const mongoose = require('mongoose');

// One entry in the activity feed — e.g. "status changed", "note added", "lead created"
const ActivityLogSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    // What kind of event this was
    action: {
      type: String,
      enum: ['lead_created', 'status_changed', 'note_added'],
      required: true,
    },
    // Human-readable description, e.g. "Status changed from new to contacted"
    description: {
      type: String,
      required: true,
    },
    performedBy: {
      type: String,
      default: 'Admin',
    },
  },
  {
    timestamps: true, // createdAt acts as the event timestamp
  }
);

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
