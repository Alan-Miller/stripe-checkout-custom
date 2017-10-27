import React, { Component } from 'react';
import axios from 'axios';
import logo from'./imgs/logo.svg';
import pumpkins from './imgs/pumpkins.jpg';
import './App.css';
const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { token: null }
    
    this.stripeHandler = window.StripeCheckout.configure({
      key: stripePublicKey,
      token: this.onToken,
      amount: 1111,
      currency: 'usd',
      locale: 'auto',
      zipCode: true,
      name: 'Pumpkins',
      description: 'Buy these pumpkins please.',
      image: pumpkins,
    });
  }

  componentWillUnmount() {
    this.stripeHandler.close();
  }

  onToken = token => {
    token.card = void 0;
    this.setState({token});
    const amount = 999;
    axios.post('/api/payment', {token, amount})
    .then(response => { console.log('payment response', response) });
  } 

  onClickPay(e) {
    e.preventDefault();
    this.stripeHandler.open({});
  }

  render() {
    let buttonText = this.state.token ? 'Thank you!' : 'Pay $11.11';

    return (
      <div className="App">
        <header className="header">
          <img src={logo} className="logo" alt="logo" />
          <h1 className="welcome">Stripe Checkout (custom)</h1>
        </header>

        <div 
          className={this.state.token ? "stripeButton disabled" : "stripeButton"} 
          onClick={this.state.token ? null : this.onClickPay.bind(this)}>
          {buttonText}
        </div>
      </div>
    );
  }
}

export default App;