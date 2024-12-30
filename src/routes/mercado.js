const express = require('express');
const MercadoController = require('../controllers/mercado');

const router = express.Router();

router.post('/create_preference', MercadoController.create);

module.exports = router;