require('dotenv').config();
const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
    , { joesPennyFunction } = require('./pennyConverter')
    , PORT = process.env.PORT
    , app = module.exports = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/api/payment', (req, res, next) => {
    const amountArray = req.body.amount.toString().split('');
    const convertedAmt = joesPennyFunction(amountArray);
    const charge = stripe.charges.create(
        {
            amount: convertedAmt,
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

app.listen(PORT, _ => { console.log(`Listening on ${PORT}.`)});