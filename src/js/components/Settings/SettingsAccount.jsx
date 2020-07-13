import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cookies from '../../utils/cookies';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppActions from '../../actions/AppActions';
import AppleSignIn from '../Apple/AppleSignIn';
import AppStore from '../../stores/AppStore';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import { historyPush, isCordova, isIPhone4in, isIPhone4p7in, isWebApp,
  restoreStylesAfterCordovaKeyboard, isAndroid,
} from '../../utils/cordovaUtils';
import FacebookActions from '../../actions/FacebookActions';
import FacebookStore from '../../stores/FacebookStore';
import FacebookSignIn from '../Facebook/FacebookSignIn';
import LoadingWheel from '../LoadingWheel';
import { oAuthLog, renderLog } from '../../utils/logging';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import { stringContains } from '../../utils/textFormat';
import TwitterActions from '../../actions/TwitterActions';
import TwitterSignIn from '../Twitter/TwitterSignIn';
import VoterActions from '../../actions/VoterActions';
import VoterEmailAddressEntry from './VoterEmailAddressEntry';
import VoterSessionActions from '../../actions/VoterSessionActions';
import VoterStore from '../../stores/VoterStore';
import VoterPhoneVerificationEntry from './VoterPhoneVerificationEntry';
import VoterPhoneEmailCordovaEntryModal from './VoterPhoneEmailCordovaEntryModal';
import webAppConfig from '../../config';

/* global $ */

const debugMode = false;

export default class SettingsAccount extends Component {
  static propTypes = {
    inModal: PropTypes.bool,
    pleaseSignInTitle: PropTypes.string,
    pleaseSignInSubTitle: PropTypes.string,
    closeSignInModal: PropTypes.func,
    focusedOnSingleInputToggle: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      facebookAuthResponse: {},
      hideCurrentlySignedInHeader: false,
      hideDialogForCordova: false,
      hideFacebookSignInButton: false,
      hideTwitterSignInButton: false,
      hideVoterEmailAddressEntry: false,
      hideVoterPhoneEntry: false,
      isOnWeVoteRootUrl: true,
      isOnWeVoteSubdomainUrl: false,
      isOnFacebookSupportedDomainUrl: false,
      pleaseSignInTitle: '',
      pleaseSignInSubTitle: '',
      showTwitterDisconnect: false,
    };
    this.toggleTwitterDisconnectClose = this.toggleTwitterDisconnectClose.bind(this);
    this.toggleTwitterDisconnectOpen = this.toggleTwitterDisconnectOpen.bind(this);
    this.voterSplitIntoTwoAccounts = this.voterSplitIntoTwoAccounts.bind(this);
    this.hideDialogForCordovaLocal = this.hideDialogForCordovaLocal.bind(this);
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this.onVoterStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    let signInStartFullUrl = cookies.getItem('sign_in_start_full_url');
    if (stringContains('/settings/account', signInStartFullUrl)) {
      cookies.removeItem('sign_in_start_full_url', '/');
      cookies.removeItem('sign_in_start_full_url', '/', 'wevote.us');
    }
    const oneDayExpires = 86400;
    let pathname = '';

    const getStartedMode = AppStore.getStartedMode();
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
    const { origin } = window.location;

    // if (window.location.pathname === '/ballot/modal/share') {

    // }

