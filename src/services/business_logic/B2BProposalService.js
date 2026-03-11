const crypto = require('crypto');
const B2BProposalAIService = require('../ai_services/B2BProposalAIService');
const { B2BProposal, AIInteractionLog } = require('../../models/database_models');
const logger = require('../../utils/logger');
const { DatabaseError } = require('../../utils/error_handlers/AppError');

class B2BProposalService {
  constructor() {
    this.aiService = new B2BProposalAIService();
  }

  async generateProposal(companyData) {
    const proposalId = crypto.randomUUID();
    let aiResult;

    try {

      aiResult = await this.aiService.generateProposal(companyData);

      await this._logInteraction({
        module_name: 'b2b-proposal',
        prompt: aiResult._meta.prompt,
        response: aiResult._meta.raw_response,
        status: 'success',
        latency_ms: aiResult._meta.latency_ms,
        metadata: { proposal_id: proposalId, company_name: companyData.company_name },
      });

      const record = await this._saveProposal(proposalId, companyData, aiResult);

      logger.info(`B2B proposal generated successfully`, { proposal_id: proposalId });

      return {
        success: true,
        data: {
          proposal_id: record.proposal_id,
          company_name: record.company_name,
          industry: record.industry,
          budget: record.budget,
          recommended_products: record.recommended_products,
          budget_allocation: record.budget_allocation,
          cost_breakdown: record.cost_breakdown,
          impact_summary: record.impact_summary,
          created_at: record.created_at,
        },
      };
    } catch (error) {

      await this._logInteraction({
        module_name: 'b2b-proposal',
        prompt: aiResult?._meta?.prompt || JSON.stringify(companyData),
        response: aiResult?._meta?.raw_response || null,
        status: 'error',
        error: error.message,
        metadata: { proposal_id: proposalId },
      }).catch((logErr) => logger.error('Failed to log AI interaction', { error: logErr.message }));

      throw error;
    }
  }

  async getAllProposals({ page = 1, limit = 20, company } = {}) {
    const filter = {};
    if (company) filter.company_name = new RegExp(company, 'i');

    const skip = (page - 1) * limit;
    const [proposals, total] = await Promise.all([
      B2BProposal.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
      B2BProposal.countDocuments(filter),
    ]);

    return {
      success: true,
      data: proposals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getProposalById(proposalId) {
    const proposal = await B2BProposal.findOne({ proposal_id: proposalId }).lean();
    if (!proposal) return null;
    return { success: true, data: proposal };
  }

  async _saveProposal(proposalId, companyData, aiResult) {
    try {
      const record = new B2BProposal({
        proposal_id: proposalId,
        company_name: companyData.company_name,
        industry: companyData.industry,
        budget: companyData.budget,
        sustainability_goals: companyData.sustainability_goals,
        required_products: companyData.required_products,
        recommended_products: aiResult.recommended_products,
        budget_allocation: aiResult.budget_allocation,
        cost_breakdown: aiResult.cost_breakdown,
        impact_summary: aiResult.impact_summary,
      });

      await record.save();
      return record.toObject();
    } catch (error) {
      logger.error('Failed to save B2B proposal', { error: error.message, proposalId });
      throw new DatabaseError('Failed to save B2B proposal', { originalError: error.message });
    }
  }

  async _logInteraction(logData) {
    try {
      await AIInteractionLog.create({
        timestamp: new Date(),
        ...logData,
      });
    } catch (error) {
      logger.error('Failed to save AI interaction log', { error: error.message });
    }
  }
}

module.exports = B2BProposalService;
