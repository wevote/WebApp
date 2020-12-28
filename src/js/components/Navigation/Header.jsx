import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import VoterStore from '../../stores/VoterStore';
import { dumpCssFromId } from '../../utils/appleSiliconUtils';
import { getApplicationViewBooleans, weVoteBrandingOff } from '../../utils/applicationUtils';
import { cordovaTopHeaderTopMargin } from '../../utils/cordovaOffsets';
import { hasIPhoneNotch, historyPushV5, isCordova, isIOS, isIOSAppOnMac, isIPad, isWebApp } from '../../utils/cordovaUtils';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import { renderLog } from '../../utils/logging';
import { startsWith, stringContains } from '../../utils/textFormat';
import ActivityTidbitDrawer from '../Activity/ActivityTidbitDrawer';
import HowItWorksModal from '../CompleteYourProfile/HowItWorksModal';
import VoterPlanModal from '../Ready/VoterPlanModal';
import SharedItemModal from '../Share/SharedItemModal';
import OrganizationModal from '../VoterGuide/OrganizationModal';
import HeaderBackTo from './HeaderBackTo';
import HeaderBackToBallot from './HeaderBackToBallot';
import HeaderBackToVoterGuides from './HeaderBackToVoterGuides';
import HeaderBar from './HeaderBar';

const appleSiliconDebug = false;

