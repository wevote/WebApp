import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { isAndroidSizeWide, isCordovaWide, isIOSAppOnMac, isIPad } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize, { displayNoneIfSmallerThanDesktop, handleResize, isTablet } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import { dumpCssFromId } from '../../utils/appleSiliconUtils';
import { getApplicationViewBooleans, weVoteBrandingOff } from '../../utils/applicationUtils';
import cordovaTopHeaderTopMargin from '../../utils/cordovaTopHeaderTopMargin';
import { HeadroomWrapper } from '../Style/pageLayoutStyles';
import IPhoneSpacer from '../Widgets/IPhoneSpacer';
import HeaderBar from './HeaderBar';

const ActivityTidbitDrawer = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitDrawer' */ '../Activity/ActivityTidbitDrawer'));
const HeaderBackTo = React.lazy(() => import(/* webpackChunkName: 'HeaderBackTo' */ './HeaderBackTo'));
const HeaderBackToBallot = React.lazy(() => import(/* webpackChunkName: 'HeaderBackToBallot' */ './HeaderBackToBallot'));
const HeaderBackToVoterGuides = React.lazy(() => import(/* webpackChunkName: 'HeaderBackToVoterGuides' */ './HeaderBackToVoterGuides'));
const HeaderBarModals = React.lazy(() => import(/* webpackChunkName: 'HeaderBarModals' */ './HeaderBarModals'));
const HowItWorksModal = React.lazy(() => import(/* webpackChunkName: 'HowItWorksModal' */ '../CompleteYourProfile/HowItWorksModal'));
const OrganizationModal = React.lazy(() => import(/* webpackChunkName: 'OrganizationModal' */ '../VoterGuide/OrganizationModal'));
const PositionDrawer = React.lazy(() => import(/* webpackChunkName: 'PositionDrawer' */ '../Ballot/PositionDrawer'));
const SharedItemModal = React.lazy(() => import(/* webpackChunkName: 'SharedItemModal' */ '../Share/SharedItemModal'));
const VoterPlanModal = React.lazy(() => import(/* webpackChunkName: 'VoterPlanModal' */ '../Ready/VoterPlanModal'));
const appleSiliconDebug = false;


export default class Header extends Component {
  constructor (props) {
    super(props);
    this.state = {
      organizationModalBallotItemWeVoteId: '',
      organizationModalHideBallotItemInfo: false,
      organizationModalHidePositions: false,
      sharedItemCode: '',
      showHowItWorksModal: false,
      showVoterPlanModal: false,
      showOrganizationModal: false,
      showPositionDrawer: false,
      showSharedItemModal: false,
    };

    // console.log('-----------HEADER constructor');
    this.closeHowItWorksModal = this.closeHowItWorksModal.bind(this);
    this.closeVoterPlanModal = this.closeVoterPlanModal.bind(this);
    this.closeSharedItemModal = this.closeSharedItemModal.bind(this);
    this.handleResizeLocal = this.handleResizeLocal.bind(this);
    // this.storeSub = null;
  }

