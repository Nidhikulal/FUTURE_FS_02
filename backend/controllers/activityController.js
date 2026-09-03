const ActivityLog = require('../models/ActivityLog');

// GET /api/activity  (admin only) — recent activity across all leads
exports.getActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const activity = await ActivityLog.find()
      .populate('lead', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};