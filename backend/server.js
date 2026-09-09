// Local development entry point only.
// Runs the Express app with app.listen(), which Vercel's serverless
// environment does not use — see api/index.js for the deployed version.
const app = require('./app');

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});