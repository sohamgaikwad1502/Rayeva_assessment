const B2BProposalService = require('../../services/business_logic/B2BProposalService');
const { asyncHandler } = require('../../utils/error_handlers');
const { NotFoundError } = require('../../utils/error_handlers/AppError');

const service = new B2BProposalService();

const generateProposal = asyncHandler(async (req, res) => {
  const result = await service.generateProposal(req.body);

  res.status(201).json(result);
});

const listProposals = asyncHandler(async (req, res) => {
  const { page, limit, company } = req.query;
  const result = await service.getAllProposals({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    company,
  });

  res.status(200).json(result);
});

const getProposal = asyncHandler(async (req, res) => {
  const result = await service.getProposalById(req.params.id);
  if (!result) {
    throw new NotFoundError(`Proposal not found: ${req.params.id}`);
  }
  res.status(200).json(result);
});

module.exports = {
  generateProposal,
  listProposals,
  getProposal,
};
