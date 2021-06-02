import { AppBar, Button, IconButton, Tabs, Toolbar, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle, Place } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import AppActions from '../../actions/AppActions';
import BallotActions from '../../actions/BallotActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import AppStore from '../../stores/AppStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { weVoteBrandingOff } from '../../utils/applicationUtils';
import { hasIPhoneNotch, historyPush, isCordova, isIOSAppOnMac, isWebApp } from '../../utils/cordovaUtils';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import LazyImage from '../../utils/LazyImage';
import { renderLog } from '../../utils/logging';
import shouldHeaderRetreat from '../../utils/shouldHeaderRetreat';
import { getBooleanValue, shortenText, startsWith, stringContains } from '../../utils/textFormat';
import { voterPhoto } from '../../utils/voterPhoto';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import HeaderBarLogo from './HeaderBarLogo';
import TabWithPushHistory from './TabWithPushHistory';

const AdviserIntroModal = React.lazy(() => import(/* webpackChunkName: 'AdviserIntroModal' */ '../CompleteYourProfile/AdviserIntroModal'));
const FirstPositionIntroModal = React.lazy(() => import(/* webpackChunkName: 'FirstPositionIntroModal' */ '../CompleteYourProfile/FirstPositionIntroModal'));
const HeaderBarProfilePopUp = React.lazy(() => import(/* webpackChunkName: 'HeaderBarProfilePopUp' */ './HeaderBarProfilePopUp'));
const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));
const ImageUploadModal = React.lazy(() => import(/* webpackChunkName: 'ImageUploadModal' */ '../Settings/ImageUploadModal'));
const PersonalizedScoreIntroModal = React.lazy(() => import(/* webpackChunkName: 'PersonalizedScoreIntroModal' */ '../CompleteYourProfile/PersonalizedScoreIntroModal'));
const SelectBallotModal = React.lazy(() => import(/* webpackChunkName: 'SelectBallotModal' */ '../Ballot/SelectBallotModal'));
const ShareModal = React.lazy(() => import(/* webpackChunkName: 'ShareModal' */ '../Share/ShareModal'));
const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../Widgets/SignInModal'));
const ValuesIntroModal = React.lazy(() => import(/* webpackChunkName: 'ValuesIntroModal' */ '../CompleteYourProfile/ValuesIntroModal'));

