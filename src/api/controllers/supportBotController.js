const { asyncHandler } = require('../../utils/error_handlers');

const handleMessage = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Module 4 (WhatsApp Support Bot) — Architecture designed, not yet implemented.',
    architecture: {
      endpoint: 'POST /ai/support-bot',
      flow: [
        'Receive message from WhatsApp webhook (or direct API call)',
        'Validate input (message, optional order_id, user_phone, conversation_history)',
        'SupportBotService calls SupportBotAIService.classifyAndRespond()',
        'AI classifies intent: order_status, return_policy, product_info, complaint, general',
        'AI generates customer-friendly response',
        'AI determines if escalation is needed (refund/damage/complaint)',
        'Business logic checks escalation flag → routes to human agent if true',
        'Save conversation to ConversationLog collection',
        'Log AI interaction to AIInteractionLog',
        'Send response back via WhatsApp API integration',
      ],
      capabilities: [
        'Order status lookup (integrate with Orders collection)',
        'Return policy Q&A (knowledge embedded in prompt)',
        'Product information queries',
        'Automatic escalation for high-priority issues',
        'Conversation history tracking',
      ],
      integrations: [
        'WhatsApp Business API — webhook for incoming messages',
        'Twilio API — alternative messaging provider',
        'Meta Cloud API — Facebook/WhatsApp integration',
      ],
      database_model: 'ConversationLog',
      fields: [
        'conversation_id', 'user_phone', 'messages[{role, content, timestamp}]',
        'intent', 'escalated', 'resolved', 'created_at',
      ],
    },
  });
});

const getConversation = asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Module 4 — GET not yet implemented.',
  });
});

module.exports = { handleMessage, getConversation };
