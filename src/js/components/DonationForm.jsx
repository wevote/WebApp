import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { browserHistory } from "react-router";
const web_app_config = require("../config");
import VoterStore from "../stores/VoterStore";

// import DonateActions from "../actions/DonateActions";

export default class DonationForm extends Component {
  static propTypes = {
    donationAmount: PropTypes.number,
    donateButtonText: PropTypes.string,
    donateMonthly: PropTypes.bool
  };

  constructor (props) {
    super(props);

    this.state={
      voter_email_address_list: []
    }
    this._openStripeModal = this._openStripeModal.bind(this);
    this._voterEmailAddress = this._voterEmailAddress.bind(this);
    this._donationDescription = this._donationDescription.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this.stripeHandler = window.StripeCheckout.configure({
      key: web_app_config.STRIPE_API_KEY,
      image: "https://stripe.com/img/documentation/checkout/marketplace.png",
      locale: "auto",
      token: function (token) {
        console.log("token generated " + token.id + " token.email " + token.email);
//        DonateActions.donationWithStripe(token, token.email, this.props.donationAmount, this.props.donateMonthly);
        browserHistory.push("/more/donate_thank_you");
      }
    });
  }

  componentWillUnmount () {
    if (this.stripehandler) {
        this.stripehandler.close();
    }
  }

  _onVoterStoreChange () {
    this.setState({
      voter_email_address_list: VoterStore.getEmailAddressList()
    });
  }

  _getToken (token) {
    this.setState({ token: token });
  }

  _voterEmailAddress () {
    if (this.state.voter_email_address_list.length > 0) {
      return this.state.voter_email_address_list[0].normalized_email_address
    } else {
      return ""
    }
  }

  _donationDescription () {
    if (this.props.donateMonthly) {
      return "Donate Monthly"
    } else {
      return "Donation"
    }
  }

  _openStripeModal (event:Object) {
    event.preventDefault();
    this.stripeHandler.open({
      name: "We Vote",
      description: this._donationDescription(),
      zipCode: true,
      amount: this.props.donationAmount,
      panelLabel: "Donate ",
//      dataCurrency: "" <-- we might want to enable this with some sort of geocoding(default is usd)
// stripe doesn't support editable pre-filled email fields nor optional email fields (they are required)
    });
  }

	render () {
    let donate_button_text = "Donate Now";
    if (this.props.donateButtonText) {
      donate_button_text = this.props.donateButtonText;
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
