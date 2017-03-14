import React, { Component } from "react";
import { Button } from "react-bootstrap";
const web_app_config = require("../config");
import DonateActions from "../actions/DonateActions";

export default class DonationForm extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);

    this._openStripeModal = this._openStripeModal.bind(this);
  }

  componentDidMount () {
    this.stripeHandler = window.StripeCheckout.configure({
      key: web_app_config.STRIPE_API_KEY,
      image: "https://stripe.com/img/documentation/checkout/marketplace.png",
      locale: "auto",
      token: function (token) {
        console.log("token generated " + token.id);
//        DonateActions.donationWithStripe(token);
      }
    });
  }

  componentWillUnmount () {
    if (this.stripehandler) {
        this.stripehandler.close();
    }
  }

  _getToken (token) {
    this.setState({ token: token });
  }

  _openStripeModal (event:Object) {
    this.stripeHandler.open({
      name: "We Vote",
      description: "Donation",
      zipCode: true,
      amount: 2000
    });
    event.preventDefault();
  }

	render () {

		return <div>
      <Button bsStyle="primary" onClick={this._openStripeModal}>
        Donate Now
      </Button>
    {/*<form onSubmit={this.getToken}>
      <FormGroup controlId="cardElement">
        <ControlLabel htmlFor="cardElement">Card
          <span className="field" ref="cardElement" value={this.state.card} onChange={this.updateCard} ></span>
        </ControlLabel>
      </FormGroup>
        <Button className="pull-right" bsStyle="primary" type="submit">
          Submit
        </Button>
    </form>*/}

  </div>;
	}
}
