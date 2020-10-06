import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, AppBar, Toolbar, Tabs, Tab, IconButton, Tooltip } from '@material-ui/core';
import { Place, AccountCircle } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { hasIPhoneNotch, historyPush, isAppleSilicon, isCordova, isWebApp } from '../../utils/cordovaUtils';
import AdviserIntroModal from '../CompleteYourProfile/AdviserIntroModal';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import BallotActions from '../../actions/BallotActions';
import cookies from '../../utils/cookies';
import FirstPositionIntroModal from '../CompleteYourProfile/FirstPositionIntroModal';
import FriendStore from '../../stores/FriendStore';
import HeaderBarProfilePopUp from './HeaderBarProfilePopUp';
import HeaderBarLogo from './HeaderBarLogo';
import HeaderNotificationMenu from './HeaderNotificationMenu';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import PaidAccountUpgradeModal from '../Settings/PaidAccountUpgradeModal';
import PersonalizedScoreIntroModal from '../CompleteYourProfile/PersonalizedScoreIntroModal';
import SelectBallotModal from '../Ballot/SelectBallotModal';
import SignInModal from '../Widgets/SignInModal';
import ValuesIntroModal from '../CompleteYourProfile/ValuesIntroModal';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import VoterStore from '../../stores/VoterStore';
import { shortenText, startsWith, stringContains } from '../../utils/textFormat';
import shouldHeaderRetreat from '../../utils/shouldHeaderRetreat';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import ShareModal from '../Share/ShareModal';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import { voterPhoto } from '../../utils/voterPhoto';

// const webAppConfig = require('../../config');


class HeaderBar extends Component {
  static goToGetStarted () {
    const getStartedNow = '/ready';
    historyPush(getStartedNow);
  }

