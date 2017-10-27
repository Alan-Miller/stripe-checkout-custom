import React, { Component } from 'react';
import logo from './logo.svg';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import './App.css';
const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

class App extends Component {

  onToken = token => {
    console.log('token', token);
    token.card = void 0;
    const amount = 999;
    axios.post('/api/payment', {token, amount})
    .then(response => { console.log('payment response', response) });
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          <img src={logo} className="logo" alt="logo" />
          <h1 className="welcome">Welcome to Stripe Checkout</h1>
        </header>

        <StripeCheckout
          token={this.onToken}
          stripeKey={stripePublicKey}
          amount={999} />
      </div>
    );
  }
}

export default App;
