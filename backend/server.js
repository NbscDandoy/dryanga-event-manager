const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample API Test Route
app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: "DYCI Campus Orientation 2026",
        description: "Welcome back, Gators! Join us for our annual campus rules and organization briefing.",
        date: "2026-06-15",
        location: "Gymnasium",
        status: "active",
        current_participants: 45
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🐊 Gator server swimming cleanly on port ${PORT}`);
});