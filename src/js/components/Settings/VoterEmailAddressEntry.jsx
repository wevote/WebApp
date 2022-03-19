import { Delete, Mail } from '@mui/icons-material';
import { Button, InputBase, Paper } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Alert from 'react-bootstrap/Alert';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { blurTextFieldAndroid, focusTextFieldAndroid } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import SettingsVerifySecretCode from './SettingsVerifySecretCode';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));


/* global $ */

class VoterEmailAddressEntry extends Component {
  constructor (props) {
    super(props);
    this.state = {
      disableEmailVerificationButton: true,
      displayEmailVerificationButton: false,
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
      otherSignInOptionsOff: false,
      secretCodeSystemLocked: false,
      showVerifyModal: false,
      voter: VoterStore.getVoter(),
      voterEmailAddress: '',
      voterEmailAddressIsValid: false,
      voterEmailAddressList: [],
      voterEmailAddressListCount: 0,
      // voterEmailAddressesVerifiedCount: 0,
    };
    if (isCordova()) {
      signInModalGlobalState.set('textOrEmailSignInInProcess', true);
    }
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterEmailAddressRetrieve();
  }

  componentDidUpdate () {
    const { movedInitialFocus } = this.state;
    if (isCordova() && !movedInitialFocus) {
      const inputFld = $('#enterVoterEmailAddress');
      // console.log('enterVoterEmailAddress ', $(inputFld));
      $(inputFld).focus();
      if ($(inputFld).is(':focus')) {
        this.setState({ movedInitialFocus: true });
      }
    }
  }

  componentWillUnmount () {
    // console.log('VoterEmailAddressEntry componentWillUnmount');
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const emailAddressStatus = VoterStore.getEmailAddressStatus();
    const { secret_code_system_locked_for_this_voter_device_id: secretCodeSystemLocked } = emailAddressStatus;
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    // console.log('onVoterStoreChange emailAddressStatus:', emailAddressStatus);

    const voter = VoterStore.getVoter();
    const { signed_in_with_email: signedInWithEmail } = voter;
    // console.log(`VoterEmailAddressEntry onVoterStoreChange isSignedIn: ${isSignedIn}, signedInWithEmail: ${signedInWithEmail}`);
    if (signedInWithEmail) {
      // console.log('VoterEmailAddressEntry onVoterStoreChange signedInWithEmail so doing a hacky fallback close');
      this.closeSignInModal();
    } else if (secretCodeVerified) {
      this.setState({
        displayEmailVerificationButton: false,
        showVerifyModal: false,
        voterEmailAddress: '',
      });
    } else if (emailAddressStatus.sign_in_code_email_sent) {
      this.setState({
        displayEmailVerificationButton: false,
        emailAddressStatus: {
          sign_in_code_email_sent: false,
        },
        showVerifyModal: true,
      });
    } else if (emailAddressStatus.email_address_already_owned_by_this_voter) {
      this.setState({
        displayEmailVerificationButton: false,
        emailAddressStatus,
        showVerifyModal: false,
      });
    } else {
      this.setState({
        emailAddressStatus,
      });
    }
    const voterEmailAddressList = VoterStore.getEmailAddressList();
    const voterEmailAddressListCount = voterEmailAddressList.length;
    // const voterEmailAddressesVerifiedCount = VoterStore.getEmailAddressesVerifiedCount();
    this.setState({
      loading: false,
      secretCodeSystemLocked,
      voter: VoterStore.getVoter(),
      voterEmailAddressList,
      voterEmailAddressListCount,
      // voterEmailAddressesVerifiedCount,
    });
  }

  setAsPrimaryEmailAddress (emailWeVoteId) {
    VoterActions.setAsPrimaryEmailAddress(emailWeVoteId);
  }

  voterEmailAddressSave = (event) => {
    // console.log('VoterEmailAddressEntry this.voterEmailAddressSave');
    const { voterEmailAddress } = this.state;
    event.preventDefault();
    const sendLinkToSignIn = true;
    VoterActions.voterEmailAddressSave(voterEmailAddress, sendLinkToSignIn);
    this.setState({ loading: true });
  };

