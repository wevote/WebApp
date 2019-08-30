import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import DonationList from '../../components/Donation/DonationList';

/* global $ */

/**
 * August 16, 2019:  This code can be deleted once its functionality is duplicated in the newly created production UI
 */


class StripeElementsTestForm extends Component {
  static propTypes = {
    stripe: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      isChecked: true,
    };
    this.submit = this.submit.bind(this);
    this.redeem = this.redeem.bind(this);
  }

  componentDidMount () {
    this.donateStoreListener = DonateStore.addListener(this.donateStoreChange);
    DonateActions.doesOrgHavePaidPlan();
    DonateActions.donationRefreshDonationList();
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  // This is really minimal, just for testing
  donateStoreChange = () => {
    try {
      const msg = DonateStore.getCouponMessageTest();
      if (msg && msg.length > 0) {
        console.log('updating coupon message success validating coupon');
        $('.u-no-break').html(msg).css('color', 'green');
      }

      if (DonateStore.getOrgSubscriptionAlreadyExists()) {
        console.log('updating coupon message organization subscription already exists');
        $('.u-no-break').html('A subscription already exists for this organization<br>The existing subscription was not altered, no credit card charge was made.')
          .css('color', 'black');
      }

      if (DonateStore.doesOrgHavePaidPlan()) {
        console.log('updating coupon message doesOrgHavePaidPlan (before we try)');
        $('.u-no-break').html('A subscription already exists for this organization -- Cancel the exising subscription first.<br>').css('color', 'red');
      }
    } catch (err) {
      console.log('donateStoreChange caught error: ', err);
    }
  };

  async submit () {
    const { stripe } = this.props;
    // TODO: Figure out what is needed for Name
    const { token } = await stripe.createToken({ name: 'Name' });
    const planType = this.state.isChecked ? 'PROFESSIONAL_MONTHLY' : 'ENTERPRISE_MONTHLY';
    let couponCode = $('input[name=couponName]').val()  || '';

    if (couponCode.length === 0) {
      couponCode = `DEFAULT-${planType}`;
    }

    // console.log("stripe token object from component/dialog: " + token);

    const isOrganizationPlan = true;
    const donateMonthly = true;
    const email  = '';
    DonateActions.donationWithStripe(token.id, email, 0, donateMonthly,  // TEMPORARY HACK STEVE $100
      isOrganizationPlan, planType, couponCode);
  }

  async redeem () {
    const couponCode = $('input[name=couponName]').val();
    const planType = this.state.isChecked ? 'PROFESSIONAL_MONTHLY' : 'ENTERPRISE_MONTHLY';
    DonateActions.validateCoupon(planType, couponCode);
  }

  render () {
    renderLog(__filename);
    const voter = VoterStore.getVoter();
    const { full_name: fullName } = voter;
    console.log(voter);
    const { redeem, submit } = this;

    return (
      <div className="checkout">
        <h3 style={{ color: '#28a745' }}>Payment</h3>
        <br />
        <br />
        <p>All transactions are secure and encrypted.</p>
        <p>Enter your card to subscribe to We Vote Professional for $100 per month</p>
        <br />
        <p style={{ fontStyle: 'italic' }}>{fullName}</p>

        <span>
          Professional
          <Checkbox
            checked={this.state.isChecked}
            onChange={console.log('checkbox checked')}
            value="checkedA"
            inputProps={{
              'aria-label': 'primary checkbox',
            }}
            style={{ color: 'black' }}
          />
        </span>
        <div className="input-group">
          <label htmlFor="friend1FirstName">
            <span className="u-no-break">Coupon code</span>
            <input
              type="text"
              id="couponId"
              name="couponName"
              className="form-control"
              placeholder="Optional"
            />
          </label>
          <Button
            style={{ height: 35, marginTop: 56, marginLeft: 5 }}
            tabIndex="0"
            onClick={redeem}
            variant="success"
          >
            <span>Redeem Coupon</span>
          </Button>

        </div>
        <br />
        <div style={{ border: '1px solid black', backgroundColor: '#f3f3f7', padding: 5 }}>
          <CardElement />
        </div>
        <br />
        <Button
          tabIndex="0"
          onClick={submit}
          variant="success"
        >
          <span>Start my Subscription</span>
        </Button>

        <br />
        <br />
        <br />
        Plan Subscriptions
        <br />
        <DonationList displayDonations={false} showOrganizationPlan />
        <br />
        <br />
        Plan Payments
        <br />
        <DonationList displayDonations showOrganizationPlan />
        <br />
      </div>
    );
  }
}

export default injectStripe(StripeElementsTestForm);

