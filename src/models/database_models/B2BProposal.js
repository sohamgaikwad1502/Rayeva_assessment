const mongoose = require('mongoose');

const b2bProposalSchema = new mongoose.Schema(
  {
    proposal_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    company_name: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    sustainability_goals: {
      type: String,
    },
    required_products: {
      type: [String],
      default: [],
    },
    recommended_products: {
      type: [String],
      default: [],
    },
    budget_allocation: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    cost_breakdown: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    impact_summary: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('B2BProposal', b2bProposalSchema);
