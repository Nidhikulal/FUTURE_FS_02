// Vercel's serverless runtime calls this file directly instead of app.listen().
// vercel.json routes every request here, and Express handles routing internally.
const app = require('../app');

module.exports = app;