import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { withStyles } from '@material-ui/core/esm/styles';
import Button from '@material-ui/core/esm/Button';
import Delete from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/esm/Paper';
import Phone from '@material-ui/icons/Phone';
import InputBase from '@material-ui/core/esm/InputBase';
import Alert from 'react-bootstrap/esm/Alert';
import LoadingWheel from '../LoadingWheel';
import { isCordova } from '../../utils/cordovaUtils';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import SettingsVerifySecretCode from './SettingsVerifySecretCode';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';

class VoterPhoneVerificationEntry extends Component {
  static propTypes = {
    classes: PropTypes.object,
    closeSignInModal: PropTypes.func,
    inModal: PropTypes.bool,
    toggleOtherSignInOptions: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      disablePhoneVerificationButton: true,
      displayPhoneVerificationButton: false,
      hideExistingPhoneNumbers: false,
      secretCodeSystemLocked: false,
      showVerifyModal: false,
      showError: false,
      signInCodeSMSSentAndWaitingForResponse: false,
      smsPhoneNumberList: [],
      smsPhoneNumberListCount: 0,
      smsPhoneNumberStatus: {},
      voterSMSPhoneNumber: '',
      voterSMSPhoneNumbersVerifiedCount: 0,
      voterSMSPhoneNumberIsValid: false,
    };

    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
    this.sendSignInCodeSMS = this.sendSignInCodeSMS.bind(this);
    this.closeVerifyModal = this.closeVerifyModal.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Steve 11/14/19: commenting out the next line: it is expensive and causes trouble in SignInModal, and is almost certainly not needed
    // VoterActions.voterRetrieve();
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
    if (this.state.hideExistingPhoneNumbers !== nextState.hideExistingPhoneNumbers) {
      // console.log('this.state.hideExistingPhoneNumbers', this.state.hideExistingPhoneNumbers, ', nextState.hideExistingPhoneNumbers', nextState.hideExistingPhoneNumbers);
      return true;
    }
    if (this.state.loading !== nextState.loading) {
      // console.log('this.state.loading', this.state.loading, ', nextState.loading', nextState.loading);
      return true;
    }
    if (this.state.secretCodeSystemLocked !== nextState.secretCodeSystemLocked) {
      // console.log('this.state.secretCodeSystemLocked', this.state.secretCodeSystemLocked, ', nextState.secretCodeSystemLocked', nextState.secretCodeSystemLocked);
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
    if (this.state.smsPhoneNumberListCount !== nextState.smsPhoneNumberListCount) {
      // console.log('this.state.smsPhoneNumberListCount', this.state.smsPhoneNumberListCount, ', nextState.smsPhoneNumberListCount', nextState.smsPhoneNumberListCount);
      return true;
    }
    if (this.state.voterSMSPhoneNumber !== nextState.voterSMSPhoneNumber) {
      // console.log('this.state.voterSMSPhoneNumber', this.state.voterSMSPhoneNumber, ', nextState.voterSMSPhoneNumber', nextState.voterSMSPhoneNumber);
      return true;
    }
    if (this.state.voterSMSPhoneNumbersVerifiedCount !== nextState.voterSMSPhoneNumbersVerifiedCount) {
      // console.log('this.state.voterSMSPhoneNumbersVerifiedCount', this.state.voterSMSPhoneNumbersVerifiedCount, ', nextState.voterSMSPhoneNumbersVerifiedCount', nextState.voterSMSPhoneNumbersVerifiedCount);
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
    const { secret_code_system_locked_for_this_voter_device_id: secretCodeSystemLocked } = smsPhoneNumberStatus;
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    // console.log('onVoterStoreChange smsPhoneNumberStatus:', smsPhoneNumberStatus);
    if (secretCodeVerified) {
      this.setState({
        displayPhoneVerificationButton: false,
        showVerifyModal: false,
        voterSMSPhoneNumber: '',
      });
    } else if (smsPhoneNumberStatus.sign_in_code_sms_sent) {
      this.setState({
        displayPhoneVerificationButton: true,  // if we need to go back to the SignInModal, we want to see all of it (and have all of it on screen)
        smsPhoneNumberStatus: {
          sign_in_code_sms_sent: false,
        },
        showVerifyModal: true,
        signInCodeSMSSentAndWaitingForResponse: false,
      });
    } else if (smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter) {
      this.setState({
        displayPhoneVerificationButton: false,
        smsPhoneNumberStatus,
        showVerifyModal: false,
        signInCodeSMSSentAndWaitingForResponse: false,
      });
    } else {
      this.setState({
        smsPhoneNumberStatus,
      });
    }
    const smsPhoneNumberList = VoterStore.getSMSPhoneNumberList();
    const smsPhoneNumberListCount = smsPhoneNumberList.length;
    const voterSMSPhoneNumbersVerifiedCount = VoterStore.getSMSPhoneNumbersVerifiedCount();
    this.setState({
      loading: false,
      voter: VoterStore.getVoter(),
      voterSMSPhoneNumbersVerifiedCount,
      secretCodeSystemLocked,
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
  };

  closeSignInModal = () => {
    // console.log('SettingsAccount localCloseSignInModal');
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  closeVerifyModal = () => {
    // console.log('VoterPhoneVerificationEntry closeVerifyModal');
    this.setState({
      smsPhoneNumberStatus: {
        sign_in_code_sms_sent: false,
      },
      showVerifyModal: false,
      voterSMSPhoneNumber: '',
    });
  };

  hidePhoneVerificationButton = () => {
    this.setState({
      displayPhoneVerificationButton: false,
    });
  };

  displayPhoneVerificationButton = () => {
    this.setState({
      displayPhoneVerificationButton: true,
    });
  };

  localToggleOtherSignInOptions = () => {
    if (isCordova() || isMobileScreenSize()) {
      const { hideExistingPhoneNumbers } = this.state;
      this.setState({ hideExistingPhoneNumbers: !hideExistingPhoneNumbers });
      if (this.props.toggleOtherSignInOptions) {
        this.props.toggleOtherSignInOptions();
      }
    }
  };

  onCancel = () => {
    // console.log('VoterPhoneVerificationEntry onCancel');
    const { inModal } = this.props;
    if (inModal) {
      this.closeSignInModal();
    } else {
      // There are Modal display problems that don't seem to be resolvable that prevents us from returning to the full SettingsAccount modal
      this.hidePhoneVerificationButton();
      this.localToggleOtherSignInOptions();
    }
  };

  onFocus = () => {
    const { displayPhoneVerificationButton } = this.state;
    if (!displayPhoneVerificationButton) {
      this.displayPhoneVerificationButton();
      this.localToggleOtherSignInOptions();
    }
  }

  onKeyDown = (event) => {
    // console.log('onKeyDown, event.keyCode:', event.keyCode);
    // Consider limiting to numbers, dash and plus
    // const regex = /^[0-9]$/;
    // const digit = String.fromCharCode((event.keyCode >= 96 && event.keyCode <= 105) ? event.keyCode - 48  : event.keyCode);
    // if (e.keyCode !== 8 && regex.test(digit)) {
    const ENTER_KEY_CODE = 13;
    const SPACE_KEY_CODE = 32;
    const keyCodesToBlock = [SPACE_KEY_CODE];
    const keyCodesForSubmit = [ENTER_KEY_CODE];
    if (keyCodesToBlock.includes(event.keyCode)) {
      event.preventDefault();
    } else if (keyCodesForSubmit.includes(event.keyCode)) {
      event.preventDefault();
      this.sendSignInCodeSMS(event);
    }
  }

  reSendSignInCodeSMS = (voterSMSPhoneNumber) => {
    if (voterSMSPhoneNumber) {
      VoterActions.sendSignInCodeSMS(voterSMSPhoneNumber);
      // We need to put voterSMSPhoneNumber back in place so the verify modal can open
      this.setState({
        loading: true,
        displayPhoneVerificationButton: true,
        smsPhoneNumberStatus: {
          sms_phone_number_already_owned_by_other_voter: false,
        },
        voterSMSPhoneNumber,
      });
    }
  }

  removeVoterSMSPhoneNumber (smsWeVoteId) {
    VoterActions.removeVoterSMSPhoneNumber(smsWeVoteId);
  }

  sendSignInCodeSMS (event) {
    // console.log('sendSignInCodeSMS');
    event.preventDefault();
    const { voterSMSPhoneNumber, voterSMSPhoneNumberIsValid } = this.state;
    if (voterSMSPhoneNumberIsValid) {
      VoterActions.sendSignInCodeSMS(voterSMSPhoneNumber);
      this.setState({
        displayPhoneVerificationButton: true,
        signInCodeSMSSentAndWaitingForResponse: true,
        smsPhoneNumberStatus: {
          sms_phone_number_already_owned_by_other_voter: false,
        },
        loading: true,
      });
    } else {
      this.setState({ showError: true });
    }
  }

  render () {
    renderLog('VoterPhoneVerificationEntry');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.loading) {
      return LoadingWheel;
    }

    const { classes } = this.props;
    const {
      disablePhoneVerificationButton, displayPhoneVerificationButton, hideExistingPhoneNumbers,
      secretCodeSystemLocked, showError, showVerifyModal, signInCodeSMSSentAndWaitingForResponse,
      smsPhoneNumberStatus, smsPhoneNumberList, smsPhoneNumberListCount, voterSMSPhoneNumber,
    } = this.state;

    const signInLinkOrCodeSent = (smsPhoneNumberStatus.link_to_sign_in_sms_sent || smsPhoneNumberStatus.sign_in_code_sms_sent);
    const smsPhoneNumberStatusHtml = (
      <span>
        { (smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter && !smsPhoneNumberStatus.sms_phone_number_deleted && !smsPhoneNumberStatus.make_primary_sms && !secretCodeSystemLocked) ||
        (smsPhoneNumberStatus.sms_phone_number_already_owned_by_other_voter && !signInLinkOrCodeSent && !secretCodeSystemLocked) ||
        secretCodeSystemLocked ? (
          <Alert variant="warning">
            { smsPhoneNumberStatus.sms_phone_number_already_owned_by_other_voter && !signInLinkOrCodeSent && !secretCodeSystemLocked && (
              <div>
                That phone is already being used by another account.
                <br />
                <br />
                Please click &quot;Send Login Code in an Email&quot; below to sign into that account.
              </div>
            )}
            { smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter && !smsPhoneNumberStatus.sms_phone_number_deleted && !smsPhoneNumberStatus.make_primary_sms && !secretCodeSystemLocked && (
              <div>
                That phone number was already verified by you.
              </div>
            )}
            { secretCodeSystemLocked && (
              <span>
                Your account is locked. Please
                <OpenExternalWebSite
                  url="https://help.wevote.us/hc/en-us/requests/new"
                  target="_blank"
                  body={<span>contact We Vote support for help.</span>}
                />
              </span>
            )}
          </Alert>
          ) :
          null
        }
        {(smsPhoneNumberStatus.sms_phone_number_created && !smsPhoneNumberStatus.verification_sms_sent && !secretCodeSystemLocked) ||
          smsPhoneNumberStatus.sms_phone_number_deleted ||
          smsPhoneNumberStatus.sms_ownership_is_verified ||
          smsPhoneNumberStatus.make_primary_sms ||
          smsPhoneNumberStatus.sign_in_code_sms_sent ? (
            <Alert variant="success">
              { smsPhoneNumberStatus.sms_phone_number_created && !smsPhoneNumberStatus.verification_sms_sent && !secretCodeSystemLocked ? <span>Your phone number was saved. </span> : null }
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
    if (this.state.voter && this.state.voter.is_signed_in) {
      enterSMSPhoneNumberTitle = 'Add New Phone Number';
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
              type="tel"
              name="voter_phone_number"
              id="enterVoterPhone"
              onChange={this.onPhoneNumberChange}
              onFocus={this.onFocus}
              onKeyDown={this.onKeyDown}
              placeholder="Type phone number here..."
            />
          </Paper>
          {displayPhoneVerificationButton && (
            <ButtonWrapper>
              <CancelButtonContainer>
                <Button
                  color="primary"
                  disabled={signInCodeSMSSentAndWaitingForResponse}
                  className={classes.cancelButton}
                  fullWidth
                  onClick={this.onCancel}
                  variant="outlined"
                >
                  Cancel
                </Button>
              </CancelButtonContainer>
              <ButtonContainer>
                <Button
                  // className={classes.button}
                  color="primary"
                  disabled={disablePhoneVerificationButton || signInCodeSMSSentAndWaitingForResponse}
                  id="voterPhoneSendSMS"
                  onClick={this.sendSignInCodeSMS}
                  variant="contained"
                >
                  {signInCodeSMSSentAndWaitingForResponse ? 'Sending...' : (
                    <>
                      <span className="u-show-mobile-iphone5-or-smaller">
                        Send Code
                      </span>
                      <span className="u-show-mobile-bigger-than-iphone5">
                        Send Verification Code
                      </span>
                      <span className="u-show-desktop-tablet">
                        Send Verification Code
                      </span>
                    </>
                  )}
                </Button>
              </ButtonContainer>
            </ButtonWrapper>
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
        {!hideExistingPhoneNumbers && (
          <div>
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
          </div>
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
  },
  cancelButton: {
    width: '100%',
  },
};

const ButtonWrapper = styled.div`
  width: 100%;
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ButtonContainer = styled.div`
  width: fit-content;
  margin-left: 8px;
`;

const CancelButtonContainer = styled.div`
  width: fit-content;
`;

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
