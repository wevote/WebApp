import { Button, InputBase, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Delete, Phone } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import { isValidPhoneNumber } from 'react-phone-number-input';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { isCordova, isWebApp } from '../../utils/cordovaUtils';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import LoadingWheel from '../LoadingWheel';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import SettingsVerifySecretCode from './SettingsVerifySecretCode';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../Widgets/OpenExternalWebSite'));


/* global $ */

class VoterPhoneVerificationEntry extends Component {
  constructor (props) {
    super(props);
    this.state = {
      disablePhoneVerificationButton: true,
      displayPhoneVerificationButton: false,
      hideExistingPhoneNumbers: false,
      loading: false,
      otherSignInOptionsOff: false,
      secretCodeSystemLocked: false,
      showVerifyModal: false,
      showError: false,
      signInCodeSMSSentAndWaitingForResponse: false,
      smsPhoneNumberList: [],
      smsPhoneNumberListCount: 0,
      smsPhoneNumberStatus: {},
      voterSMSPhoneNumber: '',
      // voterSMSPhoneNumbersVerifiedCount: 0,
      voterSMSPhoneNumberIsValid: false,
    };

    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
    this.sendSignInCodeSMS = this.sendSignInCodeSMS.bind(this);
    this.closeVerifyModal = this.closeVerifyModal.bind(this);
    if (isCordova()) {
      signInModalGlobalState.set('textOrEmailSignInInProcess', true);
    }
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterSMSPhoneNumberRetrieve();
    if (isCordova()) {
      $('#enterVoterPhone').focus();
    }
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
    const voter = VoterStore.getVoter();
    const { is_signed_in: isSignedIn, signed_in_with_sms_phone_number: signedInWithSmsPhoneNumber } = voter;
    if (secretCodeVerified && !isSignedIn) {
      VoterActions.voterRetrieve();
    }
    // console.log(`VoterEmailAddressEntry onVoterStoreChange isSignedIn: ${isSignedIn}, signedInWithSmsPhoneNumber: ${signedInWithSmsPhoneNumber}`);
    if (secretCodeVerified) {
      this.setState({
        displayPhoneVerificationButton: false,
        showVerifyModal: false,
        signInCodeSMSSentAndWaitingForResponse: false,
        voterSMSPhoneNumber: '',
      });
    } else if (smsPhoneNumberStatus.sign_in_code_sms_sent) {
      this.setState({
        displayPhoneVerificationButton: false,
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
    } else if (signedInWithSmsPhoneNumber) {
      // console.log('VoterEmailAddressEntry onVoterStoreChange signedInWithSmsPhoneNumber so doing a fallback close ===================');
      this.closeSignInModal();
      this.setState({
        smsPhoneNumberStatus,
      });
    } else if (smsPhoneNumberStatus.sms_phone_number && !smsPhoneNumberStatus.sign_in_code_sms_sent) {
      this.setState({
        displayPhoneVerificationButton: true,
        smsPhoneNumberStatus,
        signInCodeSMSSentAndWaitingForResponse: false,
      });
    } else {
      this.setState({
        smsPhoneNumberStatus,
      });
    }
    const smsPhoneNumberList = VoterStore.getSMSPhoneNumberList();
    const smsPhoneNumberListCount = smsPhoneNumberList.length;
    // const voterSMSPhoneNumbersVerifiedCount = VoterStore.getSMSPhoneNumbersVerifiedCount();
    this.setState({
      loading: false,
      voter: VoterStore.getVoter(),
      // voterSMSPhoneNumbersVerifiedCount,
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
    const { displayPhoneVerificationButton, voterSMSPhoneNumber } = this.state;
    if (voterSMSPhoneNumber && displayPhoneVerificationButton) {
      VoterActions.voterSMSPhoneNumberSave(voterSMSPhoneNumber);
      this.setState({ loading: true });
    }
  };

  closeSignInModal = () => {
    // console.log('VoterPhoneVerificationEntry closeSignInModal');
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  closeVerifyModal = () => {
    // console.log('VoterPhoneVerificationEntry closeVerifyModal');
    VoterActions.clearSMSPhoneNumberStatus();
    VoterActions.clearSecretCodeVerificationStatus();
    this.setState({
      smsPhoneNumberStatus: {
        sign_in_code_sms_sent: false,
      },
      showVerifyModal: false,
      signInCodeSMSSentAndWaitingForResponse: false,
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
      const { hideExistingPhoneNumbers, otherSignInOptionsOff } = this.state;
      this.setState({
        hideExistingPhoneNumbers: !hideExistingPhoneNumbers,
        otherSignInOptionsOff: !otherSignInOptionsOff,
      });
      if (this.props.toggleOtherSignInOptions) {
        this.props.toggleOtherSignInOptions();
      }
    }
  };

  turnOtherSignInOptionsOff = () => {
    if (isCordova() || isMobileScreenSize()) {
      const { otherSignInOptionsOff } = this.state;
      this.setState({
        hideExistingPhoneNumbers: true,
        otherSignInOptionsOff: true,
      });
      if (!otherSignInOptionsOff) {
        if (this.props.toggleOtherSignInOptions) {
          this.props.toggleOtherSignInOptions();
        }
      }
    }
  };

  onCancel = () => {
    // console.log('VoterPhoneVerificationEntry onCancel');
    this.setState({
      disablePhoneVerificationButton: false,
      signInCodeSMSSentAndWaitingForResponse: false,
      // voterSMSPhoneNumber: '', // Clearing voterSMSPhoneNumber variable does not clear number in form
    });
    const { cancelShouldCloseModal } = this.props;
    if (cancelShouldCloseModal) {
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
      this.turnOtherSignInOptionsOff();
    }
  };

  onAnimationEndCancel = () => {
    // In Cordova when the virtual keyboard goes away, the on-click doesn't happen, but the onAnimation does.
    // This allows us to react to the first click.
    if (isCordova()) {
      // console.log('VoterPhoneVerificationEntry onAnimationEndCancel calling onCancel');
      this.onCancel();
    }
  };

  onAnimationEndSend = () => {
    if (isCordova()) {
      // console.log('VoterPhoneVerificationEntry onAnimationEndSend calling sendSignInCodeSMS');
      this.sendSignInCodeSMS();
    }
  };

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
  };

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
  };

  removeVoterSMSPhoneNumber (smsWeVoteId) {
    VoterActions.removeVoterSMSPhoneNumber(smsWeVoteId);
  }

  sendSignInCodeSMS (event) {
    // console.log('sendSignInCodeSMS');
    if (event) {
      event.preventDefault();
    }
    const { displayPhoneVerificationButton, voterSMSPhoneNumber, voterSMSPhoneNumberIsValid } = this.state;
    if (voterSMSPhoneNumberIsValid && displayPhoneVerificationButton) {
      VoterActions.sendSignInCodeSMS(voterSMSPhoneNumber);
      this.setState({
        signInCodeSMSSentAndWaitingForResponse: true,
        smsPhoneNumberStatus: {
          sms_phone_number_already_owned_by_other_voter: false,
        },
      });
    } else {
      this.setState({ showError: true });
    }
  }

  render () {
    renderLog('VoterPhoneVerificationEntry');  // Set LOG_RENDER_EVENTS to log all renders
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const { classes, hideEverythingButSignInWithPhoneForm, hideSignInWithPhoneForm, lockOpenPhoneVerificationButton } = this.props;
    const {
      disablePhoneVerificationButton, displayPhoneVerificationButton, hideExistingPhoneNumbers,
      secretCodeSystemLocked, showError, showVerifyModal, signInCodeSMSSentAndWaitingForResponse,
      smsPhoneNumberStatus, smsPhoneNumberList, smsPhoneNumberListCount, voterSMSPhoneNumber,
    } = this.state;
    // console.log('VoterPhoneVerificationEntry render');

    const signInLinkOrCodeSent = (smsPhoneNumberStatus.link_to_sign_in_sms_sent || smsPhoneNumberStatus.sign_in_code_sms_sent);
    const smsPhoneNumberStatusHtml = (
      <span>
        {(smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter &&
          !smsPhoneNumberStatus.sms_phone_number_deleted &&
          !smsPhoneNumberStatus.make_primary_sms && !secretCodeSystemLocked) ||
          (smsPhoneNumberStatus.sms_phone_number && !smsPhoneNumberStatus.sign_in_code_sms_sent && !secretCodeSystemLocked) ||
          (smsPhoneNumberStatus.sms_phone_number_already_owned_by_other_voter && !signInLinkOrCodeSent && !secretCodeSystemLocked) ||
          secretCodeSystemLocked ? (
            <Alert variant="warning">
              {(smsPhoneNumberStatus.sms_phone_number_already_owned_by_other_voter && !signInLinkOrCodeSent && !secretCodeSystemLocked) && (
                <div>
                  That phone is already being used by another account.
                  <br />
                  <br />
                  Please click &quot;Send Login Code in an Email&quot; below to sign into that account.
                </div>
              )}
              {(smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter && !smsPhoneNumberStatus.sms_phone_number_deleted && !smsPhoneNumberStatus.make_primary_sms && !secretCodeSystemLocked) && (
                <div>
                  That phone number was already verified by you.
                </div>
              )}
              {(smsPhoneNumberStatus.sms_phone_number && !smsPhoneNumberStatus.sign_in_code_sms_sent && !secretCodeSystemLocked) && (
                <div>
                  We could not send a code to this number. Please double-check your number and try again.
                </div>
              )}
              { secretCodeSystemLocked && (
                <span>
                  Your account is locked. Please
                  <OpenExternalWebSite
                    linkIdAttribute="weVoteSupportVoterPhoneVerificationEntry"
                    url="https://help.wevote.us/hc/en-us/requests/new"
                    target="_blank"
                    body={<span>contact We Vote support for help.</span>}
                  />
                </span>
              )}
            </Alert>
          ) : null}
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
              { smsPhoneNumberStatus.sign_in_code_sms_sent && !smsPhoneNumberStatus.sms_phone_number_created ? <span>Please check your phone. A sign in verification code was sent. </span> : null }
            </Alert>
          ) : null}
      </span>
    );
    // console.log('VoterPhoneVerificationEntry render, smsPhoneNumberStatusHtml: ', smsPhoneNumberStatusHtml, ', smsPhoneNumberStatus:', smsPhoneNumberStatus);

    // "SMS" is techno jargon
    let enterSMSPhoneNumberTitle = isWebApp() ? 'Sign in with SMS Phone Number' : 'Text the sign in code to';
    if (this.state.voter && this.state.voter.is_signed_in) {
      enterSMSPhoneNumberTitle = 'Add New Phone Number';
    }

    const enterSMSPhoneNumberHtml = hideSignInWithPhoneForm ? null : (
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
          <Paper className={classes.root} elevation={1} id="paperWrapperPhone">
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
          {(displayPhoneVerificationButton || lockOpenPhoneVerificationButton) && (
            <ButtonWrapper>
              <CancelButtonContainer>
                <Button
                  id="cancelVoterPhoneSendSMS"
                  color="primary"
                  // disabled={signInCodeSMSSentAndWaitingForResponse} // Never disable Cancel
                  className={classes.cancelButton}
                  fullWidth
                  onClick={this.onCancel}
                  onAnimationEnd={this.onAnimationEndCancel}
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
                  onAnimationEnd={() => this.onAnimationEndSend()}
                  variant="contained"
                >
                  {signInCodeSMSSentAndWaitingForResponse ? 'Sending...' : (
                    <>
                      <span className="u-show-mobile">
                        Send Code
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
            <span className="u-no-break">{voterSMSPhoneNumberFromList.normalized_sms_phone_number}</span>

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
                  <span
                    className="u-link-color u-cursor--pointer u-no-break"
                    onClick={this.setAsPrimarySMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                  >
                    Make Primary
                  </span>
                  &nbsp;&nbsp;&nbsp;
                </span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                {allowRemoveSMSPhoneNumber && (
                  <span
                    className="u-link-color u-cursor--pointer"
                    onClick={this.removeVoterSMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                  >
                    <Delete />
                  </span>
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
              <span className="u-no-break">{voterSMSPhoneNumberFromList.normalized_sms_phone_number}</span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              {voterSMSPhoneNumberFromList.sms_ownership_is_verified ?
                null : (
                  <span
                    className="u-link-color u-cursor--pointer u-no-break"
                    onClick={() => this.reSendSignInCodeSMS(voterSMSPhoneNumberFromList.normalized_sms_phone_number)}
                  >
                    Send Verification Again
                  </span>
                )}

              <span>&nbsp;&nbsp;&nbsp;</span>
              {allowRemoveSMSPhoneNumber && (
                <span
                  className="u-link-color u-cursor--pointer"
                  onClick={this.removeVoterSMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                >
                  <Delete />
                </span>
              )}
            </div>
          </div>
        );
      } else {
        return null;
      }
    });

    return (
      <Wrapper isWeb={isWebApp()} id="voterPhoneEntryWrapper">
        {(hideEverythingButSignInWithPhoneForm || hideExistingPhoneNumbers) ? (
          <span>
            {smsPhoneNumberStatusHtml}
          </span>
        ) : (
          <div>
            {verifiedSMSFound ? (
              <PhoneNumberSection isWeb={isWebApp()}>
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
            {unverifiedSMSFound && (
              <PhoneNumberSection isWeb={isWebApp()}>
                <span className="h3">Phone Numbers to Verify</span>
                {toVerifySMSListHtml}
              </PhoneNumberSection>
            )}
          </div>
        )}
        {!hideSignInWithPhoneForm && (
          <PhoneNumberSection isWeb={isWebApp()}>
            {enterSMSPhoneNumberHtml}
          </PhoneNumberSection>
        )}
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
VoterPhoneVerificationEntry.propTypes = {
  cancelShouldCloseModal: PropTypes.bool,
  classes: PropTypes.object,
  closeSignInModal: PropTypes.func,
  hideEverythingButSignInWithPhoneForm: PropTypes.bool,
  hideSignInWithPhoneForm: PropTypes.bool,
  lockOpenPhoneVerificationButton: PropTypes.bool,
  toggleOtherSignInOptions: PropTypes.func,
};

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
  margin-top: ${({ isWeb }) => (isWeb ? '32px;' : '0')};
`;

const PhoneNumberSection = styled.div`
  margin-top: ${({ isWeb }) => (isWeb ? '18px;' : '0')};
`;

const Error = styled.div`
  color: rgb(255, 73, 34);
  font-size: 14px;
`;

export default withStyles(styles)(VoterPhoneVerificationEntry);
