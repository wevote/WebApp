import { Button, IconButton, Tabs, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AccountCircle, Place, Search } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterActions from '../../actions/VoterActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import LazyImage from '../../common/components/LazyImage';
import AnalyticsStore from '../../stores/AnalyticsStore';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FacebookStore from '../../stores/FacebookStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import apiCalming from '../../utils/apiCalming';
import { avatarGeneric, displayTopMenuShadow, normalizedHref, normalizedHrefPage, weVoteBrandingOff } from '../../utils/applicationUtils';
import { hasIPhoneNotch, historyPush, isCordova, isDeviceZoomed, isIOS, isIOSAppOnMac, isWebApp } from '../../utils/cordovaUtils';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import { TopOfPageHeader, TopRowOneLeftContainer, TopRowOneMiddleContainer, TopRowOneRightContainer, TopRowTwoLeftContainer } from '../../utils/pageLayoutStyles';
import shouldHeaderRetreat from '../../utils/shouldHeaderRetreat';
import { getBooleanValue, shortenText, stringContains } from '../../utils/textFormat';
import { voterPhoto } from '../../utils/voterPhoto';
import SignInButton from '../Widgets/SignInButton';
import signInModalGlobalState from '../Widgets/signInModalGlobalState';
import FriendsTabs from './FriendsTabs';
import HeaderBarLogo from './HeaderBarLogo';
import HeaderBarModals from './HeaderBarModals';
import TabWithPushHistory from './TabWithPushHistory';


