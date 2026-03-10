const express = require('express');
const router = express.Router();
const controller = require('../controllers/b2bProposalController');
const { validate, b2bProposalSchema } = require('../../utils/validators');

router.post('/', validate(b2bProposalSchema), controller.generateProposal);

router.get('/proposals', controller.listProposals);

router.get('/proposals/:id', controller.getProposal);

module.exports = router;
