const BaseAIService = require('./BaseAIService');
const {
  buildSystemPrompt,
  buildUserPrompt,
} = require('../../prompts/prompt_templates/b2bProposalPrompt');
const logger = require('../../utils/logger');

class B2BProposalAIService extends BaseAIService {
  constructor() {
    super();
    this.moduleName = 'b2b-proposal';
  }

  async generateProposal(companyData) {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(companyData);

    const { parsed, raw, latency_ms } = await this.callAI(
      systemPrompt,
      userPrompt,
      this.moduleName
    );

    const validated = this._validateOutput(parsed, companyData.budget);

    return {
      ...validated,
      _meta: {
        prompt: userPrompt,
        raw_response: raw,
        latency_ms,
        module: this.moduleName,
      },
    };
  }

  _validateOutput(output, budget) {
    const result = { ...output };

    if (!Array.isArray(result.recommended_products)) {
      result.recommended_products = [];
    }
    result.recommended_products = result.recommended_products
      .filter((p) => typeof p === 'string')
      .map((p) => p.trim());

    if (typeof result.budget_allocation !== 'object' || result.budget_allocation === null) {
      result.budget_allocation = {};
    }

    for (const key of Object.keys(result.budget_allocation)) {
      result.budget_allocation[key] = Number(result.budget_allocation[key]) || 0;
    }

    const totalAllocation = Object.values(result.budget_allocation).reduce((a, b) => a + b, 0);
    if (Math.abs(totalAllocation - budget) > budget * 0.05) {
      logger.warn(`Budget allocation mismatch: allocated $${totalAllocation}, budget was $${budget}`);
    }

    if (typeof result.cost_breakdown !== 'object' || result.cost_breakdown === null) {
      result.cost_breakdown = {};
    }
    for (const key of Object.keys(result.cost_breakdown)) {
      result.cost_breakdown[key] = Number(result.cost_breakdown[key]) || 0;
    }

    if (typeof result.impact_summary !== 'string' || !result.impact_summary) {
      result.impact_summary = 'This proposal promotes sustainable procurement practices.';
    }

    return {
      recommended_products: result.recommended_products,
      budget_allocation: result.budget_allocation,
      cost_breakdown: result.cost_breakdown,
      impact_summary: result.impact_summary,
    };
  }
}

module.exports = B2BProposalAIService;
