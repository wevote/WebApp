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
    const self = this;
    const { StripeCheckout } = window;
    if (StripeCheckout !== undefined) {
      console.log("StripeCheckout is defined  ", StripeCheckout);
      this.stripeHandler = StripeCheckout.configure({
        key: webAppConfig.STRIPE_API_KEY,
        image: cordovaDot("https://stripe.com/img/documentation/checkout/marketplace.png"),
        locale: "auto",
        token (token) {
          // console.log("token generated " + token.id + " token.email " + token.email);
          DonateActions.donationWithStripe(token.id, token.email, self.props.donationAmount, self.props.donateMonthly);
          historyPush("/more/processing_donation");
        },
      });
    } else {
      console.log("StripeCheckout is NOT defined: ", StripeCheckout);
    }
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
    let { donateButtonText } = this.props;
    if (!donateButtonText) {
      donateButtonText = "Donate Now";
    }

    return (
      <span>
        <Button
          bsPrefix={this.props.donateOther ? "" : "btn_donate btn btn-success"}
          variant="success"
          onClick={this._openStripeModal}
        >
          {donateButtonText}
        </Button>
      </span>
    );
  }
}
