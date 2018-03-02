
import React, { Component } from 'react';
import axios from 'axios';
import pumpkins from './imgs/pumpkins.jpg';
import './App.css';
const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      haveToken: false,
      amount: 800
    }

    this.stripeForm = window.StripeCheckout.configure({
      key: stripePublicKey,
      token: this.onToken,
      amount: this.state.amount,
      currency: 'usd',
      locale: 'auto',
      zipCode: true,
      name: 'Pumpkins',
      description: 'Buy these pumpkins please.',
      image: pumpkins,
    });
  }

  componentWillUnmount() {
    this.stripeForm.close();
  }

  onToken = token => {
    console.log('token', token)

    token.card = void 0;
    this.setState({ haveToken: true });
    const { amount } = this.state;
    axios.post('/api/payment', { token, amount })
      .then(response => { console.log('payment response', response) });
  }

  onClickPay(e) {
    e.preventDefault();
    this.stripeForm.open({ // these overwrite conflicting properties in StripeCheckout.configure
      // name: 'Ye Olde Pumperkin Shoppe',
      // description: 'It\'s pumpkins',
    });
  }

  render() {
    let buttonLabel = this.state.haveToken ? 'Thank you!' : `Pay $${(this.state.amount / 100).toFixed(2)}`;

    return (
      <div className="App">
        <header className="header">
          <div className="pumpkin"></div>
          <h1 className="text">Stripe Checkout (custom)</h1>
        </header>

        <div>
          <div className="pumpkin spin1"></div>
          <div className="pumpkin spin2"></div>
          <div className="pumpkin spin1"></div>
          <div className="pumpkin widdershins"></div>
          <div className="pumpkin spin2"></div>
        </div>
        <p className="text">Buy My Pumpkins</p>
        <div
          className={this.state.haveToken ? "stripeButton disabled" : "stripeButton"}
          onClick={this.state.haveToken ? null : this.onClickPay.bind(this)}>
          {buttonLabel}
        </div>
      </div>
    );
  }
}

export default App;