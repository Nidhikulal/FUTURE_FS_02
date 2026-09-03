const mongoose = require('mongoose');

// A single follow-up note left by an admin on a lead
const NoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: String, default: 'Admin' },
  },
  { timestamps: true } // adds createdAt automatically
);

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    // Where this lead came from — e.g. "Contact Form", "Referral", "Ad"
    source: {
      type: String,
      default: 'Contact Form',
      trim: true,
    },
    // The pipeline stage this lead is currently in
        status: {
      type: String,
      enum: ['new', 'contacted', 'converted'],
      default: 'new',
    },
    // Optional date to follow up with this lead (set manually by an admin)
    followUpDate: {
      type: Date,
      default: null,
    },
    notes: [NoteSchema],
  },
  {
    timestamps: true, // adds createdAt / updatedAt to the lead itself
  }
);

module.exports = mongoose.model('Lead', LeadSchema);
