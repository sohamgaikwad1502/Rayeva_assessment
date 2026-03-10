const { v4: uuidv4 } = require('uuid');
const CategoryGeneratorAIService = require('../ai_services/CategoryGeneratorAIService');
const { ProductMetadata, AIInteractionLog } = require('../../models/database_models');
const logger = require('../../utils/logger');
const { DatabaseError } = require('../../utils/error_handlers/AppError');

class CategoryGeneratorService {
  constructor() {
    this.aiService = new CategoryGeneratorAIService();
  }

  async categorizeProduct(productData) {
    const productId = uuidv4();
    let aiResult;

    try {

      aiResult = await this.aiService.generateCategoryMetadata(productData);

      await this._logInteraction({
        module_name: 'category-generator',
        prompt: aiResult._meta.prompt,
        response: aiResult._meta.raw_response,
        status: 'success',
        latency_ms: aiResult._meta.latency_ms,
        metadata: { product_id: productId, product_name: productData.product_name },
      });

      const record = await this._saveProductMetadata(productId, productData, aiResult);

      logger.info(`Product categorized successfully`, { product_id: productId });

      return {
        success: true,
        data: {
          product_id: record.product_id,
          product_name: record.product_name,
          primary_category: record.primary_category,
          sub_category: record.sub_category,
          seo_tags: record.seo_tags,
          sustainability_filters: record.sustainability_filters,
          created_at: record.created_at,
        },
      };
    } catch (error) {

      await this._logInteraction({
        module_name: 'category-generator',
        prompt: aiResult?._meta?.prompt || JSON.stringify(productData),
        response: aiResult?._meta?.raw_response || null,
        status: 'error',
        error: error.message,
        metadata: { product_id: productId },
      }).catch((logErr) => logger.error('Failed to log AI interaction', { error: logErr.message }));

      throw error;
    }
  }

  async getAllProducts({ page = 1, limit = 20, category } = {}) {
    const filter = {};
    if (category) filter.primary_category = category;

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      ProductMetadata.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit).lean(),
      ProductMetadata.countDocuments(filter),
    ]);

    return {
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(productId) {
    const product = await ProductMetadata.findOne({ product_id: productId }).lean();
    if (!product) return null;
    return { success: true, data: product };
  }

  async _saveProductMetadata(productId, productData, aiResult) {
    try {
      const record = new ProductMetadata({
        product_id: productId,
        product_name: productData.product_name,
        description: productData.description,
        material: productData.material,
        usage: productData.usage,
        brand: productData.brand,
        primary_category: aiResult.primary_category,
        sub_category: aiResult.sub_category,
        seo_tags: aiResult.seo_tags,
        sustainability_filters: aiResult.sustainability_filters,
      });

      await record.save();
      return record.toObject();
    } catch (error) {
      logger.error('Failed to save product metadata', { error: error.message, productId });
      throw new DatabaseError('Failed to save product metadata', { originalError: error.message });
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

module.exports = CategoryGeneratorService;
