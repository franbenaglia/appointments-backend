const express = require('express');
const StripeController = require('../controllers/stripe');

const router = express.Router();


router.post('/stripe_checkout', StripeController.create);

router.post('/paymentintent', StripeController.createIntent);


module.exports = router;