import { Delete, Mail } from '@mui/icons-material';
import { Button, InputAdornment, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import { blurTextFieldAndroid, isIPad } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { FirstRowPhoneOrEmail, SecondRowPhoneOrEmail, SecondRowPhoneOrEmailDiv, AllPhoneOrEmailTypes } from '../Style/pageLayoutStyles';
import { ButtonContainerHorizontal } from '../Welcome/sectionStyles';
import SettingsVerifySecretCode from '../../common/components/Settings/SettingsVerifySecretCode';
import { validateEmail } from '../../utils/regex-checks';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

/* global $ */

class VoterEmailAddressEntry extends Component {
  constructor (props) {
    super(props);
    this.state = {
      disableEmailVerificationButton: true,
      displayEmailVerificationButton: false,
      displayIncorrectEmailError: false,
      emailErrorTimeoutId: '',
      emailAddressStatus: {
        email_address_already_owned_by_other_voter: false,
        email_address_already_owned_by_this_voter: false,
        email_address_created: false,
        email_address_deleted: false,
        email_address_not_valid: false,
        link_to_sign_in_email_sent: false,
        make_primary_email: false,
        sign_in_code_email_sent: false,
        verification_email_sent: false,
        movedInitialFocus: false,
      },
      hideExistingEmailAddresses: false,
      loading: false,
      // movedInitialFocus: false,
      secretCodeSystemLocked: false,
      showVerifyModal: false,
      // voter: VoterStore.getVoter(),
      voterEmailAddress: '',
      voterEmailAddressIsValid: false,
      voterEmailAddressList: [],
      voterEmailAddressListCount: 0,
      // voterEmailAddressesVerifiedCount: 0,
    };

    // NOTE October 2022:  This file has lots of commented out code, do not remove until there has been an iOS release
    // if (isCordova()) {
    //   signInModalGlobalState.set('textOrEmailSignInInProcess', true);
    // }
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterEmailAddressRetrieve();
    const inputFld = $('#enterVoterEmailAddress');
    // console.log('enterVoterEmailAddress ', $(inputFld));
    $(inputFld).blur();
    this._isMounted = true;
  }

  componentDidUpdate () {
    // const { movedInitialFocus } = this.state;
    // if (isCordova() && !movedInitialFocus) {
    //   const inputFld = $('#enterVoterEmailAddress');
    //   // console.log('enterVoterEmailAddress ', $(inputFld));
    //   $(inputFld).focus();
    //   if ($(inputFld).is(':focus')) {
    //     this.setState({ movedInitialFocus: true });
    //   }
    // }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this._isMounted = false;
  }

  onVoterStoreChange () {
    const emailAddressStatus = VoterStore.getEmailAddressStatus();
    const { secret_code_system_locked_for_this_voter_device_id: secretCodeSystemLocked } = emailAddressStatus;
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    // console.log('onVoterStoreChange secretCodeVerificationStatus:', secretCodeVerificationStatus);
    const voter = VoterStore.getVoter();
    const { is_signed_in: isSignedIn } = voter;
    if (secretCodeVerified && !isSignedIn) {
      // console.log('VoterEmailAddressEntry onVoterStoreChange secretCodeVerified && !isSignedIn, VoterActions.voterRetrieve()');
      if (apiCalming('voterRetrieve', 500)) {
        VoterActions.voterRetrieve();
      }
      this.closeSignInModalLocal();
    }

    const newState = {};  // Don't set state twice in the same function
    // console.log(`VoterEmailAddressEntry onVoterStoreChange isSignedIn: ${isSignedIn}, signedInWithSmsPhoneNumber: ${signedInWithSmsPhoneNumber}`);
    if (secretCodeVerified) {
      Object.assign(newState, {
        displayEmailVerificationButton: false,
        showVerifyModal: false,
        voterEmailAddress: '',
      });
    } else if (emailAddressStatus.sign_in_code_email_sent) {
      Object.assign(newState, {
        displayEmailVerificationButton: false,
        emailAddressStatus: {
          sign_in_code_email_sent: false,
        },
        showVerifyModal: true,
      });
    } else if (emailAddressStatus.email_address_already_owned_by_this_voter) {
      Object.assign(newState, {
        displayEmailVerificationButton: false,
        emailAddressStatus,
        showVerifyModal: false,
      });
    } else {
      Object.assign(newState, {
        emailAddressStatus,
      });
    }
    const voterEmailAddressList = VoterStore.getEmailAddressList();
    const voterEmailAddressListCount = voterEmailAddressList.length;
    // const voterEmailAddressesVerifiedCount = VoterStore.getEmailAddressesVerifiedCount();
    Object.assign(newState, {
      loading: false,
      secretCodeSystemLocked,
      voter: VoterStore.getVoter(),
      voterEmailAddressList,
      voterEmailAddressListCount,
      // voterEmailAddressesVerifiedCount,
    });
    if (this._isMounted) {
      this.setState(newState);
    }
  }

  setAsPrimaryEmailAddress (emailWeVoteId) {
    VoterActions.setAsPrimaryEmailAddress(emailWeVoteId);
  }

  voterEmailAddressSave = (event) => {
    // console.log('VoterEmailAddressEntry this.voterEmailAddressSave');
    event.preventDefault();
    const { displayEmailVerificationButton, voterEmailAddress } = this.state;
    if (displayEmailVerificationButton && voterEmailAddress) {
      const sendLinkToSignIn = true;
      this.setState({
        loading: true,
      }, () => VoterActions.voterEmailAddressSave(voterEmailAddress, sendLinkToSignIn));
    }
  };

  showEmailOnlySignInLocal = () => {
    this.setState({
      hideExistingEmailAddresses: true,
      signInCodeEmailSentAndWaitingForResponse: false,
    });
    if (this.props.showEmailOnlySignIn) {
      this.props.showEmailOnlySignIn();
    }
  };

  closeSignInModalLocal = () => {
    // console.log('VoterEmailAddressEntry closeSignInModalLocal');
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  closeSignInModalFromVerifySecretCode = () => {
    // console.log('VoterEmailAddressEntry closeSignInModalFromVerifySecretCode');
    setTimeout(() => {
      VoterActions.clearSecretCodeVerificationStatusAndEmail();
    }, 1000);
    this.closeSignInModalLocal();
  }

  closeVerifyModalFromVerifySecretCode = () => {
    // console.log('VoterEmailAddressEntry closeVerifyModalFromVerifySecretCode');
    this.setState({
      displayEmailVerificationButton: false,
      emailAddressStatus: {
        sign_in_code_email_sent: false,
      },
      showVerifyModal: false,
      signInCodeEmailSentAndWaitingForResponse: false,
    });
    setTimeout(() => {
      // A timer hack to prevent a "React state update on an unmounted component"
      VoterActions.clearSecretCodeVerificationStatusAndEmail();
      // if (isCordova()) {
      //   this.closeSignInModalLocal();
      // }
    }, 1000);
    if (this.props.closeVerifyModal) {
      this.props.closeVerifyModal();
    }
  };

  onVoterEmailAddressChange = (event) => {
    if (this.state.emailErrorTimeoutId) {
      clearTimeout(this.state.emailErrorTimeoutId);
    }
    this.setState({ displayIncorrectEmailError: false });
    const voterEmailAddress = event.target.value;
    const voterEmailAddressIsValid = validateEmail(voterEmailAddress);
    const disableEmailVerificationButton = !voterEmailAddressIsValid;
    const displayEmailVerificationButton = (voterEmailAddress && voterEmailAddress.length > 0);
    const emailErrorTimeoutId = setTimeout(() => {
      if (voterEmailAddress && !voterEmailAddressIsValid) {
        this.setState({ displayIncorrectEmailError: true });
      }
    }, 2000);
    this.setState({
      disableEmailVerificationButton,
      displayEmailVerificationButton,
      emailErrorTimeoutId,
      voterEmailAddress,
      voterEmailAddressIsValid,
    });
  };

  onBlur = () => {
    const { voterEmailAddress } = this.state;
    if (!voterEmailAddress) {
      // Only hide the phone verification button if the user has not "unlocked" the button used to send the message.
      this.setState({
        displayEmailVerificationButton: false,
      });
      const TermsOfServiceLink = document.getElementById("openTermsOfService");
      if (TermsOfServiceLink) {
        TermsOfServiceLink.focus(); 
      }
      blurTextFieldAndroid();
    } 
  };

  onCancel = () => {
    // console.log('VoterEmailAddressEntry onCancel');
    this.setState({
      disableEmailVerificationButton: true,
      displayEmailVerificationButton: false,
      displayIncorrectEmailError: false,
      signInCodeEmailSentAndWaitingForResponse: false,
      voterEmailAddress: '', // Clearing voterEmailAddress variable does not always clear email in form
    });

    // console.log('before clearSecretCodeVerificationStatusAndEmail in onCancel');
    VoterActions.clearSecretCodeVerificationStatusAndEmail();
    const { cancelShouldCloseModal } = this.props;
    // console.log('cancelShouldCloseModal:', cancelShouldCloseModal);
    if (cancelShouldCloseModal) {
      this.closeSignInModalLocal();
    } else if (isCordova() || isMobileScreenSize()) {
      if (this.props.showAllSignInOptions) {
        this.props.showAllSignInOptions();
      }
    }
    const TermsOfServiceLink = document.getElementById("openTermsOfService");
    if (TermsOfServiceLink) {
      TermsOfServiceLink.focus(); 
    }
  };

  onFocus = () => {
    this.setState({
      displayEmailVerificationButton: true,
    });
    if (isCordova() || isMobileScreenSize()) {
      this.showEmailOnlySignInLocal();
    }
    // focusTextFieldAndroid(); // This refers to caller string AddFriendsByEmail. Correct?
  };

  onAnimationEndCancel = () => {
    // In Cordova when the virtual keyboard goes away, the on-click doesn't happen, but the onAnimation does.
    // This allows us to react to the first click.
    // if (isCordova()) {
    //   console.log('VoterEmailAddressEntry onAnimationEndCancel calling onCancel');
    //   this.onCancel();
    // }
  };

  onAnimationEndSend = () => {
    if (isCordova()) {
      // console.log('VoterPhoneVerificationEntry onAnimationEndSend calling sendSignInCodeEmail');
      this.sendSignInCodeEmail();
    }
  };

  onKeyDown = (event) => {
    // console.log('onKeyDown, event.keyCode:', event.keyCode);
    const ENTER_KEY_CODE = 13;
    const SPACE_KEY_CODE = 32;
    const keyCodesToBlock = [ENTER_KEY_CODE, SPACE_KEY_CODE];
    if (keyCodesToBlock.includes(event.keyCode)) {
      event.preventDefault();
    }
  };

  // eslint-disable-next-line react/sort-comp
  removeVoterEmailAddress (emailWeVoteId) {
    VoterActions.removeVoterEmailAddress(emailWeVoteId);
    return null;
  }

  sendSignInCodeEmail = (event) => {
    const { displayEmailVerificationButton, voterEmailAddress, voterEmailAddressIsValid } = this.state;
    // console.log('displayEmailVerificationButton:', displayEmailVerificationButton, ', voterEmailAddress:', voterEmailAddress, ', voterEmailAddressIsValid:', voterEmailAddressIsValid);
    if (event) {
      event.preventDefault();
    }
    if (voterEmailAddressIsValid && displayEmailVerificationButton) {
      VoterActions.sendSignInCodeEmail(voterEmailAddress);
      this.setState({
        emailAddressStatus: {
          email_address_already_owned_by_other_voter: false,
        },
        signInCodeEmailSentAndWaitingForResponse: true,
      });
    } else {
      this.setState({ displayIncorrectEmailError: true });
    }
  };

  reSendSignInCodeEmail = (voterEmailAddress) => {
    // console.log('VoterEmailAddressEntry voterEmailAddress:', voterEmailAddress);
    if (voterEmailAddress) {
      VoterActions.sendSignInCodeEmail(voterEmailAddress);
      this.setState({
        emailAddressStatus: {
          email_address_already_owned_by_other_voter: false,
        },
        loading: true,
        voterEmailAddress,
      });
    }
  };

  render () {
    renderLog('VoterEmailAddressEntry');  // Set LOG_RENDER_EVENTS true to log all renders
    const { doNotRender } = this.props;
    if (doNotRender) {
      return null;
    }
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const { classes, hideEverythingButSignInWithEmailForm, hideSignInWithEmailForm, lockOpenEmailVerificationButton } = this.props;
    const {
      disableEmailVerificationButton, displayEmailVerificationButton,
      displayIncorrectEmailError, emailAddressStatus, hideExistingEmailAddresses,
      secretCodeSystemLocked, showVerifyModal, signInCodeEmailSentAndWaitingForResponse,
      voterEmailAddress, voterEmailAddressList, voterEmailAddressListCount,
    } = this.state;

    const signInLinkOrCodeSent = (emailAddressStatus.link_to_sign_in_email_sent || emailAddressStatus.sign_in_code_email_sent);
    // console.log('showVerifyModal:', showVerifyModal, ', signInLinkOrCodeSent:', signInLinkOrCodeSent);
    const emailAddressStatusHtml = (
      <span>
        { emailAddressStatus.email_address_not_valid ||
          (emailAddressStatus.email_address_already_owned_by_this_voter && !emailAddressStatus.email_address_deleted && !emailAddressStatus.make_primary_email && !secretCodeSystemLocked) ||
          (emailAddressStatus.email_address_already_owned_by_other_voter && !signInLinkOrCodeSent && !secretCodeSystemLocked) ||
          secretCodeSystemLocked ? (
            <Alert severity="warning">
              { emailAddressStatus.email_address_not_valid && (
                <div>Please enter a valid email address.</div>
              )}
              { emailAddressStatus.email_address_already_owned_by_other_voter && !signInLinkOrCodeSent && !secretCodeSystemLocked && (
                <div>
                  That email is already being used by another account.
                  <br />
                  <br />
                  Please click &quot;Send Login Code in an Email&quot; below to sign into that account.
                </div>
              )}
              { emailAddressStatus.email_address_already_owned_by_this_voter && !emailAddressStatus.email_address_deleted && !emailAddressStatus.make_primary_email && !secretCodeSystemLocked ? (
                <div>That email address was already verified by you. </div>
              ) : null }
              { secretCodeSystemLocked && (
                <div>
                  Your account is locked. Please
                  <Suspense fallback={<></>}>
                    <OpenExternalWebSite
                      linkIdAttribute="weVoteSupportVoterEmailAddressEntry"
                      url="https://help.wevote.us/hc/en-us/requests/new"
                      target="_blank"
                      body={<span>contact WeVote support for help.</span>}
                    />
                  </Suspense>
                </div>
              )}
            </Alert>
          ) : null}
        { emailAddressStatus.email_address_created ||
          emailAddressStatus.email_address_deleted ||
          emailAddressStatus.email_ownership_is_verified ||
          emailAddressStatus.verification_email_sent ||
          emailAddressStatus.link_to_sign_in_email_sent ||
          (emailAddressStatus.make_primary_email && (emailAddressStatus.email_address_created || emailAddressStatus.email_address_found || emailAddressStatus.sign_in_code_email_sent) && !secretCodeSystemLocked) ||
          emailAddressStatus.sign_in_code_email_sent ? (
            <Alert severity="success">
              { emailAddressStatus.email_address_created &&
              !emailAddressStatus.verification_email_sent ? <span>Your email address was saved. </span> : null }
              { emailAddressStatus.email_address_deleted ? <span>Your email address was deleted. </span> : null }
              { emailAddressStatus.email_ownership_is_verified ? <span>Your email address was verified. </span> : null }
              { emailAddressStatus.verification_email_sent ? <span>Please check your email. A verification email was sent. </span> : null }
              { emailAddressStatus.link_to_sign_in_email_sent ? <span>Please check your email. A sign in link was sent. </span> : null }
              { emailAddressStatus.make_primary_email && (emailAddressStatus.email_address_created || emailAddressStatus.email_address_found || emailAddressStatus.sign_in_code_email_sent) && !secretCodeSystemLocked ? <span>Your have chosen a new primary email. </span> : null }
              { emailAddressStatus.sign_in_code_email_sent ? <span>Please check your email. A sign in verification code was sent. </span> : null }
            </Alert>
          ) : null}
      </span>
    );

    // let enterEmailTitle = isWebApp() ? 'Email' : 'Email the Sign In code to';
    // // let enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to be signed into your WeVote account." :
    // //   "You'll receive a magic link in the email on this phone. Click that link to be signed into your WeVote account.";
    // if (voter && voter.is_signed_in) {
    //   enterEmailTitle = 'Add New Email';
    //   // enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to verify this new email." :
    //   //   "You'll receive a magic link in the email on this phone. Click that link to verify this new email.";
    // }

    const enterEmailHtml = hideSignInWithEmailForm ? null : (
      <div style={{ paddingTop: 10 }}>
        {/*
        <SignInSectionText>
          {enterEmailTitle}
        </SignInSectionText>
        */}
        <form className="form-inline">
          <TextField
            autoComplete="off"
            autoFocus={false}
            className={classes.input}
            error={displayIncorrectEmailError}
            helperText={(displayIncorrectEmailError) ? 'Enter valid email 6 to 254 characters long' : ''}
            id="enterVoterEmailAddress"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail />
                </InputAdornment>
              ) }}
            label="Email"
            name="voter_email_address"
            onBlur={this.onBlur}
            onChange={this.onVoterEmailAddressChange}
            onFocus={this.onFocus}
            onKeyDown={this.onKeyDown}
            placeholder="Type email here..."
            type="email"
            value={voterEmailAddress}
            variant="outlined"
          />
          {(displayEmailVerificationButton || lockOpenEmailVerificationButton) && (
            <ButtonWrapper>
              <CancelButtonContainer>
                <Button
                  id="cancelEmailButton"
                  color="primary"
                  // disabled={signInCodeEmailSentAndWaitingForResponse} // Never disable Cancel
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
                  color="primary"
                  disabled={disableEmailVerificationButton || signInCodeEmailSentAndWaitingForResponse}
                  id="voterEmailAddressEntrySendCode"
                  onClick={this.sendSignInCodeEmail}
                  onAnimationEnd={this.onAnimationEndSend}
                  variant="contained"
                >
                  {signInCodeEmailSentAndWaitingForResponse ? 'Sending...' : (
                    <>
                      <span className="u-show-mobile">
                        Send code
                      </span>
                      <span className="u-show-desktop-tablet">
                        Send verification code
                      </span>
                    </>
                  )}
                </Button>
              </ButtonContainerHorizontal>
            </ButtonWrapper>
          )}
        </form>
        {!(displayEmailVerificationButton || lockOpenEmailVerificationButton) && (
          <ButtonsHiddenSpacer className="u-show-desktop-tablet" />
        )}
      </div>
    );

    let allowRemoveEmail;
    let emailOwnershipIsVerified;
    let isPrimaryEmailAddress;

    // ///////////////////////////////////
    // LIST OF VERIFIED EMAILS
    let verifiedEmailsFound = false;
    const verifiedEmailListHtml = voterEmailAddressList.map((voterEmailAddressFromList) => {
      emailOwnershipIsVerified = !!voterEmailAddressFromList.email_ownership_is_verified;

      if (emailOwnershipIsVerified) {
        verifiedEmailsFound = true;
        allowRemoveEmail = voterEmailAddressFromList.primary_email_address !== true;
        isPrimaryEmailAddress = voterEmailAddressFromList.primary_email_address === true;

        return (
          <div key={voterEmailAddressFromList.email_we_vote_id}>
            <FirstRowPhoneOrEmail>
              <span className="u-no-break">{voterEmailAddressFromList.normalized_email_address}</span>
            </FirstRowPhoneOrEmail>
            <SecondRowPhoneOrEmail>
              {isPrimaryEmailAddress ? (
                <SecondRowPhoneOrEmailDiv>
                  <span>
                    Primary
                  </span>
                  <span>
                    <OverlayTrigger
                      placement="right"
                      overlay={(
                        <Tooltip id="tooltip-top">
                          You must add a new primary email before removing this one.
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
                  </span>
                </SecondRowPhoneOrEmailDiv>
              ) : (
                <SecondRowPhoneOrEmailDiv key={`${voterEmailAddressFromList.email_we_vote_id}-internal`}>
                  <span
                    className="u-link-color u-cursor--pointer u-no-break"
                    onClick={() => this.setAsPrimaryEmailAddress(voterEmailAddressFromList.email_we_vote_id)}
                  >
                    Make Primary
                  </span>
                  {allowRemoveEmail && (
                  <span>
                    <div>
                      <span
                        className="u-link-color u-cursor--pointer"
                        onClick={() => this.removeVoterEmailAddress(voterEmailAddressFromList.email_we_vote_id)}
                      >
                        <Delete />
                      </span>
                    </div>
                  </span>
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
    // LIST OF EMAILS TO VERIFY
    let unverifiedEmailsFound = false;
    const toVerifyEmailListHtml = voterEmailAddressList.map((voterEmailAddressFromList) => {
      emailOwnershipIsVerified = !!voterEmailAddressFromList.email_ownership_is_verified;
      if (!emailOwnershipIsVerified) {
        unverifiedEmailsFound = true;
        allowRemoveEmail = !voterEmailAddressFromList.primary_email_address;
        isPrimaryEmailAddress = !!voterEmailAddressFromList.primary_email_address;
        return (
          <div key={voterEmailAddressFromList.email_we_vote_id}>
            <div>
              <FirstRowPhoneOrEmail>
                {voterEmailAddressFromList.normalized_email_address}
              </FirstRowPhoneOrEmail>
              {voterEmailAddressFromList.email_ownership_is_verified ?
                null : (
                  <SecondRowPhoneOrEmail>
                    <SecondRowPhoneOrEmailDiv key={`${voterEmailAddressFromList.email_we_vote_id}-internal`}>
                      <span
                        className="u-link-color u-cursor--pointer u-no-break"
                        onClick={() => this.reSendSignInCodeEmail(voterEmailAddressFromList.normalized_email_address)}
                        id = "sendVerificationCodeAgain"
                      >
                        Send verification again
                      </span>
                      {allowRemoveEmail && (
                        <span>
                          <div
                            className="u-link-color u-cursor--pointer"
                            onClick={() => this.removeVoterEmailAddress(voterEmailAddressFromList.email_we_vote_id)}
                          >
                            <Delete />
                          </div>
                        </span>
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
      <Wrapper isWeb={isWebApp()}>
        {(hideEverythingButSignInWithEmailForm || hideExistingEmailAddresses) ? (
          <span>
            {emailAddressStatusHtml}
          </span>
        ) : (
          <AllPhoneOrEmailTypes>
            {verifiedEmailsFound ? (
              <EmailSection isWeb={isWebApp()}>
                <span className="h3">
                  Your Email
                  {voterEmailAddressListCount > 1 ? 's' : ''}
                </span>
                {emailAddressStatusHtml}
                {verifiedEmailListHtml}
              </EmailSection>
            ) : (
              <span>
                {emailAddressStatusHtml}
              </span>
            )}
            {unverifiedEmailsFound && (
              <EmailSection isWeb={isWebApp()}>
                <span className="h3" id = "emailVerifyTitle">Emails to Verify</span>
                {toVerifyEmailListHtml}
              </EmailSection>
            )}
          </AllPhoneOrEmailTypes>
        )}
        {!hideSignInWithEmailForm && (
          <EmailSection isWeb={isWebApp()}>
            {enterEmailHtml}
          </EmailSection>
        )}
        {showVerifyModal && (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            closeSignInModal={this.closeSignInModalFromVerifySecretCode}
            closeVerifyModal={this.closeVerifyModalFromVerifySecretCode}
            voterEmailAddress={voterEmailAddress}
          />
        )}
      </Wrapper>
    );
  }
}
VoterEmailAddressEntry.propTypes = {
  cancelShouldCloseModal: PropTypes.bool,
  classes: PropTypes.object,
  closeSignInModal: PropTypes.func,
  closeVerifyModal: PropTypes.func,
  doNotRender: PropTypes.bool,
  hideEverythingButSignInWithEmailForm: PropTypes.bool,
  hideSignInWithEmailForm: PropTypes.bool,
  lockOpenEmailVerificationButton: PropTypes.bool,
  showAllSignInOptions: PropTypes.func,
  showEmailOnlySignIn: PropTypes.func,
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

const EmailSection = styled('div', {
  shouldForwardProp: (prop) => !['isWeb'].includes(prop),
})(({ isWeb }) => (`
  margin-top: ${isWeb ? '0' : '0'};
`));

// const SignInSectionText = styled('div')`
//   display: block;
//   text-align: left;
//   font-weight: 500;
//   margin-bottom: 6px;
// `;

const Wrapper = styled('div', {
  shouldForwardProp: (prop) => !['isWeb'].includes(prop),
})(({ isWeb }) => (`
  margin-top: ${isWeb ? '0' : '0'};
  ${isIPad() ? 'text-align: left; padding-left: 110px;' : ''};
)}
`));

export default withStyles(styles)(VoterEmailAddressEntry);
