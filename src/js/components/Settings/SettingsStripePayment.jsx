import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import LoadingWheel from '../LoadingWheel';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import { numberWithCommas, stringContains } from '../../utils/textFormat';

/* global $ */

class SettingsStripePayment extends Component {
  static propTypes = {
    classes: PropTypes.object,
    couponCode: PropTypes.string,
    numberOfMonthsService: PropTypes.number,
    payByMonthCostPerMonth: PropTypes.number,
    payByYearCostPerYear: PropTypes.number,
    paymentProcessedFunction: PropTypes.func,
    pricingPlanChosen: PropTypes.string,
    stripe: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      couponCode: '',
      numberOfMonthsService: 0,
      payByYearCostPerYear: 0,
      paymentError: false,
      organization: {},
      organizationWeVoteId: '',
      payByMonthCostPerMonth: 0,
      pricingPlanChosen: '',
      voter: {},
      voterIsSignedIn: false,
    };
    this.submitStripePayment = this.submitStripePayment.bind(this);
  }

  componentDidMount () {
    // console.log('SettingsStripePayment componentDidMount');
    this.onVoterStoreChange();
    // DonateActions.doesOrgHavePaidPlan();
    // this.onOrganizationStoreChange();
    this.setState({
      couponCode: this.props.couponCode,
      numberOfMonthsService: this.props.numberOfMonthsService,
      payByYearCostPerYear: this.props.payByYearCostPerYear,
      payByMonthCostPerMonth: this.props.payByMonthCostPerMonth,
      pricingPlanChosen: this.props.pricingPlanChosen,
    });
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange);
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log('SettingsStripePayment, RELOAD componentWillReceiveProps');
    this.setState({
      couponCode: nextProps.couponCode,
      numberOfMonthsService: nextProps.numberOfMonthsService,
      payByYearCostPerYear: nextProps.payByYearCostPerYear,
      payByMonthCostPerMonth: nextProps.payByMonthCostPerMonth,
      pricingPlanChosen: nextProps.pricingPlanChosen,
    });
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
  //     // console.log('this.state.organizationWeVoteId', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
  //     return true;
  //   }
  //   // console.log('shouldComponentUpdate false');
  //   return false;
  // }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onOrganizationStoreChange () {
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
    const chosenFeaturePackage = OrganizationStore.getChosenFeaturePackage();
    // console.log('onVoterStoreChange organization: ', organization);
    this.setState({
      chosenFeaturePackage,
      organization,
      organizationWeVoteId,
      voter,
      voterIsSignedIn,
    });
  }

  onDonateStoreChange = () => {
    // console.log('onDonateStoreChange');
    try {
      const activePaidPlan = DonateStore.getActivePaidPlan();
      if (activePaidPlan && activePaidPlan.subscription_active) {
        let activePaidPlanChosen = '';
        let activePaidPlanChosenDisplay = '';
        if (stringContains('PROFESSIONAL', activePaidPlan.plan_type_enum)) {
          activePaidPlanChosen = 'professional';
          activePaidPlanChosenDisplay = 'Professional';
        } else if (stringContains('ENTERPRISE', activePaidPlan.plan_type_enum)) {
          activePaidPlanChosen = 'enterprise';
          activePaidPlanChosenDisplay = 'Enterprise';
        } else {
          activePaidPlanChosen = 'unknown';
          activePaidPlanChosenDisplay = 'Unknown';
        }
        this.setState({
          activePaidPlanChosen,
          activePaidPlanChosenDisplay,
        });
      }
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

      // if (DonateStore.doesOrgHavePaidPlan()) {
      //   console.log('updating coupon message doesOrgHavePaidPlan (before we try)');
      //   $('.u-no-break').html('A subscription already exists for this organization -- Cancel the existing subscription first.<br>').css('color', 'red');
      // }
      const stripeErrorMessageForVoter = DonateStore.donationError();
      if (stripeErrorMessageForVoter) {
        this.setState({
          paymentError: true,
          stripeErrorMessageForVoter,
        });
        setTimeout(() => {
          this.setState({
            paymentError: false,
            stripeErrorMessageForVoter: '',
          });
        }, 5000);
      }
      const getAmountPaidViaStripe = DonateStore.getAmountPaidViaStripe();
      // console.log('getAmountPaidViaStripe:', getAmountPaidViaStripe);
      if (getAmountPaidViaStripe) {
        // Tell the parent component to move past this step
        this.paymentProcessedFunction();
      }
    } catch (err) {
      console.log('onDonateStoreChange caught error: ', err);
    }
  };

  async submitStripePayment () {
    const { stripe } = this.props;
    const { payByMonthCostPerMonth, payByYearCostPerYear, pricingPlanChosen } = this.state;
    let { couponCode } = this.state;
    let donateMonthly = false;
    let planType = '';

    // If we pass in a couponCode (ex/ VOTE9X3), we then need to match that with
    if (String(pricingPlanChosen) === 'professional') {
      if (payByMonthCostPerMonth) {
        donateMonthly = true;
        planType = 'PROFESSIONAL_MONTHLY';
      } else if (payByYearCostPerYear) {
        donateMonthly = false;
        planType = 'PROFESSIONAL_YEARLY';
      } else {
        // Default
        donateMonthly = true;
        planType = 'PROFESSIONAL_MONTHLY';
      }
    } else if (String(pricingPlanChosen) === 'enterprise') {
      if (payByMonthCostPerMonth) {
        donateMonthly = true;
        planType = 'ENTERPRISE_MONTHLY';
      } else if (payByYearCostPerYear) {
        donateMonthly = false;
        planType = 'ENTERPRISE_YEARLY';
      } else {
        // Default
        donateMonthly = true;
        planType = 'ENTERPRISE_MONTHLY';
      }
    } else {
      // Default
      donateMonthly = true;
      planType = 'PROFESSIONAL_MONTHLY';
    }

    if (!couponCode || couponCode.length === 0) {
      couponCode = `DEFAULT-${planType}`;
    }
    // console.log('couponCode:', couponCode, ', planType:', planType, ', donateMonthly:', donateMonthly);
    // console.log("stripe token object from component/dialog: " + token);

    const isOrganizationPlan = true;
    const email  = '';
    // TODO: Figure out what is needed for Name
    const { token } = await stripe.createToken({ name: 'Name' });
    if (token) {
      DonateActions.donationWithStripe(token.id, email, 0, donateMonthly,  // donationAmount is 0 because the actual amount should come from API server
        isOrganizationPlan, planType, couponCode);
    } else {
      this.setState({
        paymentError: true,
      });
      setTimeout(() => {
        this.setState({ paymentError: false });
      }, 3000);
    }
  }

  paymentProcessedFunction () {
    if (this.props.paymentProcessedFunction) {
      this.props.paymentProcessedFunction();
    }
  }

  render () {
    console.log('SettingsStripePayment render, this.state:', this.state);
    renderLog(__filename);
    const { classes } = this.props;
    const {
      numberOfMonthsService, organizationWeVoteId, payByMonthCostPerMonth, payByYearCostPerYear, paymentError, pricingPlanChosen, stripeErrorMessageForVoter, voter,
    } = this.state;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }

    // let chargeAmountInPennies;
    let chargeAmountWithCommas;
    let forWhichPlanText;
    if (String(pricingPlanChosen) === 'professional') {
      forWhichPlanText = 'You are purchasing the Professional plan. ';
    } else if (String(pricingPlanChosen) === 'enterprise') {
      forWhichPlanText = 'You are purchasing the Enterprise plan. ';
    }
    let billingOptionChosen = false;
    let paymentDescriptionText;
    if (payByMonthCostPerMonth) {
      const payByMonthCostPerMonthWithCommas = numberWithCommas(payByMonthCostPerMonth / 100);
      paymentDescriptionText = `${forWhichPlanText}Your credit card will be charged $${payByMonthCostPerMonthWithCommas} per month.`;
      // chargeAmountInPennies = payByMonthCostPerMonth;
      chargeAmountWithCommas = payByMonthCostPerMonthWithCommas;
      billingOptionChosen = true;
    } else if (payByYearCostPerYear) {
      const payByYearCostPerYearWithCommas = numberWithCommas(payByYearCostPerYear / 100);
      paymentDescriptionText = `${forWhichPlanText}Your credit card will be charged $${payByYearCostPerYearWithCommas} for ${numberOfMonthsService} months of service.`;
      // chargeAmountInPennies = payByYearCostPerYear;
      chargeAmountWithCommas = payByYearCostPerYearWithCommas;
      billingOptionChosen = true;
    } else {
      paymentDescriptionText = 'Please choose billing option, or enter coupon code.';
      billingOptionChosen = false;
    }

    return (
      <div>
        {paymentError ? (
          <div
            className={classes.stripeAlertError}
          >
            {stripeErrorMessageForVoter || 'Please verify your information.'}
          </div>
        ) : null}
        <PaymentDescriptionText>
          {paymentDescriptionText}
        </PaymentDescriptionText>
        {billingOptionChosen && (
          <span>
            <StripeElementContainer>
              <CardElement />
            </StripeElementContainer>
            <Button
              disabled={false}
              fullWidth
              variant="contained"
              margin="normal"
              color="primary"
              classes={{ root: classes.paymentButton }}
              onClick={this.submitStripePayment}
            >
              Pay $
              {chargeAmountWithCommas}
            </Button>
          </span>
        )}
      </div>
    );
  }
}

const styles = () => ({
  paymentButton: {
    '@media (max-width: 569px)': {
      height: 35,
      fontSize: 14,
    },
    '@media (max-width: 769px)': {
      height: 45,
      fontSize: 16,
    },
  },
  stripeAlertError: {
    background: 'rgb(255, 177, 160)',
    color: 'rgb(163, 40, 38)',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    // height: 40,
    fontSize: 14,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      // height: 35,
      fontSize: 14,
    },
    '@media (max-width: 769px)': {
      // height: 45,
      fontSize: 16,
    },
  },
});

const PaymentDescriptionText = styled.div`
  align-items: center;
  width: fit-content;
  width: 100%;
  margin-top: 12px;
`;

const StripeElementContainer = styled.div`
  margin: 32px 0 32px 0;
`;

export default withStyles(styles)(injectStripe(SettingsStripePayment));
