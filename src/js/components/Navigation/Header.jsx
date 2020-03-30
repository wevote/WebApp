import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
import { cordovaTopHeaderTopMargin } from '../../utils/cordovaOffsets';
import { hasIPhoneNotch, isCordova, isIOS, isWebApp, isIPad } from '../../utils/cordovaUtils';
import HeaderBackToBallot from './HeaderBackToBallot';
import HeaderBackTo from './HeaderBackTo';
import HeaderBackToVoterGuides from './HeaderBackToVoterGuides';
import HeaderBar from './HeaderBar';
import HowItWorksModal from '../CompleteYourProfile/HowItWorksModal';
import { stringContains } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import OrganizationModal from '../VoterGuide/OrganizationModal';


export default class Header extends Component {
  static propTypes = {
    params: PropTypes.object,
    location: PropTypes.object,
    pathname: PropTypes.string,
    voter: PropTypes.object,
    weVoteBrandingOff: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      showHowItWorksModal: false,
      showOrganizationModal: false,
      organizationModalId: '',
    };

    this.closeHowItWorksModal = this.closeHowItWorksModal.bind(this);
    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.props.pathname !== nextProps.pathname) return true;
    if (this.state.windowWidth !== nextState.windowWidth) return true;
    if (this.state.showHowItWorksModal !== nextState.showHowItWorksModal) {
      return true;
    }
    if (this.state.showOrganizationModal !== nextState.showOrganizationModal) {
      return true;
    }
    if (this.state.organizationModalId !== nextState.organizationModalId) {
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    // console.log('Header, onAppStoreChange');
    this.setState({
      showHowItWorksModal: AppStore.showHowItWorksModal(),
      showOrganizationModal: AppStore.showOrganizationModal(),
      organizationModalId: AppStore.organizationModalId(),
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('Header caught error: ', `${error} with info: `, info);
  }

  closeHowItWorksModal () {
    AppActions.setShowHowItWorksModal(false);
  }

  closeOrganizationModal () {
    AppActions.setShowOrganizationModal(false);
  }

  handleResize () {
    this.setState({ windowWidth: window.innerWidth });
  }

  render () {
    renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders

    const { params, location, pathname, voter, weVoteBrandingOff } = this.props;
    const { showHowItWorksModal, showOrganizationModal } = this.state;
    const { friendsMode, settingsMode, valuesMode, voterGuideCreatorMode, voterGuideMode,
      showBackToFriends, showBackToBallotHeader, showBackToSettingsDesktop,
      showBackToSettingsMobile, showBackToValues, showBackToVoterGuides } = getApplicationViewBooleans(pathname);
    let iPhoneSpacer = '';
    if (isCordova() && isIOS() && hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-notched-spacer" />;
    } else if (isCordova() && isIOS() && !hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-no-notch-spacer" style={{ height: `${isIPad() ? '0px' : 'undefined'}` }} />;
    }

    console.log("organizationModalId: ", this.state.organizationModalId);

    const pageHeaderStyle = weVoteBrandingOff ? 'page-header__container_branding_off headroom' : 'page-header__container headroom';
    // console.log(`Header href: ${window.location.href}  cordovaStyle: `, cordovaTopHeaderTopMargin());


    if (voterGuideMode || voterGuideCreatorMode) {
      // console.log('Header in voterGuideMode');
      let headroomWrapper = '';
      if (isWebApp) {
        if (voterGuideCreatorMode) {
          headroomWrapper = 'headroom-wrapper-webapp__voter-guide-creator';
        } else {
          headroomWrapper = 'headroom-wrapper-webapp__voter-guide';
        }
      }
      // console.log('Header, voterGuideMode:');
      return (
        <div id="app-header">
          {iPhoneSpacer}
          <div className={headroomWrapper}>
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              {showBackToBallotHeader ?
                <HeaderBackToBallot location={location} params={params} pathname={pathname} voter={voter} /> : (
                  <span>
                    {showBackToVoterGuides ?
                      <HeaderBackToVoterGuides location={location} params={params} pathname={pathname} voter={voter} /> :
                      <HeaderBar location={location} pathname={pathname} voter={voter} />
                    }
                  </span>
                )
              }
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              pathname={pathname}
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              candidate_we_vote_id={this.state.organizationModalId}
  open={showOrganizationModal}
              // step={shareModalStep}
              toggleFunction={this.closeOrganizationModal}
            />
          )}
        </div>
      );
    } else if (settingsMode) {
      // console.log('Header in settingsMode, showBackToSettingsDesktop:', showBackToSettingsDesktop, ', showBackToSettingsMobile:', showBackToSettingsMobile);
      const backToSettingsLinkDesktop = '/settings/profile';
      const backToSettingsLinkMobile = '/settings/hamburger';
      const backToSettingsLinkText = 'Settings';
      const classNameHeadroom = showBackToVoterGuides ? 'headroom-wrapper-webapp__voter-guide' : 'headroom-wrapper-webapp__default';

      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp() ? classNameHeadroom : ''} id="headroom-wrapper">
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToSettingsDesktop && (
                <span>
                  <span className="u-show-desktop-tablet">
                    <HeaderBackTo backToLink={backToSettingsLinkDesktop} backToLinkText={backToSettingsLinkText} location={location} params={params} />
                  </span>
                  { !showBackToVoterGuides && !showBackToSettingsMobile && (
                    <span className="u-show-mobile">
                      <HeaderBar location={location} pathname={pathname} voter={voter} />
                    </span>
                  )}
                </span>
              )}
              { showBackToSettingsMobile && (
                <span>
                  <span className={isWebApp() ? 'u-show-mobile' : ''}>
                    <HeaderBackTo backToLink={backToSettingsLinkMobile} backToLinkText={backToSettingsLinkText} location={location} params={params} />
                  </span>
                  { isWebApp() && !showBackToVoterGuides && !showBackToSettingsDesktop && (
                    <span className="u-show-desktop-tablet">
                      <HeaderBar location={location} pathname={pathname} voter={voter} />
                    </span>
                  )}
                </span>
              )}
              { showBackToVoterGuides &&
                <HeaderBackToVoterGuides location={location} params={params} pathname={pathname} voter={voter} />
              }
              { !showBackToVoterGuides && !showBackToSettingsDesktop && !showBackToSettingsMobile &&
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              pathname={pathname}
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showOrganizationModal && (
          <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              candidate_we_vote_id={this.state.organizationModalId}
  open={showOrganizationModal}
              // step={shareModalStep}
              toggleFunction={this.closeOrganizationModal}
          />
          )}
        </div>
      );
    } else if (valuesMode) {
      let backToValuesLink = '/values';
      if (stringContains('/value/', pathname)) {
        backToValuesLink = '/values/list';
      } else if (stringContains('/values/list', pathname)) {
        backToValuesLink = '/values';
      }
      const backToValuesLinkText = 'Back';

      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp ? 'headroom-wrapper-webapp__default' : ''} id="headroom-wrapper">
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToValues ?
                <HeaderBackTo backToLink={backToValuesLink} backToLinkText={backToValuesLinkText} location={location} params={params} /> :
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              pathname={pathname}
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showOrganizationModal && (
          <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              candidate_we_vote_id={this.state.organizationModalId}
  open={showOrganizationModal}
              // step={shareModalStep}
              toggleFunction={this.closeOrganizationModal}
          />
          )}
        </div>
      );
    } else if (friendsMode && this.state.windowWidth >= 769) {
      const backToFriendsLink = '/friends';
      const backToFriendsLinkText = 'Back';

      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp ? 'headroom-wrapper-webapp__default' : ''} id="headroom-wrapper">
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToFriends ?
                <HeaderBackTo backToLink={backToFriendsLink} backToLinkText={backToFriendsLinkText} location={location} params={params} /> :
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              pathname={pathname}
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showOrganizationModal && (
          <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              candidate_we_vote_id={this.state.organizationModalId}
  open={showOrganizationModal}
              // step={shareModalStep}
              toggleFunction={this.closeOrganizationModal}
          />
          )}
        </div>
      );
    } else if (pathname === '/for-campaigns' ||
               pathname === '/for-organizations' ||
               pathname.startsWith('/how') ||
               pathname === '/more/about' ||
               pathname === '/more/credits' ||
               pathname.startsWith('/more/donate') ||
               pathname.startsWith('/more/pricing') ||
               pathname === '/welcome') {
      return null;
    } else {
      // console.log('Header not in any mode');
      let classNameHeadroom = '';  // Value for isCordova is ''
      if (isWebApp()) {
        if (stringContains('/ballot', pathname.toLowerCase())) {
          classNameHeadroom = 'headroom-wrapper-webapp__ballot';
        } else if (stringContains('/office', pathname.toLowerCase())) {
          classNameHeadroom = 'headroom-wrapper-webapp__office';
        } else if (displayFriendsTabs()) {
          classNameHeadroom = 'headroom-wrapper-webapp__ballot';
        } else {
          classNameHeadroom = 'headroom-wrapper-webapp__default';
        }
      }
      // This handles other pages, like the Ballot display
      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={classNameHeadroom}
            id="headroom-wrapper"
          >
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToBallotHeader ?
                <HeaderBackToBallot location={location} params={params} pathname={pathname} voter={voter} /> :
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              pathname={pathname}
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showOrganizationModal && (
          <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              candidate_we_vote_id={this.state.organizationModalId}
  open={showOrganizationModal}
              // step={shareModalStep}
              toggleFunction={this.closeOrganizationModal}
          />
          )}
        </div>
      );
    }
  }
}
