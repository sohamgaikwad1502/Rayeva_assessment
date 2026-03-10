const express = require('express');
const router = express.Router();
const controller = require('../controllers/impactReportController');
const { validate, impactReportSchema } = require('../../utils/validators');

router.post('/', validate(impactReportSchema), controller.generateReport);

router.get('/:order_id', controller.getReport);

module.exports = router;
