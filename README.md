## stripe checkout (custom button)

Example of Stripe Checkout (with custom button) in React. Uses ```<script>``` tag instead of installing ```react-stripe-checkout```.

* Repo uses ```<script src="https://checkout.stripe.com/checkout.js"></script>``` tag in index.html.
* Pay With Card button opens form, which gets token back from Stripe. Token can be console logged.
* When the token arrives, a POST request is sent with the token id to the server to make a charge, and a response comes back (if it is an error, the charge failed).
* Summary of Stripe process:
  * User clicks button and completes form.
  * Stripe receives payment information securely.
  * Stripe sends back token to app.
  * Token contains email and other information.
  * Token is stripped of credit card information and send to app server via POST request.

Tech:
* React
* Stripe Checkout
