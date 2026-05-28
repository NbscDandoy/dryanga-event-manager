import { Router } from 'express';
import type { RequestHandler } from 'express'; 
import pg from 'pg';

// Clean extraction matching NodeNext module layouts
const { Pool } = pg;
const router = Router();

// Connect to your database using configurations pulled from your active .env profile
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

/**
 * GET /api/events
 * Fetches all upcoming events with reactive student capacity counts
 */
const getEventsHandler: RequestHandler = async (req, res) => {
  try {
    // Select essential card data, pulling current active attendee metrics via subqueries
    const queryText = `
      SELECT 
        e.id, 
        e.title, 
        e.description, 
        e.date, 
        e.location, 
        e.status,
        COALESCE(r.attendee_count, 0)::INTEGER AS current_participants
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) AS attendee_count 
        FROM registrations 
        WHERE status = 'Registered' 
        GROUP BY event_id
      ) r ON e.id = r.event_id
      WHERE e.status = 'Active'
      ORDER BY e.date ASC;
    `;

    const result = await db.query(queryText);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Fetch events engine exception:', error);
    res.status(500).json({ error: 'Failed to retrieve the current campus event catalog.' });
  }
};

/**
 * POST /api/events
 * Creates a brand new campus event after performing input validation checks
 */
const createEventHandler: RequestHandler = async (req, res) => {
  const { title, description, date, location } = req.body;

  // 1. Strict input validation fields
  if (!title || !date || !location) {
    res.status(400).json({ 
      error: 'Missing required fields. Title, date, and location are mandatory.' 
    });
    return; // 👈 Explicitly stops execution here
  }

  // 2. Prevent past dates from scheduling mistakes
  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
    res.status(400).json({ 
      error: 'Invalid event date. The date must be a valid future timestamp.' 
    });
    return; // 👈 Explicitly stops execution here
  }

  try {
    const queryText = `
      INSERT INTO events (title, description, date, location, status)
      VALUES ($1, $2, $3, $4, 'Active')
      RETURNING id, title, description, date, location, status;
    `;
    const values = [title, description || '', date, location];

    const result = await db.query(queryText, values);

    res.status(201).json({
      success: true,
      message: 'Campus event successfully created.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create event engine database error:', error);
    res.status(500).json({ 
      error: 'Internal system error compiling and writing your new event.' 
    });
  }
};

/**
 * POST /api/events/:id/cancel
 * Safely updates an event status to 'Cancelled' instead of hard deleting it
 */
const cancelEventHandler: RequestHandler = async (req, res) => {
  const eventId = req.params['id'];
  
  if (!eventId) {
    res.status(400).json({ error: 'Event ID parameter is missing.' });
    return;
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Check if the event exists
    const eventCheck = await client.query(
      'SELECT status FROM events WHERE id = $1',
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      await client.query('ROLLBACK'); // 👈 Always rollback before escaping functions!
      res.status(404).json({ error: 'Target event requested could not be located.' });
      return;
    }

    const currentStatus = eventCheck.rows[0]?.status;
    if (currentStatus === 'Cancelled') {
      await client.query('ROLLBACK'); // 👈 Always rollback before escaping functions!
      res.status(400).json({ error: 'This campus event has already been cancelled.' });
      return;
    }

    // 2. Change status to 'Cancelled'
    await client.query(
      "UPDATE events SET status = 'Cancelled' WHERE id = $1",
      [eventId]
    );

    // 3. Get all registered student IDs to notify them later
    const participantsResult = await client.query(
      "SELECT user_id FROM registrations WHERE event_id = $1 AND status = 'Registered'",
      [eventId]
    );
    
    const affectedUsers = participantsResult.rows.map(row => row['user_id']);

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Event successfully cancelled.',
      notifiedCount: affectedUsers.length
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database cancellation error:', error);
    res.status(500).json({ error: 'Internal system error processing cancellation request.' });
  } finally {
    client.release();
  }
};

/**
 * POST /api/events/:id/register
 * Registers a student for a specific campus event with strict validation checks
 */
const registerForEventHandler: RequestHandler = async (req, res) => {
  const eventId = req.params['id'];
  const { userId } = req.body; 

  if (!eventId || !userId) {
    res.status(400).json({ error: 'Missing eventId parameter or userId payload.' });
    return;
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Verify the target event exists and isn't inactive
    const eventCheck = await client.query(
      'SELECT status FROM events WHERE id = $1',
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'This campus event does not exist.' });
      return;
    }

    if (eventCheck.rows[0]?.status === 'Cancelled') {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Cannot register. This campus event has been cancelled.' });
      return;
    }

    // 2. Check existing registration state for the user
    const registrationCheck = await client.query(
      "SELECT status FROM registrations WHERE event_id = $1 AND user_id = $2",
      [eventId, userId]
    );

    if (registrationCheck.rows.length > 0 && registrationCheck.rows[0]?.status === 'Registered') {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'You are already registered for this campus event.' });
      return;
    }

    // 3. Upsert execution path based on history records
    if (registrationCheck.rows.length > 0) {
      await client.query(
        "UPDATE registrations SET status = 'Registered' WHERE event_id = $1 AND user_id = $2",
        [eventId, userId]
      );
    } else {
      await client.query(
        "INSERT INTO registrations (event_id, user_id, status) VALUES ($1, $2, 'Registered')",
        [eventId, userId]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Successfully registered for this event!' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration transaction error:', error);
    res.status(500).json({ error: 'Internal system error processing registration.' });
  } finally {
    client.release();
  }
};

/**
 * POST /api/events/:id/leave
 * Gracefully alters a student registration state to 'Left' instead of destructive deletion
 */
const leaveEventHandler: RequestHandler = async (req, res) => {
  const eventId = req.params['id'];
  const { userId } = req.body;

  if (!eventId || !userId) {
    res.status(400).json({ error: 'Missing eventId parameter or userId payload.' });
    return;
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Toggle active record flags to preserve analytical data consistency
    const result = await client.query(
      "UPDATE registrations SET status = 'Left' WHERE event_id = $1 AND user_id = $2 AND status = 'Registered'",
      [eventId, userId]
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'No active registration record found for this student.' });
      return; 
    }

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Successfully left the event.' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Leave event error:', error);
    res.status(500).json({ error: 'Internal system error processing request.' });
  } finally {
    client.release();
  }
};

// --- Bound Router Endpoints ---
router.get('/events', getEventsHandler);
router.post('/events', createEventHandler);
router.post('/events/:id/cancel', cancelEventHandler);
router.post('/events/:id/register', registerForEventHandler);
router.post('/events/:id/leave', leaveEventHandler);

export default router;