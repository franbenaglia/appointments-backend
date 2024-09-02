const stripe = require('stripe')('');


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