import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import DonateActions from "../../actions/DonateActions";
import { renderLog } from "../../utils/logging";
import webAppConfig from "../../config";

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
      key: webAppConfig.STRIPE_API_KEY,
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
    renderLog(__filename);
    let donate_button_text = "Donate Now";
    if (this.props.donateButtonText) {
      donate_button_text = this.props.donateButtonText;
    }

    return <span>
      <Button bsPrefix={this.props.donateOther ? "" : "btn_donate"} variant="success"
              onClick={this._openStripeModal}>
        {donate_button_text}
      </Button>
  </span>;
  }
}
