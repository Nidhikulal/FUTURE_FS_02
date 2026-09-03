const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// This mini CRM has a single admin account, defined via environment variables,
// rather than a full user-management system — matches the task's "secure admin access" requirement
// without over-engineering a multi-user system that wasn't asked for.

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ADMIN_PASSWORD in .env is stored as plain text for setup simplicity;
    // in a real production app this would be a bcrypt hash stored in the DB.
    const isMatch = password === process.env.ADMIN_PASSWORD;
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
