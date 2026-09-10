const mongoose = require('mongoose');

// Cache the connection (and the in-flight connection promise) across
// serverless invocations using a global variable. This is the standard
// pattern for Mongoose in serverless environments — it ensures every
// request waits for a real, established connection instead of racing
// ahead and hitting Mongoose's default 10s command-buffering timeout.
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;