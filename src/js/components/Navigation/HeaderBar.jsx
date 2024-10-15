import { AccountCircle } from '@mui/icons-material';
import { IconButton, Tabs } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterActions from '../../actions/VoterActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import LazyImage from '../../common/components/LazyImage';
import apiCalming from '../../common/utils/apiCalming';
import { hasIPhoneNotch, historyPush, isDeviceZoomed, isIOS } from '../../common/utils/cordovaUtils';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize, { handleResize, isSmallTablet, isTablet } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import voterPhoto from '../../common/utils/voterPhoto';
import AnalyticsStore from '../../stores/AnalyticsStore';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import FacebookStore from '../../stores/FacebookStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric, displayTopMenuShadow, weVoteBrandingOff } from '../../utils/applicationUtils';
import getHeaderObjects from '../../utils/getHeaderObjects';
import { TopOfPageHeader, TopRowOneLeftContainer, TopRowOneMiddleContainer, TopRowOneRightContainer, TopRowTwoLeftContainer } from '../Style/pageLayoutStyles';
import SignInButton from '../Widgets/SignInButton';
import signInModalGlobalState from '../../common/components/Widgets/signInModalGlobalState';
import FriendsTabs from './FriendsTabs';
import HeaderBarLogo from './HeaderBarLogo';
import HeaderBarModals from './HeaderBarModals';
import TabWithPushHistory from './TabWithPushHistory';
// import webAppConfig from '../../config';


