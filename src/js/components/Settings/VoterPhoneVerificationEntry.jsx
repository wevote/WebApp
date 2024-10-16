import { Delete, Phone } from '@mui/icons-material';
import {
  Button,
  InputAdornment,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import styled from 'styled-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import { blurTextFieldAndroid } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { FirstRowPhoneOrEmail, SecondRowPhoneOrEmail, SecondRowPhoneOrEmailDiv, AllPhoneOrEmailTypes } from '../Style/pageLayoutStyles';
import { ButtonContainerHorizontal } from '../Welcome/sectionStyles';
import SettingsVerifySecretCode from '../../common/components/Settings/SettingsVerifySecretCode';
// import { validatePhoneOrEmail } from '../../utils/regex-checks';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));


/* global $ */

class VoterPhoneVerificationEntry extends Component {
  constructor (props) {
    super(props);
    this.state = {
      disablePhoneVerificationButton: true,
      displayPhoneVerificationButton: false,
      displayIncorrectPhoneNumberError: false,
      phoneNumberErrorTimeoutId: '',
      hideExistingPhoneNumbers: false,
      loading: false,
      // movedInitialFocus: false,
      secretCodeSystemLocked: false,
      showVerifyModal: false,
      // showError: false,
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
    this.closeVerifyModalFromVerifySecretCode = this.closeVerifyModalFromVerifySecretCode.bind(this);
    this.removeVoterSMSPhoneNumber = this.removeVoterSMSPhoneNumber.bind(this);
    // NOTE October 2022:  This file has lots of commented out code, do not remove until there has been an iOS release
    // if (isCordova()) {
    //   signInModalGlobalState.set('textOrEmailSignInInProcess', true);
    // }
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterSMSPhoneNumberRetrieve();
    const inputFld = $('#enterVoterPhone');
    // console.log('enterVoterPhone ', $(inputFld));
    $(inputFld).blur();
    this._isMounted = true;
  }

  componentDidUpdate () {
    // const { movedInitialFocus } = this.state;
    // if (isCordova() && !movedInitialFocus) {
    //   const inputFld = $('#enterVoterPhone');
    //   console.log('voterPhoneVerificationEntry componentDidUpdate ', $(inputFld));
    //   $(inputFld).focus();
    //   if ($(inputFld).is(':focus')) {
    //     this.setState({ movedInitialFocus: true });
    //   }
    // }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('VoterPhoneVerificationEntry caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    clearTimeout(this.clearPhoneTimer);
    this.voterStoreListener.remove();
    this._isMounted = false;
  }

  onVoterStoreChange () {
    const smsPhoneNumberStatus = VoterStore.getSMSPhoneNumberStatus();
    // console.log('smsPhoneNumberStatus:', smsPhoneNumberStatus);
    const {
      secret_code_system_locked_for_this_voter_device_id: secretCodeSystemLocked,
      sign_in_code_sms_sent: signInCodeSMSSent,
    } = smsPhoneNumberStatus;
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    // console.log('onVoterStoreChange smsPhoneNumberStatus:', smsPhoneNumberStatus);
    const voter = VoterStore.getVoter();
    const { is_signed_in: isSignedIn, signed_in_with_sms_phone_number: signedInWithSmsPhoneNumber } = voter;
    if (secretCodeVerified && !isSignedIn) {
      // console.log('VoterPhoneVerificationEntry onVoterStoreChange secretCodeVerified && !isSignedIn, VoterActions.voterRetrieve()');
      if (apiCalming('voterRetrieve', 500)) {
        VoterActions.voterRetrieve();
      }
      this.closeSignInModalLocal();
    }

    const newState = {};  // Don't set state twice in the same function
    // console.log(`VoterEmailAddressEntry onVoterStoreChange isSignedIn: ${isSignedIn}, signedInWithSmsPhoneNumber: ${signedInWithSmsPhoneNumber}`);
    if (secretCodeVerified) {
      Object.assign(newState, {
        displayPhoneVerificationButton: false,
        showVerifyModal: false,
        signInCodeSMSSentAndWaitingForResponse: false,
        voterSMSPhoneNumber: '',
      });
    } else if (signInCodeSMSSent) {
      Object.assign(newState, {
        displayPhoneVerificationButton: false,
        smsPhoneNumberStatus: {
          sign_in_code_sms_sent: false,
        },
        showVerifyModal: true,
        signInCodeSMSSentAndWaitingForResponse: false,
      });
    } else if (smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter) {
      Object.assign(newState, {
        displayPhoneVerificationButton: false,
        smsPhoneNumberStatus,
        showVerifyModal: false,
        signInCodeSMSSentAndWaitingForResponse: false,
      });
    } else if (signedInWithSmsPhoneNumber) {
      this.closeSignInModalLocal();
      Object.assign(newState, {
        smsPhoneNumberStatus,
      });
    } else if (smsPhoneNumberStatus.sms_phone_number && !smsPhoneNumberStatus.sign_in_code_sms_sent) {
      Object.assign(newState, {
        displayPhoneVerificationButton: true,
        smsPhoneNumberStatus,
        signInCodeSMSSentAndWaitingForResponse: false,
      });
    } else {
      Object.assign(newState, {
        smsPhoneNumberStatus,
      });
    }
    const smsPhoneNumberList = VoterStore.getSMSPhoneNumberList();
    const smsPhoneNumberListCount = smsPhoneNumberList.length;
    // const voterSMSPhoneNumbersVerifiedCount = VoterStore.getSMSPhoneNumbersVerifiedCount();
    Object.assign(newState, {
      loading: false,
      secretCodeSystemLocked,
      smsPhoneNumberList,
      smsPhoneNumberListCount,
      voter: VoterStore.getVoter(),
      // voterSMSPhoneNumbersVerifiedCount,
    });
    // console.log('VoterEmailAddressEntry onVoterStoreChange before remaining setstate');
    if (this._isMounted) {
      // console.log('VoterEmailAddressEntry onVoterStoreChange before remaining setstate AND _isMounted');
      this.setState(newState);
    }
  }

  setAsPrimarySMSPhoneNumber (smsWeVoteId) {
    VoterActions.setAsPrimarySMSPhoneNumber(smsWeVoteId);
  }

  // eslint-disable-next-line react/sort-comp
  voterSMSPhoneNumberSave = (event) => {
    // console.log('VoterPhoneVerificationEntry this.voterSMSPhoneNumberSave');
    event.preventDefault();
    const { displayPhoneVerificationButton, voterSMSPhoneNumber } = this.state;
    if (voterSMSPhoneNumber && displayPhoneVerificationButton) {
      this.setState({
        loading: true,
      }, () => VoterActions.voterSMSPhoneNumberSave(voterSMSPhoneNumber));
    }
  };

  showPhoneOnlySignInLocal = () => {
    this.setState({
      hideExistingPhoneNumbers: true,
      signInCodeSMSSentAndWaitingForResponse: false,
    });
    if (this.props.showPhoneOnlySignIn) {
      this.props.showPhoneOnlySignIn();
    }
  };

  closeSignInModalLocal = () => {
    // console.log('VoterPhoneVerificationEntry closeSignInModalLocal');
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  closeSignInModalFromVerifySecretCode = () => {
    // console.log('VoterPhoneVerificationEntry closeSignInModalFromVerifySecretCode');
    const delayBeforeClearingPhoneStatus = 500;
    this.clearPhoneTimer = setTimeout(() => {
      VoterActions.clearSecretCodeVerificationStatusAndPhone();
    }, delayBeforeClearingPhoneStatus);
    this.closeSignInModalLocal();
  }

  closeVerifyModalFromVerifySecretCode = () => {
    // console.log('VoterPhoneVerificationEntry closeVerifyModalFromVerifySecretCode');
    this.setState({
      displayPhoneVerificationButton: false,
      smsPhoneNumberStatus: {
        sign_in_code_sms_sent: false,
      },
      showVerifyModal: false,
      signInCodeSMSSentAndWaitingForResponse: false,
    });
    setTimeout(() => {
      // A timer hack to prevent a "React state update on an unmounted component"
      VoterActions.clearSecretCodeVerificationStatusAndPhone();
    }, 1000);
    // if (isCordova()) {
    //   this.closeSignInModalLocal();
    // }
    if (this.props.closeVerifyModal) {
      this.props.closeVerifyModal();
    }
  };

  onPhoneNumberChange (event) {
    if (this.state.phoneNumberErrorTimeoutId) {
      clearTimeout(this.state.phoneNumberErrorTimeoutId);
    }
    this.setState({ displayIncorrectPhoneNumberError: false });
    const incomingVoterPhoneNumber = event.target.value;
    const voterSMSPhoneNumberWithPlus = `+${incomingVoterPhoneNumber}`;
    const voterSMSPhoneNumberWithPlusAndOne = `+1${incomingVoterPhoneNumber}`;

    // const voterSMSPhoneNumberIsValidRaw = validatePhoneOrEmail(incomingVoterPhoneNumber);
    const voterSMSPhoneNumberIsValidRaw = isValidPhoneNumber(incomingVoterPhoneNumber);
    const voterSMSPhoneNumberIsValidWithPlus = isValidPhoneNumber(voterSMSPhoneNumberWithPlus);
    const voterSMSPhoneNumberIsValidWithPlusAndOne = isValidPhoneNumber(voterSMSPhoneNumberWithPlusAndOne);
    const voterSMSPhoneNumberIsValid = voterSMSPhoneNumberIsValidRaw || voterSMSPhoneNumberIsValidWithPlus || voterSMSPhoneNumberIsValidWithPlusAndOne;
    // const voterSMSPhoneNumberIsValid = validatePhoneOrEmail(incomingVoterPhoneNumber);
    const disablePhoneVerificationButton = !voterSMSPhoneNumberIsValid;
    const displayPhoneVerificationButton = (incomingVoterPhoneNumber && incomingVoterPhoneNumber.length > 0);
    // console.log('onPhoneNumberChange, incomingVoterPhoneNumber: ', incomingVoterPhoneNumber, ', voterSMSPhoneNumberIsValid:', voterSMSPhoneNumberIsValid);
    // console.log('voterSMSPhoneNumberWithPlus:', voterSMSPhoneNumberWithPlus);
    // console.log('voterSMSPhoneNumberWithPlusAndOne:', voterSMSPhoneNumberWithPlusAndOne);
    const phoneNumberErrorTimeoutId = setTimeout(() => {
      if (incomingVoterPhoneNumber && incomingVoterPhoneNumber.length > 0 && !voterSMSPhoneNumberIsValid) {
        this.setState({ displayIncorrectPhoneNumberError: true });
      }
    }, 2000);
    this.setState({
      disablePhoneVerificationButton,
      displayPhoneVerificationButton,
      phoneNumberErrorTimeoutId,
      voterSMSPhoneNumber: incomingVoterPhoneNumber,
      voterSMSPhoneNumberIsValid,
    });
  }

  onBlur = () => {
    const { voterSMSPhoneNumber } = this.state;
    if (!voterSMSPhoneNumber) {
      // Only hide the phone verification button if the user has not "unlocked" the button used to send the message.
      this.setState({
        displayPhoneVerificationButton: false,
      });
      const nextField = document.getElementById("enterVoterEmailAddress") || document.getElementById("openTermsOfService");    
      if (nextField) {
        nextField.focus();
      }
    }
    blurTextFieldAndroid();
  };

  onCancel = () => {
    // console.log('VoterPhoneVerificationEntry onCancel');
    this.setState({
      disablePhoneVerificationButton: false,
      displayIncorrectPhoneNumberError: false,
      displayPhoneVerificationButton: false,
      signInCodeSMSSentAndWaitingForResponse: false,
      voterSMSPhoneNumber: '', // Clearing voterSMSPhoneNumber variable does not always clear number in form
    });
    setTimeout(() => {
      // A timer hack to prevent a "React state update on an unmounted component"
      VoterActions.clearSecretCodeVerificationStatusAndPhone();
    }, 1000);

    const { cancelShouldCloseModal } = this.props;
    // console.log('cancelShouldCloseModal:', cancelShouldCloseModal);
    if (cancelShouldCloseModal) {
      this.closeSignInModalLocal();
    } else if (isCordova()) {
      // WV-316: seperated Cordovoa and Mobile screen cancel logic, Mobile only shows all sign in options on cancel.
      // if (this.props.showAllSignInOptions) {
      //   this.props.showAllSignInOptions();
      // }  
    } else if (isMobileScreenSize()) {
      if (this.props.showEmailOnlySignIn) {
        this.props.showEmailOnlySignIn();
      }
    } else {
      const nextField = document.getElementById("enterVoterEmailAddress") || document.getElementById("openTermsOfService");    
      if (nextField) {
        nextField.focus();
      }
    }

  };

  onFocus = () => {
    this.setState({
      displayPhoneVerificationButton: true,
    });
    if (isCordova() || isMobileScreenSize()) {
      this.showPhoneOnlySignInLocal();
    }
    // focusTextFieldAndroid(); // This refers to caller string AddFriendsByEmail. Correct?
  };

  onAnimationEndCancel = () => {
    // In Cordova when the virtual keyboard goes away, the on-click doesn't happen, but the onAnimation does.
    // This allows us to react to the first click.
    // if (isCordova()) {
    //   // console.log('VoterPhoneVerificationEntry onAnimationEndCancel calling onCancel');
    //   this.onCancel();
    // }
  };

  onAnimationEndSend = () => {
    // if (isCordova()) {
    //   // console.log('VoterPhoneVerificationEntry onAnimationEndSend calling sendSignInCodeSMS');
    //   this.sendSignInCodeSMS();
    // }
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

  // eslint-disable-next-line react/sort-comp
  removeVoterSMSPhoneNumber (smsWeVoteId) {
    VoterActions.removeVoterSMSPhoneNumber(smsWeVoteId);
    return null;
  }

  sendSignInCodeSMS = (event) => {
    const { displayPhoneVerificationButton, voterSMSPhoneNumber, voterSMSPhoneNumberIsValid } = this.state;
    // console.log('sendSignInCodeSMS voterSMSPhoneNumber:', voterSMSPhoneNumber, 'displayPhoneVerificationButton:', displayPhoneVerificationButton, 'voterSMSPhoneNumberIsValid:', voterSMSPhoneNumberIsValid);
    if (event) {
      event.preventDefault();
    }
    if (voterSMSPhoneNumberIsValid && displayPhoneVerificationButton) {
      this.setState({
        signInCodeSMSSentAndWaitingForResponse: true,
        smsPhoneNumberStatus: {
          sms_phone_number_already_owned_by_other_voter: false,
        },
      }, () => {
        VoterActions.sendSignInCodeSMS(voterSMSPhoneNumber);
      });
    } else {
      this.setState({ displayIncorrectPhoneNumberError: true });
    }
  }

  reSendSignInCodeSMS = (voterSMSPhoneNumber) => {
    // console.log('reSendSignInCodeSMS');
    if (voterSMSPhoneNumber) {
      VoterActions.sendSignInCodeSMS(voterSMSPhoneNumber);
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

  render () {
    renderLog('VoterPhoneVerificationEntry');  // Set LOG_RENDER_EVENTS to log all renders
    const { doNotRender } = this.props;
    if (doNotRender) {
      return null;
    }
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const { classes, hideEverythingButSignInWithPhoneForm, hideSignInWithPhoneForm, lockOpenPhoneVerificationButton } = this.props;
    const {
      disablePhoneVerificationButton, displayPhoneVerificationButton,
      displayIncorrectPhoneNumberError, hideExistingPhoneNumbers,
      secretCodeSystemLocked, showVerifyModal, signInCodeSMSSentAndWaitingForResponse,
      smsPhoneNumberStatus, smsPhoneNumberList, smsPhoneNumberListCount, voterSMSPhoneNumber,
    } = this.state;
    // console.log('VoterPhoneVerificationEntry render showVerifyModal:', showVerifyModal);

    const signInLinkOrCodeSent = (smsPhoneNumberStatus.link_to_sign_in_sms_sent || smsPhoneNumberStatus.sign_in_code_sms_sent);
    const smsPhoneNumberStatusHtml = (
      <span>
        {(smsPhoneNumberStatus.sms_phone_number_already_owned_by_this_voter &&
          !smsPhoneNumberStatus.sms_phone_number_deleted &&
          !smsPhoneNumberStatus.make_primary_sms && !secretCodeSystemLocked) ||
          (smsPhoneNumberStatus.sms_phone_number && !smsPhoneNumberStatus.sign_in_code_sms_sent && !secretCodeSystemLocked) ||
          (smsPhoneNumberStatus.sms_phone_number_already_owned_by_other_voter && !signInLinkOrCodeSent && !secretCodeSystemLocked) ||
          secretCodeSystemLocked ? (
            <Alert severity="warning">
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
                <div>
                  Your account is locked. Please
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="weVoteSupportVoterPhoneVerificationEntry"
                      url="https://help.wevote.us/hc/en-us/requests/new"
                      target="_blank"
                      body={<span>contact WeVote support for help.</span>}
                    />
                  </Suspense>
                </div>
              )}
            </Alert>
          ) : null}
        {(smsPhoneNumberStatus.sms_phone_number_created && !smsPhoneNumberStatus.verification_sms_sent && !secretCodeSystemLocked) ||
          smsPhoneNumberStatus.sms_phone_number_deleted ||
          smsPhoneNumberStatus.sms_ownership_is_verified ||
          smsPhoneNumberStatus.make_primary_sms ||
          smsPhoneNumberStatus.sign_in_code_sms_sent ? (
            <Alert severity="success">
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
    // let enterSMSPhoneNumberTitle = isWebApp() ? 'SMS Phone Number' : 'Text the sign in code to';
    // if (this.state.voter && this.state.voter.is_signed_in) {
    //   enterSMSPhoneNumberTitle = 'Add New Phone Number';
    // }

    const enterSMSPhoneNumberHtml = hideSignInWithPhoneForm ? null : (
      <div>
        {/*
        <div className="u-stack--sm u-tl">
          {enterSMSPhoneNumberTitle}
        </div>
        */}
        <form className="form-inline">
          <TextField
            autoComplete="off"
            autoFocus={false}
            className={classes.input}
            error={displayIncorrectPhoneNumberError}
            helperText={(displayIncorrectPhoneNumberError) ? 'Enter a valid phone number' : ''}
            id="enterVoterPhone"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ) }}
            label="Mobile Phone Number"
            name="voter_phone_number"
            onBlur={this.onBlur}
            onChange={this.onPhoneNumberChange}
            onFocus={this.onFocus}
            onKeyDown={this.onKeyDown}
            placeholder="Type phone number here..."
            type="tel"
            value={voterSMSPhoneNumber}
            margin="normal"
            variant="outlined"
          />
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
              <ButtonContainerHorizontal>
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
                      <span id="mobileSmsSendCode" className="u-show-mobile">
                        Send code
                      </span>
                      <span id="desktopSmsSendCode" className="u-show-desktop-tablet">
                        Send verification code
                      </span>
                    </>
                  )}
                </Button>
              </ButtonContainerHorizontal>
            </ButtonWrapper>
          )}
        </form>
        {!(displayPhoneVerificationButton || lockOpenPhoneVerificationButton) && (
          <ButtonsHiddenSpacer className="u-show-desktop-tablet" />
        )}
      </div>
    );

    let allowRemoveSMSPhoneNumber;
    let smsOwnershipIsVerified;
    let isPrimarySMSPhoneNumber;

    // ///////////////////////////////////
    // LIST OF VERIFIED SMS PHONE NUMBERS
    let verifiedSMSFound = false;
    const verifiedSMSListHtml = smsPhoneNumberList.map((voterSMSPhoneNumberFromList) => {
      smsOwnershipIsVerified = !!voterSMSPhoneNumberFromList.sms_ownership_is_verified;

      if (smsOwnershipIsVerified) {
        verifiedSMSFound = true;
        allowRemoveSMSPhoneNumber = voterSMSPhoneNumberFromList.primary_sms_phone_number !== true;
        isPrimarySMSPhoneNumber = voterSMSPhoneNumberFromList.primary_sms_phone_number === true;
        return (
          <div key={voterSMSPhoneNumberFromList.sms_we_vote_id}>
            <FirstRowPhoneOrEmail>
              <span className="u-no-break">
                {voterSMSPhoneNumberFromList.normalized_sms_phone_number}
              </span>
            </FirstRowPhoneOrEmail>
            <SecondRowPhoneOrEmail>
              {isPrimarySMSPhoneNumber ? (
                <SecondRowPhoneOrEmailDiv>
                  <span>
                    Primary
                  </span>
                  <OverlayTrigger
                    placement="right"
                    overlay={(
                      <Tooltip id="tooltip-top">
                        You must add a new primary number before removing this one.
                      </Tooltip>
                    )}
                  >
                    <div>
                      <span
                        className="u-gray-border"
                      >
                        <Delete />
                      </span>
                    </div>
                  </OverlayTrigger>

                </SecondRowPhoneOrEmailDiv>
              ) : (
                <SecondRowPhoneOrEmailDiv key={`${voterSMSPhoneNumberFromList.sms_we_vote_id}-internal`}>
                  <span
                     className="u-link-color u-cursor--pointer"
                     onClick={() => this.setAsPrimarySMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                  >
                    Make Primary
                  </span>
                  {allowRemoveSMSPhoneNumber && (
                    <div
                      className="u-link-color u-cursor--pointer"
                      onClick={() => this.removeVoterSMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                    >
                      <Delete />
                    </div>
                  )}
                </SecondRowPhoneOrEmailDiv>
              )}
            </SecondRowPhoneOrEmail>
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
      smsOwnershipIsVerified = !!voterSMSPhoneNumberFromList.sms_ownership_is_verified;
      if (!smsOwnershipIsVerified) {
        unverifiedSMSFound = true;
        allowRemoveSMSPhoneNumber = !voterSMSPhoneNumberFromList.primary_sms_phone_number;
        isPrimarySMSPhoneNumber = !!voterSMSPhoneNumberFromList.primary_sms_phone_number;
        return (
          <div key={voterSMSPhoneNumberFromList.sms_we_vote_id}>
            <div>
              <FirstRowPhoneOrEmail>
                {voterSMSPhoneNumberFromList.normalized_sms_phone_number.trim()}
              </FirstRowPhoneOrEmail>
              {voterSMSPhoneNumberFromList.sms_ownership_is_verified ?
                null : (
                  <SecondRowPhoneOrEmail>
                    <SecondRowPhoneOrEmailDiv>
                      <span
                        className="u-link-color u-cursor--pointer u-no-break"
                        onClick={() => this.reSendSignInCodeSMS(voterSMSPhoneNumberFromList.normalized_sms_phone_number)}
                      >
                        Send verification again
                      </span>
                      {allowRemoveSMSPhoneNumber && (
                        <div
                          className="u-link-color u-cursor--pointer"
                          onClick={() => this.removeVoterSMSPhoneNumber.bind(this, voterSMSPhoneNumberFromList.sms_we_vote_id)}
                        >
                          <Delete />
                        </div>
                      )}
                    </SecondRowPhoneOrEmailDiv>
                  </SecondRowPhoneOrEmail>
                )}
            </div>
          </div>
        );
      } else {
        return null;
      }
    });

    return (
      <VoterPhoneVerificationWrapper isWeb={isWebApp()} id="voterPhoneEntryVoterPhoneVerificationWrapper">
        {(hideEverythingButSignInWithPhoneForm || hideExistingPhoneNumbers) ? (
          <span>
            {smsPhoneNumberStatusHtml}
          </span>
        ) : (
          <AllPhoneOrEmailTypes>
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
          </AllPhoneOrEmailTypes>
        )}
        {!hideSignInWithPhoneForm && (
          <PhoneNumberSection isWeb={isWebApp()}>
            {enterSMSPhoneNumberHtml}
          </PhoneNumberSection>
        )}
        {showVerifyModal && (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            closeSignInModal={this.closeSignInModalFromVerifySecretCode}
            closeVerifyModal={this.closeVerifyModalFromVerifySecretCode}
            voterPhoneNumber={voterSMSPhoneNumber}
          />
        )}
      </VoterPhoneVerificationWrapper>
    );
  }
}
VoterPhoneVerificationEntry.propTypes = {
  cancelShouldCloseModal: PropTypes.bool,
  classes: PropTypes.object,
  closeSignInModal: PropTypes.func,
  closeVerifyModal: PropTypes.func,
  doNotRender: PropTypes.bool,
  hideEverythingButSignInWithPhoneForm: PropTypes.bool,
  hideSignInWithPhoneForm: PropTypes.bool,
  lockOpenPhoneVerificationButton: PropTypes.bool,
  showAllSignInOptions: PropTypes.func,
  showPhoneOnlySignIn: PropTypes.func,
  showEmailOnlySignIn: PropTypes.func
};

const styles = {
  paperRoot: {
    border: '1px solid #ccc',
    boxShadow: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8,
    marginBottom: 8,
  },
  input: {
    marginLeft: 0.1,
    flex: 1,
  },
  button: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
};

const ButtonsHiddenSpacer = styled('div')`
  height: 44px;
`;

const ButtonWrapper = styled('div')`
  width: 100%;
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CancelButtonContainer = styled('div')`
  width: fit-content;
`;

// const Error = styled('div')`
//   color: rgb(255, 73, 34);
//   font-size: 14px;
// `;

const PhoneNumberSection = styled('div', {
  shouldForwardProp: (prop) => !['isWeb'].includes(prop),
})(({ isWeb }) => (`
  margin-top: ${isWeb ? '18px;' : '0'};
`));

const VoterPhoneVerificationWrapper = styled('div', {
  shouldForwardProp: (prop) => !['isWeb'].includes(prop),
})(({ isWeb }) => (`
  margin-top: ${isWeb ? '32px;' : '0'};
`));

export default withStyles(styles)(VoterPhoneVerificationEntry);
