import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoterActions from '../../actions/VoterActions';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import apiCalming from '../../utils/apiCalming';
import { dumpCssFromId } from '../../utils/appleSiliconUtils';
import { getApplicationViewBooleans, normalizedHref, weVoteBrandingOff } from '../../utils/applicationUtils';
import { cordovaTopHeaderTopMargin } from '../../utils/cordovaOffsets';
import { hasIPhoneNotch, historyPush, isCordova, isIOS, isIOSAppOnMac, isIPad, isWebApp } from '../../utils/cordovaUtils';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';
import HeaderBar from './HeaderBar';

const ActivityTidbitDrawer = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitDrawer' */ '../Activity/ActivityTidbitDrawer'));
const HeaderBackTo = React.lazy(() => import(/* webpackChunkName: 'HeaderBackTo' */ './HeaderBackTo'));
const HeaderBackToBallot = React.lazy(() => import(/* webpackChunkName: 'HeaderBackToBallot' */ './HeaderBackToBallot'));
const HeaderBackToVoterGuides = React.lazy(() => import(/* webpackChunkName: 'HeaderBackToVoterGuides' */ './HeaderBackToVoterGuides'));
const HowItWorksModal = React.lazy(() => import(/* webpackChunkName: 'HowItWorksModal' */ '../CompleteYourProfile/HowItWorksModal'));
const OrganizationModal = React.lazy(() => import(/* webpackChunkName: 'OrganizationModal' */ '../VoterGuide/OrganizationModal'));
const SharedItemModal = React.lazy(() => import(/* webpackChunkName: 'SharedItemModal' */ '../Share/SharedItemModal'));
const VoterPlanModal = React.lazy(() => import(/* webpackChunkName: 'VoterPlanModal' */ '../Ready/VoterPlanModal'));
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

    // console.log('-----------HEADER constructor');
    this.closeHowItWorksModal = this.closeHowItWorksModal.bind(this);
    this.closeVoterPlanModal = this.closeVoterPlanModal.bind(this);
    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
    this.closeSharedItemModal = this.closeSharedItemModal.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.storeSub = null;
  }

  componentDidMount () {
    // console.log('-----------HEADER componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener('resize', this.handleResize);
    if (isIOSAppOnMac() && appleSiliconDebug) {
      dumpCssFromId('header-container');
    }
    if (VoterStore.getVoterWeVoteId() === '' && apiCalming('voterRetrieve', 500)) {
      VoterActions.voterRetrieve();
    }
  }

  // Jan 23, 2021: This was blocking updates that we needed, commented out for now
  // shouldComponentUpdate (nextProps, nextState) {
  //   // console.log('-----------HEADER shouldComponentUpdate');
  //   const href = normalizedHref();
  //   let update = false;
  //   if (this.state.activityTidbitWeVoteIdForDrawer !== nextState.activityTidbitWeVoteIdForDrawer) {
  //     update = true;
  //   } if (this.state.organizationModalBallotItemWeVoteId !== nextState.organizationModalBallotItemWeVoteId) {
  //     update = true;
  //   } if (href !== nextProps.pathname) {
  //     update = true;
  //   } if (this.state.priorPath === undefined) {
  //     update = true;
  //   } if (this.state.sharedItemCode !== nextState.sharedItemCode) {
  //     update = true;
  //   } if (this.state.showActivityTidbitDrawer !== nextState.showActivityTidbitDrawer) {
  //     update = true;
  //   } if (this.state.showHowItWorksModal !== nextState.showHowItWorksModal) {
  //     update = true;
  //   } if (this.state.showVoterPlanModal !== nextState.showVoterPlanModal) {
  //     update = true;
  //   } if (this.state.showOrganizationModal !== nextState.showOrganizationModal) {
  //     update = true;
  //   } if (this.state.showSharedItemModal !== nextState.showSharedItemModal) {
  //     update = true;
  //   } if (this.state.windowWidth !== nextState.windowWidth) {
  //     update = true;
  //   }
  //   return update;
  // }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('Header caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('-----------HEADER componentWillUnmount');
    this.appStateSubscription.unsubscribe();
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize (event) {
    // console.log('-----------HEADER handleResize entry');
    const { currentTarget, target } = event;
    if (currentTarget.innerWidth !== target.innerWidth) {
      // console.log('-----------HEADER handleResize RESIZE');
      // console.log('handleResize in Header detected resizing');
      this.setState({ windowWidth: window.innerWidth });
    }
  }

  // eslint-disable-next-line no-unused-vars
  onAppObservableStoreChange (msg) {
    // console.log('------ Header, onAppObservableStoreChange received: ', msg);
    this.setState({
      activityTidbitWeVoteIdForDrawer: AppObservableStore.getActivityTidbitWeVoteIdForDrawer(),
      organizationModalBallotItemWeVoteId: AppObservableStore.getOrganizationModalBallotItemWeVoteId(),
      sharedItemCode: AppObservableStore.getSharedItemCode(),
      showActivityTidbitDrawer: AppObservableStore.showActivityTidbitDrawer(),
      showHowItWorksModal: AppObservableStore.showHowItWorksModal(),
      showVoterPlanModal: AppObservableStore.showVoterPlanModal(),
      showOrganizationModal: AppObservableStore.showOrganizationModal(),
      showSharedItemModal: AppObservableStore.showSharedItemModal(),
    });
  }

  closeActivityTidbitDrawer () {
    AppObservableStore.setShowActivityTidbitDrawer(false);
  }

  closeHowItWorksModal () {
    AppObservableStore.setShowHowItWorksModal(false);
  }

  closeVoterPlanModal () {
    AppObservableStore.setShowVoterPlanModal(false);
  }

  closeOrganizationModal () {
    AppObservableStore.setShowOrganizationModal(false);
  }

  closeSharedItemModal () {
    AppObservableStore.setShowSharedItemModal('');
    const pathname = normalizedHref();
    if (stringContains('/modal/sic/', pathname)) {
      const pathnameWithoutModalSharedItem = pathname.substring(0, pathname.indexOf('/modal/sic/'));
      historyPush(pathnameWithoutModalSharedItem);
    }
  }

  hideHeader () {
    const path = normalizedHref();
    return path.startsWith('/welcome') ||
      path.startsWith('/for-campaigns') ||
      path.startsWith('/how/for-campaigns') ||
      path.startsWith('/twitter_sign_in');
  }


  render () {
    renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders

    if (this.hideHeader()) {
      renderLog('Header hidden');
      return null;
    }

    const { params } = this.props;
    // console.log('Header global.weVoteGlobalHistory', global.weVoteGlobalHistory);
    const pathname = normalizedHref();
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

    // if (!displayTopMenuShadow()) {
    //   pageHeaderClasses += ' header-shadow';
    // }
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
                    <HeaderBackTo
                      backToLink={backToSettingsLinkMobile}
                      backToLinkText={backToSettingsLinkText}
                    />
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
      pathname.startsWith('/how') ||
      pathname === '/more/about' ||
      pathname === '/more/credits' ||
      pathname.startsWith('/more/donate') ||
      pathname.startsWith('/more/pricing') ||
      pathname === '/welcome')) {
      return null;
    } else {
      // console.log('Header not in any mode');
      let classNameHeadroom = '';  // Value for isCordova is ''
      if (isWebApp()) {
        if (stringContains('/ballot', pathname.toLowerCase())) {
          classNameHeadroom = 'headroom-wrapper-webapp__ballot';
        } else if (stringContains('/office', pathname.toLowerCase())) {
          if (isMobileScreenSize()) {
            classNameHeadroom = 'headroom-wrapper-webapp__default';
          } else {
            classNameHeadroom = 'headroom-wrapper-webapp__office';
          }
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
  // pathname: PropTypes.string,
};
