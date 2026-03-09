const OpenAI = require('openai');
const config = require('../../config/environment');
const logger = require('../../utils/logger');
const { AIServiceError } = require('../../utils/error_handlers/AppError');

class BaseAIService {
  constructor() {
    this.client = new OpenAI({ apiKey: config.openai.apiKey });
    this.model = config.openai.model;
  }

  async callAI(systemPrompt, userPrompt, moduleName) {
    const startTime = Date.now();

    logger.info(`AI request initiated`, { module: moduleName });

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const latency_ms = Date.now() - startTime;
      const rawContent = completion.choices[0]?.message?.content;

      if (!rawContent) {
        throw new AIServiceError('Empty response from AI model');
      }

      let parsed;
      try {
        parsed = JSON.parse(rawContent);
      } catch (parseErr) {
        logger.error('Failed to parse AI response as JSON', {
          module: moduleName,
          rawContent,
          error: parseErr.message,
        });
        throw new AIServiceError('AI returned invalid JSON', { rawContent });
      }

      logger.info(`AI response received`, {
        module: moduleName,
        latency_ms,
        tokens: completion.usage?.total_tokens,
      });

      return {
        raw: rawContent,
        parsed,
        latency_ms,
        usage: completion.usage,
      };
    } catch (error) {
      const latency_ms = Date.now() - startTime;

      if (error instanceof AIServiceError) throw error;

      logger.error(`AI service error`, {
        module: moduleName,
        error: error.message,
        latency_ms,
      });

      throw new AIServiceError(`AI service failed: ${error.message}`, {
        originalError: error.message,
      });
    }
  }
}

module.exports = BaseAIService;
