import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ActivityTidbitDrawer from '../Activity/ActivityTidbitDrawer';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import { cordovaTopHeaderTopMargin } from '../../utils/cordovaOffsets';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
import {
  hasIPhoneNotch,
  isCordova,
  isIOS,
  isWebApp,
  isIPad,
  historyPush,
} from '../../utils/cordovaUtils';
import HeaderBackToBallot from './HeaderBackToBallot';
import HeaderBackTo from './HeaderBackTo';
import HeaderBackToVoterGuides from './HeaderBackToVoterGuides';
import HeaderBar from './HeaderBar';
import HowItWorksModal from '../CompleteYourProfile/HowItWorksModal';
import OrganizationModal from '../VoterGuide/OrganizationModal';
import SharedItemModal from '../Share/SharedItemModal';
import { stringContains } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';
import VoterPlanModal from '../Ready/VoterPlanModal';


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
      organizationModalBallotItemWeVoteId: '',
      sharedItemCode: '',
      showHowItWorksModal: false,
      showVoterPlanModal: false,
      showOrganizationModal: false,
      showSharedItemModal: false,
    };

    this.closeHowItWorksModal = this.closeHowItWorksModal.bind(this);
    this.closeVoterPlanModal = this.closeVoterPlanModal.bind(this);
    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
    this.closeSharedItemModal = this.closeSharedItemModal.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.activityTidbitWeVoteIdForDrawer !== nextState.activityTidbitWeVoteIdForDrawer) return true;
    if (this.state.organizationModalBallotItemWeVoteId !== nextState.organizationModalBallotItemWeVoteId) return true;
    if (this.props.pathname !== nextProps.pathname) return true;
    if (this.state.sharedItemCode !== nextState.sharedItemCode) return true;
    if (this.state.showActivityTidbitDrawer !== nextState.showActivityTidbitDrawer) return true;
    if (this.state.showHowItWorksModal !== nextState.showHowItWorksModal) return true;
    if (this.state.showVoterPlanModal !== nextState.showVoterPlanModal) return true;
    if (this.state.showOrganizationModal !== nextState.showOrganizationModal) return true;
    if (this.state.showSharedItemModal !== nextState.showSharedItemModal) return true;
    return this.state.windowWidth !== nextState.windowWidth;
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
  }

  onAppStoreChange () {
    // console.log('Header, onAppStoreChange');
    this.setState({
      activityTidbitWeVoteIdForDrawer: AppStore.activityTidbitWeVoteIdForDrawer(),
      organizationModalBallotItemWeVoteId: AppStore.organizationModalBallotItemWeVoteId(),
      sharedItemCode: AppStore.getSharedItemCode(),
      showActivityTidbitDrawer: AppStore.showActivityTidbitDrawer(),
      showHowItWorksModal: AppStore.showHowItWorksModal(),
      showVoterPlanModal: AppStore.showVoterPlanModal(),
      showOrganizationModal: AppStore.showOrganizationModal(),
      showSharedItemModal: AppStore.showSharedItemModal(),
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('Header caught error: ', `${error} with info: `, info);
  }

  closeActivityTidbitDrawer () {
    AppActions.setShowActivityTidbitDrawer(false);
  }

  closeHowItWorksModal () {
    AppActions.setShowHowItWorksModal(false);
  }

  closeVoterPlanModal () {
    AppActions.setShowVoterPlanModal(false);
  }

  closeOrganizationModal () {
    AppActions.setShowOrganizationModal(false);
  }

  closeSharedItemModal () {
    AppActions.setShowSharedItemModal('');
    const { pathname } = this.props;
    if (stringContains('/modal/sic/', pathname)) {
      const pathnameWithoutModalSharedItem = pathname.substring(0, pathname.indexOf('/modal/sic/'));
      historyPush(pathnameWithoutModalSharedItem);
    }
  }

  handleResize () {
    this.setState({ windowWidth: window.innerWidth });
  }

  render () {
    renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders

    const { params, location, pathname, voter, weVoteBrandingOff } = this.props;
    const {
      activityTidbitWeVoteIdForDrawer, sharedItemCode, showActivityTidbitDrawer,
      showHowItWorksModal, showVoterPlanModal, showOrganizationModal, showSharedItemModal,
    } = this.state;
    const {
      friendsMode, settingsMode, valuesMode, voterGuideCreatorMode, voterGuideMode,
      showBackToFriends, showBackToBallotHeader, showBackToSettingsDesktop,
      showBackToSettingsMobile, showBackToValues, showBackToVoterGuide, showBackToVoterGuides,
    } = getApplicationViewBooleans(pathname);
    let iPhoneSpacer = '';
    if (isCordova() && isIOS() && hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-notched-spacer" />;
    } else if (isCordova() && isIOS() && !hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-no-notch-spacer" style={{ height: `${isIPad() ? '26px' : 'undefined'}` }} />;
    }

    // console.log('organizationModalBallotItemWeVoteId: ', this.state.organizationModalBallotItemWeVoteId);

    let pageHeaderStyle = weVoteBrandingOff ? 'page-header__container_branding_off headroom' : 'page-header__container headroom';
    if (isIPad()) {
      pageHeaderStyle = pageHeaderStyle.replace('page-header__container', 'page-header__container_ipad');
    }
    // console.log(`Header href: ${window.location.href}  cordovaStyle: `, cordovaTopHeaderTopMargin());


    if (voterGuideMode || voterGuideCreatorMode) {
      // console.log('Header in voterGuideMode, showBackToVoterGuide:', showBackToVoterGuide);
      let headroomWrapper = '';
      if (isWebApp) {
        if (voterGuideCreatorMode) {
          headroomWrapper = 'headroom-wrapper-webapp__voter-guide-creator';
        } else {
          headroomWrapper = 'headroom-wrapper-webapp__voter-guide';
        }
      }
      let headerBarObject;
      if (showBackToVoterGuide) {
        const backToVoterGuideLinkDesktop = pathname.substring(0, pathname.indexOf('/m/')); // Remove the "/m/followers", "/m/following", or "/m/friends" from the end of the string
        // console.log('pathname:', pathname, ', backToVoterGuideLinkDesktop:', backToVoterGuideLinkDesktop);
        headerBarObject = <HeaderBackTo backToLink={backToVoterGuideLinkDesktop} backToLinkText="Back" location={location} params={params} />;
      } else if (showBackToBallotHeader) {
        headerBarObject = <HeaderBackToBallot location={location} params={params} pathname={pathname} voter={voter} />;
      } else if (showBackToVoterGuides) {
        headerBarObject = <HeaderBackToVoterGuides location={location} params={params} pathname={pathname} voter={voter} />;
      } else {
        headerBarObject = <HeaderBar location={location} pathname={pathname} voter={voter} />;
      }
      return (
        <div id="app-header">
          {iPhoneSpacer}
          <div className={headroomWrapper}>
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              {headerBarObject}
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              pathname={pathname}
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showVoterPlanModal && (
            <VoterPlanModal
              pathname={pathname}
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
              pathname={pathname}
              sharedItemCode={sharedItemCode}
              show={showSharedItemModal}
              closeSharedItemModal={this.closeSharedItemModal}
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
          {showVoterPlanModal && (
            <VoterPlanModal
              pathname={pathname}
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
              pathname={pathname}
              sharedItemCode={sharedItemCode}
              show={showSharedItemModal}
              closeSharedItemModal={this.closeSharedItemModal}
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
          {showVoterPlanModal && (
            <VoterPlanModal
              pathname={pathname}
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
              pathname={pathname}
              sharedItemCode={sharedItemCode}
              show={showSharedItemModal}
              closeSharedItemModal={this.closeSharedItemModal}
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
          {showVoterPlanModal && (
            <VoterPlanModal
              pathname={pathname}
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
              pathname={pathname}
              sharedItemCode={sharedItemCode}
              show={showSharedItemModal}
              closeSharedItemModal={this.closeSharedItemModal}
            />
          )}
        </div>
      );
    } else if (
      typeof pathname !== 'undefined' && pathname &&
      (pathname === '/for-campaigns' ||
      pathname === '/for-organizations' ||
      pathname.startsWith('/how')||
      pathname === '/more/about' ||
      pathname === '/more/credits' ||
      pathname.startsWith('/more/donate')||
      pathname.startsWith('/more/pricing')||
      pathname === '/welcome')) {
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
          {showActivityTidbitDrawer && (
            <ActivityTidbitDrawer
              activityTidbitWeVoteId={activityTidbitWeVoteIdForDrawer}
              show={showActivityTidbitDrawer}
              modalOpen={showActivityTidbitDrawer}
              toggleFunction={this.closeActivityTidbitDrawer}
            />
          )}
          {showHowItWorksModal && (
            <HowItWorksModal
              pathname={pathname}
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showVoterPlanModal && (
            <VoterPlanModal
              pathname={pathname}
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              pathname={pathname}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
              pathname={pathname}
              sharedItemCode={sharedItemCode}
              show={showSharedItemModal}
              closeSharedItemModal={this.closeSharedItemModal}
            />
          )}
        </div>
      );
    }
  }
}
