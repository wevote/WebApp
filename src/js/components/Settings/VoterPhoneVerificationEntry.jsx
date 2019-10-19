import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Phone from '@material-ui/icons/Phone';
import InputBase from '@material-ui/core/InputBase';
import { Alert } from 'react-bootstrap';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import SettingsVerifySecretCode from './SettingsVerifySecretCode';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';

class VoterPhoneVerificationEntry extends Component {
  static propTypes = {
    classes: PropTypes.object,
    inModal: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      disablePhoneVerificationButton: true,
      displayPhoneVerificationButton: false,
      showVerifyModal: false,
      showError: false,
      smsPhoneNumberList: [],
      smsPhoneNumberListCount: 0,
      smsPhoneNumberStatus: {},
      voterSMSPhoneNumber: '',
      voterSMSPhoneNumberIsValid: false,
    };

    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
    this.sendSignInCodeSMS = this.sendSignInCodeSMS.bind(this);
    this.closeVerifyModal = this.closeVerifyModal.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterRetrieve();
    VoterActions.voterSMSPhoneNumberRetrieve();
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (JSON.stringify(this.state.smsPhoneNumberStatus) !== JSON.stringify(nextState.smsPhoneNumberStatus)) {
      // console.log('this.state.smsPhoneNumberStatus', this.state.smsPhoneNumberStatus, ', nextState.smsPhoneNumberStatus', nextState.smsPhoneNumberStatus);
      return true;
    }
    if (this.state.disablePhoneVerificationButton !== nextState.disablePhoneVerificationButton) {
      // console.log('this.state.disablePhoneVerificationButton', this.state.disablePhoneVerificationButton, ', nextState.disablePhoneVerificationButton', nextState.disablePhoneVerificationButton);
      return true;
    }
    if (this.state.displayPhoneVerificationButton !== nextState.displayPhoneVerificationButton) {
      // console.log('this.state.displayPhoneVerificationButton', this.state.displayPhoneVerificationButton, ', nextState.displayPhoneVerificationButton', nextState.displayPhoneVerificationButton);
      return true;
    }
    if (this.state.loading !== nextState.loading) {
      // console.log('this.state.loading', this.state.loading, ', nextState.loading', nextState.loading);
      return true;
    }
    if (this.state.showError !== nextState.showError) {
      // console.log('this.state.showError', this.state.showError, ', nextState.showError', nextState.showError);
      return true;
    }
    if (this.state.showVerifyModal !== nextState.showVerifyModal) {
      // console.log('this.state.showVerifyModal', this.state.showVerifyModal, ', nextState.showVerifyModal', nextState.showVerifyModal);
      return true;
    }
    if (this.state.voterSMSPhoneNumber !== nextState.voterSMSPhoneNumber) {
      // console.log('this.state.voterSMSPhoneNumber', this.state.voterSMSPhoneNumber, ', nextState.voterSMSPhoneNumber', nextState.voterSMSPhoneNumber);
      return true;
    }
    if (this.state.smsPhoneNumberListCount !== nextState.smsPhoneNumberListCount) {
      // console.log('this.state.smsPhoneNumberListCount', this.state.smsPhoneNumberListCount, ', nextState.smsPhoneNumberListCount', nextState.smsPhoneNumberListCount);
      return true;
    }
    // console.log('shouldComponentUpdate false');
    return false;
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const smsPhoneNumberStatus = VoterStore.getSMSPhoneNumberStatus();
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    // console.log('onVoterStoreChange smsPhoneNumberStatus:', smsPhoneNumberStatus);
    if (secretCodeVerified) {
      this.setState({
        showVerifyModal: false,
        voterSMSPhoneNumber: '',
      });
    } else if (smsPhoneNumberStatus.sign_in_code_sms_sent) {
      this.setState({
        displayPhoneVerificationButton: false,
        smsPhoneNumberStatus: {
          sign_in_code_sms_sent: false,
        },
        showVerifyModal: true,
      });
    } else if (smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter) {
      this.setState({
        displayPhoneVerificationButton: false,
        smsPhoneNumberStatus,
        showVerifyModal: false,
      });
    } else {
      this.setState({
        smsPhoneNumberStatus,
      });
    }
    const smsPhoneNumberList = VoterStore.getSMSPhoneNumberList();
    const smsPhoneNumberListCount = smsPhoneNumberList.length;
    this.setState({
      loading: false,
      voter: VoterStore.getVoter(),
      smsPhoneNumberList,
      smsPhoneNumberListCount,
    });
  }

  onPhoneNumberChange (e) {
    const incomingVoterPhoneNumber = e.target.value;
    const voterSMSPhoneNumberWithPlus = `+${incomingVoterPhoneNumber}`;
    const voterSMSPhoneNumberWithPlusAndOne = `+1${incomingVoterPhoneNumber}`;

    const voterSMSPhoneNumberIsValidRaw = isValidPhoneNumber(incomingVoterPhoneNumber);
    const voterSMSPhoneNumberIsValidWithPlus = isValidPhoneNumber(voterSMSPhoneNumberWithPlus);
    const voterSMSPhoneNumberIsValidWithPlusAndOne = isValidPhoneNumber(voterSMSPhoneNumberWithPlusAndOne);
    const voterSMSPhoneNumberIsValid = voterSMSPhoneNumberIsValidRaw || voterSMSPhoneNumberIsValidWithPlus || voterSMSPhoneNumberIsValidWithPlusAndOne;
    // console.log('onPhoneNumberChange, incomingVoterPhoneNumber: ', incomingVoterPhoneNumber, ', voterSMSPhoneNumberIsValid:', voterSMSPhoneNumberIsValid);
    // console.log('voterSMSPhoneNumberWithPlus:', voterSMSPhoneNumberWithPlus);
    // console.log('voterSMSPhoneNumberWithPlusAndOne:', voterSMSPhoneNumberWithPlusAndOne);
    this.setState({
      disablePhoneVerificationButton: !voterSMSPhoneNumberIsValid,
      voterSMSPhoneNumber: incomingVoterPhoneNumber,
      voterSMSPhoneNumberIsValid,
    });
  }

  setAsPrimarySMSPhoneNumber (smsWeVoteId) {
    VoterActions.setAsPrimarySMSPhoneNumber(smsWeVoteId);
  }

  voterSMSPhoneNumberSave = (event) => {
    // console.log('VoterPhoneVerificationEntry this.voterSMSPhoneNumberSave');
    event.preventDefault();
    VoterActions.voterSMSPhoneNumberSave(this.state.voterSMSPhoneNumber);
    this.setState({ loading: true });
  }

  updateVoterSMSPhoneNumber = (e) => {
    const voterSMSPhoneNumber = e.target.value;
    const voterSMSPhoneNumberIsValid = true;
    this.setState({
      voterSMSPhoneNumber,
      voterSMSPhoneNumberIsValid,
    });
  }

  closeVerifyModal = () => {
    // console.log('VoterPhoneVerificationEntry closeVerifyModal');
    this.setState({
      displayPhoneVerificationButton: false,
      smsPhoneNumberStatus: {
        sign_in_code_sms_sent: false,
      },
      showVerifyModal: false,
      voterSMSPhoneNumber: '',
    });
  }

  hidePhoneVerificationButton = () => {
    const { voterSMSPhoneNumber } = this.state;
    if (!voterSMSPhoneNumber) {
      // Only hide if no number entered
      this.setState({
        displayPhoneVerificationButton: false,
      });
    }
  }

  displayPhoneVerificationButton = () => {
    this.setState({
      displayPhoneVerificationButton: true,
    });
  }

  reSendSignInCodeSMS = (voterSMSPhoneNumber) => {
    if (voterSMSPhoneNumber) {
      VoterActions.sendSignInCodeSMS(voterSMSPhoneNumber);
      // We need to put voterSMSPhoneNumber back in place so the verify modal can open
      this.setState({
        loading: true,
        smsPhoneNumberStatus: {
          sms_phone_number_already_owned_by_other_voter: false,
        },
        voterSMSPhoneNumber,
      });
    }
  }

  sendSignInCodeSMS () {
    // console.log('sendSignInCodeSMS');
    const { voterSMSPhoneNumber, voterSMSPhoneNumberIsValid } = this.state;
    if (voterSMSPhoneNumberIsValid) {
      VoterActions.sendSignInCodeSMS(voterSMSPhoneNumber);
      this.setState({
        smsPhoneNumberStatus: {
          sms_phone_number_already_owned_by_other_voter: false,
        },
        loading: true,
      });
    } else {
      this.setState({ showError: true });
    }
  }

  removeVoterSMSPhoneNumber (smsWeVoteId) {
    VoterActions.removeVoterSMSPhoneNumber(smsWeVoteId);
  }

  render () {
    renderLog(__filename);
    if (this.state.loading) {
      return LoadingWheel;
    }

    const { classes } = this.props;
    const { disablePhoneVerificationButton, displayPhoneVerificationButton, showError, showVerifyModal, smsPhoneNumberStatus, smsPhoneNumberList, smsPhoneNumberListCount, voterSMSPhoneNumber } = this.state;

    const signInLinkOrCodeSent = (smsPhoneNumberStatus.link_to_sign_in_sms_sent || smsPhoneNumberStatus.sign_in_code_sms_sent);
    const smsPhoneNumberStatusHtml = (
      <span>
        { (smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter && !smsPhoneNumberStatus.sms_phone_number_deleted && !smsPhoneNumberStatus.make_primary_sms) ||
        (smsPhoneNumberStatus.sms_phone_number_already_owned_by_other_voter && !signInLinkOrCodeSent) ? (
          <Alert variant="warning">
            { smsPhoneNumberStatus.sms_phone_number_already_owned_by_other_voter && !signInLinkOrCodeSent && (
              <span>
                That email is already being used by another account.
                <br />
                <br />
                Please click &quot;Send Login Code in an Email&quot; below to sign into that account.
              </span>
            )}
            { smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter && !smsPhoneNumberStatus.sms_phone_number_deleted && !smsPhoneNumberStatus.make_primary_sms ?
              <span>That phone number was already verified by you. </span>
              :
              null }
          </Alert>
          ) : null
        }
        { smsPhoneNumberStatus.sms_phone_number_created ||
        smsPhoneNumberStatus.sms_phone_number_deleted ||
        smsPhoneNumberStatus.sms_ownership_is_verified ||
        smsPhoneNumberStatus.make_primary_sms ||
        smsPhoneNumberStatus.sign_in_code_sms_sent ? (
          <Alert variant="success">
            { smsPhoneNumberStatus.sms_phone_number_created &&
            !smsPhoneNumberStatus.verification_sms_sent ? <span>Your phone number was saved. </span> : null }
            { smsPhoneNumberStatus.sms_phone_number_deleted ? <span>Your phone number was deleted. </span> : null }
            { smsPhoneNumberStatus.sms_ownership_is_verified ? <span>Your phone number was verified. </span> : null }
            { smsPhoneNumberStatus.make_primary_sms ? <span>Your have chosen a new primary phone number. </span> : null }
            { smsPhoneNumberStatus.sign_in_code_sms_sent ? <span>Please check your phone. A sign in verification code was sent. </span> : null }
          </Alert>
          ) : null
        }
      </span>
    );

    let enterSMSPhoneNumberTitle = 'Sign in with SMS Phone Number';
    // let enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to be signed into your We Vote account." :
    //   "You'll receive a magic link in the email on this phone. Click that link to be signed into your We Vote account.";
    if (this.state.voter && this.state.voter.is_signed_in) {
      enterSMSPhoneNumberTitle = 'Add New Phone Number';
      // enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to verify this new email." :
      //   "You'll receive a magic link in the email on this phone. Click that link to verify this new email.";
    }

    const enterSMSPhoneNumberHtml = (
      <div>
        <div className="u-stack--sm u-tl">
          <strong>
            {enterSMSPhoneNumberTitle}
          </strong>
          {showError ? (
            <Error>
              Please enter a valid phone number.
            </Error>
          ) : null}
          {' '}
        </div>
        <form className="form-inline">
          <Paper className={classes.root} elevation={1}>
            <Phone />
            <InputBase
              className={classes.input}
              type="phone"
              name="voter_phone_number"
              id="enterVoterPhone"
              onBlur={this.hidePhoneVerificationButton}
              onChange={this.onPhoneNumberChange}
              onFocus={this.displayPhoneVerificationButton}
              placeholder="Type phone number here..."
            />
          </Paper>
          {displayPhoneVerificationButton && (
            <Button
              className={classes.button}
              color="primary"
              disabled={disablePhoneVerificationButton}
              id="voterPhoneSendSMS"
              onClick={this.sendSignInCodeSMS}
              variant="contained"
            >
              Send Verification Code
            </Button>
          )}
        </form>
      </div>
    );

    let allowRemoveSMSPhoneNumber;
    let emailOwnershipIsVerified;
    let isPrimarySMSPhoneNumber;

    // ///////////////////////////////////
    // LIST OF VERIFIED SMS PHONE NUMBERS
    let verifiedSMSFound = false;
    const verifiedSMSListHtml = smsPhoneNumberList.map((voterSMSPhoneNumberFromList) => {
      emailOwnershipIsVerified = !!voterSMSPhoneNumberFromList.sms_ownership_is_verified;

      if (emailOwnershipIsVerified) {
        verifiedSMSFound = true;
        allowRemoveSMSPhoneNumber = voterSMSPhoneNumberFromList.primary_sms_phone_number !== true;
        isPrimarySMSPhoneNumber = voterSMSPhoneNumberFromList.primary_sms_phone_number === true;

        return (
          <div key={voterSMSPhoneNumberFromList.sms_we_vote_id}>
            <span>{voterSMSPhoneNumberFromList.normalized_sms_phone_number}</span>

            {isPrimarySMSPhoneNumber && (
              <span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                Primary
              </span>
            )}
            {!isPrimarySMSPhoneNumber && (
              <span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>
                  <a // eslint-disable-line
                    onClick={this.setAsPrimarySMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                  >
                    Make Primary
                  </a>
                  &nbsp;&nbsp;&nbsp;
                </span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                {allowRemoveSMSPhoneNumber && (
                  <a // eslint-disable-line
                    onClick={this.removeVoterSMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                  >
                    <Delete />
                  </a>
                )}
              </span>
            )}
          </div>
        );
      } else {
        return null;
      }
    });

    // ////////////////////////////////////
    // LIST OF SMS PHONE NUMBERS TO VERIFY
    let unverifiedSMSFound = false;
    const toVerifySMSListHtml = smsPhoneNumberList.map((voterSMSPhoneNumberFromList) => {
      emailOwnershipIsVerified = !!voterSMSPhoneNumberFromList.sms_ownership_is_verified;
      if (!emailOwnershipIsVerified) {
        unverifiedSMSFound = true;
        allowRemoveSMSPhoneNumber = !voterSMSPhoneNumberFromList.primary_sms_phone_number;
        isPrimarySMSPhoneNumber = !!voterSMSPhoneNumberFromList.primary_sms_phone_number;
        return (
          <div key={voterSMSPhoneNumberFromList.sms_we_vote_id}>
            <div>
              <span>{voterSMSPhoneNumberFromList.normalized_sms_phone_number}</span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              {voterSMSPhoneNumberFromList.sms_ownership_is_verified ?
                null : (
                  <a // eslint-disable-line
                    onClick={() => this.reSendSignInCodeSMS(voterSMSPhoneNumberFromList.normalized_sms_phone_number)}
                  >
                    Send Verification Again
                  </a>
                )}

              <span>&nbsp;&nbsp;&nbsp;</span>
              {allowRemoveSMSPhoneNumber && (
                <a // eslint-disable-line
                  onClick={this.removeVoterSMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                >
                  <Delete />
                </a>
              )}
            </div>
          </div>
        );
      } else {
        return null;
      }
    });

    return (
      <Wrapper>
        {verifiedSMSFound && !this.props.inModal ? (
          <PhoneNumberSection>
            <span className="h3">
              Your Phone Number
              {smsPhoneNumberListCount > 1 ? 's' : ''}
            </span>
            {smsPhoneNumberStatusHtml}
            {verifiedSMSListHtml}
          </PhoneNumberSection>
        ) : (
          <span>
            {smsPhoneNumberStatusHtml}
          </span>
        )}

        {unverifiedSMSFound && !this.props.inModal && (
          <PhoneNumberSection>
            <span className="h3">Phone Numbers to Verify</span>
            {toVerifySMSListHtml}
          </PhoneNumberSection>
        )}
        <PhoneNumberSection>
          {enterSMSPhoneNumberHtml}
        </PhoneNumberSection>
        {showVerifyModal && (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            closeVerifyModal={this.closeVerifyModal}
            voterPhoneNumber={voterSMSPhoneNumber}
          />
        )}
      </Wrapper>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8,
    marginBottom: 8,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    padding: 8,
  },
  button: {
    width: '100%',
    padding: '12px',
  },
};

const Wrapper = styled.div`
  margin-top: 32px;
`;

const PhoneNumberSection = styled.div`
  margin-top: 18px;
`;

const Error = styled.div`
  color: rgb(255, 73, 34);
  font-size: 14px;
`;

export default withStyles(styles)(VoterPhoneVerificationEntry);
