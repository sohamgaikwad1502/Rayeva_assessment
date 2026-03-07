const mongoose = require('mongoose');

const aiInteractionLogSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    module_name: {
      type: String,
      required: true,
      enum: ['category-generator', 'b2b-proposal', 'impact-report', 'support-bot'],
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['success', 'error', 'pending'],
      default: 'pending',
    },
    error: {
      type: String,
      default: null,
    },
    latency_ms: {
      type: Number,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AIInteractionLog', aiInteractionLogSchema);
