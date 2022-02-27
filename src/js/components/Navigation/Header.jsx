import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import VoterActions from '../../actions/VoterActions';
import { isIOSAppOnMac, isIPad } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import apiCalming from '../../common/utils/apiCalming';
import { dumpCssFromId } from '../../utils/appleSiliconUtils';
import { getApplicationViewBooleans, weVoteBrandingOff } from '../../utils/applicationUtils';
import cordovaTopHeaderTopMargin from '../../utils/cordovaTopHeaderTopMargin';
import { HeadroomWrapper } from '../Style/pageLayoutStyles';
import { stringContains } from '../../utils/textFormat';
import IPhoneSpacer from '../Widgets/IPhoneSpacer';
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
    // this.storeSub = null;
  }

  componentDidMount () {
    // console.log('-----------HEADER componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    window.addEventListener('resize', this.handleResize);
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
    window.removeEventListener('resize', this.handleResize);
  }

  static getDerivedStateFromError (error) {       // eslint-disable-line no-unused-vars
    console.log('!!!Error in Header: ', error);
    return { hasError: true };
  }

  handleResize (event) {
    // console.log('-----------HEADER handleResize entry');
    const { currentTarget, target } = event;
    if (currentTarget.innerWidth !== target.innerWidth) {
      // console.log('-----------HEADER handleResize RESIZE');
      // console.log('handleResize in Header detected resizing');
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
    return (
      path.startsWith('/about') ||
      path.startsWith('/for-campaigns') ||
      path.startsWith('/how/for-campaigns') ||
      path.startsWith('/more/about') ||
      path.startsWith('/more/credits') ||
      path.startsWith('/start') ||
      path.startsWith('/twitter_sign_in') ||
      path.startsWith('/wevoteintro') ||
      path.startsWith('/welcome')
    );
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
      settingsMode, valuesMode, voterGuideCreatorMode, voterGuideMode,
      showBackToBallotHeader, showBackToSettingsDesktop,
      showBackToSettingsMobile, showBackToValues, showBackToVoterGuide, showBackToVoterGuides,
    } = getApplicationViewBooleans(pathname);
    const voter = VoterStore.getVoter();

    // console.log('organizationModalBallotItemWeVoteId: ', this.state.organizationModalBallotItemWeVoteId);

    let pageHeaderClasses = weVoteBrandingOff() ? 'page-header__container_branding_off headroom' : 'page-header__container headroom';
    if (isIPad() && !isIOSAppOnMac()) {
      pageHeaderClasses = pageHeaderClasses.replace('page-header__container', 'page-header__container_ipad');
    }
    if (isCordova()) {
      pageHeaderClasses = '';   // Abandoning the main.css styles if cordova 10/2/2021
    }
    // Non-functional class, to provide a reminder about how to debug top margins
    pageHeaderClasses += ' cordovaTopHeaderTopMargin';

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
                isSignedIn={voter.is_signed_in}
                show={showOrganizationModal}
                ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
                modalOpen={showOrganizationModal}
                toggleFunction={this.closeOrganizationModal}
                params={params}
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
      const backToSettingsLinkText = 'Settings';

      return (
        <div id="app-header">
          <IPhoneSpacer />
          <HeadroomWrapper>
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToSettingsDesktop && (
                <span>
                  <span className="u-show-desktop-tablet">
                    <Suspense fallback={<></>}>
                      <HeaderBackTo backToLink={backToSettingsLinkDesktop} backToLinkText={backToSettingsLinkText} />
                    </Suspense>
                  </span>
                  { !showBackToVoterGuides && !showBackToSettingsMobile && (
                    <span className="u-show-mobile">
                      <Suspense fallback={<></>}>
                        <HeaderBar />
                      </Suspense>
                    </span>
                  )}
                </span>
              )}
              { showBackToSettingsMobile && (
                <span>
                  <span className={isWebApp() ? 'u-show-mobile' : ''}>
                    <Suspense fallback={<></>}>
                      <HeaderBackTo
                        backToLink={backToSettingsLinkMobile}
                        backToLinkText={backToSettingsLinkText}
                      />
                    </Suspense>
                  </span>
                  { isWebApp() && !showBackToVoterGuides && !showBackToSettingsDesktop && (
                    <span className="u-show-desktop-tablet">
                      <Suspense fallback={<></>}>
                        <HeaderBar />
                      </Suspense>
                    </span>
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
                isSignedIn={voter.is_signed_in}
                show={showOrganizationModal}
                ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
                modalOpen={showOrganizationModal}
                toggleFunction={this.closeOrganizationModal}
                params={params}
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
                isSignedIn={voter.is_signed_in}
                show={showOrganizationModal}
                ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
                modalOpen={showOrganizationModal}
                toggleFunction={this.closeOrganizationModal}
                params={params}
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
      pathname.startsWith('/more/donate') ||
      pathname.startsWith('/more/pricing') ||
      pathname === '/welcome')) {
      return null;
    } else {
      // console.log('Header not in any mode');
      // This handles other pages, like the Ballot display
      return (
        <div id="app-header">
          <IPhoneSpacer />
          <HeadroomWrapper>
            <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
              <Suspense fallback={<></>}>
                { showBackToBallotHeader ?
                  <HeaderBackToBallot params={params} /> :
                  <HeaderBar />}
              </Suspense>
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
                isSignedIn={voter.is_signed_in}
                show={showOrganizationModal}
                ballotItemWeVoteId={this.state.organizationModalBallotItemWeVoteId}
                modalOpen={showOrganizationModal}
                toggleFunction={this.closeOrganizationModal}
                params={params}
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