  sendSignInCodeEmail = (event) => {
    if (event) {
      event.preventDefault();
    }
    const { displayEmailVerificationButton, voterEmailAddress, voterEmailAddressIsValid } = this.state;
    if (voterEmailAddressIsValid && displayEmailVerificationButton) {
      VoterActions.sendSignInCodeEmail(voterEmailAddress);
      this.setState({
        emailAddressStatus: {
          email_address_already_owned_by_other_voter: false,
        },
        signInCodeEmailSentAndWaitingForResponse: true,
      });
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

  displayEmailVerificationButton = () => {
    this.setState({
      displayEmailVerificationButton: true,
    });
  };

  hideEmailVerificationButton = () => {
    this.setState({
      displayEmailVerificationButton: false,
    });
  };

  localToggleOtherSignInOptions = () => {
    if (isCordova() || isMobileScreenSize()) {
      const { hideExistingEmailAddresses, otherSignInOptionsOff } = this.state;
      this.setState({
        hideExistingEmailAddresses: !hideExistingEmailAddresses,
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
        hideExistingEmailAddresses: true,
        otherSignInOptionsOff: true,
        signInCodeEmailSentAndWaitingForResponse: false,
      });
      if (!otherSignInOptionsOff) {
        if (this.props.toggleOtherSignInOptions) {
          this.props.toggleOtherSignInOptions();
        }
      }
    }
  };

  closeSignInModal = () => {
    // console.log('VoterEmailAddressEntry closeSignInModal');
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  closeVerifyModal = () => {
    // console.log('VoterEmailAddressEntry closeVerifyModal');
    VoterActions.clearEmailAddressStatus();
    VoterActions.clearSecretCodeVerificationStatus();
    this.setState({
      displayEmailVerificationButton: false,
      emailAddressStatus: {
        sign_in_code_email_sent: false,
      },
      showVerifyModal: false,
      signInCodeEmailSentAndWaitingForResponse: false,
    });
  };

  updateVoterEmailAddress = (event) => {
    const voterEmailAddress = event.target.value;
    const voterEmailAddressIsValid = (voterEmailAddress && voterEmailAddress.length > 6);
    const disableEmailVerificationButton = !voterEmailAddressIsValid;
    this.setState({
      disableEmailVerificationButton,
      voterEmailAddress,
      voterEmailAddressIsValid,
    });
  };

  onCancel = () => {
    // console.log('VoterEmailAddressEntry onCancel');
    this.setState({
      disableEmailVerificationButton: false,
      signInCodeEmailSentAndWaitingForResponse: false,
    });
    const { cancelShouldCloseModal } = this.props;
    if (cancelShouldCloseModal) {
      this.closeSignInModal();
    } else {
      // There are Modal display problems that don't seem to be resolvable that prevents us from returning to the full SettingsAccount modal
      this.hideEmailVerificationButton();
      this.localToggleOtherSignInOptions();
    }
  };

  onFocus = () => {
    const { displayEmailVerificationButton } = this.state;
    if (!displayEmailVerificationButton) {
      this.displayEmailVerificationButton();
      this.turnOtherSignInOptionsOff();
    }
    focusTextFieldAndroid();
  };

  onAnimationEndCancel = () => {
    // In Cordova when the virtual keyboard goes away, the on-click doesn't happen, but the onAnimation does.
    // This allows us to react to the first click.
    if (isCordova()) {
      // console.log('VoterEmailAddressEntry onAnimationEndCancel calling onCancel');
      this.onCancel();
    }
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

  // sendVerificationEmail (emailWeVoteId) {
  //   VoterActions.sendVerificationEmail(emailWeVoteId);
  //   this.setState({ loading: true });
  // }

  removeVoterEmailAddress (emailWeVoteId) {
    VoterActions.removeVoterEmailAddress(emailWeVoteId);
  }

  render () {
    renderLog('VoterEmailAddressEntry');  // Set LOG_RENDER_EVENTS true to log all renders
    const { loading } = this.state;
    // console.log('VoterEmailAddressEntry loading: ', loading);
    if (loading) {
      // console.log('VoterEmailAddressEntry loading: ', loading);
      return LoadingWheel;
    }

    const { classes, hideEverythingButSignInWithEmailForm, hideSignInWithEmailForm, lockOpenEmailVerificationButton } = this.props;
    const {
      disableEmailVerificationButton, displayEmailVerificationButton, emailAddressStatus, hideExistingEmailAddresses,
      secretCodeSystemLocked, showVerifyModal, signInCodeEmailSentAndWaitingForResponse,
      voter, voterEmailAddress, voterEmailAddressList, voterEmailAddressListCount,
    } = this.state;

    const signInLinkOrCodeSent = (emailAddressStatus.link_to_sign_in_email_sent || emailAddressStatus.sign_in_code_email_sent);
    // console.log('showVerifyModal:', showVerifyModal, ', signInLinkOrCodeSent:', signInLinkOrCodeSent);
    const emailAddressStatusHtml = (
      <span>
        { emailAddressStatus.email_address_not_valid ||
        (emailAddressStatus.email_address_already_owned_by_this_voter && !emailAddressStatus.email_address_deleted && !emailAddressStatus.make_primary_email && !secretCodeSystemLocked) ||
        (emailAddressStatus.email_address_already_owned_by_other_voter && !signInLinkOrCodeSent && !secretCodeSystemLocked) ||
        secretCodeSystemLocked ? (
          <Alert variant="warning">
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
            { emailAddressStatus.email_address_already_owned_by_this_voter && !emailAddressStatus.email_address_deleted && !emailAddressStatus.make_primary_email && !secretCodeSystemLocked ? <div>That email address was already verified by you. </div> : null }
            { secretCodeSystemLocked && (
              <div>
                Your account is locked. Please
                <Suspense fallback={<></>}>
                  <OpenExternalWebSite
                    linkIdAttribute="weVoteSupportVoterEmailAddressEntry"
                    url="https://help.wevote.us/hc/en-us/requests/new"
                    target="_blank"
                    body={<span>contact We Vote support for help.</span>}
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
          <Alert variant="success">
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

    let enterEmailTitle = isWebApp() ? 'Sign in with Email' : 'Email the Sign In code to';
    // let enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to be signed into your We Vote account." :
    //   "You'll receive a magic link in the email on this phone. Click that link to be signed into your We Vote account.";
    if (voter && voter.is_signed_in) {
      enterEmailTitle = 'Add New Email';
      // enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to verify this new email." :
      //   "You'll receive a magic link in the email on this phone. Click that link to verify this new email.";
    }

    const enterEmailHtml = hideSignInWithEmailForm ? null : (
      <div>
        <div className="u-stack--sm u-tl">
          <strong>
            {enterEmailTitle}
          </strong>
          {' '}
          {/* enterEmailExplanation */}
        </div>
        <form className="form-inline">
          <Paper className={classes.root} elevation={1}>
            <Mail />
            <InputBase
              className={classes.input}
              type="email"
              name="voter_email_address"
              id="enterVoterEmailAddress"
              value={voterEmailAddress}
              onChange={this.updateVoterEmailAddress}
              onFocus={this.onFocus}
              onBlur={blurTextFieldAndroid}
              onKeyDown={this.onKeyDown}
              placeholder="Type email here..."
            />
          </Paper>
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
              <ButtonContainer>
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
            <span className="u-no-break">{voterEmailAddressFromList.normalized_email_address}</span>

            {isPrimaryEmailAddress && (
              <span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                Primary
              </span>
            )}
            {!isPrimaryEmailAddress && (
              <span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>
                  <span
                    className="u-link-color u-cursor--pointer u-no-break"
                    onClick={this.setAsPrimaryEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}
                  >
                    Make Primary
                  </span>
                  &nbsp;&nbsp;&nbsp;
                </span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                {allowRemoveEmail && (
                  <span
                    className="u-link-color u-cursor--pointer"
                    onClick={this.removeVoterEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}
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
              <span className="u-no-break">{voterEmailAddressFromList.normalized_email_address}</span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              {voterEmailAddressFromList.email_ownership_is_verified ?
                null : (
                  <span
                    className="u-link-color u-cursor--pointer u-no-break"
                    onClick={() => this.reSendSignInCodeEmail(voterEmailAddressFromList.normalized_email_address)}
                  >
                    Send Verification Again
                  </span>
                )}

              <span>&nbsp;&nbsp;&nbsp;</span>
              {allowRemoveEmail && (
                <span
                  className="u-link-color u-cursor--pointer"
                  onClick={this.removeVoterEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}
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
      <Wrapper isWeb={isWebApp()}>
        {(hideEverythingButSignInWithEmailForm || hideExistingEmailAddresses) ? (
          <span>
            {emailAddressStatusHtml}
          </span>
        ) : (
          <div>
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
                <span className="h3">Emails to Verify</span>
                {toVerifyEmailListHtml}
              </EmailSection>
            )}
          </div>
        )}
        {!hideSignInWithEmailForm && (
          <EmailSection isWeb={isWebApp()}>
            {enterEmailHtml}
          </EmailSection>
        )}
        {showVerifyModal && (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            closeVerifyModal={this.closeVerifyModal}
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
  hideEverythingButSignInWithEmailForm: PropTypes.bool,
  hideSignInWithEmailForm: PropTypes.bool,
  lockOpenEmailVerificationButton: PropTypes.bool,
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
};

const ButtonWrapper = styled('div')`
  width: 100%;
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ButtonContainer = styled('div')`
  width: fit-content;
  margin-left: 8px;
`;

const CancelButtonContainer = styled('div')`
  width: fit-content;
`;

const Wrapper = styled('div', {
  shouldForwardProp: (prop) => !['isWeb'].includes(prop),
})(({ isWeb }) => (`
  margin-top: ${isWeb ? '32px;' : '0'};
`));

const EmailSection = styled('div', {
  shouldForwardProp: (prop) => !['isWeb'].includes(prop),
})(({ isWeb }) => (`
  margin-top: ${isWeb ? '18px;' : '0'};
`));

export default withStyles(styles)(VoterEmailAddressEntry);
