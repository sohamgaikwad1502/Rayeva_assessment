const mongoose = require('mongoose');

const conversationLogSchema = new mongoose.Schema(
  {
    conversation_id: { type: String, required: true, index: true },
    user_phone: { type: String, required: true },
    messages: [
      {
        role: { type: String, enum: ['user', 'bot', 'agent'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    intent: { type: String },
    escalated: { type: Boolean, default: false },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('ConversationLog', conversationLogSchema);
