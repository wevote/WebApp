import { AccountCircle, Place, Search } from '@mui/icons-material';
import { Button, IconButton, Tabs, Tooltip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterActions from '../../actions/VoterActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import LazyImage from '../../common/components/LazyImage';
import apiCalming from '../../common/utils/apiCalming';
import { hasIPhoneNotch, historyPush, isDeviceZoomed, isIOS, isIOSAppOnMac } from '../../common/utils/cordovaUtils';
import getBooleanValue from '../../common/utils/getBooleanValue';
import { normalizedHref, normalizedHrefPage } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import voterPhoto from '../../common/utils/voterPhoto';
import AnalyticsStore from '../../stores/AnalyticsStore';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FacebookStore from '../../stores/FacebookStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric, displayTopMenuShadow, weVoteBrandingOff } from '../../utils/applicationUtils';
import getHeaderObjects from '../../utils/getHeaderObjects';
import { stringContains } from '../../utils/textFormat';
import { TopOfPageHeader, TopRowOneLeftContainer, TopRowOneMiddleContainer, TopRowOneRightContainer, TopRowTwoLeftContainer } from '../Style/pageLayoutStyles';
import SignInButton from '../Widgets/SignInButton';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import FriendsTabs from './FriendsTabs';
import HeaderBarLogo from './HeaderBarLogo';
import HeaderBarModals from './HeaderBarModals';
import TabWithPushHistory from './TabWithPushHistory';


const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));

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
      friendInvitationsSentToMe: 0,
      hideWeVoteLogo: false,
      // paidAccountUpgradeMode: '',
      priorPath: '',
      scrolledDown: false,
      showAdviserIntroModal: false,
      showChooseOrOpposeIntroModal: false,
      showEditAddressButton: false,
      showFirstPositionIntroModal: false,
      showSelectBallotModal: false,
      showSelectBallotModalHideAddress: false,
      showSelectBallotModalHideElections: false,
      showShareModal: false,
      showOrganizationModal: false,
      showSignInModal: false,
      showPaidAccountUpgradeModal: false,
      showPersonalizedScoreIntroModal: false,
      showPositionDrawer: false,
      showValuesIntroModal: false,
      showImageUploadModal: false,
      shareModalStep: '',
      tabsValue: 1,
      organizationModalBallotItemWeVoteId: '',
      page: 'non-blank-default-value',
      voter: {},
      voterFirstName: '',
      voterIsSignedIn: false,
      // firstVisitToBallot: true,
    };
    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.closeSignInModal = this.closeSignInModal.bind(this);
    this.debugLogging = this.debugLogging.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  componentDidMount () {
    this.appStateSubscription = messageService.getMessage().subscribe((msg) => this.onAppObservableStoreChange(msg));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.analyticsStoreListener = AnalyticsStore.addListener(this.onAnalyticsStoreChange.bind(this));

    const voter = VoterStore.getVoter();
    const voterFirstName = VoterStore.getFirstName();
    const voterIsSignedIn = voter && voter.is_signed_in;
    // if (voterIsSignedIn === undefined) {
    //   VoterActions.voterRetrieve();
    // }
    this.setState({
      componentDidMountFinished: true,
      chosenSiteLogoUrl: AppObservableStore.getChosenSiteLogoUrl(),
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      hideWeVoteLogo: AppObservableStore.getHideWeVoteLogo(),
      scrolledDown: AppObservableStore.getScrolledDown(),
      showAdviserIntroModal: AppObservableStore.showAdviserIntroModal(),
      showChooseOrOpposeIntroModal: AppObservableStore.showChooseOrOpposeIntroModal(),
      showEditAddressButton: AppObservableStore.showEditAddressButton(),
      showFirstPositionIntroModal: AppObservableStore.showFirstPositionIntroModal(),
      showPaidAccountUpgradeModal: false, // June 2021 , TODO: Add back in paid upgrade modal
      showPersonalizedScoreIntroModal: AppObservableStore.showPersonalizedScoreIntroModal(),
      showSelectBallotModal: AppObservableStore.showSelectBallotModal(),
      showSelectBallotModalHideAddress: getBooleanValue(AppObservableStore.showSelectBallotModalHideAddress()),
      showSelectBallotModalHideElections: getBooleanValue(AppObservableStore.showSelectBallotModalHideElections()),
      // showSignInModal: AppObservableStore.showSignInModal(),
      showValuesIntroModal: AppObservableStore.showValuesIntroModal(),
      showImageUploadModal: AppObservableStore.showImageUploadModal(),
      voter,
      voterFirstName,
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
        if (document.getElementById('friendsTabHeaderBar')) {
          headerObjects.opinions = document.getElementById('friendsTabHeaderBar').innerHTML;
        }
        if (document.getElementById('discussTabHeaderBar')) {
          headerObjects.discuss = document.getElementById('discussTabHeaderBar').innerHTML;
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

  shouldComponentUpdate (nextProps, nextState) {
    const pathname = normalizedHref();
    // console.log('HeaderBar shouldComponentUpdate: pathname === ', pathname);
    let update = false;
    if (pathname !== this.state.priorPath) {
      // Re-render the HeaderBar if the path has changed
      // console.log('HeaderBar shouldComponentUpdate: this.state.priorPath === ', this.state.priorPath);
      this.setState({ priorPath: pathname });
      update = true;
    } else if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      update = true;
    } else if (this.state.page !== normalizedHrefPage()) {
      // console.log('shouldComponentUpdate: this.state.page', this.state.page, ', normalizedHrefPage()', normalizedHrefPage());
      update = true;
    } else if (this.state.aboutMenuOpen !== nextState.aboutMenuOpen) {
      // console.log('shouldComponentUpdate: this.state.aboutMenuOpen", this.state.aboutMenuOpen, ', nextState.aboutMenuOpen', nextState.aboutMenuOpen);
      update = true;
    } else if (this.state.chosenSiteLogoUrl !== nextState.chosenSiteLogoUrl) {
      // console.log('shouldComponentUpdate: this.state.chosenSiteLogoUrl', this.state.chosenSiteLogoUrl, ', nextState.chosenSiteLogoUrl', nextState.chosenSiteLogoUrl);
      update = true;
    } else if (this.state.hideWeVoteLogo !== nextState.hideWeVoteLogo) {
      // console.log('shouldComponentUpdate: this.state.hideWeVoteLogo', this.state.hideWeVoteLogo, ', nextState.hideWeVoteLogo', nextState.hideWeVoteLogo);
      update = true;
    } else if (this.state.friendInvitationsSentToMe !== nextState.friendInvitationsSentToMe) {
      // console.log('shouldComponentUpdate: this.state.friendInvitationsSentToMe', this.state.friendInvitationsSentToMe, ', nextState.friendInvitationsSentToMe', nextState.friendInvitationsSentToMe);
      update = true;
    } else if (this.state.scrolledDown !== nextState.scrolledDown) {
      update = true;
    } else if (this.state.shareModalStep !== nextState.shareModalStep) {
      update = true;
    } else if (this.state.organizationModalBallotItemWeVoteId !== nextState.organizationModalBallotItemWeVoteId) {
      update = true;
    } else if (this.state.showAdviserIntroModal !== nextState.showAdviserIntroModal) {
      update = true;
    } else if (this.state.showChooseOrOpposeIntroModal !== nextState.showChooseOrOpposeIntroModal) {
      update = true;
    } if (this.state.showEditAddressButton !== nextState.showEditAddressButton) {
      update = true;
    } else if (this.state.showFirstPositionIntroModal !== nextState.showFirstPositionIntroModal) {
      update = true;
    } else if (this.state.showPaidAccountUpgradeModal !== nextState.showPaidAccountUpgradeModal) {
      update = true;
    } else if (this.state.showPersonalizedScoreIntroModal !== nextState.showPersonalizedScoreIntroModal) {
      update = true;
    } else if (this.state.showShareModal !== nextState.showShareModal) {
      update = true;
    } else if (this.state.showOrganizationModal !== nextState.showOrganizationModal) {
      update = true;
    } else if (this.state.showPositionDrawer !== nextState.showPositionDrawer) {
      update = true;
    } else if (this.state.showSignInModal !== nextState.showSignInModal) {
      update = true;
    } else if (this.state.showValuesIntroModal !== nextState.showValuesIntroModal) {
      update = true;
    } else if (this.state.showImageUploadModal !== nextState.showImageUploadModal) {
      update = true;
    } else if (this.state.voterFirstName !== nextState.voterFirstName) {
      // console.log('this.state.voterFirstName: ', this.state.voterFirstName, ', nextState.voterFirstName', nextState.voterFirstName);
      update = true;
    } else if (this.state.voterIsSignedIn !== nextState.voterIsSignedIn) {
      // console.log('HeaderBar voter.isSignedIn shouldComponentUpdate true');
      update = true;
    } else if (this.state.showSelectBallotModal !== nextState.showSelectBallotModal) {
      update = true;
    } else if (this.state.showSelectBallotModalHideAddress !== nextState.showSelectBallotModalHideAddress) {
      update = true;
    } else if (this.state.showSelectBallotModalHideElections !== nextState.showSelectBallotModalHideElections) {
      update = true;
    }
    const thisVoterExists = this.state.voter !== undefined;
    const nextVoterExists = nextState.voter !== undefined;
    if (nextVoterExists && !thisVoterExists) {
      // console.log('HeaderBar shouldComponentUpdate: thisVoterExists", thisVoterExists, ", nextVoterExists", nextVoterExists);
      update = true;
    }
    if (thisVoterExists && nextVoterExists) {
      if (this.state.voter.voter_photo_url_medium !== nextState.voter.voter_photo_url_medium) {
        // console.log('HeaderBar shouldComponentUpdate: this.state.voter.voter_photo_url_medium', this.state.voter.voter_photo_url_medium, ', nextState.voter.voter_photo_url_medium', nextState.voter.voter_photo_url_medium);
        update = true;
      }
      if (this.state.voter.signed_in_twitter !== nextState.voter.signed_in_twitter) {
        // console.log('HeaderBar shouldComponentUpdate: this.state.voter.signed_in_twitter", this.state.voter.signed_in_twitter, ", nextState.voter.signed_in_twitter", nextState.voter.signed_in_twitter);
        update = true;
      }
      if (this.state.voter.signed_in_facebook !== nextState.voter.signed_in_facebook) {
        // console.log('HeaderBar shouldComponentUpdate: this.state.voter.signed_in_facebook', this.state.voter.signed_in_facebook, ', nextState.voter.signed_in_facebook', nextState.voter.signed_in_facebook);
        update = true;
      }
      if (this.state.voter.signed_in_with_email !== nextState.voter.signed_in_with_email) {
        update = true;
      }
    }
    // We need to update if the SelectBallotModal is displayed or the BallotList is empty
    const element = document.getElementById('BallotListId');
    if (element) {
      const textForMapSearch = VoterStore.getTextForMapSearch();
      const titleElement = document.getElementById('SelectBallotModalTitleId');
      const isTitleElementDisplayed = (titleElement && !(titleElement.offsetParent === null)) || false;
      if (isTitleElementDisplayed || (element.innerHTML.trim().length < 1 && textForMapSearch)) {
        update = true;
      }
    }

    // console.log('HeaderBar shouldComponentUpdate: update === ', update);
    return update;
  }

  componentDidUpdate () {
    // console.log('HeaderBar componentDidUpdate');
    const { location: { pathname } } = window;
    if (stringContains('/ballot', pathname.toLowerCase().slice(0, 7)) ||
      stringContains('/ready', pathname.toLowerCase().slice(0, 7))) {
      if (!AppObservableStore.showEditAddressButton()) {
        AppObservableStore.setShowEditAddressButton(true);
      }
    } else if (AppObservableStore.showEditAddressButton()) {
      AppObservableStore.setShowEditAddressButton(false);
    }
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
    if (this.setStyleTimeout) clearTimeout(this.setStyleTimeout);
    if (this.showBallotModalTimeout) clearTimeout(this.showBallotModalTimeout);
  }

  handleTabChange (newValue) {
    this.customHighlightSelector();
    // console.log('handleTabChange ', newValue);
    this.setState({ tabsValue: newValue });
  }

  // eslint-disable-next-line no-unused-vars
  onAppObservableStoreChange (msg) {
    // console.log('------ HeaderBar, onAppObservableStoreChange received: ', msg);
    const paidAccountUpgradeMode = AppObservableStore.showPaidAccountUpgradeModal() || '';
    // console.log('HeaderBar paidAccountUpgradeMode:', paidAccountUpgradeMode);
    const showPaidAccountUpgradeModal = paidAccountUpgradeMode && paidAccountUpgradeMode !== '';
    // console.log('HeaderBar onAppObservableStoreChange showPaidAccountUpgradeModal:', showPaidAccountUpgradeModal);
    this.setState({
      chosenSiteLogoUrl: AppObservableStore.getChosenSiteLogoUrl(),
      hideWeVoteLogo: AppObservableStore.getHideWeVoteLogo(),
      organizationModalBallotItemWeVoteId: AppObservableStore.getOrganizationModalBallotItemWeVoteId(),
      // paidAccountUpgradeMode,
      scrolledDown: AppObservableStore.getScrolledDown(),
      shareModalStep: AppObservableStore.getShareModalStep(),
      showAdviserIntroModal: AppObservableStore.showAdviserIntroModal(),
      showChooseOrOpposeIntroModal: AppObservableStore.showChooseOrOpposeIntroModal(),
      // showEditAddressButton: AppObservableStore.showEditAddressButton(),
      showEditAddressButton: false, // 2022-03-30 Turned off now -- may be permanently off
      showFirstPositionIntroModal: AppObservableStore.showFirstPositionIntroModal(),
      showPaidAccountUpgradeModal,
      showShareModal: AppObservableStore.showShareModal(),
      showPersonalizedScoreIntroModal: AppObservableStore.showPersonalizedScoreIntroModal(),
      showSelectBallotModal: AppObservableStore.showSelectBallotModal(),
      showSelectBallotModalHideAddress: AppObservableStore.showSelectBallotModalHideAddress(),
      showSelectBallotModalHideElections: AppObservableStore.showSelectBallotModalHideElections(),
      // showSignInModal: AppObservableStore.showSignInModal(),
      showValuesIntroModal: AppObservableStore.showValuesIntroModal(),
      showImageUploadModal: AppObservableStore.showImageUploadModal(),
    });
  }

  onFriendStoreChange () {
    // console.log('HeaderBar, onFriendStoreChange textOrEmailSignInInProcess: ' + signInModalGlobalState.get('textOrEmailSignInInProcess'));
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('HeaderBar, onFriendStoreChange');
      this.setState({
        friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
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
      const voterFirstName = VoterStore.getFirstName();
      const voterIsSignedIn = voter.is_signed_in || false;
      this.setState({
        voter,
        voterFirstName,
        voterIsSignedIn,
        // showSignInModal: AppObservableStore.showSignInModal(),
        showShareModal: AppObservableStore.showShareModal(),
        showOrganizationModal: AppObservableStore.showOrganizationModal(),
        showPersonalizedScoreIntroModal: AppObservableStore.showPersonalizedScoreIntroModal(),
        showPositionDrawer: AppObservableStore.showPositionDrawer(),
      });
    }
  }

  onAnalyticsStoreChange () {
    // A page reload for iOS in Cordova after facebook login forces the need for a voterRetrieve, after redrawing the page
    // (and without requiring changes to the API server), the first response that indicates 'is signed in' is an Analytics call response
    // console.log('onAnalyticsStoreChange VoterStore.getVoterIsSignedIn(): ', VoterStore.getVoterIsSignedIn(), ' AnalyticsStore.getIsSignedIn(): ', AnalyticsStore.getIsSignedIn(), 'FacebookStore.loggedIn: ', FacebookStore.loggedIn, 'VoterStore.voterDeviceId(): ', VoterStore.voterDeviceId());
    if (isCordova() && VoterStore.getVoterIsSignedIn() === false && (AnalyticsStore.getIsSignedIn() || FacebookStore.loggedIn)) {
      if (apiCalming('voterRetrieve', 500)) {
        // console.log('Cordova:  HeaderBar onAnalyticsStoreChange, firing voterRetrieve --------------');  // Do not comment out or delete
        VoterActions.voterRetrieve();
      }
    }
  }

  goToSearch = () => {
    historyPush('/opinions');
  }

  closeAdviserIntroModal = () => {
    AppObservableStore.setShowAdviserIntroModal(false);
  }

  closeChooseOrOpposeIntroModal = () => {
    AppObservableStore.setShowChooseOrOpposeIntroModal(false);
  }

  closeFirstPositionIntroModal = () => {
    AppObservableStore.setShowFirstPositionIntroModal(false);
  }

  closeImageUploadModal = () => {
    AppObservableStore.setShowImageUploadModal(false);
  }

  closeValuesIntroModal = () => {
    AppObservableStore.setShowValuesIntroModal(false);
  }

  closePersonalizedScoreIntroModal = () => {
    AppObservableStore.setShowPersonalizedScoreIntroModal(false);
  }

  closePaidAccountUpgradeModal () {
    AppObservableStore.setShowPaidAccountUpgradeModal(false);
  }

  closeShareModal () {
    AppObservableStore.setShowShareModal(false);
    AppObservableStore.setShareModalStep('');
    const pathname = normalizedHref();
    // console.log('HeaderBar closeShareModal pathname:', pathname);
    if (stringContains('/modal/share', pathname) && isWebApp()) {
      const pathnameWithoutModalShare = pathname.replace('/modal/share', '');  // Cordova
      // console.log('Navigation closeShareModal pathnameWithoutModalShare:', pathnameWithoutModalShare);
      historyPush(pathnameWithoutModalShare);
    }
  }

  // December 2020: destinationUrlForHistoryPush is not defined in this class, so we never make the HistoryPush
  // eslint-disable-next-line no-unused-vars
  toggleSelectBallotModal (showSelectBallotModalHideAddress = false, showSelectBallotModalHideElections = false) {
    const { showSelectBallotModal } = this.state;
    if (!showSelectBallotModal) {
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }
    AppObservableStore.setShowSelectBallotModal(!showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections);

    this.setState({
      showSelectBallotModal: !showSelectBallotModal,
      // firstVisitToBallot: false,
    });
  }

  closeSignInModal () {
    // console.log('HeaderBar closeSignInModal');
    this.setState({ showSignInModal: false });
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  toggleSignInModal () {
    // console.log('HeaderBar toggleSignInModal');
    const { showSignInModal } = this.state;
    AppObservableStore.setShowSignInModal(!showSignInModal);
    this.setState({
      showSignInModal: !showSignInModal,
    });
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
      fontWeight: 800,
      color: '#2e3c5d',
    };

    if (window.$) {
      // console.log('customHighlightSelector called for page: ', normalizedHrefPage());
      const ballot = $('#ballotTabHeaderBar');
      const friends = $('#friendsTabHeaderBar');
      const news = $('#discussTabHeaderBar');
      ballot.css(normal);
      friends.css(normal);       // Opinions
      news.css(normal);         // Discuss

      switch (normalizedHrefPage()) {
        case 'ballot':
          ballot.css(highlight);
          break;
        case 'friends':
          friends.css(highlight);
          break;
        case 'news':
          news.css(highlight);
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

  render () {
    renderLog('HeaderBar');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.componentDidMountFinished) {
      return null;
    }

    const { classes } = this.props;
    const {
      chosenSiteLogoUrl, hideWeVoteLogo, /* paidAccountUpgradeMode, */ scrolledDown,
      showAdviserIntroModal, showChooseOrOpposeIntroModal, showEditAddressButton, showFirstPositionIntroModal,
      showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
      showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections,
      showShareModal, showSignInModal, showValuesIntroModal, showImageUploadModal,
      voter, voterIsSignedIn, tabsValue,
    } = this.state;
    /* eslint object-property-newline: ["off"] */
    const shows = {
      showAdviserIntroModal, showChooseOrOpposeIntroModal, showEditAddressButton, showFirstPositionIntroModal,
      showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
      showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections,
      showShareModal, showSignInModal, showValuesIntroModal, showImageUploadModal,
    };
    const showFullNavigation = true;
    // const showingBallot = pathname.startsWith('/ballot');
    // const showingFriendsTabs = displayFriendsTabs();
    const voterPhotoUrlMedium = voterPhoto(voter);
    const hideAddressWrapper = false; // isAndroid() && getAndroidSize() === '--xl';
    const editAddressButtonHtml = (
      <Tooltip title="Change my location or election" aria-label="Change Address or Election" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
        <>
          <AddressWrapperDesktop className="u-show-desktop-tablet">
            <IconButton
              classes={{ root: classes.addressIconButtonRoot }}
              id="changeAddressOrElectionHeaderBarElection"
              onClick={() => this.toggleSelectBallotModal(false, false)}
              size="large"
            >
              <Place />
            </IconButton>
            <Button
              color="primary"
              classes={{ root: classes.addressButtonRoot }}
              id="changeAddressOrElectionHeaderBarText"
              onClick={() => this.toggleSelectBallotModal(false, false)}
            >
              Address & Elections
            </Button>
          </AddressWrapperDesktop>
          <AddressWrapperMobile className="u-show-mobile"
                                style={hideAddressWrapper ? { display: 'none' } : {}}
          >
            <IconButton
              classes={{ root: classes.addressIconButtonRoot }}
              id="changeAddressOnlyHeaderBar"
              onClick={() => this.toggleSelectBallotModal(false, true)}
              size="large"
            >
              <Place />
            </IconButton>
          </AddressWrapperMobile>
        </>
      </Tooltip>
    );
    const searchButtonHtml = (
      <Tooltip title="Search" aria-label="Search" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
        <>
          <SearchWrapper className="u-show-desktop-tablet">
            <IconButton
              classes={{ root: classes.searchButtonRoot }}
              id="searchHeaderBarDesktop"
              onClick={this.goToSearch}
              size="large"
            >
              <Search />
            </IconButton>
          </SearchWrapper>
          <SearchWrapper className="u-show-mobile-bigger-than-iphone5">
            <IconButton
              classes={{ root: classes.searchButtonRoot }}
              id="searchHeaderBarMobile"
              onClick={this.goToSearch}
              size="large"
            >
              <Search />
            </IconButton>
          </SearchWrapper>
        </>
      </Tooltip>
    );

    const doNotShowWeVoteLogo = weVoteBrandingOff() || hideWeVoteLogo;
    const showWeVoteLogo = !doNotShowWeVoteLogo;
    // let appBarCname = 'page-header ';
    // if (hasIPhoneNotch()) {
    //   appBarCname += ' page-header__cordova-iphonex';
    // } else if (isCordova()) {
    //   appBarCname += ' page-header__cordova';
    // }

    const isFriends = normalizedHrefPage() === 'friends';  // The URL '/friends/request' yields 'friends'

    // console.log('HeaderBar hasNotch, scrolledDown, hasSubmenu', hasIPhoneNotch(), scrolledDown, displayTopMenuShadow());
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
                showFullNavigation={!!showFullNavigation}
                // isBeta={showWeVoteLogo && !chosenSiteLogoUrl}
              />
            )}
            <div className="header-nav" style={isMobileScreenSize() ? { display: 'none' } : {}}>
              <Tabs
                className={isIOSAppOnMac() ? '' : 'u-show-desktop'}
                value={tabsValue}
                indicatorColor="primary"
                classes={{ indicator: classes.indicator }}
              >
                {showFullNavigation && (
                  <TabWithPushHistory
                    classes={{ root: classes.tabRootBallot }}
                    value={1}
                    change={this.handleTabChange}
                    id="ballotTabHeaderBar"
                    label="Ballot"
                    to="/ballot"
                  />
                )}
                <TabWithPushHistory
                  classes={{ root: classes.tabRootValues }}
                  value={2}
                  change={this.handleTabChange}
                  id="friendsTabHeaderBar"
                  label="Friends"
                  to="/friends"
                />
                {(showFullNavigation) && (
                  <TabWithPushHistory
                    classes={{ root: classes.tabRootNews }}
                    value={3}
                    change={this.handleTabChange}
                    id="discussTabHeaderBar"
                    label="Discuss"
                    to="/news"
                  />
                )}
              </Tabs>
            </div>
          </TopRowOneLeftContainer>
          <TopRowOneMiddleContainer />
          <TopRowOneRightContainer className="u-cursor--pointer">
            {voterIsSignedIn && voterPhotoUrlMedium ? (
              <>
                <div>
                  {showEditAddressButton && editAddressButtonHtml}
                </div>
                <div>
                  {searchButtonHtml}
                </div>
                <Suspense fallback={<></>}>
                  <HeaderNotificationMenu />
                </Suspense>
                <div id="profileAvatarHeaderBar"
                  className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                  style={isCordova() ? { marginBottom: 2 } : {}}
                  onClick={this.goToSettings}
                >
                  <LazyImage
                    className="header-nav__avatar"
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
                <div>
                  {showEditAddressButton && editAddressButtonHtml}
                </div>
                <div>
                  {searchButtonHtml}
                </div>
                <Suspense fallback={<></>}>
                  <HeaderNotificationMenu />
                </Suspense>
                <IconButton
                  classes={{ root: classes.iconButtonRoot }}
                  id="profileAvatarHeaderBar"
                  onClick={this.goToSettings}
                  size="large"
                >
                  <AccountCircle />
                </IconButton>
              </>
            ))}
            {!voterIsSignedIn && (
              <>
                <div>
                  {showEditAddressButton && editAddressButtonHtml}
                </div>
                <div>
                  {searchButtonHtml}
                </div>
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
        <HeaderBarModals
          closeAdviserIntroModal={this.closeAdviserIntroModal}
          closeChooseOrOpposeIntroModal={this.closeChooseOrOpposeIntroModal}
          closeFirstPositionIntroModal={this.closeFirstPositionIntroModal}
          closeImageUploadModal={this.closeImageUploadModal}
          closeSignInModal={this.closeSignInModal}
          closePaidAccountUpgradeModal={this.closePaidAccountUpgradeModal}
          closePersonalizedScoreIntroModal={this.closePersonalizedScoreIntroModal}
          closeShareModal={this.closeShareModal}
          closeValuesIntroModal={this.closeValuesIntroModal}
          shows={shows}
          toggleSelectBallotModal={this.toggleSelectBallotModal}
        />
      </HeaderBarWrapper>
    );
  }
}
HeaderBar.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  headerBadge: {
    right: -15,
    top: 9,
  },
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
  headerButtonRoot: {
    paddingTop: 2,
    paddingBottom: 2,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    color: 'rgb(6, 95, 212)',
    marginLeft: '1rem',
    outline: 'none !important',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 12,
      paddingLeft: 0,
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
  outlinedPrimary: {
    minWidth: 36,
    marginRight: '.5rem',
    [theme.breakpoints.down('md')]: {
      padding: 2,
    },
  },
  tabRootBallot: {
    minWidth: 90,
  },
  tabRootFriends: {
    minWidth: 90,
  },
  tabRootIncomingFriendRequests: {
    minWidth: 110,
  },
  tabRootReady: {
    minWidth: 90,
  },
  tabRootNews: {
    minWidth: 70,
  },
  tabRootValues: {
    minWidth: 90,
  },
  indicator: {
    display: 'none',
  },
});

const AddressWrapperDesktop = styled('div')`
  margin-top: 5px;
  width: 212px;
`;

const AddressWrapperMobile = styled('div')`
  margin-top: 9px;
`;

// TODO: March 22, 2022 Dale to work on this (it is half way converted to a new ui scheme)
const HeaderBarWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hasNotch', 'scrolledDown', 'hasSubmenu'].includes(prop),
})(({ hasNotch, scrolledDown, hasSubmenu }) => (`
  margin-top: ${hasNotch ? '1.5rem' : ''};
  box-shadow: ${(!scrolledDown || !hasSubmenu)  ? '' : '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)'};
  border-bottom: ${(!scrolledDown || !hasSubmenu) ? '' : '1px solid #aaa'};
`));

const SearchWrapper = styled('div')`
  margin-top: 11px;
`;

export default withStyles(styles)(HeaderBar);
