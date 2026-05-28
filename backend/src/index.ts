import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors'; // 👈 Added CORS support
import dotenv from 'dotenv';
import pg from 'pg'; // 👈 Added PostgreSQL client module

// 1. Load environment configurations IMMEDIATELY after importing dotenv
dotenv.config();

// 2. Now it is safe to import your routes (they will see your environment variables!)
import eventRoutes from './routes/eventRoutes.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 🗄️ PostgreSQL Connection Pool Configuration
// ==========================================
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/dryanga_events',
  // Alternatively, falls back to separate individual variables if preferred:
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

// Test database connection on startup
pool.connect()
  .then((client) => {
    console.log('🐘 Successfully connected to PostgreSQL Database Instance!');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Critical Database Connection Error:', err.message);
  });

// ==========================================
// 🛠️ Global Middlewares
// ==========================================

// Allows your frontend (Vite) to make requests without cross-origin safety rejections
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware parser for JSON payloads
app.use(express.json());

// ==========================================
// 🛣️ Routing Configurations
// ==========================================

// Bind the event management routing endpoints
app.use('/api', eventRoutes);

/**
 * 1. Catch-All 404 Route Handler
 * Intercepts any incoming requests that do not match our defined API routes
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `The requested endpoint '${req.originalUrl}' does not exist on this server.`
  });
});

/**
 * 2. Global Error-Handling Middleware
 * Catches unhandled code exceptions anywhere down the request chain to prevent runtime crashes
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('⚠️ Global Server Exception Intercepted:', err.stack);
  
  res.status(500).json({
    success: false,
    error: 'A critical internal server error occurred while processing this request.'
  });
});

// Start listening for inbound traffic
app.listen(PORT, () => {
  console.log(`🚀 Dr. Yanga's Backend Server running on port ${PORT}`);
});