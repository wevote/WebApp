import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cookies from '../../utils/cookies';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import { cordovaSignInModalTopPosition } from '../../utils/cordovaOffsets';
import { isCordova, isIOS } from '../../utils/cordovaUtils';
import FacebookActions from '../../actions/FacebookActions';
import FacebookStore from '../../stores/FacebookStore';
import FacebookSignIn from '../Facebook/FacebookSignIn';
import LoadingWheel from '../LoadingWheel';
import { oAuthLog, renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';
import TwitterActions from '../../actions/TwitterActions';
import TwitterSignIn from '../Twitter/TwitterSignIn';
import VoterActions from '../../actions/VoterActions';
import VoterEmailAddressEntry from './VoterEmailAddressEntry';
import VoterSessionActions from '../../actions/VoterSessionActions';
import VoterStore from '../../stores/VoterStore';
import VoterPhoneVerificationEntry from './VoterPhoneVerificationEntry';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';

/* global $ */

const debugMode = false;

export default class SettingsAccount extends Component {
  static propTypes = {
    inModal: PropTypes.bool,
    pleaseSignInTitle: PropTypes.string,
    pleaseSignInSubTitle: PropTypes.string,
    closeSignInModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      facebookAuthResponse: {},
      hideCurrentlySignedInHeader: false,
      hideFacebookSignInButton: false,
      hideTwitterSignInButton: false,
      hideVoterEmailAddressEntry: false,
      hideVoterPhoneEntry: false,
      inEmailCodeVerificationProcess: false,
      inTextCodeVerificationProcess: false,
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

    if (!signInModalGlobalState.getBool('isShowingSignInModal')) {
      VoterActions.voterRetrieve();
    }

    const getStartedMode = AppStore.getStartedMode();
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
    const { origin } = window.location;
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
      AppActions.storeSignInStartFullUrl();
      this.setState({
        pleaseSignInTitle: '',
        pleaseSignInSubTitle: 'Don\'t worry, we won\'t post anything automatically.',
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

  componentWillUnmount () {
    // console.log("SignIn ---- UN mount");
    this.appStoreListener.remove();
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
    this.timer = null;
  }

  onAppStoreChange () {
    this.setState({
      isOnWeVoteRootUrl: AppStore.isOnWeVoteRootUrl(),
      isOnWeVoteSubdomainUrl: AppStore.isOnWeVoteSubdomainUrl(),
      isOnFacebookSupportedDomainUrl: AppStore.isOnFacebookSupportedDomainUrl(),
    });
  }

  onVoterStoreChange () {
    const emailAddressStatus = VoterStore.getEmailAddressStatus();
    const inEmailCodeVerificationProcess = (emailAddressStatus.sign_in_code_email_sent);
    this.setState({
      inEmailCodeVerificationProcess,
      voter: VoterStore.getVoter(),
    });
  }

  onFacebookChange () {
    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
    });
  }

  localCloseSignInModal = () => {
    // console.log('SettingsAccount localCloseSignInModal');
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  toggleInTextCodeVerificationProcess = () => {
    const { inTextCodeVerificationProcess } = this.state;
    this.setState({ inTextCodeVerificationProcess: !inTextCodeVerificationProcess });
  };

  toggleInEmailCodeVerificationProcess = () => {
    const { inEmailCodeVerificationProcess } = this.state;
    if (inEmailCodeVerificationProcess) {
      // If already in the verification process, reset the emailAddressStatus dict, so that VoterStore is refreshed without email verification data
      VoterActions.clearEmailAddressStatus();
    } else {
      // If not already in the verification process, put us in the process
      this.setState({ inEmailCodeVerificationProcess: true });
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
  };

  toggleNonPhoneSignInOptions = () => {
    const { hideCurrentlySignedInHeader, hideFacebookSignInButton, hideTwitterSignInButton, hideVoterEmailAddressEntry } = this.state;
    this.setState({
      hideCurrentlySignedInHeader: !hideCurrentlySignedInHeader,
      hideFacebookSignInButton: !hideFacebookSignInButton,
      hideTwitterSignInButton: !hideTwitterSignInButton,
      hideVoterEmailAddressEntry: !hideVoterEmailAddressEntry,
    });
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

  twitterLogOutOnKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      TwitterActions.appLogout();
    }
  }

  render () {
    renderLog('SettingsAccount');  // Set LOG_RENDER_EVENTS to log all renders
    const { inModal } = this.props;
    const {
      facebookAuthResponse, hideCurrentlySignedInHeader, hideFacebookSignInButton, hideTwitterSignInButton,
      hideVoterEmailAddressEntry, hideVoterPhoneEntry, isOnWeVoteRootUrl, isOnWeVoteSubdomainUrl,
      isOnFacebookSupportedDomainUrl, pleaseSignInTitle, pleaseSignInSubTitle, voter,
    } = this.state;
    if (!voter) {
      return LoadingWheel;
    }

    const {
      is_signed_in: voterIsSignedIn, signed_in_facebook: voterIsSignedInFacebook,
      signed_in_twitter: voterIsSignedInTwitter, signed_in_with_email: voterIsSignedInWithEmail,
      twitter_screen_name: twitterScreenName,
    } = voter;
    // console.log("SettingsAccount.jsx facebookAuthResponse:", facebookAuthResponse);
    // console.log("SettingsAccount.jsx voter:", voter);
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

    if (isCordova()) {
      // The dialog fades in, so it will not be there on the initial passes through this render() function
      const dlg = $('[class*="SignInModal-dialogRoot-"]');
      if (dlg.length) {
        const collapse = hideVoterEmailAddressEntry === true;
        // console.log("cordovaSignInModalTopPosition(collapse): ", cordovaSignInModalTopPosition(collapse));
        // console.log("cordovaSignInModalTopPosition -- collapse: ", collapse);
        const topStyle = `z-index: 1300; top: ${cordovaSignInModalTopPosition(collapse)}`;
        $(dlg).attr('style', topStyle);
        if (isIOS()) {
          const container = $('.MuiDialog-container');
          if (collapse) {
            $(container).attr('style', `${$(container).attr('style')}; height: 240px; transform: translateY(2%);`);
          } else {
            $(container).attr('style', $(container).attr('style').replace('height: 240px; transform: translateY(2%);', ''));
          }
        }
      }
    }

    const fbAuthMsg = AppStore.getSignInErrorMessage();
    // console.log('In settingsAccount, facebookAuthMessage: ' + fbAuthMsg);

    return (
      <div className="">
        <Helmet title={pageTitle} />
        <BrowserPushMessage incomingProps={this.props} />
        <div className={inModal ? '' : 'card'}>
          <Main inModal={inModal}>
            {voterIsSignedInTwitter && voterIsSignedInFacebook ?
              null :
              <h1 className="h3">{!hideTwitterSignInButton && !hideFacebookSignInButton && voterIsSignedIn ? <span>{yourAccountTitle}</span> : null}</h1>
            }
            {!hideCurrentlySignedInHeader && (
              <div>
                {voterIsSignedIn ?
                  <div className="u-stack--sm">{yourAccountExplanation}</div> : (
                    <div>
                      <div className="u-f3">{pleaseSignInTitle}</div>
                      <SignInSubtitle className="u-stack--sm">{pleaseSignInSubTitle}</SignInSubtitle>
                    </div>
                  )
                }
              </div>
            )}
            {!voterIsSignedInTwitter || !voterIsSignedInFacebook ? (
              <>
                <div className="u-stack--md">
                  { !hideTwitterSignInButton && !voterIsSignedInTwitter && (isOnWeVoteRootUrl || isOnWeVoteSubdomainUrl) && (
                    <span>
                      <RecommendedText className="u-tl u-stack--sm">Recommended</RecommendedText>
                      <TwitterSignIn
                        buttonText="Sign in with Twitter"
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
                      <FacebookSignIn closeSignInModal={this.localCloseSignInModal} buttonText="Sign in with Facebook" />
                      { fbAuthMsg && fbAuthMsg.length ? <FacebookErrorContainer>{fbAuthMsg}</FacebookErrorContainer> : '' }
                    </span>
                  )
                  }
                </div>
              </>
            ) : null
            }
            {voterIsSignedIn ? (
              <div className="u-stack--md">
                {!hideCurrentlySignedInHeader && (
                  <div className="u-stack--sm">
                    <span className="h3">Currently Signed In</span>
                    <span className="u-margin-left--sm" />
                    <span className="account-edit-action" onKeyDown={this.twitterLogOutOnKeyDown.bind(this)}>
                      <span className="pull-right" onClick={VoterSessionActions.voterSignOut}>sign out</span>
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
            {!hideVoterPhoneEntry && (
              <VoterPhoneVerificationEntry
                toggleOtherSignInOptions={this.toggleNonPhoneSignInOptions}
              />
            )}
            {!hideVoterEmailAddressEntry && (
              <VoterEmailAddressEntry
                inModal={inModal}
                toggleOtherSignInOptions={this.toggleNonEmailSignInOptions}
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
      </div>
    );
  }
}

const Main = styled.div`
  margin-top: ${({ inModal }) => (inModal ? '-16px' : '0')};
  padding: 16px;
  text-align: center;
  padding-top: 0;
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

const FacebookErrorContainer  = styled.h3`
  margin-top: 8px;
  background-color: palegoldenrod;
  box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
`;
