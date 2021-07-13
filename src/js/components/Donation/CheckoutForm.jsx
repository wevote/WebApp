import { TextField } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { LockOutlined } from '@material-ui/icons';
import { styled as muiStyled } from '@material-ui/styles';
import { CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import moneyStringToPennies from '../../utils/moneyStringToPennies';
import LoadingWheelComp from '../LoadingWheelComp';
import SplitIconButton from '../Widgets/SplitIconButton';


const iconButtonStyles = {
  width: window.innerWidth < 1280 ? 220 : 300,
  margin: '16px',
};

/*
July 2021 TODO: Same named file in the WebApp and Campaigns -- PLEASE KEEP THEM IDENTICAL -- make symmetrical changes and test on both sides
*/


class CheckoutForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      donationWithStripeSubmitted: false,
      paymentError: false,
      stripeErrorMessageForVoter: '',
      emailFieldError: false,
      emailFieldText: '',
      emailValidationErrorText: '',
    };
    this.continuePolling = this.continuePolling.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.onDonateStoreChange = this.onDonateStoreChange.bind(this);
    this.pollForWebhookCompletionAtList = this.pollForWebhookCompletionAtList.bind(this);
    this.submitStripePayment = this.submitStripePayment.bind(this);
    this.preDonationCounts = {
      subscriptions: -1,
      payments: -1,
    };
  }

  componentDidMount () {
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange);
    DonateActions.donationRefreshDonationList();
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    if (this.stripeErrorTimer) clearTimeout(this.stripeErrorTimer);
  }

  onDonateStoreChange = () => {
    const { donationWithStripeSubmitted, paymentErrorMessage } = this.state;
    console.log('onDonateStoreChange');
    try {
      const { apiSuccess } = DonateStore.getAll();
      let stripeErrorMessageForVoter = DonateStore.donationError() || paymentErrorMessage;
      const getAmountPaidViaStripe = DonateStore.getAmountPaidViaStripe();
      if (apiSuccess === false ||
        (getAmountPaidViaStripe === 0 && donationWithStripeSubmitted && stripeErrorMessageForVoter.length === 0)) {
        stripeErrorMessageForVoter = 'The payment did not go through, please try again later.';
      }
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
      console.log('getAmountPaidViaStripe:', getAmountPaidViaStripe);
      if (getAmountPaidViaStripe) {
        // Tell the parent component to move past this step
        this.setState({
          donationWithStripeSubmitted: false,
        });
      }

      if (DonateStore.donationResponseReceived()) {
        console.log('onDonateStoreChange  ---  donationResponseReceived');
        if (DonateStore.donationSuccess()) {
          console.log('onDonateStoreChange  ---  donationSuccess');
        }
      }
    } catch (err) {
      console.log('onDonateStoreChange caught error: ', err);
    }
  };

  // See https://www.npmjs.com/package/@stripe/react-stripe-js#using-class-components
  setPreDonationCounts () {
    this.preDonationCounts = {
      subscriptions: DonateStore.getNumberOfActiveSubscriptions(),
      payments: DonateStore.getNumberOfPayments(),
    };
  }

  submitStripePayment = async (emailFromVoter) => {
    const { stripe, value, elements, isMonthly, isChipIn, campaignXWeVoteId } = this.props;
    const { emailFieldError, emailFieldText } = this.state;
    console.log('submitStripePayment was called ==================');

    if (emailFieldError) {
      this.setState({
        emailValidationErrorText: 'Our payment processor requires an email address for this transaction.',
        emailFieldError: false,
      });
    } else {
      const email = (emailFromVoter && emailFromVoter.length > 0) ? emailFromVoter : emailFieldText;

      let paymentMethodId;
      let error;
      try {
        ({ error,  paymentMethod: { id: paymentMethodId } } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            email,
          },
        }));
      } catch (error2) {
        console.log('Stripe createPaymentMethodError: ', error2);
      }

      const tokenResult = await stripe.createToken(elements.getElement(CardElement));
      const { token } = tokenResult;
      console.log(`stripe token object from component/dialog: ${token}`);
      if (token) {
        const isMonthlyDonation = isMonthly;
        const isPremiumPlan = false;
        const couponCode = '';
        const premiumPlanType = '';
        const donationPennies = moneyStringToPennies(value);
        this.setPreDonationCounts();

        DonateActions.donationWithStripe(token.id, email, donationPennies, isChipIn, isMonthlyDonation, isPremiumPlan, token.client_ip, campaignXWeVoteId, paymentMethodId, couponCode, premiumPlanType);

        this.pollForWebhookCompletionAtList(20);

        this.setState({
          donationWithStripeSubmitted: true,
          paymentError: false,
          paymentErrorMessage: '',
        });
      } else {
        const { /* code, */ message } = error;
        console.log('Stripe returned error message:', message);
        this.setState({
          paymentError: true,
          paymentErrorMessage: message,
        });
      }
    }
  }

  pollForWebhookCompletionAtList = (maxPolls) => {
    let pollCount = maxPolls;
    console.log('pollForWebhookCompletion entry ----- ');

    if (this.continuePolling()) {
      this.setState({ isPolling: true });
      this.setPollInterval = setInterval(() => {
        pollCount--;
        if (pollCount > 0 && this.continuePolling()) {
          console.log(`pollForWebhookCompletion polling ----- ${pollCount}`);
          DonateActions.donationRefreshDonationList();
        } else {
          clearInterval(this.setPollInterval);
          this.setPollInterval = null;
          this.clearPreDonationCounts();
        }
      }, 1000);
      this.setState({ isPolling: false });
    }
  }

  emailChange = (event) => {
    const currentEntry = event.target.value;
    const validEmailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const valid = currentEntry.match(validEmailPattern) != null;
    console.log('valid? : ', currentEntry, ' valid: ', valid);
    this.setState({
      emailFieldError: !valid,
      emailFieldText: currentEntry,
      emailValidationErrorText: 'Our payment processor requires a valid email address',
    });
  }

  clearPreDonationCounts () {
    this.preDonationCounts = {
      subscriptions: -1,
      payments: -1,
    };
  }

  continuePolling () {
    console.log(` continuePolling subs ${DonateStore.getNumberOfActiveSubscriptions()} vs ${this.preDonationCounts.subscriptions}  payments ${DonateStore.getNumberOfPayments()} vs ${this.preDonationCounts.payments}`);

    return this.preDonationCounts.payments > -1 &&
      DonateStore.getNumberOfActiveSubscriptions() === this.preDonationCounts.subscriptions &&
      DonateStore.getNumberOfPayments() === this.preDonationCounts.payments;
  }


  render () {
    renderLog('CheckoutForm');  // Set LOG_RENDER_EVENTS to log all renders
    const { campaignXWeVoteId, classes, isMonthly, showWaiting } = this.props;
    const { emailValidationErrorText, emailFieldError, isPolling, paymentError, stripeErrorMessageForVoter } = this.state;
    const voter = VoterStore.getVoter();
    const emailFromVoter = (voter && voter.email) || '';
    console.log('render emailFieldError:', emailFieldError);
    const paymentErrorText = stripeErrorMessageForVoter  || 'Please verify your information.';
    const error = emailFieldError || paymentError;
    const errorText = emailFieldError ? emailValidationErrorText : paymentErrorText;
    let buttonText = 'Become a member';
    if (!isMonthly) {
      buttonText = campaignXWeVoteId && campaignXWeVoteId.length ? 'Chip In Today' : 'Donate Today';
    }

    return (
      <>
        {error ? (
          <div className={classes.stripeAlertError}>{errorText}</div>
        ) : (
          <div style={{ height: 41 }} />
        )}
        {emailFromVoter.length === 0 ? (
          <TextFieldContainer>
            <TextField
              id="outlined-basic-email"
              label="email"
              variant="outlined"
              className={classes.root}
              error={emailFieldError}
              onChange={this.emailChange}
              autoFocus
            />
          </TextFieldContainer>
        ) : null}
        <form>
          <CardElement
            options={{
              style: {
                base: {
                  margin: 4,
                  fontSize: '18px',
                  color: 'darkgrey',
                  '::placeholder': {
                    color: 'lightgrey',
                  },
                },
                empty: {
                  backgroundColor: 'white',
                  margin: 10,
                },
                invalid: {
                  color: '#9e2146',
                  fontSize: '18px',
                },
              },
            }}
          />
          <ButtonContainer>
            <SplitIconButton
              buttonText={buttonText}
              backgroundColor="#2e3c5d"
              separatorColor="#2e3c5d"
              styles={iconButtonStyles}
              adjustedIconWidth={40}
              disabled={showWaiting}
              externalUniqueId="becomeAMember"
              icon={<LockStyled />}
              id="stripeCheckOutForm"
              onClick={() => this.submitStripePayment(emailFromVoter)}
            />
          </ButtonContainer>
          <StripeTagLine>
            Secure processing provided by Stripe
          </StripeTagLine>
        </form>
        {isPolling ? <LoadingWheelComp /> : null}
      </>
    );
  }
}
CheckoutForm.propTypes = {
  stripe: PropTypes.object,
  elements: PropTypes.object,
  value: PropTypes.string,
  classes: PropTypes.object,
  showWaiting: PropTypes.bool,
  isMonthly: PropTypes.bool,
  isChipIn: PropTypes.bool,
  campaignXWeVoteId: PropTypes.string,
};

const StripeTagLine = styled.div`
  color: grey;
  font-size: 12px;
  padding-top: 5px;
`;

const TextFieldContainer = styled.div`
  color: grey;
  font-size: 12px;
  padding: 5px 0 10px 0;
`;
const ButtonContainer = styled.div`
  margin-top: 10px;
`;

const styles = () => ({
  root: {
    '& .MuiOutlinedInput-input': {
      backgroundColor: 'white',
    },
  },
  stripeAlertError: {
    background: 'rgb(255, 177, 160)',
    color: 'rgb(163, 40, 38)',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
    width: '94%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      fontSize: 14,
    },
  },
});

const LockStyled = muiStyled(LockOutlined)({ color: 'white' });

export default withTheme(withStyles(styles)(CheckoutForm));
