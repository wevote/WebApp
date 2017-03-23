import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { browserHistory } from "react-router";
const web_app_config = require("../config");
// import DonateActions from "../actions/DonateActions";

export default class DonationForm extends Component {
  static propTypes = {
    donationAmount: PropTypes.number,
    donateButtonText: PropTypes.string,
    donateMonthly: PropTypes.bool
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
//        DonateActions.donationWithStripe(token, this.props.donationAmount, this.props.donateMonthly);
        browserHistory.push("/more/donate_thank_you");
        console.log(this.props.donationAmount);
        console.log("donate monthly? " + this.props.donateMonthly);

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
    event.preventDefault();
    this.stripeHandler.open({
      name: "We Vote",
      description: "Donation",
      zipCode: true,
      amount: this.props.donationAmount,
      panelLabel: "Donate ",
      email: ""
    });
  }

	render () {
    let donate_button_text = "Donate Now";
    if (this.props.donateButtonText) {
      donate_button_text = this.props.donateButtonText ;
    }

		return <span>
      <Button bsStyle="success" onClick={this._openStripeModal}>
        {donate_button_text}
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

  </span>;
	}
}
