import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import DonateActions from "../../actions/DonateActions";
const web_app_config = require("../../config");

export default class DonationForm extends Component {
  static propTypes = {
    donationAmount: PropTypes.number,
    donateButtonText: PropTypes.string,
    donateMonthly: PropTypes.bool,
    donateOther: PropTypes.bool,
  };

  constructor (props) {
    super(props);

    this._openStripeModal = this._openStripeModal.bind(this);
    this._donationDescription = this._donationDescription.bind(this);
  }

  componentDidMount () {
    let self = this;
    this.stripeHandler = window.StripeCheckout.configure({
      key: web_app_config.STRIPE_API_KEY,
      image: cordovaDot("https://stripe.com/img/documentation/checkout/marketplace.png"),
      locale: "auto",
      token: function (token) {
        // console.log("token generated " + token.id + " token.email " + token.email);
        DonateActions.donationWithStripe(token.id, token.email, self.props.donationAmount, self.props.donateMonthly);
        historyPush("/more/processing_donation");
      },
    });
  }

  componentWillUnmount () {
    if (this.stripeHandler) {
      this.stripeHandler.close();
    }
  }

  _donationDescription () {
    if (this.props.donateMonthly) {
      return "Donate Monthly";
    } else {
      return "Donation";
    }
  }

  _openStripeModal (event) {
    event.preventDefault();
    this.stripeHandler.open({
      name: "We Vote",
      description: this._donationDescription(),
      zipCode: true,
      amount: this.props.donationAmount,
      panelLabel: "Donate ",
    });
  }

  render () {
    let donate_button_text = "Donate Now";
    if (this.props.donateButtonText) {
      donate_button_text = this.props.donateButtonText;
    }

    return <span>
      <Button className={this.props.donateOther ? "" : "btn_donate"} bsStyle="success"
              onClick={this._openStripeModal}>
        {donate_button_text}
      </Button>
  </span>;
  }
}
