const stripe = require('stripe')('');
const axios = require('axios');

const PRIVATE_KEY_STRIPE = require('../config/constants.js').PRIVATE_KEY_STRIPE;

exports.createIntent = async (req, res) => {

    const amount = req.body.amount;
    const currency = req.body.currency;

    const data = {
        amount: amount,
        currency: currency
    };

    const encodedData = new URLSearchParams(data);

    const response = await axios({
        method: "POST",
        url: "https://api.stripe.com/v1/payment_intents",
        data: encodedData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + PRIVATE_KEY_STRIPE
        },
        //auth: login
    })

    res.status(200).json(response.data.client_secret);

}


exports.create = async (req, res) => {
    console.log('stripe endpoint');
    const stripeToken = req.body.stripeToken;
    const amount = req.body.amount;
    const amountUSD = Math.round(amount * 100);
    const chargeObj = await stripe.charges.create({
        amount: amountUSD,
        currency: 'eur',
        source: stripeToken,
        capture: false,
        description: 'turn pay',
        receipt_email: 'fbenaglia@hotmail.com'
    });

    try {
        await stripe.charges.capture(chargeObj.id);
        console.log('success: ' + chargeObj);
        res.status(200).json(chargeObj);
    } catch (error) {
        console.log('failed: ' + chargeObj);
        await stripe.refunds.create({ charge: chargeObj.id });
        res.status(200).json(chargeObj);
    }

}