export default class Header extends Component {
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
    if (isIOSAppOnMac() && appleSiliconDebug) {
      dumpCssFromId('header-container');
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { location: { pathname } } = window;
    if (this.state.activityTidbitWeVoteIdForDrawer !== nextState.activityTidbitWeVoteIdForDrawer) return true;
    if (this.state.organizationModalBallotItemWeVoteId !== nextState.organizationModalBallotItemWeVoteId) return true;
    if (pathname !== nextProps.pathname) return true;
    if (this.state.sharedItemCode !== nextState.sharedItemCode) return true;
    if (this.state.showActivityTidbitDrawer !== nextState.showActivityTidbitDrawer) return true;
    if (this.state.showHowItWorksModal !== nextState.showHowItWorksModal) return true;
    if (this.state.showVoterPlanModal !== nextState.showVoterPlanModal) return true;
    if (this.state.showOrganizationModal !== nextState.showOrganizationModal) return true;
    if (this.state.showSharedItemModal !== nextState.showSharedItemModal) return true;
    return this.state.windowWidth !== nextState.windowWidth;
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('Header caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize () {
    this.setState({ windowWidth: window.innerWidth });
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
    const { location: { pathname } } = window;
    if (stringContains('/modal/sic/', pathname)) {
      const pathnameWithoutModalSharedItem = pathname.substring(0, pathname.indexOf('/modal/sic/'));
      const { history } = this.props;
      historyPushV5(history, pathnameWithoutModalSharedItem);
    }
  }

  render () {
    renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders

    const { params } = this.props;
    const { location: { pathname } } = window;
    const {
      activityTidbitWeVoteIdForDrawer, sharedItemCode, showActivityTidbitDrawer,
      showHowItWorksModal, showVoterPlanModal, showOrganizationModal, showSharedItemModal,
    } = this.state;
    const {
      friendsMode, settingsMode, valuesMode, voterGuideCreatorMode, voterGuideMode,
      showBackToFriends, showBackToBallotHeader, showBackToSettingsDesktop,
      showBackToSettingsMobile, showBackToValues, showBackToVoterGuide, showBackToVoterGuides,
    } = getApplicationViewBooleans(pathname);
    const voter = VoterStore.getVoter();
    let iPhoneSpacer = '';
    if (isCordova() && isIOS() && hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-notched-spacer" />;
    } else if (isCordova() && isIOS() && !hasIPhoneNotch() && !isIOSAppOnMac()) {
      iPhoneSpacer = <div className="ios-no-notch-spacer" style={{ height: `${isIPad() ? '26px' : 'undefined'}` }} />;
    }

    // console.log('organizationModalBallotItemWeVoteId: ', this.state.organizationModalBallotItemWeVoteId);

    let pageHeaderClasses = weVoteBrandingOff() ? 'page-header__container_branding_off headroom' : 'page-header__container headroom';
    if (isIPad() && !isIOSAppOnMac()) {
      pageHeaderClasses = pageHeaderClasses.replace('page-header__container', 'page-header__container_ipad');
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
        headerBarObject = <HeaderBackTo backToLink={backToVoterGuideLinkDesktop} backToLinkText="Back" />;
      } else if (showBackToBallotHeader) {
        headerBarObject = <HeaderBackToBallot params={params} />;
      } else if (showBackToVoterGuides) {
        headerBarObject = <HeaderBackToVoterGuides params={params} />;
      } else {
        headerBarObject = <HeaderBar />;
      }
      return (
        <div id="app-header">
          {iPhoneSpacer}
          <div className={headroomWrapper}>
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              {headerBarObject}
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showVoterPlanModal && (
            <VoterPlanModal
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
              params={params}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
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
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToSettingsDesktop && (
                <span>
                  <span className="u-show-desktop-tablet">
                    <HeaderBackTo backToLink={backToSettingsLinkDesktop} backToLinkText={backToSettingsLinkText} />
                  </span>
                  { !showBackToVoterGuides && !showBackToSettingsMobile && (
                    <span className="u-show-mobile">
                      <HeaderBar />
                    </span>
                  )}
                </span>
              )}
              { showBackToSettingsMobile && (
                <span>
                  <span className={isWebApp() ? 'u-show-mobile' : ''}>
                    <HeaderBackTo backToLink={backToSettingsLinkMobile} backToLinkText={backToSettingsLinkText} />
                  </span>
                  { isWebApp() && !showBackToVoterGuides && !showBackToSettingsDesktop && (
                    <span className="u-show-desktop-tablet">
                      <HeaderBar />
                    </span>
                  )}
                </span>
              )}
              { showBackToVoterGuides &&
                <HeaderBackToVoterGuides params={params} />}
              { !showBackToVoterGuides && !showBackToSettingsDesktop && !showBackToSettingsMobile &&
                <HeaderBar />}
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showVoterPlanModal && (
            <VoterPlanModal
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
              params={params}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
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
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToValues ?
                <HeaderBackTo backToLink={backToValuesLink} backToLinkText={backToValuesLinkText} /> :
                <HeaderBar />}
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showVoterPlanModal && (
            <VoterPlanModal
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
              params={params}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
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
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToFriends ?
                <HeaderBackTo backToLink={backToFriendsLink} backToLinkText={backToFriendsLinkText} /> :
                <HeaderBar />}
            </div>
          </div>
          {showHowItWorksModal && (
            <HowItWorksModal
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showVoterPlanModal && (
            <VoterPlanModal
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
              params={params}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
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
      startsWith('/how', pathname) ||
      pathname === '/more/about' ||
      pathname === '/more/credits' ||
      startsWith('/more/donate', pathname) ||
      startsWith('/more/pricing', pathname) ||
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
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToBallotHeader ?
                <HeaderBackToBallot params={params} /> :
                <HeaderBar />}
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
              show={showHowItWorksModal}
              toggleFunction={this.closeHowItWorksModal}
            />
          )}
          {showVoterPlanModal && (
            <VoterPlanModal
              show={showVoterPlanModal}
              toggleFunction={this.closeVoterPlanModal}
            />
          )}
          {showOrganizationModal && (
            <OrganizationModal
              isSignedIn={voter.is_signed_in}
              show={showOrganizationModal}
              ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
              modalOpen={showOrganizationModal}
              toggleFunction={this.closeOrganizationModal}
              params={params}
            />
          )}
          {showSharedItemModal && (
            <SharedItemModal
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
Header.propTypes = {
  params: PropTypes.object,
  pathname: PropTypes.string.isRequired,
  history: PropTypes.object,
};