const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));
// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

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
      }, 1000);
    }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   const pathname = normalizedHref();
  //   // console.log('HeaderBar shouldComponentUpdate: pathname === ', pathname);
  //   let update = false;
  //   if (pathname !== this.state.priorPath) {
  //     // Re-render the HeaderBar if the path has changed
  //     // console.log('HeaderBar shouldComponentUpdate: this.state.priorPath === ', this.state.priorPath);
  //     this.setState({ priorPath: pathname });
  //     update = true;
  //   } else if (this.state.componentDidMountFinished === false) {
  //     // console.log('shouldComponentUpdate: componentDidMountFinished === false');
  //     update = true;
  //   } else if (this.state.page !== normalizedHrefPage()) {
  //     // console.log('shouldComponentUpdate: this.state.page', this.state.page, ', normalizedHrefPage()', normalizedHrefPage());
  //     update = true;
  //   } else if (this.state.aboutMenuOpen !== nextState.aboutMenuOpen) {
  //     // console.log('shouldComponentUpdate: this.state.aboutMenuOpen", this.state.aboutMenuOpen, ', nextState.aboutMenuOpen', nextState.aboutMenuOpen);
  //     update = true;
  //   } else if (this.state.chosenSiteLogoUrl !== nextState.chosenSiteLogoUrl) {
  //     // console.log('shouldComponentUpdate: this.state.chosenSiteLogoUrl', this.state.chosenSiteLogoUrl, ', nextState.chosenSiteLogoUrl', nextState.chosenSiteLogoUrl);
  //     update = true;
  //   } else if (this.state.hideWeVoteLogo !== nextState.hideWeVoteLogo) {
  //     // console.log('shouldComponentUpdate: this.state.hideWeVoteLogo', this.state.hideWeVoteLogo, ', nextState.hideWeVoteLogo', nextState.hideWeVoteLogo);
  //     update = true;
  //   } else if (this.state.friendInvitationsSentToMe !== nextState.friendInvitationsSentToMe) {
  //     // console.log('shouldComponentUpdate: this.state.friendInvitationsSentToMe', this.state.friendInvitationsSentToMe, ', nextState.friendInvitationsSentToMe', nextState.friendInvitationsSentToMe);
  //     update = true;
  //   } else if (this.state.scrolledDown !== nextState.scrolledDown) {
  //     update = true;
  //   } else if (this.state.whatAndHowMuchToShare !== nextState.whatAndHowMuchToShare) {
  //     update = true;
  //   } else if (this.state.organizationModalBallotItemWeVoteId !== nextState.organizationModalBallotItemWeVoteId) {
  //     update = true;
  //   // } if (this.state.showEditAddressButton !== nextState.showEditAddressButton) {
  //   //   update = true;
  //   } else if (this.state.showOrganizationModal !== nextState.showOrganizationModal) {
  //     update = true;
  //   } else if (this.state.showPositionDrawer !== nextState.showPositionDrawer) {
  //     update = true;
  //   } else if (this.state.showSignInModal !== nextState.showSignInModal) {
  //     update = true;
  //   } else if (this.state.voterFirstName !== nextState.voterFirstName) {
  //     // console.log('this.state.voterFirstName: ', this.state.voterFirstName, ', nextState.voterFirstName', nextState.voterFirstName);
  //     update = true;
  //   } else if (this.state.voterIsSignedIn !== nextState.voterIsSignedIn) {
  //     // console.log('HeaderBar voter.isSignedIn shouldComponentUpdate true');
  //     update = true;
  //   }
  //   const thisVoterExists = this.state.voter !== undefined;
  //   const nextVoterExists = nextState.voter !== undefined;
  //   if (nextVoterExists && !thisVoterExists) {
  //     // console.log('HeaderBar shouldComponentUpdate: thisVoterExists", thisVoterExists, ", nextVoterExists", nextVoterExists);
  //     update = true;
  //   }
  //   if (thisVoterExists && nextVoterExists) {
  //     if (this.state.voter.voter_photo_url_medium !== nextState.voter.voter_photo_url_medium) {
  //       // console.log('HeaderBar shouldComponentUpdate: this.state.voter.voter_photo_url_medium', this.state.voter.voter_photo_url_medium, ', nextState.voter.voter_photo_url_medium', nextState.voter.voter_photo_url_medium);
  //       update = true;
  //     }
  //     if (this.state.voter.signed_in_twitter !== nextState.voter.signed_in_twitter) {
  //       // console.log('HeaderBar shouldComponentUpdate: this.state.voter.signed_in_twitter", this.state.voter.signed_in_twitter, ", nextState.voter.signed_in_twitter", nextState.voter.signed_in_twitter);
  //       update = true;
  //     }
  //     if (this.state.voter.signed_in_facebook !== nextState.voter.signed_in_facebook) {
  //       // console.log('HeaderBar shouldComponentUpdate: this.state.voter.signed_in_facebook', this.state.voter.signed_in_facebook, ', nextState.voter.signed_in_facebook', nextState.voter.signed_in_facebook);
  //       update = true;
  //     }
  //     if (this.state.voter.signed_in_with_email !== nextState.voter.signed_in_with_email) {
  //       update = true;
  //     }
  //   }
  //   // We need to update if the SelectBallotModal is displayed or the BallotList is empty
  //   const element = document.getElementById('BallotListId');
  //   if (element) {
  //     const textForMapSearch = VoterStore.getTextForMapSearch();
  //     const titleElement = document.getElementById('SelectBallotModalTitleId');
  //     const isTitleElementDisplayed = (titleElement && !(titleElement.offsetParent === null)) || false;
  //     if (isTitleElementDisplayed || (element.innerHTML.trim().length < 1 && textForMapSearch)) {
  //       update = true;
  //     }
  //   }
  //
  //   // console.log('HeaderBar shouldComponentUpdate: update === ', update);
  //   return update;
  // }

  componentDidUpdate () {
    // console.log('HeaderBar componentDidUpdate');
    const { page } = this.state;
    if (page !== normalizedHrefPage()) {
      this.customHighlightSelector();
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

  handleTabChange (newValue) {
    this.customHighlightSelector();
    // console.log('handleTabChange ', newValue);
    this.setState({ tabsValue: newValue });
  }

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

    if (isIOS()) {
      if (isDeviceZoomed()) {
        // October 20, 2021: in iOS, at the Facebook site, within the facebook sign-in dialog, when you tab between the username and the password, our
        // HeaderBar and FooterBar expand off of the screen -- i.e. the screen zooms in.
        // Rotating (forcing a redraw) fixes it, so for new we just detect the condition in isDeviceZoomed and force a full DOM reload to clear the zoom.
        window.localStorage.setItem('window.location.reloaded', 'true');
        window.location.reload(true);
      }
    }

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

  // goToSearch = () => {
  //   historyPush('/opinions');
  // }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  }

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
  customHighlightSelector () {
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
      ballot.css(normal);
      candidates.css(normal);   // Candidates (not individual candidate page)
      challenges.css(normal);   // Democracy Challenges
      friends.css(normal);      // Friends
      news.css(normal);         // Discuss
      donate.css(normal);       // Donate
      squads.css(normal);       // Squads

      switch (normalizedHrefPage()) {
        case 'ballot':
          ballot.css(highlight);
          break;
        case 'candidatelist': // displays same page as "cs"
          candidates.css(highlight);
          break;
        case 'challenges':
          challenges.css(highlight);
          break;
        case 'friends':
          friends.css(highlight);
          break;
        case 'news':
          news.css(highlight);
          break;
        case 'donate':
        case 'more/donate':
          donate.css(highlight);
          break;
        case 'squads':
          squads.css(highlight);
          break;
        default:
          break;
      }
    } else {
      setTimeout(() => {
        console.log('customHighlightSelector purposefully called recursively');
        this.customHighlightSelector();
      }, 500);
    }
    this.setState({ page: normalizedHrefPage() });
  }

  goToSettings () {
    if (isMobileScreenSize()) {
      historyPush('/settings/hamburger');
    } else {
      historyPush('/settings/profile');
    }
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
    // console.log('HeaderBar hasNotch, scrolledDown, hasSubmenu', hasIPhoneNotch(), scrolledDown, displayTopMenuShadow());
    const displayMenu = !isMobileScreenSize() || isTablet();
    // console.log('HeaderBar isMobileScreenSize(), isTablet()', isMobileScreenSize(), isTablet());
    // If NOT signed in, turn Discuss off and How It Works on
    let discussValue;
    let discussVisible;
    let donateValue;
    let donateVisible;
    const friendsVisible = false; // 2023-09-04 Dale We are turning off Friends header link for now
    let howItWorksValue;
    const squadsVisible = isWebApp();
    // const squadsVisible = false;
    let squadsValue;
    // let howItWorksVisible;
    const howItWorksVisible = false;
    if (isCordova() || inPrivateLabelMode) {
      discussValue = 99; // 4;
      discussVisible = false; // We are turning off Discuss header link for now
      donateValue = 99; // Donate not used in Cordova
      donateVisible = false;
      howItWorksValue = 5;
      // howItWorksVisible = true;
      squadsValue = 4;
    } else if (voterIsSignedIn) {
      // If not Cordova and signed in, turn Donate & Discuss on, and How It Works off
      // discussValue = 4;
      // discussVisible = false; // We are turning off Discuss header link for now
      donateValue = 5;
      donateVisible = true;
      howItWorksValue = 99;
      // howItWorksVisible = false;
      squadsValue = 4;
    } else {
      // If not Cordova, and NOT signed in, turn Discuss off & How It Works on
      discussValue = 99; // Not offered prior to sign in
      discussVisible = false;
      donateValue = 5;
      donateVisible = true;
      howItWorksValue = 99;
      // howItWorksVisible = true;
      squadsValue = 4;
    }
    // console.log('HeaderBar !isMobileScreenSize()', displayMenu);
    return (
      <HeaderBarWrapper
        hasNotch={hasIPhoneNotch()}
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
              { displayMenu && (
                <StyledHeaderMenuTabs
                  value={tabsValue}
                  indicatorColor="primary"
                  classes={{ indicator: classes.indicator }}
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
                  {friendsVisible && (
                    <TabWithPushHistory
                      classes={isWebApp() ? { root: classes.tabRootFriendsDesktop } : { root: classes.tabRootFriends }}
                      value={3}
                      change={this.handleTabChange}
                      id="friendsTabHeaderBar"
                      label="Friends"
                      to="/friends"
                    />
                  )}
                  {discussVisible && (
                    <TabWithPushHistory
                      classes={isWebApp() ? { root: classes.tabRootNewsDesktop } : { root: classes.tabRootNews }}
                      value={discussValue}
                      change={this.handleTabChange}
                      id="discussTabHeaderBar"
                      label="Discuss"
                      to="/news"
                    />
                  )}
                  {squadsVisible && (
                    <TabWithPushHistory
                      classes={isWebApp() ? { root: classes.tabRootDonateDesktop } : { root: classes.tabRootDonate }}
                      value={squadsValue}
                      change={this.handleTabChange}
                      id="challengesTabHeaderBar"
                      label="Challenges"  // Was Squads
                      to="/challenges"  // Was "/squads"
                    />
                  )}
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
                  {howItWorksVisible && (
                    <TabWithPushHistory
                      classes={isWebApp() ? { root: classes.tabRootHowItWorksDesktop } : { root: classes.tabRootHowItWorks }}
                      value={howItWorksValue}
                      change={this.openHowItWorksModal}
                      id="howItWorksTabHeaderBar"
                      label="How It Works"
                    />
                  )}
                </StyledHeaderMenuTabs>
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

const styles = (theme) => ({
  padding: {
    padding: `0 ${theme.spacing(2)}px`,
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
  tabRootHowItWorksDesktop: {
    fontSize: 18,
    minWidth: 70,
    paddingTop: 17,
  },
  indicator: {
    display: 'none',
  },
});

const HeaderBarWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hasNotch', 'scrolledDown', 'hasSubmenu'].includes(prop),
})(({ hasNotch, scrolledDown, hasSubmenu }) => (`
  margin-top: ${hasNotch ? '9%' : ''};
  box-shadow: ${(!scrolledDown || !hasSubmenu)  ? '' : standardBoxShadow('wide')};
  border-bottom: ${(!scrolledDown || !hasSubmenu) ? '' : '1px solid #aaa'};
`));

const StyledHeaderMenuTabs = styled(Tabs)`
  // {() => (isIOSAppOnMac() ? '' : displayNoneIfSmallerThanDesktop())};
`;

export default withStyles(styles)(HeaderBar);
