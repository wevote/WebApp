import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import { numberWithCommas } from '../../utils/textFormat';


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
      donationWithStripeSubmitted: false,
      numberOfMonthsService: 0,
      payByYearCostPerYear: 0,
      paymentError: false,
      organizationWeVoteId: '',
      payByMonthCostPerMonth: 0,
      pricingPlanChosen: '',
      voter: {},
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
    this.voterStoreListener.remove();
    if (this.stripeErrorTimer) {
      clearTimeout(this.stripeErrorTimer);
      this.stripeErrorTimer = null;
    }
    if (this.stripeSubmitTimer) {
      clearTimeout(this.stripeSubmitTimer);
      this.stripeSubmitTimer = null;
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const organizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log('onVoterStoreChange organizationWeVoteId: ', organizationWeVoteId);
    this.setState({
      organizationWeVoteId,
      voter,
    });
  }

  onDonateStoreChange = () => {
    // console.log('onDonateStoreChange');
    try {
      const stripeErrorMessageForVoter = DonateStore.donationError();
      if (stripeErrorMessageForVoter) {
        this.setState({
          paymentError: true,
          stripeErrorMessageForVoter,
        });
        this.stripeErrorTimer = setTimeout(() => {
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
        this.setState({
          donationWithStripeSubmitted: false,
        });
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
      this.setState({
        donationWithStripeSubmitted: true,
      });
    } else {
      this.setState({
        paymentError: true,
      });
      this.stripeSubmitTimer = setTimeout(() => {
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
    renderLog('SettingsStripePayment');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      donationWithStripeSubmitted, numberOfMonthsService, organizationWeVoteId, payByMonthCostPerMonth, payByYearCostPerYear, paymentError, pricingPlanChosen, stripeErrorMessageForVoter, voter,
    } = this.state;
    if (!voter || !organizationWeVoteId) {
      return LoadingWheel;
    }

    // let chargeAmountInPennies;
    let chargeAmountWithCommas;
    let forWhichPlanText = '';
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
              disabled={donationWithStripeSubmitted}
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
