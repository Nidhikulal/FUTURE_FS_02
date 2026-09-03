const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createLead,
  createLeadByAdmin,
  getLeads,
  getLeadById,
  updateLeadStatus,
  addNote,
  deleteLead,
  getAnalytics,
} = require('../controllers/leadController');

// Public — this is the endpoint a website's contact form would call
router.post('/', createLead);

// Everything below is admin-only
router.post('/admin', protect, createLeadByAdmin);
router.get('/', protect, getLeads);
router.get('/analytics/summary', protect, getAnalytics);
router.get('/:id', protect, getLeadById);
router.patch('/:id/status', protect, updateLeadStatus);
router.post('/:id/notes', protect, addNote);
router.delete('/:id', protect, deleteLead);

module.exports = router;
