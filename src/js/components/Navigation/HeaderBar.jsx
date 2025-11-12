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
import { hasIPhoneNotch, historyPush, isDeviceZoomed, isIOS, isIPhoneMiniOrSmaller } from '../../common/utils/cordovaUtils';
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
import OpenExternalWebSite from '../../common/components/Widgets/OpenExternalWebSite';
// import lookupPageNameAndPageTypeDict from '../../utils/lookupPageNameAndPageTypeDict';

const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));
const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

/* global $ */

// TODO: Backport "@stripe/react-stripe-js" use from Campaigns
// import PaidAccountUpgradeModal from '../Settings/PaidAccountUpgradeModal';


class HeaderBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenSiteLogoUrl: '',
      componentDidMountFinished: false,
      hideWeVoteLogo: false,
      scrolledDown: false,
      showSignInModal: false,
      tabsValue: 1,
      page: 'non-blank-default-value',
      voter: {},
      voterIsSignedIn: false,
    };
    this.debugLogging = this.debugLogging.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleResizeLocal = this.handleResizeLocal.bind(this);
  }

  getTabsValueFromPage = () => {
    const page = normalizedHrefPage();
    switch (page) {
      case 'ballot': return 1;
      case 'candidatelist':
      case 'politicianpage': return 2;
      case 'friends': return 3;
      case 'news': return 99;
      case 'challenges': return 4;
      case 'donate':
      case 'more/donate': return 5;
      case 'more':
      case 'managecandidates': return 99;
      default: return false;
    }
  };

  syncTabsToRoute = () => {
    const nextPage = normalizedHrefPage();
    const nextValue = this.getTabsValueFromPage();
    this.setState({ tabsValue: nextValue, page: nextPage }, () => {
      this.customHighlightSelector(nextValue);
    });
  };


  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.analyticsStoreListener = AnalyticsStore.addListener(this.onAnalyticsStoreChange.bind(this));
    window.addEventListener('resize', this.handleResizeLocal);

    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter && voter.is_signed_in;
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
      this.customHighlightSelector(newValue);
    });
  }

  handleResizeLocal () {
    if (handleResize('HeaderBar')) {
      this.setState({});
    }
  }

  onFriendStoreChange () {
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      this.setState({
      });
    }
  }

  onVoterStoreChange () {
    if (isIOS()) {
      if (isDeviceZoomed()) {
        window.localStorage.setItem('window.location.reloaded', 'true');
        window.location.reload(true);
      }
    }

    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      const voter = VoterStore.getVoter();
      const voterIsSignedIn = voter.is_signed_in || false;
      this.setState({
        voter,
        voterIsSignedIn,
        showSignInModal: AppObservableStore.showSignInModal(),
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  onAppObservableStoreChange (msg) {
    this.setState({
      chosenSiteLogoUrl: AppObservableStore.getChosenSiteLogoUrl(),
      hideWeVoteLogo: AppObservableStore.getHideWeVoteLogo(),
      scrolledDown: AppObservableStore.getScrolledDown(),
      showSignInModal: AppObservableStore.showSignInModal(),
    });
  }

  onAnalyticsStoreChange () {
    if (isCordova() && VoterStore.getVoterIsSignedIn() === false && (AnalyticsStore.getIsSignedIn() || FacebookStore.loggedIn)) {
      if (apiCalming('voterRetrieve', 500)) {
        VoterActions.voterRetrieve();
      }
    }
  }

  openHowItWorksModal = () => {
    AppObservableStore.setShowHowItWorksModal(true);
  }

  navTo = (path, highlightValue = 99) => () => {
    this.setState({ moreAnchorEl: null });
    this.handleTabChange(highlightValue);
    historyPush(path);
  };

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter/election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
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
          challenges.css(highlight);
          break;
        case 'donate':
        case 'more/donate':
          donate.css(highlight);
          break;
        case 'friends':
          friends.css(highlight);
          break;
        case 'news':
          news.css(highlight);
          break;
        case 'politicianpage':
          candidates.css(highlight);
          break;
        case 'squads':
          squads.css(highlight);
          break;
        case 'more':
          more.css(highlight);
          break;
        case 'managecandidates':
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

    this.setState({ page: normalizedHrefPage() });
  }

  goToSettings () {
    AppObservableStore.setDrawerOpen('headerProfileDrawerOpen', true);
  }

  toggleSignInModal () {
    const { showSignInModal } = this.state;
    AppObservableStore.setShowSignInModal(!showSignInModal);
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  render () {
    renderLog('HeaderBar');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.componentDidMountFinished) {
      return null;
    }

    if (window.leanLoadForChromeExtension) {
      return null;    // No header on the iFramed pages for the Chrome Extension
    }

    const { classes } = this.props;
    const {
      chosenSiteLogoUrl, hideWeVoteLogo, scrolledDown,
      voter, voterIsSignedIn, tabsValue,
    } = this.state;
    const inPrivateLabelMode = AppObservableStore.getHideWeVoteLogo();  // setState onAppObservableStoreChange is not working for some reason
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
    const displayMenu = !isMobileScreenSize() || isTablet();
    // If NOT signed in, turn Discuss off and How It Works on
    let discussValue;
    let discussVisible = false; // We are turning off Discuss header link for now
    let donateValue;
    let donateVisible;
    const friendsVisible = false; // 2023-09-04 Dale We are turning off Friends header link for now
    let howItWorksValue;
    const squadsVisible = false; // Set nextReleaseFeaturesEnabled && isWebApp();  when we want to turn on the Challenges header link
    let squadsValue;
    const howItWorksVisible = false;
    if (isCordova() || inPrivateLabelMode) {
      donateVisible = isIOS();
      donateValue = isIOS() ? 3 : 99;
    } else if (voterIsSignedIn) {
      // If not Cordova and signed in, turn Donate & Discuss on, and How It Works off
      donateValue = 5;
      donateVisible = true;
      squadsValue = 4;
    } else {
      // If not Cordova, and NOT signed in, turn Discuss off & How It Works on
      discussValue = 99; // Not offered prior to sign in
      discussVisible = false;
      donateValue = 5;
      donateVisible = true;
      howItWorksValue = 99;
      squadsValue = 4;
    }

    return (
      <HeaderBarWrapper
        hasNotch={hasIPhoneNotch()}
        scrolledDown={scrolledDown}
        hasSubmenu={displayTopMenuShadow()}
      >
        <TopOfPageHeader>
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
                    <Tab
                      value={99}
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
                        this.handleTabChange(99); // Highlight the tab
                      }}
                      aria-controls="more-menu"
                      aria-haspopup="true"
                      wrapped
                    />
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
                  <StyledMoreMenu
                    id="more-menu"
                    anchorEl={this.state.moreAnchorEl}
                    open={Boolean(this.state.moreAnchorEl)}
                    onClose={() => this.setState({ moreAnchorEl: null })}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <StyledMoreMenuItem
                      id="HeaderBarFriends"
                      selected={normalizedHrefPage() === 'friends'}
                      onClick={this.navTo('/friends', 99)}
                      disableRipple
                    >
                      Friends
                    </StyledMoreMenuItem>

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

                    {nextReleaseFeaturesEnabled && (
                      <StyledMoreMenuItem
                        id="HeaderBarCandidatesManaging"
                        selected={['manage', 'managecandidates'].includes(normalizedHrefPage())}
                        onClick={this.navTo('/managecandidates', 99)}
                        disableRipple
                      >
                        Candidates I&apos;m managing
                      </StyledMoreMenuItem>
                    )}
                    <StyledMoreMenuItem>
                      <OpenExternalWebSite
                        linkIdAttribute="footerLinkBlog"
                        url="https://blog.wevote.us/"
                        target="_blank"
                        body={(
                          <span>Blog</span>
                        )}
                        className={classes.link}
                      />
                    </StyledMoreMenuItem>
                  </StyledMoreMenu>
                </>
              )}
            </div>
          </TopRowOneMiddleContainer>
          <TopRowOneRightContainer className="u-cursor--pointer">
            {voterIsSignedIn && voterPhotoUrlMedium ? (
              <>
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
  shouldForwardProp: (prop) => !['hasNotch', 'scrolledDown', 'hasSubmenu'].includes(prop),
})(({ hasNotch, scrolledDown, hasSubmenu }) => (`
  margin-top: ${hasNotch && !isIPhoneMiniOrSmaller() ? '9%' : ''};
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
