import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { cordovaDot, historyPush } from '../../utils/cordovaUtils';
import DonateActions from '../../actions/DonateActions';
import { renderLog } from '../../utils/logging';
import webAppConfig from '../../config';

export default class DonationForm extends Component {
  constructor (props) {
    super(props);

    this._openStripeModal = this._openStripeModal.bind(this);
    this._donationDescription = this._donationDescription.bind(this);
  }

  componentDidMount () {
    // console.log('DonationForm componentDidMount');
    this.configureStripe();
  }

  componentWillUnmount () {
    if (this.stripeHandler) {
      this.stripeHandler.close();
    }
  }

  configureStripe = () => {
    const self = this;
    const { StripeCheckout } = window;
    if (StripeCheckout !== undefined) {
      console.log('StripeCheckout is defined  ', StripeCheckout);
      this.stripeHandler = StripeCheckout.configure({
        key: webAppConfig.STRIPE_API_KEY,
        image: cordovaDot('https://stripe.com/img/documentation/checkout/marketplace.png'),
        locale: 'auto',
        token (token) {
          console.log(`token generated ${token.id} token.email ${token.email}`);
          const isOrganizationPlan = false;
          const couponCode = '';
          const planType = '';
          DonateActions.donationWithStripe(token.id, token.email, self.props.donationAmount, self.props.donateMonthly,
            isOrganizationPlan, planType, couponCode);
          historyPush('/more/processing_donation');
        },
      });
    } else {
      console.log('StripeCheckout is NOT defined: ', StripeCheckout);
    }
  }

  _donationDescription () {
    if (this.props.donateMonthly) {
      return 'Donate Monthly';
    } else {
      return 'Donation';
    }
  }

  _openStripeModal (event) {
    event.preventDefault();
    if (this.stripeHandler) {
      this.stripeHandler.open({
        name: 'We Vote',
        description: this._donationDescription(),
        zipCode: true,
        amount: this.props.donationAmount,
        panelLabel: 'Donate ',
      });
    } else {
      console.log('DonationForm cannot open');
    }
  }

  render () {
    renderLog('DonationForm');  // Set LOG_RENDER_EVENTS to log all renders
    let { donateButtonText } = this.props;
    if (!donateButtonText) {
      donateButtonText = 'Donate Now';
    }

    return (
      <span>
        <Button
          color="primary"
          onClick={this._openStripeModal}
          style={{ width: '7%', margin: 5 }}
          variant="contained"
        >
          {donateButtonText}
        </Button>
      </span>
    );
  }
}
DonationForm.propTypes = {
  donationAmount: PropTypes.number,
  donateButtonText: PropTypes.string,
  donateMonthly: PropTypes.bool,
};
