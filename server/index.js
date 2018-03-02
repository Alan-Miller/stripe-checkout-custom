require('dotenv').config();
const express = require('express')
    , bodyParser = require('body-parser')
    , { SERVER_PORT, STRIPE_PRIVATE_KEY } = process.env
    , stripe = require('stripe')(STRIPE_PRIVATE_KEY)
    , app = module.exports = express();

app.use(bodyParser.json());

app.post('/api/payment', (req, res, next) => {
    // If needed, convert req.body.amount to pennies

    const charge = stripe.charges.create(
        {
            amount: req.body.amount,
            currency: 'usd',
            source: req.body.token.id,
            description: 'Stripe Checkout test charge'
        },
        function(err, charge) {
            if (err) return res.sendStatus(500);
            else return res.sendStatus(200);
        }
    )
});

app.listen(SERVER_PORT, () => { console.log(`Listening on ${SERVER_PORT}.`) });