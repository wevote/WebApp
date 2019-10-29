import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { getApplicationViewBooleans, polyfillObjectEntries, setZenDeskHelpVisibility } from './utils/applicationUtils';
import cookies from './utils/cookies';
import { getToastClass, historyPush, isCordova, isWebApp } from './utils/cordovaUtils';
import { cordovaContainerMainOverride, cordovaScrollablePaneTopPadding, cordovaVoterGuideTopPadding } from './utils/cordovaOffsets';
import ElectionActions from './actions/ElectionActions';
import FooterBar from './components/Navigation/FooterBar';
import FriendActions from './actions/FriendActions';
import Header from './components/Navigation/Header';
import AppActions from './actions/AppActions';
import AppStore from './stores/AppStore';
import { renderLog, routingLog } from './utils/logging';
import OrganizationActions from './actions/OrganizationActions';
import TwitterSignIn from './components/Twitter/TwitterSignIn';
import VoterActions from './actions/VoterActions';
import VoterStore from './stores/VoterStore';
import webAppConfig from './config';
import { stringContains } from './utils/textFormat';
import SnackNotifier from './components/Widgets/SnackNotifier';

class Application extends Component {
  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      // Do not define voter here. We rely on it being undefined
      voter_initial_retrieve_needed: true,
    };
  }

  componentDidMount () {
    const { hostname } = window.location;
    AppActions.siteConfigurationRetrieve(hostname);
    console.log('React Application ---------------   componentDidMount () hostname: ', hostname);
    polyfillObjectEntries();
    this.initializeFacebookSdkForJavascript();
    this.initializationForCordova();

    const voterDeviceId = VoterStore.voterDeviceId();
    VoterActions.voterRetrieve();

    // console.log('Application, componentDidMount, voterDeviceId:', voterDeviceId);
    if (voterDeviceId) {
      this.onVoterStoreChange();
    }

    ElectionActions.electionsRetrieve();

    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (isWebApp()) {
      // disabled for cordova June 2019, see note in https://github.com/wevote/WebApp/pull/2303
      window.addEventListener('scroll', this.handleWindowScroll);
    }
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate (prevProps, prevState, nextContent) {
    // console.log('Application componentDidUpdate');
    const { location: { pathname } } = this.props;
    const { voteMode, voterGuideMode } = getApplicationViewBooleans(pathname);

    if (!voterGuideMode && AppStore.showEditAddressButton()) {
      AppActions.setShowEditAddressButton(false);
    }

    if (!voteMode &&
      ((voterGuideMode && !AppStore.showEditAddressButton()) ||
        stringContains('/ballot', pathname.toLowerCase().slice(0, 7)))) {
      AppActions.setShowEditAddressButton(true);
    }
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.voterStoreListener.remove();
    window.removeEventListener('scroll', this.handleWindowScroll);
  }

  initializationForCordova () { // eslint-disable-line
    if (isCordova()) {
      console.log('Application initializationForCordova ------------');
      window.handleOpenURL = (url) => {
        TwitterSignIn.handleTwitterOpenURL(url);
      };
    }
  }

  initializeFacebookSdkForJavascript () { // eslint-disable-line
    if (webAppConfig.ENABLE_FACEBOOK) {
      window.fbAsyncInit = function () {  // eslint-disable-line func-names
        const { FB } = window;
        FB.init({
          appId: webAppConfig.FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v3.3',
          status: true, // set this status to true, this will fix the popup blocker issue
        });
      };

      (function (d, s, id) { // eslint-disable-line
        let js;
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }

        js = d.createElement(s);    // eslint-disable-line prefer-const
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }

  onAppStoreChange () {
    let signInStartFullUrl = cookies.getItem('sign_in_start_full_url');
    // console.log('Application onAppStoreChange, current signInStartFullUrl: ', signInStartFullUrl);
    // Do not let sign_in_start_full_url be set again. Different logic while we figure out how to call AppActions.unsetStoreSignInStartFullUrl()
    if (AppStore.storeSignInStartFullUrl() && !signInStartFullUrl) {
      const { origin, pathname } = window.location;
      // console.log('window.location:', window.location);
      const oneDayExpires = 86400;
      signInStartFullUrl = `${origin}${pathname}`;
      // console.log('Application onAppStoreChange, new origin: ', origin, ', pathname: ', pathname, ', NEW signInStartFullUrl: ', signInStartFullUrl);
      if (stringContains('facebook_sign_in', signInStartFullUrl)) {
        // console.log('Do NOT set signInStartFullUrl:', signInStartFullUrl);
      } else if (origin && stringContains('wevote.us', origin)) {
        cookies.setItem('sign_in_start_full_url', signInStartFullUrl, oneDayExpires, '/', 'wevote.us');
      } else {
        cookies.setItem('sign_in_start_full_url', signInStartFullUrl, oneDayExpires, '/');
      }
      // AppActions.unsetStoreSignInStartFullUrl(); // Throws this error: Cannot dispatch in the middle of a dispatch.
    }
  }

  onVoterStoreChange () {
    // console.log('Application, onVoterStoreChange');
    const voterDeviceId = VoterStore.voterDeviceId();
    if (voterDeviceId && voterDeviceId !== '') {
      if (this.state.voter_initial_retrieve_needed) {
        VoterActions.voterEmailAddressRetrieve();
        VoterActions.voterSMSPhoneNumberRetrieve();
        FriendActions.friendInvitationsSentToMe();
        this.incomingVariableManagement();
        this.setState({
          voter: VoterStore.getVoter(),
          voter_initial_retrieve_needed: false,
        });
      } else {
        this.setState({
          voter: VoterStore.getVoter(),
        });
      }
    }

    // console.log('Application onVoterStoreChange voter: ', VoterStore.getVoter());
    // console.log('SignedIn Voter in Application onVoterStoreChange voter: ', VoterStore.getVoter().full_name);
  }

  getAppBaseClass = () => {
    // console.log('Determine the headroom space pathname:' + pathname);
    let appBaseClass = 'app-base';
    if (isWebApp()) {
      appBaseClass += ' headroom-webapp';
    } else {
      appBaseClass += ' cordova-base';
    }
    return appBaseClass;
  };

  handleWindowScroll = (evt) => {
    const { scrollTop } = evt.target.scrollingElement;
    if (scrollTop > 60 && !AppStore.getScrolledDown()) {
      AppActions.setScrolled(true);
    }
    if (scrollTop < 60 && AppStore.getScrolledDown()) {
      AppActions.setScrolled(false);
    }
  };


  incomingVariableManagement () {
    // console.log('Application, incomingVariableManagement, this.props.location.query: ', this.props.location.query);
    if (this.props.location.query) {
      // Cookie needs to expire in One day i.e. 24*60*60 = 86400
      let atLeastOneQueryVariableFound = false;
      const oneDayExpires = 86400;
      const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
      const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off') || 0;
      if (weVoteBrandingOffFromUrl && !weVoteBrandingOffFromCookie) {
        cookies.setItem('we_vote_branding_off', weVoteBrandingOffFromUrl, oneDayExpires, '/');
      }

      if (weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie) {
        cookies.setItem('show_full_navigation', '1', Infinity, '/');
      }

      // Currently not used, but it seems like it should be
      // this.setState({ we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie });

      const { hide_intro_modal: hideIntroModal } = this.props.location.query;
      const hideIntroModalFromUrl = this.props.location.query ? hideIntroModal : 0;
      const hideIntroModalFromUrlTrue = hideIntroModalFromUrl === 1 || hideIntroModalFromUrl === '1' || hideIntroModalFromUrl === 'true';
      if (hideIntroModalFromUrl) {
        // console.log('hideIntroModalFromUrl: ', hideIntroModalFromUrl);
        atLeastOneQueryVariableFound = true;
      }

      const hideIntroModalFromCookie = cookies.getItem('hide_intro_modal');
      const hideIntroModalFromCookieTrue = hideIntroModalFromCookie === 1 || hideIntroModalFromCookie === '1' || hideIntroModalFromCookie === 'true';
      if (hideIntroModalFromUrlTrue && !hideIntroModalFromCookieTrue) {
        cookies.setItem('hide_intro_modal', hideIntroModalFromUrl, oneDayExpires, '/');
      }

      const { id: externalVoterId } = this.props.location.query;
      if (externalVoterId) {
        // console.log('externalVoterId: ', externalVoterId);
        VoterActions.setExternalVoterId(externalVoterId);
        atLeastOneQueryVariableFound = true;
      }

      let autoFollowListFromUrl = '';
      if (this.props.location.query) {
        // console.log('this.props.location.query: ', this.props.location.query);
        const {
          af, auto_follow: autoFollow,
          voter_address: voterAddress,
        } = this.props.location.query;
        if (this.props.location.query.af) {
          autoFollowListFromUrl = af;
          atLeastOneQueryVariableFound = true;
        } else if (autoFollow) {
          atLeastOneQueryVariableFound = true;
          autoFollowListFromUrl = autoFollow;
        }

        const autoFollowList = autoFollowListFromUrl ? autoFollowListFromUrl.split(',') : [];
        autoFollowList.forEach((organizationTwitterHandle) => {
          OrganizationActions.organizationFollow('', organizationTwitterHandle);
        });

        if (voterAddress) {
          // console.log('this.props.location.query.voter_address: ', this.props.location.query.voter_address);
          atLeastOneQueryVariableFound = true;
          if (voterAddress && voterAddress !== '') {
            // Do not save a blank voterAddress -- we don't want to over-ride an existing address with a blank
            VoterActions.voterAddressSave(voterAddress);
          }
        }

        if (atLeastOneQueryVariableFound && this.props.location.pathname) {
          // console.log('atLeastOneQueryVariableFound push: ', atLeastOneQueryVariableFound);
          // console.log('this.props.location.pathname: ', this.props.location.pathname);
          historyPush(this.props.location.pathname);
        }
      }
    }
  }

  render () {
    renderLog('Application');  // Set LOG_RENDER_EVENTS to log all renders
    const { location: { pathname } } = this.props;
    const { lastZenDeskVisibilityPathName } = this.state;
    const { StripeCheckout } = window;
    const waitForStripe = (String(pathname) === '/more/donate' && StripeCheckout === undefined);
    // console.log('Application render, pathname:', pathname);

    if (this.state.voter === undefined || this.props.location === undefined || waitForStripe) {
      if (waitForStripe) {
        console.log('Waiting for stripe to load, on an initial direct URL to DonationForm');
      }
      return (
        <LoadingScreen>
          <div style={{ padding: 30 }}>
            <h1 className="h1">Loading We Vote...</h1>
            { isCordova() &&
              <h2 className="h1">Does your phone have access to the internet?</h2>
            }
            <div className="u-loading-spinner u-loading-spinner--light" />
          </div>
        </LoadingScreen>
      );
    }

    routingLog(pathname);
    if (String(lastZenDeskVisibilityPathName) !== String(pathname)) {
      // console.log('lastZenDeskVisibilityPathName:', lastZenDeskVisibilityPathName, ', pathname:', pathname);
      setZenDeskHelpVisibility(pathname);
      this.setState({
        lastZenDeskVisibilityPathName: String(pathname),
      });
    }

    const { inTheaterMode, contentFullWidthMode, settingsMode, showFooterBar, voterGuideMode } = getApplicationViewBooleans(pathname);

    if (inTheaterMode) {
      // console.log('inTheaterMode', inTheaterMode);
      return (
        <div className="app-base" id="app-base-id">
          <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
            <div className="page-content-container">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 container-main">
                    { this.props.children }
                  </div>
                </div>
              </div>
            </div>
          </Wrapper>
        </div>
      );
    } else if (voterGuideMode) {
      // console.log('voterGuideMode', voterGuideMode);
      return (
        <div className={this.getAppBaseClass()} id="app-base-id">
          <ToastContainer closeButton={false} className={getToastClass()} />
          <Header params={this.props.params}
                  location={this.props.location}
                  pathname={pathname}
                  voter={this.state.voter}
                  weVoteBrandingOff={this.state.weVoteBrandingOff}
          />
          <SnackNotifier />
          <Wrapper padTop={cordovaVoterGuideTopPadding()}>
            <div className="page-content-container">
              <div className="container-voter-guide">
                { this.props.children }
              </div>
            </div>
          </Wrapper>
          {(
            <div className="footroom-wrapper">
              <FooterBar location={this.props.location} pathname={pathname} voter={this.state.voter} />
            </div>
          )
          }
        </div>
      );
    } else if (settingsMode) {
      // console.log('settingsMode', settingsMode);
      return (
        <div className={this.getAppBaseClass()} id="app-base-id">
          <ToastContainer closeButton={false} className={getToastClass()} />
          <Header params={this.props.params}
                  location={this.props.location}
                  pathname={pathname}
                  voter={this.state.voter}
                  weVoteBrandingOff={this.state.weVoteBrandingOff}
          />
          <SnackNotifier />
          <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
            <div className="page-content-container">
              <div className="container-settings">
                { this.props.children }
              </div>
            </div>
          </Wrapper>
          {showFooterBar && (
            <div className="footroom-wrapper">
              <FooterBar location={this.props.location} pathname={pathname} voter={this.state.voter} />
            </div>
          )}
        </div>
      );
    }
    // This handles other pages, like Welcome and the Ballot display
    // console.log('Application, another mode');
    return (
      <div className={this.getAppBaseClass()} id="app-base-id">
        <ToastContainer closeButton={false} className={getToastClass()} />
        <Header params={this.props.params}
                location={this.props.location}
                pathname={pathname}
                voter={this.state.voter}
                weVoteBrandingOff={this.state.weVoteBrandingOff}
        />
        <SnackNotifier />
        { String(pathname) === '/for-campaigns' ||
          String(pathname) === '/for-organizations' ||
          pathname.startsWith('/how') ||
          String(pathname) === '/more/about' ||
          String(pathname) === '/more/credits' ||
          pathname.startsWith('/more/donate') ||
          pathname.startsWith('/more/pricing') ||
          String(pathname) === '/welcome' ||
          !contentFullWidthMode ?
          (
            <div className="welcome-or-not-full-width">
              { this.props.children }
            </div>
          ) :
          (
            <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
              <div className="page-content-container">
                <div className="container-fluid">
                  <div className="container-main" style={{ paddingTop: `${cordovaContainerMainOverride()}` }}>
                    { this.props.children }
                  </div>
                </div>
              </div>
            </Wrapper>
          )}
        {showFooterBar && (
          <div className="footroom-wrapper">
            <FooterBar location={this.props.location} pathname={pathname} voter={this.state.voter} />
          </div>
        )}
      </div>
    );
  }
}

const Wrapper = styled.div`
  padding-top: ${({ padTop }) => padTop};
`;

const LoadingScreen = styled.div`
  position: 'fixed',
  height: '100vh',
  width: '100vw',
  display: 'flex',
  top: 0,
  left: 0,
  background-color: '#2E3C5D',
  justify-content: 'center',
  align-items: 'center',
  font-size: '30px',
  color: '#fff',
  flex-direction: 'column',
  @media print{
    color: '#2E3C5D';
  }
`;

export default Application;
