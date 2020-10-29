import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { polyfillFixes } from './utils/applicationUtils';
import { getToastClass, isCordova, isWebApp } from './utils/cordovaUtils';
// import { cordovaContainerMainOverride, cordovaScrollablePaneTopPadding } from './utils/cordovaOffsets';
// import FooterBar from './components/Navigation/FooterBar';
// import Header from './components/Navigation/Header';
import { renderLog } from './utils/logging';
// import ShareButtonFooter from './components/Share/ShareButtonFooter';
import SnackNotifier from './components/Widgets/SnackNotifier';

class ApplicationForReady extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // Do not define voter here. We rely on it being undefined
      // voter_initial_retrieve_needed: true,
    };
  }

  componentDidMount () {
    let { hostname } = window.location;
    hostname = hostname || '';
    // AppActions.siteConfigurationRetrieve(hostname);
    console.log('ApplicationForReady ---------------   componentDidMount () hostname: ', hostname);
    polyfillFixes();
    // this.initializeFacebookSdkForJavascript();
    // if (isCordova()) {
    //   initializationForCordova();
    // }

    // const voterDeviceId = VoterStore.voterDeviceId();
    // VoterActions.voterRetrieve();
    //
    // // console.log('Application, componentDidMount, voterDeviceId:', voterDeviceId);
    // if (voterDeviceId) {
    //   this.onVoterStoreChange();
    // }
    //
    // ElectionActions.electionsRetrieve();
    //
    // this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    // this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // window.addEventListener('scroll', this.handleWindowScroll);
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('Application caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // this.appStoreListener.remove();
    // this.voterStoreListener.remove();
    // window.removeEventListener('scroll', this.handleWindowScroll);
    // if (isCordova()) {
    //   removeCordovaSpecificListeners();
    // }
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

  render () {
    renderLog('ApplicationForReady');  // Set LOG_RENDER_EVENTS to log all renders
    // const { location: { pathname } } = this.props;
    // console.log('ApplicationForReady render, pathname:', pathname);

    if (this.props.location === undefined) {
      return (
        <LoadingScreen>
          <div
            style={
              {
                alignItems: 'center',
                backgroundColor: '#fff',
                color: '#0d5470',
                display: 'flex',
                flexDirection: 'column',
                fontSize: 14,
                height: '100vh',
                width: '100vw',
                justifyContent: 'center',
                left: 0,
                marginLeft: '15px',
                marginRight: '15px',
                position: 'fixed',
                top: 0,
              }
            }
          >
            <h1 className="h1">More election data loading...</h1>
            { isCordova() &&
              <h2 className="h1">Does your phone have access to the internet?</h2>}
            <div className="u-loading-spinner u-loading-spinner--light" />
          </div>
        </LoadingScreen>
      );
    }

    // routingLog(pathname);

    // const {
    //   inTheaterMode, contentFullWidthMode, extensionPageMode, settingsMode, sharedItemLandingPage,
    //   showFooterBar, showShareButtonFooter, twitterSignInMode, voterGuideCreatorMode,
    //   voterGuideMode,
    // } = getApplicationViewBooleans(pathname);
    // const contentFullWidthMode = true;
    // const readyMode = true;
    // const showFooterBar = true;
    // const showShareButtonFooter = false;
    // console.log('showShareButtonFooter:', showShareButtonFooter);
    // const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

    // This handles other pages, like Welcome and the Ballot display
    // console.log('ApplicationForReady, another mode');
    return (
      <div className={this.getAppBaseClass()} id="app-base-id">
        <ToastContainer closeButton={false} className={getToastClass()} />
        {/* <Header */}
        {/*  params={this.props.params} */}
        {/*  location={this.props.location} */}
        {/*  pathname={pathname} */}
        {/*  voter={this.state.voter} */}
        {/*  weVoteBrandingOff={this.state.weVoteBrandingOff} */}
        {/* /> */}
        <SnackNotifier />
        {/*  padTop={cordovaScrollablePaneTopPadding()} */}
        <Wrapper>
          <div className="page-content-container">
            <div className="container-fluid">
              {/* style={{ paddingTop: `${cordovaContainerMainOverride()}` }} */}
              <div className="container-main">
                { this.props.children }
              </div>
            </div>
          </div>
        </Wrapper>
        {/* {showFooterBar && ( */}
        {/*  <div className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}> */}
        {/*    <FooterBar location={this.props.location} pathname={pathname} voter={this.state.voter} /> */}
        {/*  </div> */}
        {/* )} */}
        {/* {showShareButtonFooter && ( */}
        {/*  <ShareButtonFooter pathname={pathname} /> */}
        {/* )} */}
      </div>
    );
  }
}
ApplicationForReady.propTypes = {
  children: PropTypes.element,
  location: PropTypes.object,
  // params: PropTypes.object,
};

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

export default ApplicationForReady;