const HeaderBarProfilePopUp = React.lazy(() => import(/* webpackChunkName: 'HeaderBarProfilePopUp' */ './HeaderBarProfilePopUp'));
const HeaderNotificationMenu = React.lazy(() => import(/* webpackChunkName: 'HeaderNotificationMenu' */ './HeaderNotificationMenu'));

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
      voterIsSignedIn: false,
      // firstVisitToBallot: true,
    };
    this.closeOrganizationModal = this.closeOrganizationModal.bind(this);
    this.closePaidAccountUpgradeModal = this.closePaidAccountUpgradeModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.closeSignInModal = this.closeSignInModal.bind(this);
    this.debugLogging = this.debugLogging.bind(this);
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.toggleSelectBallotModal = this.toggleSelectBallotModal.bind(this);
    this.toggleSignInModal = this.toggleSignInModal.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
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
        const { headerObjects } = window;
        if (document.getElementById('HeaderBarLogoWrapper')) {
          headerObjects.logo = document.getElementById('HeaderBarLogoWrapper').innerHTML;
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
        if (document.getElementById('HeaderNotificationMenuWrapper')) {
          headerObjects.bell = document.getElementById('HeaderNotificationMenuWrapper').innerHTML;
        }
        if (document.getElementById('profileAvatarHeaderBar')) {
          headerObjects.photo = document.getElementById('profileAvatarHeaderBar').innerHTML;
        }
      }, 1000);
    }
    // 2021-11 From Dale: Automatically opening modals on first page load doesn't test well with voters
    // this.showBallotModalTimeout = setTimeout(() => {
    //   // We want the SelectBallotModal to appear on the ballot page (without a keystroke)
    //   // if the page is empty and we have a textForMapSearch and we dont have the EditAddressOneHorizontalRow displayed
    //   const elList = document.getElementById('BallotListId');
    //   const elEditAddress = document.getElementById('EditAddressOneHorizontalRow');
    //   if (elList && !!elEditAddress) {
    //     const textForMapSearch = VoterStore.getTextForMapSearch();
    //     if (elList.innerHTML.trim().length < 1 && textForMapSearch) {
    //       console.log('Putting up SelectBallotModal since BallotList is empty and textForMapSearch exists.');
    //       this.setState({ showSelectBallotModal: true });
    //     }
    //   }
    // }, 1500);
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
    } else if (this.state.profilePopUpOpen !== nextState.profilePopUpOpen) {
      // console.log('shouldComponentUpdate: this.state.profilePopUpOpen', this.state.profilePopUpOpen, ', nextState.profilePopUpOpen', nextState.profilePopUpOpen);
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

    // console.log(`HeaderBar shouldComponentUpdate:  ${false}`);
    if (update)  this.manuallyUnderlineTab(true);

    // console.log('HeaderBar shouldComponentUpdate: update === ', update);
    return update;
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
      showEditAddressButton: AppObservableStore.showEditAddressButton(),
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
      // console.log('HeaderBar, onVoterStoreChange'};
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

  setShowAddressButtonIfMobile (newState) {
    // Oct 21, 2021: I think we want this component if not mobile
    // if (isMobileScreenSize() || isIPad()) {
    if (AppObservableStore.showEditAddressButton() !== newState) {
      AppObservableStore.setShowEditAddressButton(newState);
    }
    // }
  }

  manuallyUnderlineTab = (setInitial = false) => {
    const pathname = normalizedHref();

    // console.log('HeaderBar ------------------ manuallyUnderlineTab ', pathname);
    if (typeof pathname !== 'undefined' && pathname) {
      if (pathname.startsWith('/ready')  || pathname === '/') {
        if (setInitial) {
          this.changeOverrideUnderline('readyTabHeaderBar,ballotTabHeaderBar,valuesTabHeaderBar,discussTabHeaderBar');
        }
        this.setShowAddressButtonIfMobile(true);
        return 0;
      }
      if (pathname.startsWith('/ballot'))  {
        if (setInitial) {
          this.changeOverrideUnderline('ballotTabHeaderBar,readyTabHeaderBar,valuesTabHeaderBar,discussTabHeaderBar');
        }
        this.setShowAddressButtonIfMobile(true);
        return 1;
      }
      if (stringContains('/value', pathname) ||
          stringContains('/opinions', pathname)) {    // '/values'
        if (setInitial) {
          this.changeOverrideUnderline('valuesTabHeaderBar,readyTabHeaderBar,ballotTabHeaderBar,discussTabHeaderBar');
        }
        this.setShowAddressButtonIfMobile(false);
        return 2;
      }
      if (pathname.startsWith('/news')) {
        if (setInitial) {
          this.changeOverrideUnderline('discussTabHeaderBar,readyTabHeaderBar,ballotTabHeaderBar,valuesTabHeaderBar');
        }
        this.setShowAddressButtonIfMobile(false);
        return 3;
      }
    }
    this.setShowAddressButtonIfMobile(false);
    return false;
  };

  // handleNavigation = (to) => {
  //   const history = useHistory();
  //   history.push(to);
  // }

  goToSearch = () => {
    historyPush('/opinions');
  }

  closeAdviserIntroModal = () => {
    AppObservableStore.setShowAdviserIntroModal(false);
  }

  closeFirstPositionIntroModal = () => {
    AppObservableStore.setShowFirstPositionIntroModal(false);
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

  closeOrganizationModal () {
    AppObservableStore.setShowOrganizationModal(false);
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
      BallotActions.voterBallotListRetrieve(); // Retrieve a list of ballots for the voter from other elections
    }
    AppObservableStore.setShowSelectBallotModal(!showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections);

    this.setState({
      showSelectBallotModal: !showSelectBallotModal,
      // firstVisitToBallot: false,
    });
  }

  // closeNewVoterGuideModal () {
  //   // console.log('HeaderBar closeNewVoterGuideModal');
  //   AppObservableStore.setShowNewVoterGuideModal(false);
  //   // signInModalGlobalState.set('isShowingSignInModal', false);
  //   HeaderBar.goToGetStarted();
  // }

  closeSignInModal () {
    // console.log('HeaderBar closeSignInModal');
    this.setState({ showSignInModal: false });
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
    // AppObservableStore.setShowSignInModal(false);  6/10/21: Sends you in an endless loop

    // signInModalGlobalState.set('isShowingSignInModal', false);
    // When this is uncommented, closing the sign in box from pages like "Values" will redirect you to the ballot
    // HeaderBar.goToGetStarted();
  }

  toggleSignInModal () {
    // console.log('HeaderBar toggleSignInModal');
    const { showSignInModal } = this.state;
    AppObservableStore.setShowSignInModal(!showSignInModal);
    this.setState({
      showSignInModal: !showSignInModal,
    });
  }

  hideProfilePopUp () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideProfilePopUp () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  // June 2021:  This is a hack, not an elegant solution.  The Tabs object seems to get confused
  // when it is inside the render of a of HeaderBarSuspense, and in addition, we are not using the Tabs
  // object to load a pane, we are using it to HistoryPush to a different page.
  // The first id in the tabNamesString gets the underline, the others, in whatever order they
  // arrive get the underline removed.  Once the voter navigates to a tab in a session, this hack becomes
  // unnecessary for that tab, but there doesn't seem to be a downside of calling it all the time
  changeOverrideUnderline (tabNamesString) {
    const tabNames = tabNamesString.split(',');
    for (let i = 0; i < tabNames.length; i++) {
      const element = document.getElementById(tabNames[i]);
      if (element) {
        if (i === 0) {
          element.style.borderBottom = 'black';
          element.style.borderBottomStyle = 'solid';
          element.style.borderBottomWidth = '4px';
          element.style.paddingBottom = '2px';
        } else {
          element.style.borderBottomStyle = 'none';
          element.style.borderBottomStyle = 'none';
          element.style.borderBottomWidth = '0px';
          element.style.paddingBottom = '6px';
        }
      }
    }
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
    const pathname = normalizedHref();

    const {
      chosenSiteLogoUrl, hideWeVoteLogo, /* paidAccountUpgradeMode, */ scrolledDown,
      showAdviserIntroModal, showEditAddressButton, showFirstPositionIntroModal,
      showPaidAccountUpgradeModal, showPersonalizedScoreIntroModal,
      showSelectBallotModal, showSelectBallotModalHideAddress, showSelectBallotModalHideElections,
      showShareModal, showSignInModal, showValuesIntroModal, showImageUploadModal,
      voter, voterFirstName, voterIsSignedIn,
    } = this.state;
    /* eslint object-property-newline: ["off"] */
    const shows = {
      showAdviserIntroModal, showEditAddressButton, showFirstPositionIntroModal,
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
            >
              <Search />
            </IconButton>
          </SearchWrapper>
          <SearchWrapper className="u-show-mobile-bigger-than-iphone5">
            <IconButton
              classes={{ root: classes.searchButtonRoot }}
              id="searchHeaderBarMobile"
              onClick={this.goToSearch}
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

    return (
      <HeaderBarWrapper
        hasNotch={hasIPhoneNotch()}
        scrolledDown={scrolledDown && isWebApp() && shouldHeaderRetreat(pathname)}
        hasSubMenu={displayTopMenuShadow()}
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
                isBeta={showWeVoteLogo && !chosenSiteLogoUrl}
              />
            )}
            <div className="header-nav" style={isMobileScreenSize() ? { display: 'none' } : {}}>
              <Tabs
                className={isIOSAppOnMac() ? '' : 'u-show-desktop'}
                value={this.manuallyUnderlineTab()}
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
                <HeaderNotificationMenu />
                <div id="profileAvatarHeaderBar"
                  className={`header-nav__avatar-container ${isCordova() ? 'header-nav__avatar-cordova' : undefined}`}
                  style={isCordova() ? { marginBottom: 2 } : {}}
                  onClick={this.toggleProfilePopUp}
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
              </>
            ) : (voterIsSignedIn && (
              <>
                <div>
                  {showEditAddressButton && editAddressButtonHtml}
                </div>
                <div>
                  {searchButtonHtml}
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
                <HeaderNotificationMenu />
                <SignInButton toggleSignInModal={this.toggleSignInModal} />
              </>
            )}
          </TopRowOneRightContainer>
          <TopRowTwoLeftContainer style={{ display: `${isFriends ? 'inherit' : 'none'}` }}>
            {(isFriends) && (
              <FriendsTabs />
            )}
          </TopRowTwoLeftContainer>
        </TopOfPageHeader>
        <HeaderBarModals
          shows={shows}
          closeSignInModal={this.closeSignInModal}
          toggleSelectBallotModal={this.toggleSelectBallotModal}
          closePaidAccountUpgradeModal={this.closePaidAccountUpgradeModal}
          closeShareModal={this.closeShareModal}
          closeAdviserIntroModal={this.closeAdviserIntroModal}
          closeFirstPositionIntroModal={this.closeFirstPositionIntroModal}
          closePersonalizedScoreIntroModal={this.closePersonalizedScoreIntroModal}
          closeValuesIntroModal={this.closeValuesIntroModal}
          closeImageUploadModal={this.closeImageUploadModal}
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
    height: 4,
  },
});

const AddressWrapperDesktop = styled.div`
  margin-top: 5px;
  width: 212px;
`;

const AddressWrapperMobile = styled.div`
  margin-top: 9px;
`;

const FirstNameWrapper = styled.div`
  font-size: 14px;
  padding-right: 4px;
`;

// const FriendTabWrapper = styled.div`
//   margin-left: ${({ incomingFriendRequests }) => (incomingFriendRequests ? '-20px' : '0')};
// `;


const HeaderBarWrapper = styled.div`
  margin-top: ${({ hasNotch }) => (hasNotch ? '1.5rem' : '0')};
  // transition: all 50ms ease-in;
  // ${({ scrolledDown }) => (scrolledDown ? 'transform: translateY(-100%);' : '')}
  ${({ hasSubMenu }) => (!hasSubMenu ? '' :
    'box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);' +
    'border-bottom = 1px solid #aaa;')}
`;

const SearchWrapper = styled.div`
  margin-top: 10px;
`;

export default withStyles(styles)(HeaderBar);
