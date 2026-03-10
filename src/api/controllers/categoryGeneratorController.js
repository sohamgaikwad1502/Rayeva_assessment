const CategoryGeneratorService = require('../../services/business_logic/CategoryGeneratorService');
const { asyncHandler } = require('../../utils/error_handlers');
const { NotFoundError } = require('../../utils/error_handlers/AppError');

const service = new CategoryGeneratorService();

const generateCategory = asyncHandler(async (req, res) => {
  const result = await service.categorizeProduct(req.body);

  res.status(201).json(result);
});

const listProducts = asyncHandler(async (req, res) => {
  const { page, limit, category } = req.query;
  const result = await service.getAllProducts({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    category,
  });

  res.status(200).json(result);
});

const getProduct = asyncHandler(async (req, res) => {
  const result = await service.getProductById(req.params.id);
  if (!result) {
    throw new NotFoundError(`Product not found: ${req.params.id}`);
  }
  res.status(200).json(result);
});

module.exports = {
  generateCategory,
  listProducts,
  getProduct,
};
