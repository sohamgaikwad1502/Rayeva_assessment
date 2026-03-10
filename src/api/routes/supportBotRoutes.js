const express = require('express');
const router = express.Router();
const controller = require('../controllers/supportBotController');
const { validate, supportBotSchema } = require('../../utils/validators');

router.post('/', validate(supportBotSchema), controller.handleMessage);

router.get('/conversations/:id', controller.getConversation);

module.exports = router;
