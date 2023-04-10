import { Facebook, Twitter } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';
import AnalyticsActions from '../../../actions/AnalyticsActions';
import FacebookActions from '../../../actions/FacebookActions';
import TwitterActions from '../../../actions/TwitterActions';
import VoterActions from '../../../actions/VoterActions';
import VoterSessionActions from '../../../actions/VoterSessionActions';
import LoadingWheel from '../Widgets/LoadingWheel';
import { isAndroid, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import historyPush from '../../utils/historyPush';
import { normalizedHref } from '../../utils/hrefUtils';
import { isWebApp } from '../../utils/isCordovaOrWebApp';
import Cookies from '../../utils/js-cookie/Cookies';
import { oAuthLog, renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FacebookStore from '../../../stores/FacebookStore';
import VoterStore from '../../../stores/VoterStore';
import initializeAppleSDK from '../../../utils/initializeAppleSDK';
import initializeFacebookSDK from '../../../utils/initializeFacebookSDK';
import AppleSignIn from '../../../components/Apple/AppleSignIn';
import FacebookSignIn from '../../../components/Facebook/FacebookSignIn';
import VoterEmailAddressEntry from '../../../components/Settings/VoterEmailAddressEntry';
import VoterPhoneVerificationEntry from '../../../components/Settings/VoterPhoneVerificationEntry';
import TwitterSignIn from '../../../components/Twitter/TwitterSignIn';
import BrowserPushMessage from '../../../components/Widgets/BrowserPushMessage';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import SnackNotifier, { openSnackbar } from '../Widgets/SnackNotifier';


/* global $ */

const debugMode = false;

export default class SignInOptionsPanel extends Component {
  constructor (props) {
    super(props);
    this.state = {
      facebookAuthResponse: {},
      hideAppleSignInButton: false,
      hideCurrentlySignedInHeader: false,
      hideDialogForCordova: false,
      hideFacebookSignInButton: false,
      hideTwitterSignInButton: false,
      hideVoterEmailAddressEntry: false,
      hideVoterPhoneEntry: false,
      isInternetExplorer: document.documentMode || false, // Yes, we are talking about that old Microsoft product
      isOnWeVoteRootUrl: true,
      isOnWeVoteSubdomainUrl: false,
      isOnFacebookSupportedDomainUrl: false,
      pleaseSignInTitleFromState: '',
      pleaseSignInSubTitle: '',
      showTwitterDisconnect: false,
      showRecommendedText: false,
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
    // console.log("SignInOptionsPanel componentDidMount");
    // initializeAppleSDK(null);
    const { FB, AppleID } = window;
    if (!FB) {
      initializeFacebookSDK();
    }
    if (!AppleID) {
      initializeAppleSDK();
    }
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    let signInStartFullUrl =  Cookies.get('sign_in_start_full_url');
    if (stringContains('/settings/account', signInStartFullUrl)) {
      Cookies.remove('sign_in_start_full_url', { path: '/' });
      Cookies.remove('sign_in_start_full_url', { path: '/', domain: 'wevote.us' });
    }
    let pathname = '';
    const isOnFacebookSupportedDomainUrl = AppObservableStore.isOnFacebookJsSdkHostDomainList(); // hostname.replace('www.', '') === 'wevote.us' || hostname === 'quality.wevote.us' || hostname === 'localhost' || hostname === 'wevotedeveloper.com' || isCordova() || window.location.href.includes('ngrok');

    const getStartedMode = AppObservableStore.getStartedMode();
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
    const { origin } = window.location;

    if (this.props.pleaseSignInTitle || this.props.pleaseSignInSubTitle || this.props.pleaseSignInTextOff) {
      this.setState({
        pleaseSignInTitleFromState: this.props.pleaseSignInTitle || '',
        pleaseSignInSubTitle: this.props.pleaseSignInSubTitle || '',
      }, () => this.localStoreSignInStartFullUrl());
    } else if (getStartedMode && getStartedMode === 'startup') {
      // js/pages/Startup
      this.setState({
        pleaseSignInTitleFromState: '',
        pleaseSignInSubTitle: '',
        showRecommendedText: false,
      });
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      // console.log('SignInOptionsPanel getStartedForCampaigns, new origin: ', origin, ', pathname: ', pathname, ', signInStartFullUrl: ', signInStartFullUrl);
      if (origin && stringContains('wevote.us', origin)) {
        Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 31, path: '/', domain: 'wevote.us' });
      }
    } else if (getStartedMode && getStartedMode === 'getStartedForCampaigns') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      // console.log('SignInOptionsPanel getStartedForCampaigns, new origin: ', origin, ', pathname: ', pathname, ', signInStartFullUrl: ', signInStartFullUrl);
      if (origin && stringContains('wevote.us', origin)) {
        Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 31, path: '/', domain: 'wevote.us' });
      } else {
        Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 31, path: '/' });
      }
      this.setState({
        pleaseSignInTitleFromState: 'Please sign in to get started.',
        pleaseSignInSubTitle: 'Use Twitter to verify your account most quickly.',
      });
    } else if (getStartedMode && getStartedMode === 'getStartedForOrganizations') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      // console.log('SignInOptionsPanel getStartedForCampaigns, new origin: ', origin, ', pathname: ', pathname, ', signInStartFullUrl: ', signInStartFullUrl);
      if (origin && stringContains('wevote.us', origin)) {
        Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 1, path: '/', domain: 'wevote.us' });
      } else {
        Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 1, path: '/' });
      }
      this.setState({
        pleaseSignInTitleFromState: 'Please sign in to get started.',
        pleaseSignInSubTitle: 'Use Twitter to verify your account most quickly.',
      });
    } else if (getStartedMode && getStartedMode === 'getStartedForVoters') {
      pathname = '/settings/profile';
      signInStartFullUrl = `${origin}${pathname}`;
      // console.log('SignInOptionsPanel getStartedForCampaigns, new origin: ', origin, ', pathname: ', pathname, ', signInStartFullUrl: ', signInStartFullUrl);
      if (origin && stringContains('wevote.us', origin)) {
        Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 1, path: '/', domain: 'wevote.us' });
      } else {
        Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 1, path: '/' });
      }
      this.setState({
        pleaseSignInTitleFromState: 'Please sign in to get started.',
        pleaseSignInSubTitle: '',
      });
    } else {
      const isOnWeVoteRootUrl = AppObservableStore.isOnWeVoteRootUrl();
      const isOnWeVoteSubdomainUrl = AppObservableStore.isOnWeVoteSubdomainUrl();
      // No need to query an api to get this answer.  Creates an unneeded dependency:  const isOnFacebookSupportedDomainUrl = AppObservableStore.isOnFacebookSupportedDomainUrl() || window.location.href.includes('ngrok');
      let pleaseSignInSubTitle = '';
      if (isOnWeVoteRootUrl || isOnWeVoteSubdomainUrl || isOnFacebookSupportedDomainUrl) {
        pleaseSignInSubTitle = '';
      }
      this.setState({
        pleaseSignInTitleFromState: '',
        pleaseSignInSubTitle,
      }, () => this.localStoreSignInStartFullUrl());
    }
    this.setState({
      isOnWeVoteRootUrl: AppObservableStore.isOnWeVoteRootUrl(),
      isOnWeVoteSubdomainUrl: AppObservableStore.isOnWeVoteSubdomainUrl(),
      isOnFacebookSupportedDomainUrl,
    });

    const delayBeforeClearingEmailStatus = 500;
    this.clearEmailTimer = setTimeout(() => {
      VoterActions.clearSecretCodeVerificationStatusAndEmail();
    }, delayBeforeClearingEmailStatus);
    const delayBeforeClearingPhoneStatus = 750;
    this.clearPhoneTimer = setTimeout(() => {
      VoterActions.clearSecretCodeVerificationStatusAndPhone();
    }, delayBeforeClearingPhoneStatus);
  }

  componentDidUpdate () {
    // NOTE October 2022:  This file has lots of commented out code, do not remove until there has been an iOS release
    // if (isCordova()) {
    //   const sendButtonSMS = $('#voterPhoneSendSMS');
    //   const sendButtonEmail = $('#voterEmailAddressEntrySendCode');
    //   const cont = $('.MuiDialog-container');
    //   const styleWorking = cont.length ? $(cont).attr('style') : '';
    //   const translate = isIPhone4in() || isIPhone4p7in() ? 'transform: translateY(10%); height: unset;' : 'transform: translateY(40%); height: unset;';
    //
    //   // The VoterPhoneEmailCordovaEntryModal dialog gets pushed out of the way when the virtual keyboard appears,
    //   // so we wait for it to be rendered, then move it into place
    //
    //   if (sendButtonSMS.length) {
    //     console.log('SignInOptionsPanel componentDidUpdate SEND CODE was rendered. sendButtonSMS:', sendButtonSMS);
    //   } else if ((sendButtonSMS.length)) {
    //     console.log('SignInOptionsPanel componentDidUpdate SEND CODE was rendered. sendButtonEmail:', sendButtonEmail);
    //   }
    //   if (sendButtonSMS.length || sendButtonSMS.length) {
    //     if (styleWorking && !stringContains(translate, styleWorking)) {
    //       $(cont).attr('style', `${styleWorking} ${translate}`);
    //       console.log(`SignInOptionsPanel componentDidUpdate was rendered. NEW style: ${$(cont).attr('style')}`);
    //     } else {
    //       console.log(`SignInOptionsPanel componentDidUpdate was rendered. transform was already there. style: ${$(cont).attr('style')}`);
    //     }
    //   }
    // }
    if (AppObservableStore.isSnackMessagePending()) openSnackbar({});
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('SignInOptionsPanel caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log("SignInOptionsPanel componentWillUnmount");
    signInModalGlobalState.set('textOrEmailSignInInProcess', false);
    this.appStateSubscription.unsubscribe();
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.timer) clearTimeout(this.timer);
    if (this.clearEmailTimer) clearTimeout(this.clearEmailTimer);
    if (this.clearPhoneTimer) clearTimeout(this.clearPhoneTimer);
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    restoreStylesAfterCordovaKeyboard('SignInOptionsPanel');
  }

  onAppObservableStoreChange () {
    const { isOnFacebookSupportedDomainUrl } = this.state;
    this.setState({
      isOnWeVoteRootUrl: AppObservableStore.isOnWeVoteRootUrl(),
      isOnWeVoteSubdomainUrl: AppObservableStore.isOnWeVoteSubdomainUrl(),
      isOnFacebookSupportedDomainUrl: AppObservableStore.isOnFacebookSupportedDomainUrl() || isOnFacebookSupportedDomainUrl,
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
    // 2022-09-28 This is only used in SignInModalOriginal, which is no longer in use
    // console.log('SignInOptionsPanel focusedOnSingleInput');
    if (this.props.focusedOnSingleInputToggle) {
      this.props.focusedOnSingleInputToggle(focusedInputName);
    }
  };

  closeSignInModalLocal = () => {
    // console.log('SignInOptionsPanel closeSignInModalLocal');
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  closeSignInModalLocalFromEmailOrPhone = () => {
    // console.log('SignInOptionsPanel closeSignInModalLocalFromEmailOrPhone');
    this.showAllSignInOptions();
    if (this.props.closeSignInModal) {
      this.props.closeSignInModal();
    }
  };

  closeVerifyModalLocal = () => {
    // console.log('SignInOptionsPanel closeVerifyModalLocal');
    this.showAllSignInOptions();
  };

  showAllSignInOptions = () => {
    // console.log('SignInOptionsPanel showAllSignInOptions');
    const {
      isInternetExplorer,
    } = this.state;
    this.setState({
      hideAppleSignInButton: isInternetExplorer || isAndroid(),
      hideFacebookSignInButton: false,
      hideTwitterSignInButton: false,
      hideVoterEmailAddressEntry: false,
      hideVoterPhoneEntry: false,
    });
    const delayBeforeScrolling = 250;
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, delayBeforeScrolling);
  };

  showEmailOnlySignIn = () => {
    // console.log('SignInOptionsPanel showEmailOnlySignIn');
    this.setState({
      hideAppleSignInButton: true,
      hideCurrentlySignedInHeader: true,
      hideVoterEmailAddressEntry: false,
      hideFacebookSignInButton: true,
      hideTwitterSignInButton: true,
      hideVoterPhoneEntry: true,
    });
    this.focusedOnSingleInputToggle('email');
    const delayBeforeScrolling = 250;
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, delayBeforeScrolling);
  };

  showPhoneOnlySignIn = () => {
    // console.log('SignInOptionsPanel showPhoneOnlySignIn');
    this.setState({
      hideAppleSignInButton: true,
      hideCurrentlySignedInHeader: true,
      hideFacebookSignInButton: true,
      hideTwitterSignInButton: true,
      hideVoterEmailAddressEntry: true,
      hideVoterPhoneEntry: false,
    });
    this.focusedOnSingleInputToggle('phone');
    const delayBeforeScrolling = 250;
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, delayBeforeScrolling);
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

  localStoreSignInStartFullUrl () {
    const { origin } = window.location;
    const pathname = normalizedHref();
    // console.log('localStoreSignInStartFullUrl, pathname:', pathname);
    const signInStartFullUrl = `${origin}${pathname}`;
    // console.log('localStoreSignInStartFullUrl, signInStartFullUrl:', signInStartFullUrl);
    // AppObservableStore.setSignInStartFullUrl();
    if (origin && stringContains('wevote.us', origin)) {
      Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 1, path: '/', domain: 'wevote.us' });
    } else {
      Cookies.set('sign_in_start_full_url', signInStartFullUrl, { expires: 1, path: '/' });
    }
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
    // console.log('SignInOptionsPanel.jsx signOut');
    VoterSessionActions.voterSignOut();
    historyPush('/ballot');
  }

  render () {
    renderLog('SignInOptionsPanel');  // Set LOG_RENDER_EVENTS to log all renders
    const { inModal, externalUniqueId, pleaseSignInTitle } = this.props;
    const {
      facebookAuthResponse, hideCurrentlySignedInHeader,
      hideAppleSignInButton, hideFacebookSignInButton, hideTwitterSignInButton,
      hideVoterEmailAddressEntry, hideVoterPhoneEntry, isOnWeVoteRootUrl, isOnWeVoteSubdomainUrl,
      isOnFacebookSupportedDomainUrl, pleaseSignInTitleFromState, pleaseSignInSubTitle, showRecommendedText, voter, hideDialogForCordova,
    } = this.state;
    if (!voter) {
      return LoadingWheel;
    }

    const {
      is_signed_in: voterIsSignedIn,
      signed_in_facebook: voterIsSignedInFacebook,
      signed_in_twitter: voterIsSignedInTwitter,
      signed_in_with_apple: voterIsSignedInWithApple,
      signed_in_with_email: voterIsSignedInWithEmail,
      twitter_screen_name: twitterScreenName,
    } = voter;
    // console.log("SignInOptionsPanel.jsx facebookAuthResponse:", facebookAuthResponse);
    // console.log('SignInOptionsPanel hide Apple:', hideAppleSignInButton, ' Facebook: ', hideFacebookSignInButton, ' Twitter: ', hideTwitterSignInButton, ' Email: ', hideVoterEmailAddressEntry, ' Phone: ', hideVoterPhoneEntry);
    // console.log("SignInOptionsPanel.jsx voter:", voter);
    if (!voterIsSignedInFacebook && facebookAuthResponse && facebookAuthResponse.length && facebookAuthResponse.facebook_retrieve_attempted) {
      // console.log('SignInOptionsPanel.jsx facebook_retrieve_attempted');
      oAuthLog('SignInOptionsPanel facebook_retrieve_attempted');
      // return <span>SignInOptionsPanel.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    }

    let yourAccountTitle = 'Security & Sign In';
    let yourAccountExplanation = '';
    if (voterIsSignedIn) {
      if (voterIsSignedInFacebook && !voterIsSignedInTwitter && (isOnWeVoteRootUrl || isOnWeVoteSubdomainUrl)) {
        yourAccountTitle = 'Have Twitter Too?';
        yourAccountExplanation = 'By adding your Twitter account to your We Vote profile, you get access to the voter guides of everyone you follow.';
      } else if (voterIsSignedInTwitter && !voterIsSignedInFacebook && isOnFacebookSupportedDomainUrl) {
        yourAccountTitle = 'Have Facebook Too?';
        yourAccountExplanation = 'By adding Facebook to your We Vote profile, it is easier for friends to find you.';
      }
    }

    // console.log('SignInOptionsPanel voterIsSignedIn', voterIsSignedIn, 'signedInTwitter', voterIsSignedInTwitter, 'signedInFacebook', voterIsSignedInFacebook,
    //   'signedInWithApple', voterIsSignedInWithApple, 'hideDialogForCordova', hideDialogForCordova, 'hideCurrentlySignedInHeader', hideCurrentlySignedInHeader,
    //   'hideTwitterSignInButton', hideTwitterSignInButton,
    //   'hideFacebookSignInButton', hideFacebookSignInButton, 'hideDialogForCordova', hideDialogForCordova,
    //   '\nisOnFacebookSupportedDomainUrl', isOnFacebookSupportedDomainUrl, 'isOnWeVoteRootUrl', isOnWeVoteRootUrl);

    return (
      <>
        <SnackNotifier />
        {!hideDialogForCordova &&
          <BrowserPushMessage incomingProps={this.props} />}
        <SignInOptionsPanelWrapper
          // className={inModal ? 'card-main full-width' : 'card'}
          style={{ display: `${hideDialogForCordova ? ' none' : 'undefined'}` }}
        >
          <Main inModal={inModal} id={`SignInOptionsMain-${externalUniqueId}`}>
            {voterIsSignedInTwitter && voterIsSignedInFacebook ?
              null :
              <h1 className="h3">{!hideTwitterSignInButton && !hideFacebookSignInButton && voterIsSignedIn ? <span>{yourAccountTitle}</span> : null}</h1>}
            {!hideCurrentlySignedInHeader && (
              <div>
                {voterIsSignedIn ?
                  <div className="u-stack--sm">{yourAccountExplanation}</div> : (
                    <>
                      <div className="u-show-mobile-bigger-than-iphone5">
                        <div className="u-f3">{pleaseSignInTitle || pleaseSignInTitleFromState}</div>
                        <SignInSubtitle className="u-stack--sm">{pleaseSignInSubTitle}</SignInSubtitle>
                      </div>
                      <div className="u-show-desktop-tablet">
                        <div className="u-f3">{pleaseSignInTitle || pleaseSignInTitleFromState}</div>
                        <SignInSubtitle className="u-stack--sm">{pleaseSignInSubTitle}</SignInSubtitle>
                      </div>
                    </>
                  )}
              </div>
            )}
            {(!voterIsSignedInTwitter || !voterIsSignedInFacebook) && !hideDialogForCordova ? (
              <>
                <div className="u-stack--md">
                  { !hideTwitterSignInButton && !voterIsSignedInTwitter && (isOnWeVoteRootUrl || isOnWeVoteSubdomainUrl) && (
                    <span>
                      {showRecommendedText &&
                        <RecommendedText className="u-tl u-stack--sm">Recommended</RecommendedText>}
                      <TwitterSignIn
                        buttonText="Sign in with Twitter"
                        buttonSubmittedText="Signing in..."
                        inModal={inModal}
                        closeSignInModal={this.closeSignInModalLocal}
                      />
                    </span>
                  )}
                </div>
                <div className="u-stack--md">
                  { !hideFacebookSignInButton && !voterIsSignedInFacebook && isOnFacebookSupportedDomainUrl && (
                    <span>
                      <FacebookSignIn
                        closeSignInModal={this.closeSignInModalLocal}
                        buttonSubmittedText="Signing in..."
                        buttonText="Sign in with Facebook"
                      />
                    </span>
                  )}
                </div>
              </>
            ) : null}
            {!hideAppleSignInButton && (
              <AppleSignIn signedIn={voterIsSignedInWithApple} closeSignInModal={this.closeSignInModalLocal} />
            )}
            {voterIsSignedIn && !hideDialogForCordova ? (
              <div className="u-stack--md">
                {!hideCurrentlySignedInHeader && (
                  <div className="u-stack--sm">
                    <span className="h3 voterIsSignedIn">Currently Signed In</span>
                    <span className="u-margin-left--sm" />
                    <span className="account-edit-action" onKeyDown={this.twitterLogOutOnKeyDown.bind(this)}>
                      <span
                        className="pull-right u-link-color u-cursor--pointer"
                        onClick={this.signOut.bind(this)}
                      >
                        sign out
                      </span>
                    </span>
                  </div>
                )}
                {!hideTwitterSignInButton && voterIsSignedInTwitter && (
                  <div>
                    <TwitterContainer className="btn btn-md btn-twitter" href="#">
                      <Twitter style={{ transform: 'translateX(-100%)' }} />
                      <span style={{ borderLeft: '1px solid rgba(0,0,0,0.2)', paddingLeft: '20px' }}>
                        @
                        {twitterScreenName}
                      </span>
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
                          id={`voterSplitIntoTwoAccounts-${externalUniqueId}`}
                          onClick={this.voterSplitIntoTwoAccounts}
                          type="submit"
                          variant="danger"
                        >
                          Are you sure you want to un-link?
                        </Button>
                        <span
                          className="u-margin-left--sm"
                          id={`toggleTwitterDisconnectClose-${externalUniqueId}`}
                          onClick={this.toggleTwitterDisconnectClose}
                        >
                          cancel
                        </span>
                      </div>
                    ) : (
                      <div style={{ paddingBottom: 8 }}>
                        <span
                          id={`toggleTwitterDisconnectOpen-${externalUniqueId}`}
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
                ) : null}
                {!hideFacebookSignInButton && voterIsSignedInFacebook && (
                <div>
                  <FacebookContainer>
                    <Facebook fontSize="large" style={{ transform: 'translateY(-3px)' }} />
                  </FacebookContainer>
                  <span className="u-margin-left--sm" />
                </div>
                )}
              </div>
            ) : null}
            <VoterPhoneVerificationEntry
              closeSignInModal={this.closeSignInModalLocalFromEmailOrPhone}
              closeVerifyModal={this.closeVerifyModalLocal}
              doNotRender={hideVoterPhoneEntry}
              // hideSignInWithPhoneForm={isCordova()}
              showAllSignInOptions={this.showAllSignInOptions}
              showPhoneOnlySignIn={this.showPhoneOnlySignIn}
            />
            {/* {isCordova() && ( */}
            {/*  <VoterPhoneEmailCordovaEntryModal */}
            {/*    doNotRender={hideVoterPhoneEntry} */}
            {/*    isPhone */}
            {/*    hideDialogForCordova={this.hideDialogForCordovaLocal} */}
            {/*  />* /}
            {/* )} */}
            {(!hideVoterPhoneEntry && !hideVoterEmailAddressEntry && isWebApp()) && (
              <OrWrapper>
                &mdash;
                or
                &mdash;
              </OrWrapper>
            )}
            <VoterEmailAddressEntry
              closeSignInModal={this.closeSignInModalLocalFromEmailOrPhone}
              closeVerifyModal={this.closeVerifyModalLocal}
              doNotRender={hideVoterEmailAddressEntry}
              // hideSignInWithEmailForm={isCordova()}
              showAllSignInOptions={this.showAllSignInOptions}
              // toggleOtherSignInOptions={this.toggleNonEmailSignInOptions}
              showEmailOnlySignIn={this.showEmailOnlySignIn}
            />
            {/* {isCordova() && ( */}
            {/*  <VoterPhoneEmailCordovaEntryModal */}
            {/*    doNotRender={hideVoterEmailAddressEntry} */}
            {/*    isPhone={false} */}
            {/*    hideDialogForCordova={this.hideDialogForCordovaLocal} */}
            {/*  /> */}
            {/* )} */}
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
        </SignInOptionsPanelWrapper>
      </>
    );
  }
}
SignInOptionsPanel.propTypes = {
  externalUniqueId: PropTypes.string,
  inModal: PropTypes.bool,
  pleaseSignInTextOff: PropTypes.bool,
  pleaseSignInTitle: PropTypes.string,
  pleaseSignInSubTitle: PropTypes.string,
  closeSignInModal: PropTypes.func,
  focusedOnSingleInputToggle: PropTypes.func,
};

