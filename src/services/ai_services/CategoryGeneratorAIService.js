const BaseAIService = require('./BaseAIService');
const {
  buildSystemPrompt,
  buildUserPrompt,
  VALID_CATEGORIES,
  VALID_SUSTAINABILITY_FILTERS,
} = require('../../prompts/prompt_templates/categoryGeneratorPrompt');
const logger = require('../../utils/logger');

class CategoryGeneratorAIService extends BaseAIService {
  constructor() {
    super();
    this.moduleName = 'category-generator';
  }

  async generateCategoryMetadata(productData) {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(productData);

    const { parsed, raw, latency_ms } = await this.callAI(
      systemPrompt,
      userPrompt,
      this.moduleName
    );

    const validated = this._validateOutput(parsed);

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

  _validateOutput(output) {
    const result = { ...output };

    if (!VALID_CATEGORIES.includes(result.primary_category)) {
      logger.warn(`AI returned invalid category: ${result.primary_category}, defaulting to "Lifestyle"`);
      result.primary_category = 'Lifestyle';
    }

    if (!result.sub_category || typeof result.sub_category !== 'string') {
      result.sub_category = 'General Product';
    }

    if (!Array.isArray(result.seo_tags)) {
      result.seo_tags = [];
    }
    result.seo_tags = result.seo_tags
      .filter((tag) => typeof tag === 'string')
      .map((tag) => tag.toLowerCase().trim())
      .slice(0, 10);

    if (!Array.isArray(result.sustainability_filters)) {
      result.sustainability_filters = [];
    }
    result.sustainability_filters = result.sustainability_filters.filter((f) =>
      VALID_SUSTAINABILITY_FILTERS.includes(f)
    );

    return {
      primary_category: result.primary_category,
      sub_category: result.sub_category,
      seo_tags: result.seo_tags,
      sustainability_filters: result.sustainability_filters,
    };
  }
}

module.exports = CategoryGeneratorAIService;