    if (this.props.pleaseSignInTitle || this.props.pleaseSignInSubTitle) {
      AppActions.storeSignInStartFullUrl();
      this.setState({
        pleaseSignInTitle: this.props.pleaseSignInTitle || '',
        pleaseSignInSubTitle: this.props.pleaseSignInSubTitle || '',
      });
    } else if (getStartedMode && getStartedMode === 'getStartedForCampaigns') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      // console.log('SettingsAccount getStartedForCampaigns, new origin: ', origin, ', pathname: ', pathname, ', signInStartFullUrl: ', signInStartFullUrl);
      cookies.setItem('sign_in_start_full_url', signInStartFullUrl, oneDayExpires, '/', 'wevote.us');
      this.setState({
        pleaseSignInTitle: 'Please sign in to get started.',
        pleaseSignInSubTitle: 'Use Twitter to verify your account most quickly.',
      });
    } else if (getStartedMode && getStartedMode === 'getStartedForOrganizations') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      // console.log('SettingsAccount getStartedForCampaigns, new origin: ', origin, ', pathname: ', pathname, ', signInStartFullUrl: ', signInStartFullUrl);
      cookies.setItem('sign_in_start_full_url', signInStartFullUrl, oneDayExpires, '/', 'wevote.us');
      this.setState({
        pleaseSignInTitle: 'Please sign in to get started.',
        pleaseSignInSubTitle: 'Use Twitter to verify your account most quickly.',
      });
    } else if (getStartedMode && getStartedMode === 'getStartedForVoters') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      // console.log('SettingsAccount getStartedForCampaigns, new origin: ', origin, ', pathname: ', pathname, ', signInStartFullUrl: ', signInStartFullUrl);
      cookies.setItem('sign_in_start_full_url', signInStartFullUrl, oneDayExpires, '/', 'wevote.us');
      this.setState({
        pleaseSignInTitle: 'Please sign in to get started.',
        pleaseSignInSubTitle: 'Don\'t worry, we won\'t post anything automatically.',
      });
    } else {
      const isOnWeVoteRootUrl = AppStore.isOnWeVoteRootUrl();
      const isOnWeVoteSubdomainUrl = AppStore.isOnWeVoteSubdomainUrl();
      const isOnFacebookSupportedDomainUrl = AppStore.isOnFacebookSupportedDomainUrl();
      let pleaseSignInSubTitle = '';
      if (isOnWeVoteRootUrl || isOnWeVoteSubdomainUrl || isOnFacebookSupportedDomainUrl) {
        pleaseSignInSubTitle = 'Don\'t worry, we won\'t post anything automatically.';
      }
      AppActions.storeSignInStartFullUrl();
      this.setState({
        pleaseSignInTitle: '',
        pleaseSignInSubTitle,
      });
    }
    this.setState({
      isOnWeVoteRootUrl: AppStore.isOnWeVoteRootUrl(),
      isOnWeVoteSubdomainUrl: AppStore.isOnWeVoteSubdomainUrl(),
      isOnFacebookSupportedDomainUrl: AppStore.isOnFacebookSupportedDomainUrl(),
    });

    const delayBeforeClearingStatus = 500;
    this.timer = setTimeout(() => {
      VoterActions.clearEmailAddressStatus();
      VoterActions.clearSecretCodeVerificationStatus();
    }, delayBeforeClearingStatus);
  }

  componentDidUpdate () {
    if (isCordova()) {
      const sendButtonSMS = $('#voterPhoneSendSMS');
      const sendButtonEmail = $('#voterEmailAddressEntrySendCode');
      const cont = $('.MuiDialog-container');
      const styleWorking = cont.length ? $(cont).attr('style') : '';
      const translate = isIPhone4in() || isIPhone4p7in() ? 'transform: translateY(10%); height: unset;' : 'transform: translateY(40%); height: unset;';

      // The VoterPhoneEmailCordovaEntryModal dialog gets pushed out of the way when the virtual keyboard appears,
      // so we wait for it to be rendered, then move it into place

      if (sendButtonSMS.length) {
        console.log('SettingsAccount componentDidUpdate SEND CODE was rendered. sendButtonSMS:', sendButtonSMS);
      } else if ((sendButtonSMS.length)) {
        console.log('SettingsAccount componentDidUpdate SEND CODE was rendered. sendButtonEmail:', sendButtonEmail);
      }
      if (sendButtonSMS.length || sendButtonSMS.length) {
        if (styleWorking && !stringContains(translate, styleWorking)) {
          $(cont).attr('style', `${styleWorking} ${translate}`);
          console.log(`SettingsAccount componentDidUpdate was rendered. NEW style: ${$(cont).attr('style')}`);
        } else {
          console.log(`SettingsAccount componentDidUpdate was rendered. transform was already there. style: ${$(cont).attr('style')}`);
        }
      }
    }
  }

  componentWillUnmount () {
    // console.log("SettingsAccount componentWillUnmount");
    signInModalGlobalState.set('textOrEmailSignInInProcess', false);
    this.appStoreListener.remove();
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    restoreStylesAfterCordovaKeyboard('SettingsAccount');
  }

  onAppStoreChange () {
    this.setState({
      isOnWeVoteRootUrl: AppStore.isOnWeVoteRootUrl(),
      isOnWeVoteSubdomainUrl: AppStore.isOnWeVoteSubdomainUrl(),
      isOnFacebookSupportedDomainUrl: AppStore.isOnFacebookSupportedDomainUrl(),
    });
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  onFacebookChange () {
    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
    });
  }

  focusedOnSingleInputToggle = (focusedInputName) => {
    // console.log('SettingsAccount focusedOnSingleInput');
    if (this.props.focusedOnSingleInputToggle) {
      this.props.focusedOnSingleInputToggle(focusedInputName);
    }
  };

  localCloseSignInModal = () => {
    // console.log('SettingsAccount localCloseSignInModal');
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  toggleNonEmailSignInOptions = () => {
    const { hideCurrentlySignedInHeader, hideFacebookSignInButton, hideTwitterSignInButton, hideVoterPhoneEntry } = this.state;
    this.setState({
      hideCurrentlySignedInHeader: !hideCurrentlySignedInHeader,
      hideFacebookSignInButton: !hideFacebookSignInButton,
      hideTwitterSignInButton: !hideTwitterSignInButton,
      hideVoterPhoneEntry: !hideVoterPhoneEntry,
    });
    // console.log('SettingsAccount toggleNonEmailSignInOptions');
    this.focusedOnSingleInputToggle('email');
  };

  toggleNonPhoneSignInOptions = () => {
    const { hideCurrentlySignedInHeader, hideFacebookSignInButton, hideTwitterSignInButton, hideVoterEmailAddressEntry } = this.state;
    this.setState({
      hideCurrentlySignedInHeader: !hideCurrentlySignedInHeader,
      hideFacebookSignInButton: !hideFacebookSignInButton,
      hideTwitterSignInButton: !hideTwitterSignInButton,
      hideVoterEmailAddressEntry: !hideVoterEmailAddressEntry,
    });
    // console.log('SettingsAccount toggleNonPhoneSignInOptions');
    this.focusedOnSingleInputToggle('phone');
  };

  toggleTwitterDisconnectOpen () {
    this.setState({ showTwitterDisconnect: true });
  }

  toggleTwitterDisconnectClose () {
    this.setState({ showTwitterDisconnect: false });
  }

  voterSplitIntoTwoAccounts () {
    VoterActions.voterSplitIntoTwoAccounts();
    this.setState({ showTwitterDisconnect: false });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('SignIn caught error: ', `${error} with info: `, info);
  }

  facebookLogOutOnKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      FacebookActions.appLogout();
    }
  }

  hideDialogForCordovaLocal () {
    if (!this.state.hideDialogForCordova) {
      this.setState({ hideDialogForCordova: true });
      $('.MuiDialog-paperScrollPaper').css('display', 'none');  // Manually hide the underlying dialog title
    }
  }

  twitterLogOutOnKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      TwitterActions.appLogout();
    }
  }

  signOut () {
    // console.log('SettingsAccount.jsx signOut');
    VoterSessionActions.voterSignOut();
    historyPush('/ballot');
  }

  render () {
    renderLog('SettingsAccount');  // Set LOG_RENDER_EVENTS to log all renders
    const { inModal } = this.props;
    const {
      facebookAuthResponse, hideCurrentlySignedInHeader, hideFacebookSignInButton, hideTwitterSignInButton,
      hideVoterEmailAddressEntry, hideVoterPhoneEntry, isOnWeVoteRootUrl, isOnWeVoteSubdomainUrl,
      isOnFacebookSupportedDomainUrl, pleaseSignInTitle, pleaseSignInSubTitle, voter, hideDialogForCordova,
    } = this.state;
    if (!voter) {
      return LoadingWheel;
    }

    const {
      is_signed_in: voterIsSignedIn, signed_in_facebook: voterIsSignedInFacebook,
      signed_in_twitter: voterIsSignedInTwitter, signed_in_with_email: voterIsSignedInWithEmail,
      twitter_screen_name: twitterScreenName, signed_in_with_apple: voterIsSignedInWithApple,
    } = voter;
    // console.log("SettingsAccount.jsx facebookAuthResponse:", facebookAuthResponse);
    // console.log("SettingsAccount.jsx voter:", voter);
    // console.log('SettingsAccount.jsx hideDialogForCordova:', hideDialogForCordova);
    if (!voterIsSignedInFacebook && facebookAuthResponse && facebookAuthResponse.length && facebookAuthResponse.facebook_retrieve_attempted) {
      // console.log('SettingsAccount.jsx facebook_retrieve_attempted');
      oAuthLog('SettingsAccount facebook_retrieve_attempted');
      // return <span>SettingsAccount.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    }

    let pageTitle = 'Sign In - We Vote';
    let yourAccountTitle = 'Security & Sign In';
    let yourAccountExplanation = '';
    if (voterIsSignedIn) {
      pageTitle = 'Security & Sign In - We Vote';
      if (voterIsSignedInFacebook && !voterIsSignedInTwitter && (isOnWeVoteRootUrl || isOnWeVoteSubdomainUrl)) {
        yourAccountTitle = 'Have Twitter Too?';
        yourAccountExplanation = 'By adding your Twitter account to your We Vote profile, you get access to the voter guides of everyone you follow.';
      } else if (voterIsSignedInTwitter && !voterIsSignedInFacebook && isOnFacebookSupportedDomainUrl) {
        yourAccountTitle = 'Have Facebook Too?';
        yourAccountExplanation = 'By adding Facebook to your We Vote profile, it is easier to invite friends.';
      }
    }

    // console.log('SettingsAccount voterIsSignedIn', voterIsSignedIn, 'signedInTwitter', voterIsSignedInTwitter, 'signedInFacebook', voterIsSignedInFacebook,
    //   'signedInWithApple', voterIsSignedInWithApple, '\nhideDialogForCordova', hideDialogForCordova, 'hideCurrentlySignedInHeader', hideCurrentlySignedInHeader,
    //   'hideTwitterSignInButton', hideTwitterSignInButton,
    //   'hideFacebookSignInButton', hideFacebookSignInButton, 'hideDialogForCordova', hideDialogForCordova,
    //   'isOnFacebookSupportedDomainUrl', isOnFacebookSupportedDomainUrl, 'isOnWeVoteRootUrl', isOnWeVoteRootUrl);
    const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

    return (
      <>
        <Helmet title={pageTitle} />
        {!hideDialogForCordova &&
          <BrowserPushMessage incomingProps={this.props} />
        }
        <div className={inModal ? 'card-main full-width' : 'card'} style={{ display: `${hideDialogForCordova ? ' none' : 'undefined'}` }}>
          <Main inModal={inModal} id="settingsAccountMain">
            {voterIsSignedInTwitter && voterIsSignedInFacebook ?
              null :
              <h1 className="h3">{!hideTwitterSignInButton && !hideFacebookSignInButton && voterIsSignedIn ? <span>{yourAccountTitle}</span> : null}</h1>
            }
            {!hideCurrentlySignedInHeader && (
              <div>
                {voterIsSignedIn ?
                  <div className="u-stack--sm">{yourAccountExplanation}</div> : (
                    <>
                      <div className="u-show-mobile-bigger-than-iphone5">
                        <div className="u-f3">{pleaseSignInTitle}</div>
                        <SignInSubtitle className="u-stack--sm">{pleaseSignInSubTitle}</SignInSubtitle>
                      </div>
                      <div className="u-show-desktop-tablet">
                        <div className="u-f3">{pleaseSignInTitle}</div>
                        <SignInSubtitle className="u-stack--sm">{pleaseSignInSubTitle}</SignInSubtitle>
                      </div>
                    </>
                  )
                }
              </div>
            )}
            {(!voterIsSignedInTwitter || !voterIsSignedInFacebook) && !hideDialogForCordova ? (
              <>
                <div className="u-stack--md">
                  { !hideTwitterSignInButton && !voterIsSignedInTwitter && (isOnWeVoteRootUrl || isOnWeVoteSubdomainUrl) && (
                    <span>
                      <RecommendedText className="u-tl u-stack--sm">Recommended</RecommendedText>
                      <TwitterSignIn
                        buttonText="Sign in with Twitter"
                        buttonSubmittedText="Signing in..."
                        inModal={inModal}
                        closeSignInModal={this.localCloseSignInModal}
                      />
                    </span>
                  )
                  }
                </div>
                <div className="u-stack--md">
                  { !hideFacebookSignInButton && !voterIsSignedInFacebook && isOnFacebookSupportedDomainUrl && (
                    <span>
                      <FacebookSignIn
                        closeSignInModal={this.localCloseSignInModal}
                        buttonSubmittedText="Signing in..."
                        buttonText="Sign in with Facebook"
                      />
                    </span>
                  )
                  }
                </div>
              </>
            ) : null
            }
            {voterIsSignedIn && !hideDialogForCordova ? (
              <div className="u-stack--md">
                {!hideCurrentlySignedInHeader && (
                  <div className="u-stack--sm">
                    <span className="h3 voterIsSignedIn">Currently Signed In</span>
                    <span className="u-margin-left--sm" />
                    <span className="account-edit-action" onKeyDown={this.twitterLogOutOnKeyDown.bind(this)}>
                      <span className="pull-right" onClick={this.signOut.bind(this)}>sign out</span>
                    </span>
                  </div>
                )}
                <div className="u-stack--sm">
                  {!hideTwitterSignInButton && voterIsSignedInTwitter && (
                    <div>
                      <TwitterContainer className="btn btn-social btn-md btn-twitter" href="#">
                        <i className="fab fa-twitter" />
                        @
                        {twitterScreenName}
                      </TwitterContainer>
                      <span className="u-margin-left--sm" />
                    </div>
                  )}
                  {!hideTwitterSignInButton && voterIsSignedInTwitter && (voterIsSignedInFacebook || voterIsSignedInWithEmail) ? (
                    <div className="u-margin-top--xs">
                      {this.state.showTwitterDisconnect ? (
                        <div>
                          <Button
                            className="btn-sm"
                            id="voterSplitIntoTwoAccounts"
                            onClick={this.voterSplitIntoTwoAccounts}
                            type="submit"
                            variant="danger"
                          >
                            Are you sure you want to un-link?
                          </Button>
                          <span
                            className="u-margin-left--sm"
                            id="toggleTwitterDisconnectClose"
                            onClick={this.toggleTwitterDisconnectClose}
                          >
                            cancel
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span
                            id="toggleTwitterDisconnectOpen"
                            onClick={this.toggleTwitterDisconnectOpen}
                          >
                            un-link @
                            {twitterScreenName}
                            {' '}
                            twitter account
                          </span>
                        </div>
                      )}
                    </div>
                  ) : null
                  }
                  <div className="u-margin-top--sm">
                    {!hideFacebookSignInButton && voterIsSignedInFacebook && (
                    <span>
                      <FacebookContainer className="btn btn-social-icon btn-lg btn-facebook">
                        <span className="fab fa-facebook" />
                      </FacebookContainer>
                      <span className="u-margin-left--sm" />
                    </span>
                    )}
                  </div>
                </div>
              </div>
            ) : null
            }
            {!isAndroid() && nextReleaseFeaturesEnabled && (
              <AppleSignIn signedIn={voterIsSignedInWithApple} closeSignInModal={this.localCloseSignInModal} />
            )}
            {!hideVoterPhoneEntry && isWebApp() && (
              <VoterPhoneVerificationEntry
                closeSignInModal={this.localCloseSignInModal}
                inModal={inModal}
                toggleOtherSignInOptions={this.toggleNonPhoneSignInOptions}
              />
            )}
            {!hideVoterPhoneEntry && isCordova() && (
              <VoterPhoneEmailCordovaEntryModal
                closeSignInModal={this.localCloseSignInModal}
                inModal={inModal}
                toggleOtherSignInOptions={this.toggleNonPhoneSignInOptions}
                isPhone
                hideDialogForCordova={this.hideDialogForCordovaLocal}
              />
            )}
            {!hideVoterEmailAddressEntry && isWebApp() && (
              <VoterEmailAddressEntry
                closeSignInModal={this.localCloseSignInModal}
                inModal={inModal}
                toggleOtherSignInOptions={this.toggleNonEmailSignInOptions}
              />
            )}
            {!hideVoterEmailAddressEntry && isCordova() && (
              <VoterPhoneEmailCordovaEntryModal
                closeSignInModal={this.localCloseSignInModal}
                inModal={inModal}
                toggleOtherSignInOptions={this.toggleNonPhoneSignInOptions}
                isPhone={false}
                hideDialogForCordova={this.hideDialogForCordovaLocal}
              />
            )}
            {debugMode && (
            <div className="text-center">
              is_signed_in:
              {' '}
              {voterIsSignedIn ? <span>True</span> : null}
              <br />
              signed_in_facebook:
              {' '}
              {voterIsSignedInFacebook ? <span>True</span> : null}
              <br />
              signed_in_twitter:
              {' '}
              {voterIsSignedInTwitter ? <span>True</span> : null}
              <br />
              we_vote_id:
              {' '}
              {voter.we_vote_id ? <span>{voter.we_vote_id}</span> : null}
              <br />
              email:
              {' '}
              {voter.email ? <span>{voter.email}</span> : null}
              <br />
              facebook_email:
              {' '}
              {voter.facebook_email ? <span>{voter.facebook_email}</span> : null}
              <br />
              facebook_profile_image_url_https:
              {' '}
              {voter.facebook_profile_image_url_https ? <span>{voter.facebook_profile_image_url_https}</span> : null}
              <br />
              first_name:
              {' '}
              {voter.first_name ? <span>{voter.first_name}</span> : null}
              <br />
              facebook_id:
              {' '}
              {voter.facebook_id ? <span>{voter.facebook_id}</span> : null}
              <br />
            </div>
            )}
          </Main>
        </div>
      </>
    );
  }
}

const Main = styled.div`
  margin-top: ${({ inModal }) => (inModal ? '-16px' : '0')};
  padding: 16px;
  text-align: center;
  padding-top: 0;
  width: 100%;
`;

const SignInSubtitle = styled.p`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 24px;
`;

const RecommendedText = styled.p`
  margin: 0;
  color: #333;
  font-weight: bold;
  font-size: 16px;
`;

const TwitterContainer = styled.span`
  color: #fff !important;
  background-color: #55acee !important;
  border-color: rgba(0,0,0,0.2);
  position: relative;
  padding-left: 44px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FacebookContainer = styled.span`
  color: #fff;
  background-color: #3b5998 !important;
  borderColor: rgba(0,0,0,0.2);
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: 0.3rem;
`;
