import AccountCircle from '@mui/icons-material/AccountCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Menu, MenuItem, Tab, Tabs } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterActions from '../../actions/VoterActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import LazyImage from '../../common/components/LazyImage';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import signInModalGlobalState from '../../common/components/Widgets/signInModalGlobalState';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import apiCalming from '../../common/utils/apiCalming';
import { historyPush } from '../../common/utils/cordovaUtils';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize, { handleResize, isSmallTablet, isTablet } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import voterPhoto from '../../common/utils/voterPhoto';
import webAppConfig from '../../config';
import AnalyticsStore from '../../stores/AnalyticsStore';
import FacebookStore from '../../stores/FacebookStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric, displayTopMenuShadow, weVoteBrandingOff } from '../../utils/applicationUtils';
import getHeaderObjects from '../../utils/getHeaderObjects';
import { TopOfPageHeader, TopRowOneLeftContainer, TopRowOneMiddleContainer, TopRowOneRightContainer, TopRowTwoLeftContainer } from '../Style/pageLayoutStyles';
import SignInButton from '../Widgets/SignInButton';
import FriendsTabs from './FriendsTabs';
import HeaderBarLogo from './HeaderBarLogo';
import HeaderBarModals from './HeaderBarModals';
import TabWithPushHistory from './TabWithPushHistory';

const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

/* global $ */

// TODO: Backport "@stripe/react-stripe-js" use from Campaigns
// import PaidAccountUpgradeModal from '../Settings/PaidAccountUpgradeModal';


class HeaderBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // aboutMenuOpen: false,
      chosenSiteLogoUrl: '',
      componentDidMountFinished: false,
      // friendInvitationsSentToMe: 0,
      hideWeVoteLogo: false,
      // inPrivateLabelMode: false,
      // priorPath: '',
      scrolledDown: false,
      // showOrganizationModal: false,
      showSignInModal: false,
      // showPositionDrawer: false,
      // whatAndHowMuchToShare: '',
      tabsValue: 1,
      // organizationModalBallotItemWeVoteId: '',
      page: 'non-blank-default-value',
      voter: {},
      // voterFirstName: '',
      voterIsSignedIn: false,
    };
    this.debugLogging = this.debugLogging.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleResizeLocal = this.handleResizeLocal.bind(this);
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.analyticsStoreListener = AnalyticsStore.addListener(this.onAnalyticsStoreChange.bind(this));
    window.addEventListener('resize', this.handleResizeLocal);

    const voter = VoterStore.getVoter();
    // const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter && voter.is_signed_in;
    // if (voterIsSignedIn === undefined) {
    //   VoterActions.voterRetrieve();
    // }
    this.setState({
      componentDidMountFinished: true,
      chosenSiteLogoUrl: AppObservableStore.getChosenSiteLogoUrl(),
      // friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      hideWeVoteLogo: AppObservableStore.getHideWeVoteLogo(),
      // inPrivateLabelMode: AppObservableStore.getHideWeVoteLogo(), // Using this setting temporarily // setState onAppObservableStoreChange is not working for some reason
      scrolledDown: AppObservableStore.getScrolledDown(),
      showSignInModal: AppObservableStore.showSignInModal(),
      voter,
      // voterFirstName,
      voterIsSignedIn,
    });
    if (isWebApp()) {
      this.setStyleTimeout = setTimeout(() => {
        const headerObjects = getHeaderObjects();
        if (document.getElementById('HeaderBarLogoWrapper')) {
          headerObjects.logo = document.getElementById('HeaderBarLogoWrapper').innerHTML;
        }
        if (document.getElementById('ballotTabHeaderBar')) {
          headerObjects.ballot = document.getElementById('ballotTabHeaderBar').innerHTML;
        }
        if (document.getElementById('candidatesTabHeaderBar')) {
          headerObjects.candidates = document.getElementById('candidatesTabHeaderBar').innerHTML;
        }
        if (document.getElementById('challengesTabHeaderBar')) {
          headerObjects.challenges = document.getElementById('challengesTabHeaderBar').innerHTML;
        }
        if (document.getElementById('friendsTabHeaderBar')) {
          headerObjects.opinions = document.getElementById('friendsTabHeaderBar').innerHTML;
        }
        if (document.getElementById('discussTabHeaderBar')) {
          headerObjects.discuss = document.getElementById('discussTabHeaderBar').innerHTML;
        }
        if (document.getElementById('donateTabHeaderBar')) {
          headerObjects.donate = document.getElementById('donateTabHeaderBar').innerHTML;
        }
        if (document.getElementById('HeaderNotificationMenuWrapper')) {
          headerObjects.bell = document.getElementById('HeaderNotificationMenuWrapper').innerHTML;
        }
        if (document.getElementById('profileAvatarHeaderBar')) {
          headerObjects.photo = document.getElementById('profileAvatarHeaderBar').innerHTML;
        }
        if (document.getElementById('moreTabHeaderBar')) {
          headerObjects.more = document.getElementById('moreTabHeaderBar').innerHTML;
        }
        if (document.getElementById('howItWorksTabHeaderBar')) {
          headerObjects.howItWorks = document.getElementById('howItWorksTabHeaderBar').innerHTML;
        }
      }, 1000);
    }
    this.syncTabsToRoute();
  }

  componentDidUpdate () {
    // console.log('HeaderBar componentDidUpdate');
    const { page } = this.state;
    if (page !== normalizedHrefPage()) {
      this.syncTabsToRoute();
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('HeaderBar caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
    this.analyticsStoreListener.remove();
    window.removeEventListener('resize', this.handleResizeLocal);
    if (this.setStyleTimeout) clearTimeout(this.setStyleTimeout);
  }

  handleTabChange = (newValue) => {
    this.setState({ tabsValue: newValue }, () => {
    // console.log('handleTabChange ', newValue);
    /* if (newValue === 4) {  // Check if the tab change is for challenges
      const currentPathname = window.location.pathname;
      const destinationPathname = '/challenges';
      const currentPage = lookupPageNameAndPageTypeDict(currentPathname);
      const destinationPage = lookupPageNameAndPageTypeDict(destinationPathname);

      TagManager.dataLayer({
        dataLayer: {
          event: 'landing',
          pageDetails: {
            pageName: currentPage.pageName,
            pageType: currentPage.pageType,
            pathname: currentPathname,
          },
          destinationDetails: {
            pageName: destinationPage.pageName,
            pageType: destinationPage.pageType,
            pathname: destinationPathname,
            stateCode: VoterStore.getVoterStateCode(),
          },
          userDetails: VoterStore.getAnalyticsUserDetails(),
        },
      });
    } */
      this.customHighlightSelector(newValue);
    });
  };

  handleResizeLocal () {
    if (handleResize('HeaderBar')) {
      this.setState({});
    }
  }

  onFriendStoreChange () {
    // console.log('HeaderBar, onFriendStoreChange textOrEmailSignInInProcess: ' + signInModalGlobalState.get('textOrEmailSignInInProcess'));
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('HeaderBar, onFriendStoreChange');
      this.setState({
        // friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      });
    }
  }

  onVoterStoreChange () {
    // console.log('HeaderBar, onVoterStoreChange textOrEmailSignInInProcess: ' + signInModalGlobalState.get('textOrEmailSignInInProcess'));
    // console.log('HeaderBar, onVoterStoreChange voter: ', VoterStore.getVoter());

    // Nov 2025: flashing cordova on older ios devices bug was removed here ( Facebook, window.location.reload(true) )
    // if (isIOS()) {
    //   if (isDeviceZoomed()) {
    //     // October 20, 2021: in iOS, at the Facebook site, within the facebook sign-in dialog, when you tab between the username and the password, our
    //     // HeaderBar and FooterBar expand off of the screen -- i.e. the screen zooms in.
    //     // Rotating (forcing a redraw) fixes it, so for new we just detect the condition in isDeviceZoomed and force a full DOM reload to clear the zoom.
    //     window.localStorage.setItem('window.location.reloaded', 'true');
    //     window.location.reload(true);
    //   }
    // }

    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('HeaderBar, onVoterStoreChange ', VoterStore.getFirstName(), VoterStore.getFullName());
      const voter = VoterStore.getVoter();
      // const voterFirstName = VoterStore.getFirstName();
      const voterIsSignedIn = voter.is_signed_in || false;
      this.setState({
        voter,
        // voterFirstName,
        voterIsSignedIn,
        showSignInModal: AppObservableStore.showSignInModal(),
        // showOrganizationModal: AppObservableStore.showOrganizationModal(),
        // showPositionDrawer: AppObservableStore.showPositionDrawer(),
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  onAppObservableStoreChange (msg) {
    // console.log('------ HeaderBar, onAppObservableStoreChange received: ', msg);
    this.setState({
      chosenSiteLogoUrl: AppObservableStore.getChosenSiteLogoUrl(),
      hideWeVoteLogo: AppObservableStore.getHideWeVoteLogo(),
      // inPrivateLabelMode: AppObservableStore.getHideWeVoteLogo(), // Using this setting temporarily // setState onAppObservableStoreChange is not working for some reason
      // organizationModalBallotItemWeVoteId: AppObservableStore.getOrganizationModalBallotItemWeVoteId(),
      scrolledDown: AppObservableStore.getScrolledDown(),
      // whatAndHowMuchToShare: AppObservableStore.getWhatAndHowMuchToShare(),
      showSignInModal: AppObservableStore.showSignInModal(),
    });
  }

  onAnalyticsStoreChange () {
    // A page reload for iOS in Cordova after facebook login forces the need for a voterRetrieve, after redrawing the page
    // (and without requiring changes to the API server), the first response that indicates 'is signed in' is an Analytics call response
    // console.log('onAnalyticsStoreChange VoterStore.getVoterIsSignedIn(): ', VoterStore.getVoterIsSignedIn(), ' AnalyticsStore.getIsSignedIn(): ', AnalyticsStore.getIsSignedIn(), 'FacebookStore.loggedIn: ', FacebookStore.loggedIn, 'VoterStore.voterDeviceId(): ', VoterStore.voterDeviceId());
    if (isCordova() && VoterStore.getVoterIsSignedIn() === false && (AnalyticsStore.getIsSignedIn() || FacebookStore.loggedIn)) {
      if (apiCalming('voterRetrieve', 500)) {
        // console.log('Cordova:   HeaderBar onAnalyticsStoreChange, firing voterRetrieve --------------');  // Do not comment out or delete
        VoterActions.voterRetrieve();
      }
    }
  }

  syncTabsToRoute = () => {
    const nextPage = normalizedHrefPage();
    const nextValue = this.getTabsValueFromPage();
    this.setState({ tabsValue: nextValue, page: nextPage }, () => {
      this.customHighlightSelector(nextValue || false);
    });
  };

  getTabsValueFromPage = () => {
    const page = normalizedHrefPage();
    switch (page) {
      case 'ballot': return 1;
      case 'candidatelist':
      case 'politicianpage': return 2;
      case 'friends':
      case 'news':
      case 'challenges':
      case 'donate':
      case 'more/donate': return 5;
      case 'more':
      case 'managecandidates':
      case 'no-candidates-claimed':
      default: return false;
    }
  };

  // goToSearch = () => {
  //   historyPush('/opinions');
  // }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  };

  navTo = (path, highlightValue = 99) => () => {
    this.setState({ moreAnchorEl: null });
    this.handleTabChange(highlightValue);
    historyPush(path);
  };

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter/election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    // const googleCivicElectionId = 0;
    // if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(googleCivicElectionId, this.state.voter.linked_organization_we_vote_id)) {
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, false, true);
    // }
    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
  }

  debugLogging (text) {
    const isDebugLogging = false;
    if (isDebugLogging) {
      console.log(`HeaderBar shouldComponentUpdate: ${text}`);
    }
  }

  // Highlight the active tab, but don't highlight anything if not on one of the tabs, for example we are on 'friends'
  customHighlightSelector (currentValue) {
    const normal = {
      opacity: 0.7,
      fontWeight: 500,
      color: 'rgba(51, 51, 51)',
    };
    // Should use theme.colors.brandBlue instead of directly using '#2e3c5d'
    const highlight = {
      opacity: 1,
      fontWeight: 600,
      color: '#2e3c5d',
    };

    if (window.$) {
      // console.log('customHighlightSelector called for page: ', normalizedHrefPage());
      const ballot = $('#ballotTabHeaderBar');
      const candidates = $('#candidatesTabHeaderBar');
      const challenges = $('#challengesTabHeaderBar');
      const friends = $('#friendsTabHeaderBar');
      const news = $('#discussTabHeaderBar');
      const donate = $('#donateTabHeaderBar');
      const squads = $('#squadsTabHeaderBar');
      const more = $('#moreTabHeaderBar');
      ballot.css(normal);
      candidates.css(normal);   // Candidates (not individual candidate page)
      challenges.css(normal);   // Democracy Challenges
      friends.css(normal);      // Friends
      news.css(normal);         // Discuss
      donate.css(normal);       // Donate
      squads.css(normal);       // Squads
      more.css(normal);         // More


      switch (normalizedHrefPage()) {
        case 'ballot':
          ballot.css(highlight);
          break;
        case 'candidatelist': // displays same page as "cs"
          candidates.css(highlight);
          break;
        case 'challenges':
          more.css(highlight);
          break;
        case 'election-finder':
          more.css(highlight);
          break;
        case 'donate':
        case 'more/donate':
          donate.css(highlight);
          break;
        case 'friends':
          more.css(highlight);
          break;
        case 'managecandidates':
          more.css(highlight);
          break;
        case 'no-candidates-claimed':
          more.css(highlight);
          break;
        case 'more':
          more.css(highlight);
          break;
        case 'news':
          more.css(highlight);
          break;
        case 'politicianpage':
          candidates.css(highlight);
          break;
        case 'squads':
          more.css(highlight);
          break;
        default:
          break;
      }
      if (currentValue === 99) {
        more.css(highlight);
      }
    } else {
      setTimeout(() => {
        console.log('customHighlightSelector purposefully called recursively');
        this.customHighlightSelector(currentValue);
      }, 500);
    }

    // If user clicked the “More” tab explicitly, force that highlight
    // if (currentValue === 99) more.css(highlight);

    this.setState({ page: normalizedHrefPage() });
  }

  goToSettings () {
    console.log('goToSettings IN HeaderBar setDrawerOpen');
    AppObservableStore.setDrawerOpen('headerProfileDrawerOpen', true);
  }

  toggleSignInModal () {
    const { showSignInModal } = this.state;
    // console.log('HeaderBar toggleSignInModal showSignInModal:', showSignInModal);
    AppObservableStore.setShowSignInModal(!showSignInModal);
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  render () {
    renderLog('HeaderBar');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.componentDidMountFinished) {
      // console.log('HeaderBar suppressed for !componentDidMountFinished');
      return null;
    }

    if (window.leanLoadForChromeExtension) {
      // console.log('HeaderBar suppressed for Chrome Extension');
      return null;    // No header on the iFramed pages for the Chrome Extension
    }

    const { classes } = this.props;
    const {
      chosenSiteLogoUrl, hideWeVoteLogo, scrolledDown,
      voter, voterIsSignedIn, tabsValue,
    } = this.state;
    const inPrivateLabelMode = AppObservableStore.getHideWeVoteLogo();  // setState onAppObservableStoreChange is not working for some reason
    // console.log('HeaderBar inPrivateLabelMode:', inPrivateLabelMode);
    const voterPhotoUrlMedium = voterPhoto(voter);

    const doNotShowWeVoteLogo = weVoteBrandingOff() || hideWeVoteLogo;
    const showWeVoteLogo = !doNotShowWeVoteLogo;

    const isFriends = normalizedHrefPage() === 'friends';  // The URL '/friends/request' yields 'friends'
    let avatarStyle = {};
    if (isCordova()) {
      avatarStyle = { marginBottom: 2 };
    }
    if (isSmallTablet()) {
      avatarStyle = { ...avatarStyle, paddingRight: 10 };
    }
    // console.log('HeaderBar hasNotch, scrolledDown, hasSubmenu', hasCordovaNotch(), scrolledDown, displayTopMenuShadow());
    const displayMenu = !isMobileScreenSize() || isTablet();
    // console.log('HeaderBar isMobileScreenSize(), isTablet()', isMobileScreenSize(), isTablet());
    let donateValue;
    let donateVisible;
    if (inPrivateLabelMode) {
      donateValue = 3;
      donateVisible = false;
    } else {
      donateValue = 3;
      donateVisible = true;
    }

    // console.log('HeaderBar !isMobileScreenSize()', displayMenu);
    return (
      <HeaderBarWrapper
        scrolledDown={scrolledDown}
        hasSubmenu={displayTopMenuShadow()}
      >
        <TopOfPageHeader>
          {/* <AppBar position="relative" */}
          {/*        id="headerBarAppBar" */}
          {/*        color="default" */}
          {/*        className={`${appBarCname} ${showingBallot || showingFriendsTabs ? ' page-header__ballot' : ''}`} */}
          {/*        style={pageLayoutStyles()} */}
          {/*        elevation={0} */}
          {/* > */}
          {/* <Toolbar style={headerToolbarStyles()} disableGutters elevation={0}> */}
          <TopRowOneLeftContainer>
            {(showWeVoteLogo || chosenSiteLogoUrl) && (
              <HeaderBarLogo
                chosenSiteLogoUrl={chosenSiteLogoUrl}
              // isBeta={showWeVoteLogo && !chosenSiteLogoUrl}
              />
            )}
          </TopRowOneLeftContainer>
          <TopRowOneMiddleContainer>
            <div className="header-nav">
              {displayMenu && (
                <>
                  <StyledHeaderMenuTabs
                    value={tabsValue}
                    // indicatorColor="primary"
                    textColor="inherit"
                    classes={{ indicator: classes.indicator }}
                    onChange={(e, val) => this.handleTabChange(val)}
                  >
                    <TabWithPushHistory
                      classes={isWebApp() ? { root: classes.tabRootBallotDesktop } : { root: classes.tabRootBallot }}
                      value={1}
                      change={this.handleTabChange}
                      id="ballotTabHeaderBar"
                      label="Ballot"
                      to="/ballot"
                    />
                    <TabWithPushHistory
                      classes={isWebApp() ? { root: classes.tabRootCandidatesDesktop } : { root: classes.tabRootCandidates }}
                      value={2}
                      change={this.handleTabChange}
                      id="candidatesTabHeaderBar"
                      label="Candidates"
                      to="/cs/"
                    />
                    {donateVisible && (
                      <TabWithPushHistory
                        classes={isWebApp() ? { root: classes.tabRootDonateDesktop } : { root: classes.tabRootDonate }}
                        value={donateValue}
                        change={this.handleTabChange}
                        id="donateTabHeaderBar"
                        label="Donate"
                        to="/donate"
                      />
                    )}
                    <Tab
                      value={3}
                      tabIndex={0}
                      classes={isWebApp() ? { root: classes.tabRoot, selected: classes.tabSelected } : { root: classes.tabRootMore, selected: classes.tabSelected }}
                      id="moreTabHeaderBar"
                      label={(
                        <span className={classes.moreLabel}>
                          More
                          <ExpandMoreIcon className={classes.tabMoreIcon} />
                        </span>
                      )}
                      onClick={(event) => {
                        this.setState({ moreAnchorEl: event.currentTarget });
                        this.handleTabChange(3); // Highlight the tab
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          this.setState({ moreAnchorEl: e.currentTarget });
                          this.handleTabChange(3); // Highlight the tab
                        }
                      }}
                      aria-controls="more-menu"
                      aria-haspopup="true"
                      wrapped
                    />
                  </StyledHeaderMenuTabs>
                  <StyledMoreMenu
                    id="more-menu"
                    anchorEl={this.state.moreAnchorEl}
                    open={Boolean(this.state.moreAnchorEl)}
                    onClose={() => this.setState({ moreAnchorEl: null })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <StyledMoreMenuItem
                      id="howItWorksTabHeaderBar"
                      onClick={this.openHowItWorksModal}
                      disableRipple
                    >
                      How it works
                    </StyledMoreMenuItem>

                    <StyledMoreMenuItem
                      id="HeaderBarElectionFinder"
                      selected={normalizedHrefPage() === 'election-finder'}
                      onClick={this.navTo('/election-finder', 99)}
                      disableRipple
                    >
                      Election Finder
                    </StyledMoreMenuItem>

                    <StyledMoreMenuItem
                      id="HeaderBarFriends"
                      selected={normalizedHrefPage() === 'friends'}
                      onClick={this.navTo('/friends', 99)}
                      disableRipple
                    >
                      Friends
                    </StyledMoreMenuItem>

                    {isWebApp() && (  // Not in Cordova release 2.7.4 phones or tablets
                      <StyledMoreMenuItem
                        id="discussTabHeaderBar"
                        selected={normalizedHrefPage() === 'news'}
                        onClick={this.navTo('/news', 99)}
                        disableRipple
                      >
                        Discuss
                      </StyledMoreMenuItem>
                    )}

                    {nextReleaseFeaturesEnabled && (
                      <StyledMoreMenuItem
                        id="HeaderBarCandidatesManaging"
                        selected={['manage', 'managecandidates', 'no-candidates-claimed'].includes(normalizedHrefPage())}
                        onClick={this.navTo('/no-candidates-claimed', 99)}
                        disableRipple
                      >
                        Candidates I&apos;m managing
                      </StyledMoreMenuItem>
                    )}

                    {nextReleaseFeaturesEnabled && (
                      <StyledMoreMenuItem
                        id="HeaderBarChallenges"
                        selected={normalizedHrefPage() === 'challenges'}
                        onClick={this.navTo('/challenges', 99)}
                        disableRipple
                      >
                        Challenges
                      </StyledMoreMenuItem>
                    )}

                    {isWebApp() && (      // Not in Cordova release 2.7.4 phones or tablets
                      <Suspense fallback={<></>}>
                        <StyledMoreMenuItem>
                          <OpenExternalWebSite
                            linkIdAttribute="footerLinkBlog"
                            url="https://blog.wevote.us/"
                            target="_blank"
                            body={(
                              <span>Blog</span>
                            )}
                            className={classes.tabRootBlog}
                          />
                        </StyledMoreMenuItem>
                      </Suspense>
                    )}
                  </StyledMoreMenu>
                </>
              )}
            </div>
          </TopRowOneMiddleContainer>
          <TopRowOneRightContainer className="u-cursor--pointer">
            {voterIsSignedIn && voterPhotoUrlMedium ? (
              <>
                {/*
                <div>
                  {showEditAddressButton && editAddressButtonHtml}
                </div>
                */}
                {/*
                <div>
                  {searchButtonHtml}
                </div>
                */}
                <Suspense fallback={<></>}>
                  <HeaderNotificationMenu />
                </Suspense>
                <div id="profileAvatarHeaderBar"
                  className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                  style={avatarStyle}
                  onClick={this.goToSettings}
                >
                  <LazyImage
                    isAvatar
                    src={voterPhotoUrlMedium}
                    placeholder={avatarGeneric()}
                    style={{
                      marginLeft: 16,
                    }}
                    height={34}
                    width={34}
                    alt="Your Settings"
                  />
                </div>
              </>
            ) : (voterIsSignedIn && (
              <>
                {/*
                <div>
                  {showEditAddressButton && editAddressButtonHtml}
                </div>
                */}
                {/*
                <div>
                  {searchButtonHtml}
                </div>
                */}
                <Suspense fallback={<></>}>
                  <HeaderNotificationMenu />
                </Suspense>
                <IconButton
                  classes={{ root: classes.iconButtonRoot }}
                  id="profileAvatarHeaderBar"
                  onClick={this.goToSettings}
                  size="large"
                  aria-label="Your Settings"
                >
                  <AccountCircle />
                </IconButton>
              </>
            ))}
            {!voterIsSignedIn && (
              <>
                {/*
                <div>
                  {showEditAddressButton && editAddressButtonHtml}
                </div>
                */}
                {/*
                <div>
                  {searchButtonHtml}
                </div>
                */}
                <SignInButton toggleSignInModal={this.toggleSignInModal} />
              </>
            )}
          </TopRowOneRightContainer>
          <TopRowTwoLeftContainer style={{ display: `${(isFriends && voterIsSignedIn) ? 'inherit' : 'none'}`, paddingBottom: `${(isFriends && voterIsSignedIn) ? '0' : ''}` }}>
            {(isFriends && voterIsSignedIn) && (
              <FriendsTabs />
            )}
          </TopRowTwoLeftContainer>
        </TopOfPageHeader>
        <HeaderBarModals />
      </HeaderBarWrapper>
    );
  }
}
HeaderBar.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => {
  const tabBase = {
    color: 'rgba(51, 51, 51, 0.7)',
    fontSize: 18,
    minWidth: 90,
    opacity: 0.7,
    paddingTop: 17,
    '&.Mui-selected': {
      color: '#2e3c5d',
      fontWeight: 600,
      opacity: 1,
    },
  };
  const tabSelected = {
    color: '#2e3c5d',
    fontWeight: 600,
    opacity: 1,
  };

  return {
    tabRoot: { ...tabBase },
    tabRootMore: { ...tabBase },
    tabSelected: { ...tabSelected },

    padding: {
      padding: `0 ${theme.spacing(2)}px`,
    },
    moreLabel: {
      alignItems: 'center',
      display: 'flex',
      gap: 4,
      lineHeight: 1,
    },
    tabMoreIcon: {
      color: 'inherit',
      fontSize: 22,
    },

    addressButtonRoot: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
      color: 'rgba(17, 17, 17, .5)',
      outline: 'none !important',
      paddingRight: 6,
      [theme.breakpoints.up('sm')]: {
        paddingLeft: 0,
      },
      [theme.breakpoints.down('sm')]: {
        paddingTop: 6,
        marginLeft: 2,
        paddingLeft: 0,
      },
    },
    addressIconButtonRoot: {
      paddingTop: 1,
      paddingRight: 6,
      paddingBottom: 3,
      paddingLeft: 0,
      color: 'rgba(17, 17, 17, .4)',
      outline: 'none !important',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      [theme.breakpoints.up('sm')]: {
        paddingRight: 2,
      },
    },
    iconButtonRoot: {
      paddingTop: 1,
      paddingRight: 0,
      paddingBottom: 3,
      paddingLeft: 0,
      color: 'rgba(17, 17, 17, .4)',
      outline: 'none !important',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    searchButtonRoot: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
      color: 'rgba(17, 17, 17, .5)',
      outline: 'none !important',
      paddingTop: 0,
      paddingRight: 0,
      [theme.breakpoints.up('sm')]: {
        paddingLeft: 0,
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: 2,
        paddingLeft: 0,
      },
    },
    tooltipPlacementBottom: {
      marginTop: 0,
    },
    tabRootBallot: {
      minWidth: 90,
      [theme.breakpoints.between('tabMin', 'tabMdMin')]: { // Small Tablets
        minWidth: 0,
        fontSize: 20,
        padding: '16px 8px 10px 8px',
      },
      [theme.breakpoints.between('tabMdMin', 'tabLgMin')]: { // Medium Tablets
        fontSize: 20,
        padding: '16px 16px 10px 16px',
      },
      [theme.breakpoints.up('tabLgMin')]: { // Larger Tablets, and desktops
        fontSize: 24,
      },
    },
    tabRootBallotDesktop: {
      fontSize: 18,
      minWidth: 90,
      paddingTop: 17,
    },
    tabRootBlog: {
      color: 'rgba(51, 51, 51, 0.7)',
    },
    tabRootCandidates: {
      minWidth: 90,
      [theme.breakpoints.between('tabMin', 'tabMdMin')]: { // Small Tablets
        minWidth: 0,
        fontSize: 20,
        padding: '16px 8px 10px 8px',
      },
      [theme.breakpoints.between('tabMdMin', 'tabLgMin')]: { // Medium Tablets
        fontSize: 20,
        padding: '16px 16px 10px 16px',
      },
      [theme.breakpoints.up('tabLgMin')]: { // Larger Tablets, and desktops
        fontSize: 24,
      },
    },
    tabRootCandidatesDesktop: {
      fontSize: 18,
      minWidth: 90,
      paddingTop: 17,
    },
    tabRootDonate: {
      minWidth: 70,
      [theme.breakpoints.between('tabMin', 'tabMdMin')]: { // Small Tablets
        minWidth: 0,
        fontSize: 20,
        padding: '16px 8px 10px 8px',
      },
      [theme.breakpoints.between('tabMdMin', 'tabLgMin')]: { // Medium Tablets
        fontSize: 20,
        padding: '16px 16px 10px 16px',
      },
      [theme.breakpoints.up('tabLgMin')]: { // Larger Tablets, and desktop
        fontSize: 24,
      },
    },
    tabRootDonateDesktop: {
      fontSize: 18,
      minWidth: 70,
      paddingTop: 17,
    },
    tabRootFriends: {
      minWidth: 90,
      [theme.breakpoints.between('tabMin', 'tabMdMin')]: { // Small Tablets
        minWidth: 0,
        fontSize: 20,
        padding: '16px 8px 10px 8px',
      },
      [theme.breakpoints.between('tabMdMin', 'tabLgMin')]: { // Medium Tablets
        fontSize: 20,
        padding: '16px 16px 10px 16px',
      },
      [theme.breakpoints.up('tabLgMin')]: { // Larger Tablets, and desktop
        fontSize: 24,
      },
    },
    tabRootFriendsDesktop: {
      fontSize: 18,
      minWidth: 90,
      paddingTop: 17,
    },
    tabRootNews: {
      minWidth: 70,
      [theme.breakpoints.between('tabMin', 'tabMdMin')]: { // Small Tablets
        minWidth: 0,
        fontSize: 20,
        padding: '16px 8px 10px 8px',
      },
      [theme.breakpoints.between('tabMdMin', 'tabLgMin')]: { // Medium Tablets
        fontSize: 20,
        padding: '16px 16px 10px 16px',
      },
      [theme.breakpoints.up('tabLgMin')]: { // Larger Tablets, and desktop
        fontSize: 24,
      },
    },
    tabRootNewsDesktop: {
      fontSize: 18,
      minWidth: 70,
      paddingTop: 17,
    },
    tabRootHowItWorks: {
      minWidth: 70,
      [theme.breakpoints.between('tabMin', 'tabMdMin')]: { // Small Tablets
        minWidth: 0,
        fontSize: 20,
        padding: '16px 8px 10px 8px',
      },
      [theme.breakpoints.between('tabMdMin', 'tabLgMin')]: { // Medium Tablets
        fontSize: 20,
        padding: '16px 16px 10px 16px',
      },
      [theme.breakpoints.up('tabLgMin')]: { // Larger Tablets, and desktop
        fontSize: 24,
      },
    },
  };
};

const HeaderBarWrapper = styled.div.attrs({
  className: 'HeaderBarWrapper', // div.attrs and className all added to achieve drop-shadow on Donate page
  shouldForwardProp: (prop) => !['scrolledDown', 'hasSubmenu'].includes(prop),
})(({ scrolledDown, hasSubmenu }) => (`
  box-shadow: ${(!scrolledDown || !hasSubmenu) ? '' : standardBoxShadow('wide')};
  border-bottom: ${(!scrolledDown || !hasSubmenu) ? '' : '1px solid #aaa'};
  padding-left: calc(100vw - 100%);
`));

const StyledHeaderMenuTabs = styled(Tabs)`
  // {() => (isIOSAppOnMac() ? '' : displayNoneIfSmallerThanDesktop())};
`;
const StyledMoreMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 8px;
    box-shadow: ${standardBoxShadow('wide')};
    margin-top: 8px;
    min-width: 200px;
  }
`;

const StyledMoreMenuItem = styled(MenuItem)`
  color: rgba(51, 51, 51, 0.7);
  font-size: 18px;
  font-weight: 500;
  line-height: 1.2;
  opacity: 1;
  padding: 12px 16px;
  position: relative;

  &:hover {
    background: rgba(46, 60, 93, 0.06);
  }

  &.Mui-selected,
  &.Mui-selected:hover {
    background: transparent;
    color: #2e3c5d;
    font-weight: 600;
    opacity: 1;
  }
`;

export default withStyles(styles)(HeaderBar);
