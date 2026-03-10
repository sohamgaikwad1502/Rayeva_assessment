const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoryGeneratorController');
const { validate, categoryGeneratorSchema } = require('../../utils/validators');

router.post('/', validate(categoryGeneratorSchema), controller.generateCategory);

router.get('/products', controller.listProducts);

router.get('/products/:id', controller.getProduct);

module.exports = router;
