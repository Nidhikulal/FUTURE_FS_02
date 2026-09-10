require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Every request waits here until MongoDB is actually connected.
// This is the fix for "buffering timed out" errors — on a cold start,
// requests no longer race ahead of the database connection.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ error: 'Database connection failed, please try again' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/activity', activityRoutes);

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'Mini CRM API is running' });
});

module.exports = app;