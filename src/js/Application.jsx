import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { getApplicationViewBooleans, polyfillObjectEntries, setZenDeskHelpVisibility } from './utils/applicationUtils';
import cookies from './utils/cookies';
import {
  getAppBaseClass, getToastClass, historyPush, isCordova,
} from './utils/cordovaUtils';
import ElectionActions from './actions/ElectionActions';
// import FooterBarCordova from "./components/Navigation/FooterBarCordova";
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
    this.loadedHeader = false;
  }

  componentDidMount () {
    // console.log("React Application ---------------   componentDidMount ()");
    polyfillObjectEntries();
    this.initFacebook();
    this.initCordova();

    const voterDeviceId = VoterStore.voterDeviceId();
    VoterActions.voterRetrieve();

    // console.log("Application, componentDidMount, voterDeviceId:", voterDeviceId);
    if (voterDeviceId) {
      this.onVoterStoreChange();
    }

    ElectionActions.electionsRetrieve();

    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    window.addEventListener('scroll', this.handleWindowScroll);
  }

  componentDidUpdate () {
    const { location: { pathname } } = this.props;
    const { voterGuideMode } = getApplicationViewBooleans(pathname);

    if (!voterGuideMode && AppStore.showEditAddressButton()) {
      AppActions.setShowEditAddressButton(false);
    }

    if ((voterGuideMode && !AppStore.showEditAddressButton()) || stringContains('/ballot', pathname.slice(0, 7))) {
      AppActions.setShowEditAddressButton(true);
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.loadedHeader = false;
    window.removeEventListener('scroll', this.handleWindowScroll);
  }

  initCordova () { // eslint-disable-line
    if (isCordova()) {
      console.log(`Application initCordova ------------ ${__filename}`);
      window.handleOpenURL = (url) => {
        TwitterSignIn.handleTwitterOpenURL(url);
      };
    }
  }

  initFacebook () { // eslint-disable-line
    if (webAppConfig.ENABLE_FACEBOOK) {
      window.fbAsyncInit = function () {  // eslint-disable-line func-names
        window.FB.init({
          appId: webAppConfig.FACEBOOK_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v3.2',
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

  onVoterStoreChange () {
    // console.log("Application, onVoterStoreChange");
    const voterDeviceId = VoterStore.voterDeviceId();
    if (voterDeviceId && voterDeviceId !== '') {
      if (this.state.voter_initial_retrieve_needed) {
        VoterActions.voterEmailAddressRetrieve();
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

    // console.log("Application onVoterStoreChange voter: ", VoterStore.getVoter());
    // console.log("SignedIn Voter in Application onVoterStoreChange voter: ", VoterStore.getVoter().full_name);
  }

  handleWindowScroll = (evt) => {
    const { scrollTop } = evt.target.scrollingElement;
    if (scrollTop > 60 && !AppStore.getScrolledDown()) {
      AppActions.setScrolled(true);
    }
    if (scrollTop < 60 && AppStore.getScrolledDown()) {
      AppActions.setScrolled(false);
    }
  }

  incomingVariableManagement () {
    // console.log("Application, incomingVariableManagement, this.props.location.query: ", this.props.location.query);
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

      const hideIntroModalFromUrl = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
      const hideIntroModalFromUrlTrue = hideIntroModalFromUrl === 1 || hideIntroModalFromUrl === '1' || hideIntroModalFromUrl === 'true';
      if (hideIntroModalFromUrl) {
        // console.log("hideIntroModalFromUrl: ", hideIntroModalFromUrl);
        atLeastOneQueryVariableFound = true;
      }

      const hideIntroModalFromCookie = cookies.getItem('hide_intro_modal');
      const hideIntroModalFromCookieTrue = hideIntroModalFromCookie === 1 || hideIntroModalFromCookie === '1' || hideIntroModalFromCookie === 'true';
      if (hideIntroModalFromUrlTrue && !hideIntroModalFromCookieTrue) {
        cookies.setItem('hide_intro_modal', hideIntroModalFromUrl, oneDayExpires, '/');
      }

      let autoFollowListFromUrl = '';
      if (this.props.location.query) {
        // console.log("this.props.location.query: ", this.props.location.query);
        if (this.props.location.query.af) {
          autoFollowListFromUrl = this.props.location.query.af;
          atLeastOneQueryVariableFound = true;
        } else if (this.props.location.query.auto_follow) {
          atLeastOneQueryVariableFound = true;
          autoFollowListFromUrl = this.props.location.query.auto_follow;
        }

        const autoFollowList = autoFollowListFromUrl ? autoFollowListFromUrl.split(',') : [];
        autoFollowList.forEach((organizationTwitterHandle) => {
          OrganizationActions.organizationFollow('', organizationTwitterHandle);
        });

        if (this.props.location.query.voter_address) {
          // console.log("this.props.location.query.voter_address: ", this.props.location.query.voter_address);
          atLeastOneQueryVariableFound = true;
          const voterAddress = this.props.location.query.voter_address;
          if (voterAddress && voterAddress !== '') {
            // Do not save a blank voterAddress -- we don't want to over-ride an existing address with a blank
            VoterActions.voterAddressSave(voterAddress);
          }
        }

        if (atLeastOneQueryVariableFound && this.props.location.pathname) {
          // console.log("atLeastOneQueryVariableFound push: ", AtLeastOneQueryVariableFound);
          // console.log("this.props.location.pathname: ", this.props.location.pathname);
          historyPush(this.props.location.pathname);
        }
      }
    }
  }

  render () {
    renderLog(__filename);
    const { location: { pathname } } = this.props;

    if (this.state.voter === undefined || this.props.location === undefined) {
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
    setZenDeskHelpVisibility(pathname);

    const { inTheaterMode, contentFullWidthMode, settingsMode, voterGuideMode } = getApplicationViewBooleans(pathname);

    if (inTheaterMode) {
      // console.log("inTheaterMode", inTheaterMode);
      return (
        <div className="app-base" id="app-base-id">
          <Wrapper padTop={isCordova() ? '85px' : '0'}>
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
      // console.log("voterGuideMode", voterGuideMode);
      return (
        <div className={getAppBaseClass(pathname)} id="app-base-id">
          <ToastContainer closeButton={false} className={getToastClass()} />
          <Header params={this.props.params}
                  location={this.props.location}
                  pathname={pathname}
                  voter={this.state.voter}
                  weVoteBrandingOff={this.state.weVoteBrandingOff}
          />
          <Wrapper padTop={isCordova() ? '55px' : '0'}>
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
      // console.log("settingsMode", settingsMode);
      return (
        <div className={getAppBaseClass(pathname)} id="app-base-id">
          <ToastContainer closeButton={false} className={getToastClass()} />
          <Header params={this.props.params}
                  location={this.props.location}
                  pathname={pathname}
                  voter={this.state.voter}
                  weVoteBrandingOff={this.state.weVoteBrandingOff}
          />
          <Wrapper padTop={isCordova() ? '60px' : '0'}>
            <div className="page-content-container">
              <div className="container-settings">
                { this.props.children }
              </div>
            </div>
          </Wrapper>
          {(
            <div className="footroom-wrapper">
              <FooterBar location={this.props.location} pathname={pathname} voter={this.state.voter} />
            </div>
          )}
        </div>
      );
    }
    // This handles other pages, like Welcome and the Ballot display
    return (
      <div className={getAppBaseClass(pathname)} id="app-base-id">
        <ToastContainer closeButton={false} className={getToastClass()} />
        <Header params={this.props.params}
                location={this.props.location}
                pathname={pathname}
                voter={this.state.voter}
                weVoteBrandingOff={this.state.weVoteBrandingOff}
        />
        { pathname === '/welcome' || !contentFullWidthMode ?
          (
            <div className="welcome-or-not-full-width">
              { this.props.children }
            </div>
          ) :
          (
            <Wrapper padTop={isCordova() ? '85px' : '0'}>
              <div className="page-content-container">
                <div className="container-fluid">
                  <div className="container-main">
                    { this.props.children }
                  </div>
                </div>
              </div>
            </Wrapper>
          )}
        {/* Do not show the FooterBar if any of these pathname patterns are found */}
        { !(pathname && pathname.startsWith('/candidate')) &&
          !(pathname && pathname.startsWith('/friends/')) &&
          !(pathname && pathname.startsWith('/measure')) &&
          !(pathname && pathname.startsWith('/office')) &&
          !(pathname && pathname.startsWith('/value/')) &&
          !(pathname && pathname.startsWith('/values/')) &&
          !(pathname === '/welcome') && (
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
`;

export default Application;