const anonymous = '../../../img/global/icons/avatar-generic.png';
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
      profilePopUpOpen: false,
      scrolledDown: false,
      showAdviserIntroModal: false,
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
      showValuesIntroModal: false,
      showImageUploadModal: false,
      shareModalStep: '',
      organizationModalBallotItemWeVoteId: '',
      voter: {},
      voterFirstName: '',
    };
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
    this.debugLogging = this.debugLogging.bind(this);
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    const voter = VoterStore.getVoter();
    const voterFirstName = VoterStore.getFirstName();
    this.setState({
      componentDidMountFinished: true,
      chosenSiteLogoUrl: AppStore.getChosenSiteLogoUrl(),
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      hideWeVoteLogo: AppStore.getHideWeVoteLogo(),
      scrolledDown: AppStore.getScrolledDown(),
      showAdviserIntroModal: AppStore.showAdviserIntroModal(),
      showEditAddressButton: AppStore.showEditAddressButton(),
      showFirstPositionIntroModal: AppStore.showFirstPositionIntroModal(),
      showPaidAccountUpgradeModal: false, // June 2021 , TODO: Add back in paid upgrade modal
      showPersonalizedScoreIntroModal: AppStore.showPersonalizedScoreIntroModal(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
      showSelectBallotModalHideAddress: getBooleanValue(AppStore.showSelectBallotModalHideAddress()),
      showSelectBallotModalHideElections: getBooleanValue(AppStore.showSelectBallotModalHideElections()),
      showSignInModal: AppStore.showSignInModal(),
      showValuesIntroModal: AppStore.showValuesIntroModal(),
      showImageUploadModal: AppStore.showImageUploadModal(),
      voter,
      voterFirstName,
      voterIsSignedIn: voter && voter.is_signed_in,
    });
    setTimeout(() => {
      const { headerObjects } = window;
      const logoWrapper = document.querySelectorAll('[class^=HeaderBarLogo__HeaderBarWrapper]');
      if (logoWrapper && logoWrapper[0] && logoWrapper[0].innerHTML.length) {
        headerObjects.logo = logoWrapper[0].innerHTML;
      }
      if (document.getElementById('readyTabHeaderBar')) {
        headerObjects.ready = document.getElementById('readyTabHeaderBar').innerHTML;
      }
      if (document.getElementById('ballotTabHeaderBar')) {
        headerObjects.ballot = document.getElementById('ballotTabHeaderBar').innerHTML;
      }
      if (document.getElementById('valuesTabHeaderBar')) {
        headerObjects.opinions = document.getElementById('valuesTabHeaderBar').innerHTML;
      }
      if (document.getElementById('discussTabHeaderBar')) {
        headerObjects.discuss = document.getElementById('discussTabHeaderBar').innerHTML;
      }
      const notificationMenuWrapper = document.querySelectorAll('[class^=HeaderNotificationMenu__HeaderNotificationMenuWrapper]');
      if (notificationMenuWrapper && notificationMenuWrapper[0] && notificationMenuWrapper[0].innerHTML.length) {
        headerObjects.bell = notificationMenuWrapper[0].innerHTML;
      }
      if (document.getElementById('profileAvatarHeaderBar')) {
        headerObjects.photo = document.getElementById('profileAvatarHeaderBar').innerHTML;
      }
    }, 1000);
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { location: { pathname } } = window;
    if (pathname !== this.state.priorPath) {
      // Re-render the HeaderBar if the path has changed
      // console.log('HeaderBar shouldComponentUpdate: this.state.priorPath === ', this.state.priorPath);
      this.setState({ priorPath: pathname });
      return true;
    }
    if (this.state.componentDidMountFinished === false) {
      // console.log('shouldComponentUpdate: componentDidMountFinished === false');
      return true;
    }
    if (this.state.profilePopUpOpen !== nextState.profilePopUpOpen) {
      // console.log('shouldComponentUpdate: this.state.profilePopUpOpen', this.state.profilePopUpOpen, ', nextState.profilePopUpOpen', nextState.profilePopUpOpen);
      return true;
    }
    if (this.state.aboutMenuOpen !== nextState.aboutMenuOpen) {
      // console.log('shouldComponentUpdate: this.state.aboutMenuOpen", this.state.aboutMenuOpen, ', nextState.aboutMenuOpen', nextState.aboutMenuOpen);
      return true;
    }
    if (this.state.chosenSiteLogoUrl !== nextState.chosenSiteLogoUrl) {
      // console.log('shouldComponentUpdate: this.state.chosenSiteLogoUrl', this.state.chosenSiteLogoUrl, ', nextState.chosenSiteLogoUrl', nextState.chosenSiteLogoUrl);
      return true;
    }
    if (this.state.hideWeVoteLogo !== nextState.hideWeVoteLogo) {
      // console.log('shouldComponentUpdate: this.state.hideWeVoteLogo', this.state.hideWeVoteLogo, ', nextState.hideWeVoteLogo', nextState.hideWeVoteLogo);
      return true;
    }
    if (this.state.friendInvitationsSentToMe !== nextState.friendInvitationsSentToMe) {
      // console.log('shouldComponentUpdate: this.state.friendInvitationsSentToMe', this.state.friendInvitationsSentToMe, ', nextState.friendInvitationsSentToMe', nextState.friendInvitationsSentToMe);
      return true;
    }
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      return true;
    }
    if (this.state.shareModalStep !== nextState.shareModalStep) {
      return true;
    }
    if (this.state.organizationModalBallotItemWeVoteId !== nextState.organizationModalBallotItemWeVoteId) {
      return true;
    }
    if (this.state.showAdviserIntroModal !== nextState.showAdviserIntroModal) {
      return true;
    }
    if (this.state.showEditAddressButton !== nextState.showEditAddressButton) {
      return true;
    }
    if (this.state.showFirstPositionIntroModal !== nextState.showFirstPositionIntroModal) {
      return true;
    }
    if (this.state.showPaidAccountUpgradeModal !== nextState.showPaidAccountUpgradeModal) {
      return true;
    }
    if (this.state.showPersonalizedScoreIntroModal !== nextState.showPersonalizedScoreIntroModal) {
      return true;
    }
    if (this.state.showShareModal !== nextState.showShareModal) {
      return true;
    }
    if (this.state.showOrganizationModal !== nextState.showOrganizationModal) {
      return true;
    }
    if (this.state.showSignInModal !== nextState.showSignInModal) {
      return true;
    }
    if (this.state.showValuesIntroModal !== nextState.showValuesIntroModal) {
      return true;
    }
    if (this.state.showImageUploadModal !== nextState.showImageUploadModal) {
      return true;
    }
    if (this.state.voterFirstName !== nextState.voterFirstName) {
      // console.log('this.state.voterFirstName: ', this.state.voterFirstName, ', nextState.voterFirstName', nextState.voterFirstName);
      return true;
    }
    if (this.state.voterIsSignedIn !== nextState.voterIsSignedIn) {
      // console.log('HeaderBar voter.isSignedIn shouldComponentUpdate true');
      return true;
    }
    if (this.state.showSelectBallotModal !== nextState.showSelectBallotModal) {
      return true;
    }
    if (this.state.showSelectBallotModalHideAddress !== nextState.showSelectBallotModalHideAddress) {
      return true;
    }
    if (this.state.showSelectBallotModalHideElections !== nextState.showSelectBallotModalHideElections) {
      return true;
    }
    const thisVoterExists = this.state.voter !== undefined;
    const nextVoterExists = nextState.voter !== undefined;
    if (nextVoterExists && !thisVoterExists) {
      // console.log('HeaderBar shouldComponentUpdate: thisVoterExists", thisVoterExists, ", nextVoterExists", nextVoterExists);
      return true;
    }
    if (thisVoterExists && nextVoterExists) {
      if (this.state.voter.voter_photo_url_medium !== nextState.voter.voter_photo_url_medium) {
        // console.log('HeaderBar shouldComponentUpdate: this.state.voter.voter_photo_url_medium', this.state.voter.voter_photo_url_medium, ', nextState.voter.voter_photo_url_medium', nextState.voter.voter_photo_url_medium);
        return true;
      }
      if (this.state.voter.signed_in_twitter !== nextState.voter.signed_in_twitter) {
        // console.log('HeaderBar shouldComponentUpdate: this.state.voter.signed_in_twitter", this.state.voter.signed_in_twitter, ", nextState.voter.signed_in_twitter", nextState.voter.signed_in_twitter);
        return true;
      }
      if (this.state.voter.signed_in_facebook !== nextState.voter.signed_in_facebook) {
        // console.log('HeaderBar shouldComponentUpdate: this.state.voter.signed_in_facebook', this.state.voter.signed_in_facebook, ', nextState.voter.signed_in_facebook', nextState.voter.signed_in_facebook);
        return true;
      }
      if (this.state.voter.signed_in_with_email !== nextState.voter.signed_in_with_email) {
        return true;
      }
    }
    // console.log('HeaderBar shouldComponentUpdate false');
    return false;
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('HeaderBar caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppStoreChange () {
    // console.log('HeaderBar, onAppStoreChange');
    const paidAccountUpgradeMode = AppStore.showPaidAccountUpgradeModal() || '';
    // console.log('HeaderBar paidAccountUpgradeMode:', paidAccountUpgradeMode);
    const showPaidAccountUpgradeModal = paidAccountUpgradeMode && paidAccountUpgradeMode !== '';
    // console.log('HeaderBar onAppStoreChange showPaidAccountUpgradeModal:', showPaidAccountUpgradeModal);
    this.setState({
      chosenSiteLogoUrl: AppStore.getChosenSiteLogoUrl(),
      hideWeVoteLogo: AppStore.getHideWeVoteLogo(),
      organizationModalBallotItemWeVoteId: AppStore.organizationModalBallotItemWeVoteId(),
      // paidAccountUpgradeMode,
      scrolledDown: AppStore.getScrolledDown(),
      shareModalStep: AppStore.shareModalStep(),
      showAdviserIntroModal: AppStore.showAdviserIntroModal(),
      showEditAddressButton: AppStore.showEditAddressButton(),
      showFirstPositionIntroModal: AppStore.showFirstPositionIntroModal(),
      showPaidAccountUpgradeModal,
      showShareModal: AppStore.showShareModal(),
      showPersonalizedScoreIntroModal: AppStore.showPersonalizedScoreIntroModal(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
      showSelectBallotModalHideAddress: AppStore.showSelectBallotModalHideAddress(),
      showSelectBallotModalHideElections: AppStore.showSelectBallotModalHideElections(),
      showSignInModal: AppStore.showSignInModal(),
      showValuesIntroModal: AppStore.showValuesIntroModal(),
      showImageUploadModal: AppStore.showImageUploadModal(),
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
    if (!signInModalGlobalState.get('textOrEmailSignInInProcess')) {
      // console.log('HeaderBar, onVoterStoreChange'};
      const voter = VoterStore.getVoter();
      const voterFirstName = VoterStore.getFirstName();
      const voterIsSignedIn = voter.is_signed_in || false;
      this.setState({
        voter,
        voterFirstName,
        voterIsSignedIn,
        showSignInModal: AppStore.showSignInModal(),
        showShareModal: AppStore.showShareModal(),
        showOrganizationModal: AppStore.showOrganizationModal(),
        showPersonalizedScoreIntroModal: AppStore.showPersonalizedScoreIntroModal(),
      });
    }
  }

  getSelectedTab = () => {
    const { location: { pathname } } = window;
    if (typeof pathname !== 'undefined' && pathname) {
      if (startsWith('/ready', pathname.toLowerCase())) return 0;
      if (startsWith('/ballot', pathname.toLowerCase())) return 1;
      if (stringContains('/value', pathname.toLowerCase()) || stringContains('/opinions', pathname.toLowerCase())) return 2; // '/values'
      if (startsWith('/news', pathname.toLowerCase())) return 3;
    }
    return false;
  };

  // handleNavigation = (to) => {
  //   const history = useHistory();
  //   history.push(to);
  // }

  closeAdviserIntroModal = () => {
    AppActions.setShowAdviserIntroModal(false);
  }

  closeFirstPositionIntroModal = () => {
    AppActions.setShowFirstPositionIntroModal(false);
  }

  closeValuesIntroModal = () => {
    AppActions.setShowValuesIntroModal(false);
  }

  closePersonalizedScoreIntroModal = () => {
    AppActions.setShowPersonalizedScoreIntroModal(false);
  }

  closePaidAccountUpgradeModal () {
    AppActions.setShowPaidAccountUpgradeModal(false);
  }

  closeShareModal () {
    AppActions.setShowShareModal(false);
    AppActions.setShareModalStep('');
    const { location: { href } } = window;
    if (stringContains('/modal/share', href) && isWebApp()) {
      const pathnameWithoutModalShare = href.replace('/modal/share', '');  // Cordova
      // console.log('Navigation closeShareModal ', pathnameWithoutModalShare)
      historyPush.push(pathnameWithoutModalShare);
    }
  }

  closeOrganizationModal () {
    AppActions.setShowOrganizationModal(false);
  }

  toggleProfilePopUp () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  // December 2020: destinationUrlForHistoryPush is not defined in this class, so we never make the HistoryPush
  // eslint-disable-next-line no-unused-vars
  toggleSelectBallotModal (showSelectBallotModalHideAddress = false, showSelectBallotModalHideElections = false) {
    const { showSelectBallotModal } = this.state;
    if (!showSelectBallotModal) {
      // console.log('Ballot toggleSelectBallotModal, BallotActions.voterBallotListRetrieve()');
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }
    // May 5, 2021:  We were running into "invariant.js:40 Uncaught Invariant Violation: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch."
    // In both the major "speed" refactored branch, and on the older wevote.us when trying to close the  BallotElectionListWithFilters.  So this workaround updates the store without a dispatch.
    // So just close the dialog, to avoid this API call: AppActions.setShowSelectBallotModal(!showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections);
    this.setState({ showSelectBallotModal: false });
  }

  // closeNewVoterGuideModal () {
  //   // console.log('HeaderBar closeNewVoterGuideModal');
  //   AppActions.setShowNewVoterGuideModal(false);
  //   // signInModalGlobalState.set('isShowingSignInModal', false);
  //   HeaderBar.goToGetStarted();
  // }

  closeSignInModal () {
    // console.log('HeaderBar closeSignInModal');
    AppActions.setShowSignInModal(false);
    // signInModalGlobalState.set('isShowingSignInModal', false);
    // When this is uncommented, closing the sign in box from pages like "Values" will redirect you to the ballot
    // HeaderBar.goToGetStarted();
  }

  toggleSignInModal () {
    // console.log('HeaderBar toggleSignInModal');
    const { showSignInModal } = this.state;
    AppActions.setShowSignInModal(!showSignInModal);
  }

  hideProfilePopUp () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideProfilePopUp () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter/election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    // const googleCivicElectionId = 0;
    // if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(googleCivicElectionId, this.state.voter.linked_organization_we_vote_id)) {
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, false, true);
    // }
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
    this.setState({ profilePopUpOpen: false });
  }

  debugLogging (text) {
    const isDebugLogging = false;
    if (isDebugLogging) {
      console.log(`HeaderBar shouldComponentUpdate: ${text}`);
    }
  }

  render () {
    renderLog('HeaderBar');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.componentDidMountFinished) {
      return null;
    }

    const { classes } = this.props;
    const { location: { pathname } } = window;

    const {
      chosenSiteLogoUrl, hideWeVoteLogo, /* paidAccountUpgradeMode, */ scrolledDown, shareModalStep,
      showAdviserIntroModal, showEditAddressButton, showFirstPositionIntroModal,
      showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
      showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections,
      showShareModal, showSignInModal, showValuesIntroModal, showImageUploadModal,
      voter, voterFirstName, voterIsSignedIn,
    } = this.state;

    // console.log('Header Bar, showSignInModal ', showSignInModal);
    const ballotBaseUrl = stringContains('/ready', pathname.toLowerCase().slice(0, 7)) ? '/ready' : '/ballot';
    // const numberOfIncomingFriendRequests = friendInvitationsSentToMe.length || 0;
    const showFullNavigation = true;
    const showingBallot = stringContains('/ballot', pathname.toLowerCase().slice(0, 7));
    const showingFriendsTabs = displayFriendsTabs();
    const voterPhotoUrlMedium = voterPhoto(voter);
    const hideAddressWrapper = false; // isAndroid() && getAndroidSize() === '--xl';
    const editAddressButtonHtml = (
      <Tooltip title="Change my location or election" aria-label="Change Address or Election" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
        <>
          <AddressWrapperDesktop className="u-show-desktop-tablet">
            <IconButton
              classes={{ root: classes.iconButtonRoot }}
              id="changeAddressOrElectionHeaderBarElection"
              onClick={() => this.toggleSelectBallotModal(false, false)}
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
          <AddressWrapperMobile className="u-show-mobile-bigger-than-iphone5"
                                style={hideAddressWrapper ? { display: 'none' } : {}}
          >
            <IconButton
              classes={{ root: classes.iconButtonRoot }}
              id="changeAddressOnlyHeaderBar"
              onClick={() => this.toggleSelectBallotModal(false, true)}
            >
              <Place />
            </IconButton>
            <Button
              color="primary"
              classes={{ root: classes.addressButtonRoot }}
              id="changeAddressOnlyHeaderBarText"
              onClick={() => this.toggleSelectBallotModal(false, true)}
            >
              Address
            </Button>
          </AddressWrapperMobile>
          <AddressWrapperMobileTiny className="u-show-mobile-iphone5-or-smaller"
                                    style={hideAddressWrapper ? { display: 'none' } : {}}
          >
            <IconButton
              classes={{ root: classes.iconButtonRoot }}
              id="changeAddressOnlyHeaderBar"
              onClick={() => this.toggleSelectBallotModal(false, true)}
            >
              <Place />
            </IconButton>
          </AddressWrapperMobileTiny>
        </>
      </Tooltip>
    );

    const doNotShowWeVoteLogo = weVoteBrandingOff() || hideWeVoteLogo;
    const showWeVoteLogo = !doNotShowWeVoteLogo;
    const cordovaOverrides = isWebApp() ? {} : { marginLeft: 0, padding: '0 0 0 8px', right: 'unset' };
    let appBarCname = 'page-header ';
    if (hasIPhoneNotch()) {
      appBarCname += ' page-header__cordova-iphonex';
    } else if (isCordova()) {
      appBarCname += ' page-header__cordova';
    }

    return (
      <Wrapper hasNotch={hasIPhoneNotch()} scrolledDown={scrolledDown && isWebApp() && shouldHeaderRetreat(pathname)}>
        <AppBar position="relative"
                color="default"
                className={`${appBarCname} ${showingBallot || showingFriendsTabs ? ' page-header__ballot' : ''}`}
                style={cordovaOverrides}
        >
          <Toolbar className="header-toolbar" disableGutters>
            {(showWeVoteLogo || chosenSiteLogoUrl) && (
              <HeaderBarLogo
                chosenSiteLogoUrl={chosenSiteLogoUrl}
                showFullNavigation={!!showFullNavigation}
                isBeta={showWeVoteLogo && !chosenSiteLogoUrl}
              />
            )}
            <div className="header-nav">
              <Tabs
                className={isIOSAppOnMac() ? '' : 'u-show-desktop'}
                value={this.getSelectedTab()}
                indicatorColor="primary"
                classes={{ indicator: classes.indicator }}
              >
                {showFullNavigation && (
                  <TabWithPushHistory classes={{ root: classes.tabRootReady }} id="readyTabHeaderBar" label="Ready?" to="/ready" />
                )}
                {showFullNavigation && (
                  <TabWithPushHistory classes={{ root: classes.tabRootBallot }} id="ballotTabHeaderBar" label="Ballot" to="/ballot" />
                )}
                <TabWithPushHistory classes={{ root: classes.tabRootValues }} id="valuesTabHeaderBar" label="Opinions" to="/values" />
                {(showFullNavigation) && (
                  <TabWithPushHistory classes={{ root: classes.tabRootNews }} id="discussTabHeaderBar" label="Discuss" to="/news" />
                )}
              </Tabs>
            </div>
            {
              voterIsSignedIn && voterPhotoUrlMedium ? (
                <NotificationsAndProfileWrapper className="u-cursor--pointer">
                  <div>
                    {showEditAddressButton && editAddressButtonHtml}
                  </div>
                  <HeaderNotificationMenu />
                  <div id="profileAvatarHeaderBar"
                    className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                    style={isCordova() ? { marginBottom: 2 } : {}}
                    onClick={this.toggleProfilePopUp}
                  >
                    <LazyImage
                      className="header-nav__avatar"
                      src={voterPhotoUrlMedium}
                      placeholder={anonymous}
                      style={{
                        marginLeft: 16,
                      }}
                      height={34}
                      width={34}
                      alt="Your Settings"
                    />
                  </div>
                  {this.state.profilePopUpOpen && voterIsSignedIn && (
                    <HeaderBarProfilePopUp
                      hideProfilePopUp={this.hideProfilePopUp}
                      onClick={this.toggleProfilePopUp}
                      profilePopUpOpen={this.state.profilePopUpOpen}
                      signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
                      toggleProfilePopUp={this.toggleProfilePopUp}
                      toggleSignInModal={this.toggleSignInModal}
                      transitionToYourVoterGuide={this.transitionToYourVoterGuide}
                      voter={voter}
                    />
                  )}
                </NotificationsAndProfileWrapper>
              ) : (
                voterIsSignedIn && (
                  <NotificationsAndProfileWrapper className="u-cursor--pointer">
                    <div>
                      {showEditAddressButton && editAddressButtonHtml}
                    </div>
                    <HeaderNotificationMenu />
                    <IconButton
                      classes={{ root: classes.iconButtonRoot }}
                      id="profileAvatarHeaderBar"
                      onClick={this.toggleProfilePopUp}
                    >
                      <FirstNameWrapper>
                        {shortenText(voterFirstName, 9)}
                      </FirstNameWrapper>
                      <AccountCircle />
                    </IconButton>
                    {this.state.profilePopUpOpen && voterIsSignedIn && (
                      <HeaderBarProfilePopUp
                        hideProfilePopUp={this.hideProfilePopUp}
                        onClick={this.toggleProfilePopUp}
                        profilePopUpOpen={this.state.profilePopUpOpen}
                        signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
                        toggleProfilePopUp={this.toggleProfilePopUp}
                        toggleSignInModal={this.toggleSignInModal}
                        transitionToYourVoterGuide={this.transitionToYourVoterGuide}
                        voter={voter}
                      />
                    )}
                  </NotificationsAndProfileWrapper>
                )
              )
            }
            {
              !voterIsSignedIn && (
              <NotificationsAndProfileWrapper className="u-cursor--pointer d-print-none">
                <div>
                  {showEditAddressButton && editAddressButtonHtml}
                </div>
                <HeaderNotificationMenu />
                <Button
                  color="primary"
                  classes={{ root: classes.headerButtonRoot }}
                  id="signInHeaderBar"
                  onClick={this.toggleSignInModal}
                >
                  <span className="u-no-break">Sign In</span>
                </Button>
              </NotificationsAndProfileWrapper>
              )
            }
          </Toolbar>
        </AppBar>
        {showSignInModal && (
          <SignInModal
            show={showSignInModal}
            closeFunction={this.closeSignInModal}
          />
        )}
        {showSelectBallotModal && (
          <SelectBallotModal
            ballotBaseUrl={ballotBaseUrl}
            hideAddressEdit={showSelectBallotModalHideAddress}
            hideElections={showSelectBallotModalHideElections}
            show={showSelectBallotModal}
            toggleFunction={this.toggleSelectBallotModal}
          />
        )}
        {showPaidAccountUpgradeModal && (
          {/*
          // TODO: Backport "@stripe/react-stripe-js" use from Campaigns
          <PaidAccountUpgradeModal
            initialPricingPlan={paidAccountUpgradeMode}
            show={showPaidAccountUpgradeModal}
            toggleFunction={this.closePaidAccountUpgradeModal}
          />
          */}
        )}
        {showShareModal && (
          <ShareModal
            voterIsSignedIn={voterIsSignedIn}
            show={showShareModal}
            shareModalStep={shareModalStep}
            closeShareModal={this.closeShareModal}
          />
        )}
        {showAdviserIntroModal && (
          <AdviserIntroModal
            show={showAdviserIntroModal}
            toggleFunction={this.closeAdviserIntroModal}
          />
        )}
        {showFirstPositionIntroModal && (
          <FirstPositionIntroModal
            show={showFirstPositionIntroModal}
            toggleFunction={this.closeFirstPositionIntroModal}
          />
        )}
        {showPersonalizedScoreIntroModal && (
          <PersonalizedScoreIntroModal
            show={showPersonalizedScoreIntroModal}
            toggleFunction={this.closePersonalizedScoreIntroModal}
          />
        )}
        {showValuesIntroModal && (
          <ValuesIntroModal
            show={showValuesIntroModal}
            toggleFunction={this.closeValuesIntroModal}
          />
        )}
        {showImageUploadModal && (
          <ImageUploadModal
            show={showImageUploadModal}
            toggleFunction={this.closeImageUploadModal}
          />
        )}
      </Wrapper>
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
    [theme.breakpoints.down('sm')]: {
      paddingTop: 6,
      marginLeft: 2,
      paddingLeft: 0,
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
    height: 4,
  },
});

const AddressWrapperDesktop = styled.div`
  margin-top: 5px;
  width: 220px;
`;

const AddressWrapperMobile = styled.div`
  margin-top: 5px;
  width: 104px;
`;

const AddressWrapperMobileTiny = styled.div`
  margin-top: 8px;
`;

const FirstNameWrapper = styled.div`
  font-size: 14px;
  padding-right: 4px;
`;

// const FriendTabWrapper = styled.div`
//   margin-left: ${({ incomingFriendRequests }) => (incomingFriendRequests ? '-20px' : '0')};
// `;

const NotificationsAndProfileWrapper = styled.div`
  display: flex;
  height: 48px;
  z-index: 3; //to float above the account/ProfilePopUp menu option grey div
`;

const Wrapper = styled.div`
  margin-top: ${({ hasNotch }) => (hasNotch ? '1.5rem' : '0')};
  transition: all 50ms ease-in;
  ${({ scrolledDown }) => (scrolledDown ? 'transform: translateY(-100%);' : '')}
`;

export default withStyles(styles)(HeaderBar);