  constructor (props) {
    super(props);
    this.state = {
      // aboutMenuOpen: false,
      chosenSiteLogoUrl: '',
      componentDidMountFinished: false,
      friendInvitationsSentToMe: 0,
      hideWeVoteLogo: false,
      paidAccountUpgradeMode: '',
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
  }

  componentDidMount () {
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // this.onBallotStoreChange();

    const voterFirstName = VoterStore.getFirstName();
    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
    this.setState({
      componentDidMountFinished: true,
      chosenSiteLogoUrl: AppStore.getChosenSiteLogoUrl(),
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
      hideWeVoteLogo: AppStore.getHideWeVoteLogo(),
      scrolledDown: AppStore.getScrolledDown(),
      showAdviserIntroModal: AppStore.showAdviserIntroModal(),
      showEditAddressButton: AppStore.showEditAddressButton(),
      showFirstPositionIntroModal: AppStore.showFirstPositionIntroModal(),
      showPersonalizedScoreIntroModal: AppStore.showPersonalizedScoreIntroModal(),
      showSelectBallotModal: AppStore.showSelectBallotModal(),
      showSelectBallotModalHideAddress: AppStore.showSelectBallotModalHideAddress(),
      showSelectBallotModalHideElections: AppStore.showSelectBallotModalHideElections(),
      showSignInModal: AppStore.showSignInModal(),
      showValuesIntroModal: AppStore.showValuesIntroModal(),
      voter: this.props.voter,
      voterFirstName,
      voterIsSignedIn: this.props.voter && this.props.voter.is_signed_in,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.profilePopUpOpen !== nextState.profilePopUpOpen) {
      // console.log("shouldComponentUpdate: this.state.profilePopUpOpen", this.state.profilePopUpOpen, ", nextState.profilePopUpOpen", nextState.profilePopUpOpen);
      return true;
    }
    if (this.state.aboutMenuOpen !== nextState.aboutMenuOpen) {
      // console.log("shouldComponentUpdate: this.state.aboutMenuOpen", this.state.aboutMenuOpen, ", nextState.aboutMenuOpen", nextState.aboutMenuOpen);
      return true;
    }
    if (this.state.chosenSiteLogoUrl !== nextState.chosenSiteLogoUrl) {
      // console.log("shouldComponentUpdate: this.state.chosenSiteLogoUrl", this.state.chosenSiteLogoUrl, ", nextState.chosenSiteLogoUrl", nextState.chosenSiteLogoUrl);
      return true;
    }
    if (this.state.hideWeVoteLogo !== nextState.hideWeVoteLogo) {
      // console.log("shouldComponentUpdate: this.state.hideWeVoteLogo", this.state.hideWeVoteLogo, ", nextState.hideWeVoteLogo", nextState.hideWeVoteLogo);
      return true;
    }
    if (this.state.friendInvitationsSentToMe !== nextState.friendInvitationsSentToMe) {
      // console.log("shouldComponentUpdate: this.state.friendInvitationsSentToMe", this.state.friendInvitationsSentToMe, ", nextState.friendInvitationsSentToMe", nextState.friendInvitationsSentToMe);
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
    const currentPathnameExists = this.props.location && this.props.location.pathname;
    const nextPathnameExists = nextProps.location && nextProps.location.pathname;
    // One exists, and the other doesn't
    if ((currentPathnameExists && !nextPathnameExists) || (!currentPathnameExists && nextPathnameExists)) {
      // console.log("HeaderBar shouldComponentUpdate: PathnameExistsDifference");
      return true;
    }
    if (currentPathnameExists && nextPathnameExists && this.props.location.pathname !== nextProps.location.pathname) {
      // console.log("HeaderBar shouldComponentUpdate: this.props.location.pathname", this.props.location.pathname, ", nextProps.location.pathname", nextProps.location.pathname);
      return true;
    }
    const thisVoterExists = this.state.voter !== undefined;
    const nextVoterExists = nextState.voter !== undefined;
    if (nextVoterExists && !thisVoterExists) {
      // console.log("HeaderBar shouldComponentUpdate: thisVoterExists", thisVoterExists, ", nextVoterExists", nextVoterExists);
      return true;
    }
    if (thisVoterExists && nextVoterExists) {
      if (this.state.voter.voter_photo_url_medium !== nextState.voter.voter_photo_url_medium) {
        // console.log('HeaderBar shouldComponentUpdate: this.state.voter.voter_photo_url_medium', this.state.voter.voter_photo_url_medium, ', nextState.voter.voter_photo_url_medium', nextState.voter.voter_photo_url_medium);
        return true;
      }
      if (this.state.voter.signed_in_twitter !== nextState.voter.signed_in_twitter) {
        // console.log("HeaderBar shouldComponentUpdate: this.state.voter.signed_in_twitter", this.state.voter.signed_in_twitter, ", nextState.voter.signed_in_twitter", nextState.voter.signed_in_twitter);
        return true;
      }
      if (this.state.voter.signed_in_facebook !== nextState.voter.signed_in_facebook) {
        // console.log("HeaderBar shouldComponentUpdate: this.state.voter.signed_in_facebook", this.state.voter.signed_in_facebook, ", nextState.voter.signed_in_facebook", nextState.voter.signed_in_facebook);
        return true;
      }
      if (this.state.voter.signed_in_with_email !== nextState.voter.signed_in_with_email) {
        return true;
      }
    }
    // console.log('HeaderBar shouldComponentUpdate false');
    return false;
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
      paidAccountUpgradeMode,
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
    const { pathname } = this.props;
    if (typeof pathname !== 'undefined' && pathname) {
      if (startsWith('/ready', pathname.toLowerCase())) return 0;
      if (startsWith('/ballot', pathname.toLowerCase())) return 1;
      if (stringContains('/value', pathname.toLowerCase()) || stringContains('/opinions', pathname.toLowerCase())) return 2; // '/values'
      if (startsWith('/news', pathname.toLowerCase())) return 3;
    }
    return false;
  };

  handleNavigation = (to) => historyPush(to);

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
    const { pathname } = this.props;
    if (stringContains('/modal/share', pathname) && isWebApp()) {
      const pathnameWithoutModalShare = pathname.replace('/modal/share', '');  // Cordova
      // console.log('Navigation closeShareModal ', pathnameWithoutModalShare)
      historyPush(pathnameWithoutModalShare);
    }
  }

  closeOrganizationModal () {
    AppActions.setShowOrganizationModal(false);
  }

  toggleProfilePopUp () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  toggleSelectBallotModal (destinationUrlForHistoryPush = '', showSelectBallotModalHideAddress = false, showSelectBallotModalHideElections = false) {
    const { showSelectBallotModal } = this.state;
    if (showSelectBallotModal && destinationUrlForHistoryPush && destinationUrlForHistoryPush !== '') {
      historyPush(destinationUrlForHistoryPush);
    } else if (!showSelectBallotModal) {
      // console.log('Ballot toggleSelectBallotModal, BallotActions.voterBallotListRetrieve()');
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }
    AppActions.setShowSelectBallotModal(!showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections);
  }

  closeNewVoterGuideModal () {
    // console.log('HeaderBar closeNewVoterGuideModal');
    AppActions.setShowNewVoterGuideModal(false);
    // signInModalGlobalState.set('isShowingSignInModal', false);
    HeaderBar.goToGetStarted();
  }

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

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('HeaderBar caught error: ', `${error} with info: `, info);
  }


  render () {
    renderLog('HeaderBar');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.componentDidMountFinished) {
      return null;
    }
    const { classes, pathname, location } = this.props;
    const {
      chosenSiteLogoUrl, hideWeVoteLogo, paidAccountUpgradeMode, scrolledDown, shareModalStep,
      showAdviserIntroModal, showEditAddressButton, showFirstPositionIntroModal,
      showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
      showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections,
      showShareModal, showSignInModal, showValuesIntroModal,
      voter, voterFirstName, voterIsSignedIn,
    } = this.state;

    // console.log('Header Bar, showSignInModal ', showSignInModal);
    const ballotBaseUrl = stringContains('/ready', pathname.toLowerCase().slice(0, 7)) ? '/ready' : '/ballot';
    // const numberOfIncomingFriendRequests = friendInvitationsSentToMe.length || 0;
    const showFullNavigation = true;
    const weVoteBrandingOff = this.state.we_vote_branding_off;
    const showingBallot = stringContains('/ballot', pathname.toLowerCase().slice(0, 7));
    const showingFriendsTabs = displayFriendsTabs();
    const voterPhotoUrlMedium = voterPhoto(voter);
    const editAddressButtonHtml = (
      <Tooltip title="Change my location or election" aria-label="Change Address or Election" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
        <>
          <AddressWrapperDesktop className="u-show-desktop-tablet">
            <IconButton
              classes={{ root: classes.iconButtonRoot }}
              id="changeAddressOrElectionHeaderBarElection"
              onClick={() => this.toggleSelectBallotModal('', false, false)}
            >
              <Place />
            </IconButton>
            <Button
              color="primary"
              classes={{ root: classes.addressButtonRoot }}
              id="changeAddressOrElectionHeaderBarText"
              onClick={() => this.toggleSelectBallotModal('', false, false)}
            >
              Address & Elections
            </Button>
          </AddressWrapperDesktop>
          <AddressWrapperMobile className="u-show-mobile-bigger-than-iphone5">
            <IconButton
              classes={{ root: classes.iconButtonRoot }}
              id="changeAddressOnlyHeaderBar"
              onClick={() => this.toggleSelectBallotModal('', false, true)}
            >
              <Place />
            </IconButton>
            <Button
              color="primary"
              classes={{ root: classes.addressButtonRoot }}
              id="changeAddressOnlyHeaderBarText"
              onClick={() => this.toggleSelectBallotModal('', false, true)}
            >
              Address
            </Button>
          </AddressWrapperMobile>
          <AddressWrapperMobileTiny className="u-show-mobile-iphone5-or-smaller">
            <IconButton
              classes={{ root: classes.iconButtonRoot }}
              id="changeAddressOnlyHeaderBar"
              onClick={() => this.toggleSelectBallotModal('', false, true)}
            >
              <Place />
            </IconButton>
          </AddressWrapperMobileTiny>
        </>
      </Tooltip>
    );

    const doNotShowWeVoteLogo = weVoteBrandingOff || hideWeVoteLogo;
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
                className={isAppleSilicon() ? '' : 'u-show-desktop'}
                value={this.getSelectedTab()}
                indicatorColor="primary"
                classes={{ indicator: classes.indicator }}
              >
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRootReady }} id="readyTabHeaderBar" label="Ready?" onClick={() => this.handleNavigation('/ready')} />
                )}
                {showFullNavigation && (
                  <Tab classes={{ root: classes.tabRootBallot }} id="ballotTabHeaderBar" label="Ballot" onClick={() => this.handleNavigation('/ballot')} />
                )}
                <Tab classes={{ root: classes.tabRootValues }} id="valuesTabHeaderBar" label="Opinions" onClick={() => this.handleNavigation('/values')} />
                {/* OFF FOR NOW showFullNavigation && (
                  <Tab
                    classes={(numberOfIncomingFriendRequests > 0) ? { root: classes.tabRootIncomingFriendRequests } : { root: classes.tabRootFriends }}
                    id="friendsTabHeaderBar"
                    label={(
                      <FriendTabWrapper incomingFriendRequests={(numberOfIncomingFriendRequests > 0)}>
                        <Badge
                          classes={{ badge: classes.headerBadge }}
                          badgeContent={numberOfIncomingFriendRequests}
                          color="primary"
                          max={9}
                        >
                          Friends
                        </Badge>
                      </FriendTabWrapper>
                    )}
                    onClick={() => this.handleNavigation('/friends')}
                  />
                ) */}
                {(showFullNavigation) && (
                  <Tab classes={{ root: classes.tabRootNews }} id="activityTabHeaderBar" label="Discuss" onClick={() => this.handleNavigation('/news')} />
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
                    <img
                      className="header-nav__avatar"
                      src={voterPhotoUrlMedium}
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
                      weVoteBrandingOff={this.state.we_vote_branding_off}
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
                        weVoteBrandingOff={this.state.we_vote_branding_off}
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
            location={location}
            pathname={pathname}
            show={showSelectBallotModal}
            toggleFunction={this.toggleSelectBallotModal}
          />
        )}
        {showPaidAccountUpgradeModal && (
          <PaidAccountUpgradeModal
            initialPricingPlan={paidAccountUpgradeMode}
            pathname={pathname}
            show={showPaidAccountUpgradeModal}
            toggleFunction={this.closePaidAccountUpgradeModal}
          />
        )}
        {showShareModal && (
          <ShareModal
            voterIsSignedIn={voterIsSignedIn}
            pathname={pathname}
            show={showShareModal}
            shareModalStep={shareModalStep}
            closeShareModal={this.closeShareModal}
          />
        )}
        {showAdviserIntroModal && (
          <AdviserIntroModal
            pathname={pathname}
            show={showAdviserIntroModal}
            toggleFunction={this.closeAdviserIntroModal}
          />
        )}
        {showFirstPositionIntroModal && (
          <FirstPositionIntroModal
            pathname={pathname}
            show={showFirstPositionIntroModal}
            toggleFunction={this.closeFirstPositionIntroModal}
          />
        )}
        {showPersonalizedScoreIntroModal && (
          <PersonalizedScoreIntroModal
            pathname={pathname}
            show={showPersonalizedScoreIntroModal}
            toggleFunction={this.closePersonalizedScoreIntroModal}
          />
        )}
        {showValuesIntroModal && (
          <ValuesIntroModal
            pathname={pathname}
            show={showValuesIntroModal}
            toggleFunction={this.closeValuesIntroModal}
          />
        )}
      </Wrapper>
    );
  }
}
HeaderBar.propTypes = {
  location: PropTypes.object,
  voter: PropTypes.object,
  pathname: PropTypes.string,
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
