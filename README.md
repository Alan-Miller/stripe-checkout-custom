# Stripe Checkout (custom)

## Overview

* User clicks Pay With Card button.
* User completes form, sending information to Stripe.
* Stripe sends back token.
* POST request is sent with token id to server.
* Endpoint function creates charge.
* Response comes back (charge or error).

## **1. Sign up for Stripe account**
- The account is free. If you are just testing, do not activate the account. You can test payments with the test credit card number: 4242-4242-4242-4242.
- In the API settings, copy the Publishable Key and the Secret Key.


## **2. Protect your keys**
- Store the Publishable Key and the Secret Key in a file that is .gitignored, like an .env file or a config.js file.
- React only allows front end environment variables if they start with "REACT_APP_". Our Publishable Key will be used in our React front end, so name it something like REACT_APP_STRIPE_PUBLIC_KEY.
- The Secret Key will be used on the back end, so it does not need "REACT_APP_". Ours will be called STRIPE_PRIVATE_KEY here.


## **3. Install** 
```sh
npm install stripe
```


## **4. Front end**

#### **Insert Stripe `<script>` tag**
- Open your `index.html` file. In apps made with `create-react-app`, this file is in the `public` folder.
- At the bottom of the `<body>`, insert Stripe `<script>` tag.
  ```html
  <body>

    <div id="root"></div>

    <script src="https://checkout.stripe.com/checkout.js"></script>
  </body>
  ```

#### **Render Stripe Checkout**
- Create a Stripe form by calling `window.StripeCheckout.configure` and invoking it with a configuration object. 
- The properties on this object configure your form. 
- This invocation returns an object you can save in a variable. The object has `open()` and `close()` methods.
  ```js
  this.stripeForm = window.StripeCheckout.configure({
    key: stripePublicKey,
    token: this.onToken,
    amount: this.state.amount,
    currency: 'usd',
    name: 'Pumpkins',
    description: 'Buy these pumpkins please.',
  });
  ```
- Call the `open()` method when the button is clicked. 
- If you pass a configuration object directly into this invocation, the properties here will overwrite any conflicting properties in the configuration object passed into the `configure()` method.
  ```js
  this.stripeForm.open() // object optional
  ```
- Call the `close()` method when the component unmounts.
  ```js
  componentWillUnmount() {
    this.stripeForm.close();
  }
  ```

#### **Write POST method**
- Write a method to accept a token from Stripe.
- Use axios to make a POST request to our server, passing back the token and the payment amount in the request body.
- Notice the two console.logs here. When the user clicks the button and enters information for a payment, two logs should appear in the console. The first is the token created after the used finished with the Stripe form. The second log appears a few moments later after the charge is approved; this charge is logged in the console when it gets back from our server.
  ```js
  onToken = token => {
    console.log('token', token);
    token.card = void 0;
    const { amount } = this.state
    axios.post('/api/payment', { token, amount })
      .then(charge => { console.log('charge response', charge.data) }););
  }
  ```


## **5. Back end**

#### **Require `stripe`**
- Require `stripe`.
- Invoke with your Secret Key.
  ```js
  const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
  ```

#### **Write POST endpoint function**
- Stripe expects the amount to be in cents. Depending on your app, you may need to convert the amount format using something like the pennyConverter in the `server` folder here. This might be true if your users enter the amount themselves, some typing whole numbers and others decimals. Because this app involves a simple button press and the amount is already in cents, no conversion is needed.
- Invoke Stripe's `create()` method to create a charge, passing in a configuration objection with `amount`, `currency`, `source`, and `description` properties.
- The `source` property takes the `id` value on the token we sent in the request body.
- The `create()` method takes a callback. Handle the error parameter.
- This example sends the entire charge back to the front, where our app logs it to the console.

  ```js
  app.post('/api/payment', (req, res, next) => {
    
    // If needed, convert req.body.amount to pennies

    const charge = stripe.charges.create(
      {
        source: req.body.token.id,
        amount: req.body.amount,
        currency: 'usd',
        description: 'Stripe test charge'
      },
      function(err, charge) {
          if (err) return res.sendStatus(500);
          else return res.sendStatus(200);
      }
    );
  });
  ```

---

## Notes

  - This demo was based on [Joe Blank's demo](https://github.com/joeblank/react-stripe).
  - [Stripe Checkout (custom) docs](https://stripe.com/docs/checkout#integration-custom)
  - [`react-stripe-checkout` NPM docs](https://www.npmjs.com/package/react-stripe-checkout)
