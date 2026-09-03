const Lead = require('../models/Lead');
const ActivityLog = require('../models/ActivityLog');

// Small helper so every controller doesn't repeat this logic
const logActivity = async (leadId, action, description) => {
  await ActivityLog.create({ lead: leadId, action, description });
};

// POST /api/leads  (public — this is what a website's contact form calls)
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const lead = await Lead.create({ name, email, phone, message, source });

    await logActivity(
      lead._id,
      'lead_created',
      `New lead "${lead.name}" created via ${lead.source}`
    );

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/leads/admin  (admin only — manual entry from inside the dashboard,
// supports setting status and a follow-up date directly, unlike the public endpoint)
exports.createLeadByAdmin = async (req, res) => {
  try {
    const { name, email, phone, message, source, status, followUpDate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const validStatuses = ['new', 'contacted', 'converted'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      message,
      source,
      status: status || 'new',
      followUpDate: followUpDate || null,
    });

    await logActivity(
      lead._id,
      'lead_created',
      `Lead "${lead.name}" added manually via ${lead.source}`
    );

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/leads  (admin only — supports ?status= and ?search= query params)
exports.getLeads = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/leads/:id  (admin only — single lead with full detail)
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/leads/:id/status  (admin only)
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'contacted', 'converted'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const oldStatus = lead.status;
    lead.status = status;
    await lead.save();

    await logActivity(
      lead._id,
      'status_changed',
      `Status changed from "${oldStatus}" to "${status}"`
    );

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/leads/:id/notes  (admin only)
exports.addNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Note text is required' });

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    lead.notes.push({ text });
    await lead.save();

    await logActivity(lead._id, 'note_added', `Note added: "${text}"`);

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/leads/:id  (admin only)
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/leads/analytics/summary  (admin only)
exports.getAnalytics = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const statusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const sourceCounts = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    const converted = statusCounts.find((s) => s._id === 'converted')?.count || 0;
    const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

    res.json({ total, conversionRate, statusCounts, sourceCounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
