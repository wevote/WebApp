import { CircularProgress, TextField } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { LockOutlined } from '@material-ui/icons';
import { styled as muiStyled } from '@material-ui/styles';
import { CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import VoterStore from '../../../stores/VoterStore';
import { renderLog } from '../../../utils/logging';
import moneyStringToPennies from '../../../utils/moneyStringToPennies';
import SplitIconButton from '../../../components/Widgets/SplitIconButton';


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
      oneLastRefreshSent: false,
      stripePaymentError: false,
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
    DonateStore.noDispatchClearStripeErrorState();
    DonateActions.donationRefreshDonationList();
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    if (this.stripeErrorTimer) clearTimeout(this.stripeErrorTimer);
    if (this.setPollInterval) clearInterval(this.setPollInterval);
  }

  onDonateStoreChange = () => {
    const { donationWithStripeSubmitted, stripePaymentErrorMessage, oneLastRefreshSent, isPolling } = this.state;
    console.log('onDonateStoreChange');
    try {
      const paymentSetupSuccess = stripePaymentErrorMessage === undefined || stripePaymentErrorMessage.length === 0;
      const donationWithStripeApiSuccess = DonateStore.donationSuccess() === undefined ? true : DonateStore.donationSuccess();
      const donationWithStripeErrorMessage = DonateStore.donationError();
      const getAmountPaidViaStripe = DonateStore.getAmountPaidViaStripe();
      let stripeErrorMessageForVoter = '';
      if (!paymentSetupSuccess) {
        stripeErrorMessageForVoter = stripePaymentErrorMessage;
      } else if (!donationWithStripeApiSuccess && !isPolling) {
        stripeErrorMessageForVoter = donationWithStripeErrorMessage ||
          'An error occurred.  (Do you already have a membership for the same amount?)';
      }

      if (stripeErrorMessageForVoter) {
        this.setState({
          stripePaymentError: true,
          stripeErrorMessageForVoter,
        });
        if (donationWithStripeSubmitted) {
          this.stripeErrorTimer = setTimeout(() => {
            this.setState({
              stripePaymentError: false,
              stripeErrorMessageForVoter: '',
              donationWithStripeSubmitted: false,
            });
            DonateActions.clearStripeErrorState();
          }, 10000);
        }
      }
      console.log('getAmountPaidViaStripe:', getAmountPaidViaStripe);
      if (getAmountPaidViaStripe) {
        // Tell the parent component to move past this step
        this.setState({
          donationWithStripeSubmitted: false,
        });
      }

      if (DonateStore.donationResponseReceived() && !oneLastRefreshSent) {
        console.log('onDonateStoreChange  ---  donationResponseReceived');
        if (DonateStore.donationSuccess()) {
          console.log('onDonateStoreChange  ---  donationSuccess');
          // One last refresh to guarantee that the DonationLists update
          DonateActions.donationRefreshDonationList();
          this.setState({
            oneLastRefreshSent: true,
          });
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
      let createPaymentError;
      try {
        ({ createPaymentError,  paymentMethod: { id: paymentMethodId } } = await stripe.createPaymentMethod({
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
        DonateActions.clearStripeErrorState();
        DonateActions.donationWithStripe(token.id, email, donationPennies, isChipIn, isMonthlyDonation, isPremiumPlan, token.client_ip, campaignXWeVoteId, paymentMethodId, couponCode, premiumPlanType);

        this.pollForWebhookCompletionAtList(20);

        this.setState({
          donationWithStripeSubmitted: true,
          oneLastRefreshSent: false,
          stripePaymentError: false,
          stripePaymentErrorMessage: '',
        });
      } else {
        const { /* code, */ message } = createPaymentError;
        console.log('Stripe returned error message:', message);
        this.setState({
          stripePaymentError: true,
          stripePaymentErrorMessage: message,
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
        if (pollCount > 0 && this.continuePolling() && DonateStore.donationSuccess()) {
          console.log(`pollForWebhookCompletion polling ----- ${pollCount}`);
          DonateActions.donationRefreshDonationList();
        } else {
          console.log(`pollForWebhookCompletion done ----- ${pollCount}`);
          clearInterval(this.setPollInterval);
          this.setPollInterval = null;
          this.clearPreDonationCounts();
          // So the previous card error, does not influence the next potential success
          DonateActions.clearStripeErrorState();
          // One last refresh to guarantee that the DonationLists update
          DonateActions.donationRefreshDonationList();
        }
      }, 1000);
      console.log(`pollForWebhookCompletion isPolling set false ===== ${pollCount}`);
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
    const { campaignXWeVoteId, classes, isMonthly } = this.props;
    const { donationWithStripeSubmitted, emailValidationErrorText, emailFieldError,
      stripePaymentError, stripeErrorMessageForVoter } = this.state;
    const voter = VoterStore.getVoter();
    const emailFromVoter = (voter && voter.email) || '';
    console.log('render emailFieldError:', emailFieldError);
    const paymentErrorText = stripeErrorMessageForVoter  || 'Please verify your information.';
    const error = emailFieldError || stripePaymentError;
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
              disabled={donationWithStripeSubmitted}
              externalUniqueId="becomeAMember"
              icon={donationWithStripeSubmitted ? <ProgressStyled /> : <LockStyled />}
              id="stripeCheckOutForm"
              onClick={() => this.submitStripePayment(emailFromVoter)}
            />
          </ButtonContainer>
          <StripeTagLine>
            Secure processing provided by Stripe
          </StripeTagLine>
        </form>
      </>
    );
  }
}
CheckoutForm.propTypes = {
  stripe: PropTypes.object,
  elements: PropTypes.object,
  value: PropTypes.string,
  classes: PropTypes.object,
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
const ProgressStyled = muiStyled(CircularProgress)({
  color: 'white',
  width: '20px !important',
  display: 'inline-block',
  height: '20px !important',
  alignItems: 'center',
  padding: 'unset !important',
});

export default withTheme(withStyles(styles)(CheckoutForm));
