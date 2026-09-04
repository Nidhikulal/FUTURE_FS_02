const mongoose = require('mongoose');

// In serverless environments, this function can be called on every request.
// Reusing an existing connection (instead of reconnecting each time) avoids
// exhausting MongoDB's connection limit and speeds up response times.
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    // Note: no process.exit() here — that would crash the whole serverless
    // function on every cold start if the DB has a brief hiccup.
  }
};

module.exports = connectDB;