  componentDidMount () {
    // console.log('-----------HEADER componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    window.addEventListener('resize', this.handleResizeLocal);
    if (isIOSAppOnMac() && appleSiliconDebug) {
      dumpCssFromId('header-container');
    }
    if (VoterStore.getVoterWeVoteId() === '' && apiCalming('voterRetrieve', 500)) {
      setTimeout(() => {
        VoterActions.voterRetrieve();
      }, 1000);
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
    console.error('!!!Header caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('-----------HEADER componentWillUnmount');
    this.appStateSubscription.unsubscribe();
    window.removeEventListener('resize', this.handleResizeLocal);
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('!!!Error in Header: ', error);
    return { hasError: true };
  }

  handleResizeLocal () {
    if (handleResize('Header')) {
      this.setState({});
    }
  }

  // eslint-disable-next-line no-unused-vars
  onAppObservableStoreChange (msg) {
    // console.log('------ Header, onAppObservableStoreChange received: ', msg);
    this.setState({
      activityTidbitWeVoteIdForDrawer: AppObservableStore.getActivityTidbitWeVoteIdForDrawer(),
      organizationModalBallotItemWeVoteId: AppObservableStore.getOrganizationModalBallotItemWeVoteId(),
      organizationModalHideBallotItemInfo: AppObservableStore.hideOrganizationModalBallotItemInfo(),
      organizationModalHidePositions: AppObservableStore.hideOrganizationModalPositions(),
      positionDrawerBallotItemWeVoteId: AppObservableStore.getPositionDrawerBallotItemWeVoteId(),
      positionDrawerOrganizationWeVoteId: AppObservableStore.getPositionDrawerOrganizationWeVoteId(),
      sharedItemCode: AppObservableStore.getSharedItemCode(),
      showActivityTidbitDrawer: AppObservableStore.showActivityTidbitDrawer(),
      showHowItWorksModal: AppObservableStore.showHowItWorksModal(),
      showVoterPlanModal: AppObservableStore.showVoterPlanModal(),
      showOrganizationModal: AppObservableStore.showOrganizationModal(),
      showPositionDrawer: AppObservableStore.showPositionDrawer(),
      showSharedItemModal: AppObservableStore.showSharedItemModal(),
    });
  }

  closePositionDrawer = () => {
    AppObservableStore.setShowPositionDrawer(false);
  }

  closeOrganizationModal = () => {
    AppObservableStore.setShowOrganizationModal(false);
    AppObservableStore.setHideOrganizationModalBallotItemInfo(false);
    AppObservableStore.setHideOrganizationModalPositions(false);
  }

  closeHowItWorksModal () {
    AppObservableStore.setShowHowItWorksModal(false);
  }

  closeVoterPlanModal () {
    AppObservableStore.setShowVoterPlanModal(false);
  }

  closeActivityTidbitDrawer () {
    AppObservableStore.setShowActivityTidbitDrawer(false);
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
    return (
      // path.startsWith('/-') || // Shared item
      path.startsWith('/about') ||
      path.startsWith('/findfriends') ||
      path.startsWith('/for-campaigns') ||
      path.startsWith('/how/for-campaigns') ||
      path.startsWith('/more/about') ||
      path.startsWith('/more/credits') ||
      path.startsWith('/remind') ||
      path.startsWith('/setupaccount') ||
      path.startsWith('/start') ||
      path.startsWith('/twitter_sign_in') ||
      path.startsWith('/unsubscribe') ||
      path.startsWith('/wevoteintro') ||
      path.startsWith('/welcomehome')
    );
  }


  render () {
    renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders

    if (this.hideHeader()) {
      renderLog('Header hidden');
      return null;
    }

    if (isCordova()) {
      console.log('Header, cordova device model', window.device.model);
      // console.log('Header, hasDynamicIsland', hasDynamicIsland());
    }

    const { params } = this.props;
    // console.log('Header global.weVoteGlobalHistory', global.weVoteGlobalHistory);
    const pathname = normalizedHref();
    const {
      activityTidbitWeVoteIdForDrawer, organizationModalHideBallotItemInfo, organizationModalHidePositions, organizationModalBallotItemWeVoteId,
      positionDrawerBallotItemWeVoteId, positionDrawerOrganizationWeVoteId,
      sharedItemCode, showActivityTidbitDrawer,
      showHowItWorksModal, showOrganizationModal, showPositionDrawer, showVoterPlanModal, showSharedItemModal,
    } = this.state;
    const {
      headerNotVisible, settingsMode, valuesMode, voterGuideCreatorMode, voterGuideMode,
      showBackToBallotHeader, showBackToSettingsDesktop,
      showBackToSettingsMobile, showBackToValues, showBackToVoterGuide, showBackToVoterGuides,
    } = getApplicationViewBooleans(pathname);
    const voter = VoterStore.getVoter();

    // console.log('organizationModalBallotItemWeVoteId: ', organizationModalBallotItemWeVoteId);

    let pageHeaderClasses = weVoteBrandingOff() ? 'page-header__container_branding_off headroom' : 'page-header__container headroom';
    if (isIPad() && !isIOSAppOnMac()) {
      pageHeaderClasses = pageHeaderClasses.replace('page-header__container', 'page-header__container_ipad');
    }
    if (isCordova()) {
      pageHeaderClasses = '';   // Abandoning the main.css styles if cordova 10/2/2021
    }
    // Non-functional class, to provide a reminder about how to debug top margins
    pageHeaderClasses += pageHeaderClasses.length ? ' cordovaTopHeaderTopMargin' : 'cordovaTopHeaderTopMargin';

    // if (!displayTopMenuShadow()) {
    //   pageHeaderClasses += ' header-shadow';
    // }
    // console.log(`Header href: ${window.location.href}  cordovaStyle: `, cordovaTopHeaderTopMargin());

    // console.log('voterGuideMode:', voterGuideMode, ', showBackToVoterGuide:', showBackToVoterGuide, ', showBackToVoterGuides:', showBackToVoterGuides, ', showBackToBallotHeader:', showBackToBallotHeader, ', settingsMode:', settingsMode);
    if (voterGuideMode || voterGuideCreatorMode) {
      // console.log('Header in voterGuideMode, showBackToVoterGuide:', showBackToVoterGuide);
      // let headroomWrapper = '';
      // if (isWebApp) {
      //   if (voterGuideCreatorMode) {
      //     headroomWrapper = 'headroom-wrapper-webapp__voter-guide-creator';
      //   } else {
      //     headroomWrapper = 'headroom-wrapper-webapp__voter-guide';
      //   }
      // }
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
          <IPhoneSpacer />
          <HeadroomWrapper>
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              <Suspense fallback={<></>}>
                {headerBarObject}
              </Suspense>
            </div>
          </HeadroomWrapper>
          {showHowItWorksModal && (
            <Suspense fallback={<></>}>
              <HowItWorksModal
                show={showHowItWorksModal}
                toggleFunction={this.closeHowItWorksModal}
              />
            </Suspense>
          )}
          {showVoterPlanModal && (
            <Suspense fallback={<></>}>
              <VoterPlanModal
                show={showVoterPlanModal}
                toggleFunction={this.closeVoterPlanModal}
              />
            </Suspense>
          )}
          {showOrganizationModal && (
            <Suspense fallback={<></>}>
              <OrganizationModal
                ballotItemWeVoteId={organizationModalBallotItemWeVoteId}
                hideBallotItemInfo={organizationModalHideBallotItemInfo}
                hidePositions={organizationModalHidePositions}
                isSignedIn={voter.is_signed_in}
                modalOpen={showOrganizationModal}
                params={params}
                show={showOrganizationModal}
                toggleFunction={this.closeOrganizationModal}
              />
            </Suspense>
          )}
          {showSharedItemModal && (
            <Suspense fallback={<></>}>
              <SharedItemModal
                sharedItemCode={sharedItemCode}
                show
                closeSharedItemModal={this.closeSharedItemModal}
              />
            </Suspense>
          )}
        </div>
      );
    } else if (settingsMode) {
      // console.log('Header in settingsMode, showBackToSettingsDesktop:', showBackToSettingsDesktop, ', showBackToSettingsMobile:', showBackToSettingsMobile);
      const backToSettingsLinkDesktop = '/settings/profile';
      const backToSettingsLinkMobile = '/settings/hamburger';
      const backToSettingsLinkText = '';
      const { innerWidth, muiThemeGlobal: { breakpoints: { values: { tabMin } } } } = window;

      return (
        <div id="app-header">
          <IPhoneSpacer />
          <HeadroomWrapper>
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToSettingsDesktop && (
                <span id="inner_for_showBackToSettingsDesktop">
                  { (!isAndroidSizeWide() && displayNoneIfSmallerThanDesktop().length > 0) && (
                    <span className="BackToSettingsDesktopSpan">
                      <Suspense fallback={<></>}>
                        <HeaderBackTo backToLink={backToSettingsLinkDesktop} backToLinkText={backToSettingsLinkText} />
                      </Suspense>
                    </span>
                  )}
                  { (isAndroidSizeWide() || isTablet() || (!showBackToVoterGuides && !showBackToSettingsMobile)) && (
                    <span className="BackToSettingsDesktopMobileSpan">
                      <Suspense fallback={<></>}>
                        <HeaderBar />
                      </Suspense>
                    </span>
                  )}
                </span>
              )}
              { showBackToSettingsMobile && (
                <span>
                  { (!isCordovaWide() && innerWidth < tabMin) && (
                    <span className="BackToSettingsMobileSpan">
                      <Suspense fallback={<></>}>
                        <HeaderBackTo
                          backToLink={backToSettingsLinkMobile}
                          backToLinkText={backToSettingsLinkText}
                        />
                      </Suspense>
                    </span>
                  )}
                  { (isCordovaWide() || isTablet() || (isWebApp() && !showBackToVoterGuides && !showBackToSettingsDesktop)) && (
                    <BackToSettingsMobileDesktopSpan>
                      <Suspense fallback={<></>}>
                        <HeaderBar />
                      </Suspense>
                    </BackToSettingsMobileDesktopSpan>
                  )}
                </span>
              )}
              { showBackToVoterGuides && (
                <Suspense fallback={<></>}>
                  <HeaderBackToVoterGuides params={params} />
                </Suspense>
              )}
              { !showBackToVoterGuides && !showBackToSettingsDesktop && !showBackToSettingsMobile && (
                <Suspense fallback={<></>}>
                  <HeaderBar />
                </Suspense>
              )}
            </div>
          </HeadroomWrapper>
          {showHowItWorksModal && (
            <Suspense fallback={<></>}>
              <HowItWorksModal
                show={showHowItWorksModal}
                toggleFunction={this.closeHowItWorksModal}
              />
            </Suspense>
          )}
          {showVoterPlanModal && (
            <Suspense fallback={<></>}>
              <VoterPlanModal
                show={showVoterPlanModal}
                toggleFunction={this.closeVoterPlanModal}
              />
            </Suspense>
          )}
          {showOrganizationModal && (
            <Suspense fallback={<></>}>
              <OrganizationModal
                ballotItemWeVoteId={organizationModalBallotItemWeVoteId}
                hideBallotItemInfo={organizationModalHideBallotItemInfo}
                hidePositions={organizationModalHidePositions}
                isSignedIn={voter.is_signed_in}
                modalOpen={showOrganizationModal}
                params={params}
                show={showOrganizationModal}
                toggleFunction={this.closeOrganizationModal}
              />
            </Suspense>
          )}
          {showSharedItemModal && (
            <Suspense fallback={<></>}>
              <SharedItemModal
                sharedItemCode={sharedItemCode}
                show
                closeSharedItemModal={this.closeSharedItemModal}
              />
            </Suspense>
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
          <IPhoneSpacer />
          <HeadroomWrapper>
            {/* <div className={isWebApp ? 'headroom-wrapper-webapp__default' : ''} id="headroom-wrapper"> */}
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              <Suspense fallback={<></>}>
                { showBackToValues ?
                  <HeaderBackTo backToLink={backToValuesLink} backToLinkText={backToValuesLinkText} /> :
                  <HeaderBar />}
              </Suspense>
            </div>
          </HeadroomWrapper>
          {showHowItWorksModal && (
            <Suspense fallback={<></>}>
              <HowItWorksModal
                show={showHowItWorksModal}
                toggleFunction={this.closeHowItWorksModal}
              />
            </Suspense>
          )}
          {showVoterPlanModal && (
            <Suspense fallback={<></>}>
              <VoterPlanModal
                show={showVoterPlanModal}
                toggleFunction={this.closeVoterPlanModal}
              />
            </Suspense>
          )}
          {showOrganizationModal && (
            <Suspense fallback={<></>}>
              <OrganizationModal
                ballotItemWeVoteId={organizationModalBallotItemWeVoteId}
                hideBallotItemInfo={organizationModalHideBallotItemInfo}
                hidePositions={organizationModalHidePositions}
                isSignedIn={voter.is_signed_in}
                modalOpen={showOrganizationModal}
                params={params}
                show={showOrganizationModal}
                toggleFunction={this.closeOrganizationModal}
              />
            </Suspense>
          )}
          {showSharedItemModal && (
            <Suspense fallback={<></>}>
              <SharedItemModal
                sharedItemCode={sharedItemCode}
                show
                closeSharedItemModal={this.closeSharedItemModal}
              />
            </Suspense>
          )}
        </div>
      );
    } else if (typeof pathname !== 'undefined' && pathname &&
      (pathname === '/about' ||
      pathname === '/for-campaigns' ||
      pathname === '/for-organizations' ||
      pathname.startsWith('/how') ||
      pathname === '/more/about' ||
      pathname === '/more/credits' ||
      pathname.startsWith('/more/pricing') ||
      pathname === '/welcomehome')) {
      return null;
    } else {
      // This handles other pages, like the Ballot display
      // console.log('Header not in any mode, headerNotVisible:', headerNotVisible);
      return (
        <div id="app-header">
          <IPhoneSpacer />
          <HeadroomWrapper>
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              {headerNotVisible ? (
                <>
                  <Suspense fallback={<></>}>
                    <HeaderBarModals />
                  </Suspense>
                </>
              ) : (
                <>
                  <Suspense fallback={<></>}>
                    { showBackToBallotHeader ?
                      <HeaderBackToBallot params={params} /> :
                      <HeaderBar />}
                  </Suspense>
                </>
              )}
            </div>
          </HeadroomWrapper>
          {showActivityTidbitDrawer && (
            <Suspense fallback={<></>}>
              <ActivityTidbitDrawer
                activityTidbitWeVoteId={activityTidbitWeVoteIdForDrawer}
                show={showActivityTidbitDrawer}
                modalOpen={showActivityTidbitDrawer}
                toggleFunction={this.closeActivityTidbitDrawer}
              />
            </Suspense>
          )}
          {showHowItWorksModal && (
            <Suspense fallback={<></>}>
              <HowItWorksModal
                show={showHowItWorksModal}
                toggleFunction={this.closeHowItWorksModal}
              />
            </Suspense>
          )}
          {showVoterPlanModal && (
            <Suspense fallback={<></>}>
              <VoterPlanModal
                show={showVoterPlanModal}
                toggleFunction={this.closeVoterPlanModal}
              />
            </Suspense>
          )}
          {showOrganizationModal && (
            <Suspense fallback={<></>}>
              <OrganizationModal
                ballotItemWeVoteId={organizationModalBallotItemWeVoteId}
                hideBallotItemInfo={organizationModalHideBallotItemInfo}
                hidePositions={organizationModalHidePositions}
                isSignedIn={voter.is_signed_in}
                modalOpen={showOrganizationModal}
                params={params}
                show={showOrganizationModal}
                toggleFunction={this.closeOrganizationModal}
              />
            </Suspense>
          )}
          {showPositionDrawer && (
            <Suspense fallback={<></>}>
              <PositionDrawer
                ballotItemWeVoteId={positionDrawerBallotItemWeVoteId}
                featuredOrganizationWeVoteId={positionDrawerOrganizationWeVoteId}
                isSignedIn={voter.is_signed_in}
                modalOpen={showPositionDrawer}
                params={params}
                show={showPositionDrawer}
                toggleFunction={this.closePositionDrawer}
              />
            </Suspense>
          )}
          {showSharedItemModal && (
            <Suspense fallback={<></>}>
              <SharedItemModal
                sharedItemCode={sharedItemCode}
                show
                closeSharedItemModal={this.closeSharedItemModal}
              />
            </Suspense>
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

const BackToSettingsMobileDesktopSpan = styled('span')`
  ${() => (!isMobileScreenSize() || isTablet() ? '' : 'display: none;')};
`;

