const express = require('express');

const emailSender = require('../controllers/emailsender');

const router = express.Router();

router.post('/', emailSender);

module.exports = router;