const OrWrapper = styled('div')(({ theme }) => (`
  color: #999;
  margin-bottom: 30px;
  margin-top: 0;
  ${theme.breakpoints.down('sm')} {
    margin-bottom: -2px;
    margin-top: 0;
  }
`));

const Main = styled('div', {
  shouldForwardProp: (prop) => !['inModal'].includes(prop),
})(({ inModal }) => (`
  margin-top: ${inModal ? '-16px' : '0'};
  max-width: 500px;
  padding: ${inModal ? '0' : '16px'};
  text-align: center;
  padding-top: 0;
  width: 100%;
`));

const SignInOptionsPanelWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SignInSubtitle = styled('p')`
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 24px;
`;

const RecommendedText = styled('p')`
  margin: 0;
  color: #333;
  font-weight: bold;
  font-size: 16px;
`;

const TwitterContainer = styled('span')`
  color: #fff !important;
  background-color: #55acee !important;
  border-color: rgba(0,0,0,0.2);
  position: relative;
  padding-left: 44px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 225px;
`;

const FacebookContainer = styled('div')`
  background-color: #3b5998 !important;
  border-color: rgba(0,0,0,0.2);
  border-radius: 0.3rem;
  color: #fff;
  display: inline-block;
  height: 40px;
  line-height: 1.5;
  padding: 0.375rem 0.75rem;
  text-align: center;
  width: 225px;
`;
