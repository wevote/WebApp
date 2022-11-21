import { ArrowBackIos, Close, Comment, Info, IosShare, Reply, Share } from '@mui/icons-material';
import { Button, Drawer, IconButton, MenuItem } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterActions from '../../actions/VoterActions';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import apiCalming from '../../common/utils/apiCalming';
import { cordovaLinkToBeSharedFixes, hasDynamicIsland, hasIPhoneNotch, isAndroid } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
import { shareBottomOffset } from '../../utils/cordovaOffsets';
import createMessageToFriendDefaults from '../../utils/createMessageToFriendDefaults';
import isMobile from '../../utils/isMobile';
import { openSnackbar } from '../Widgets/SnackNotifier';
import { ShareFacebook, SharePreviewFriends, shareStyles, ShareTwitterAndCopy, ShareWeVoteFriends } from './shareButtonCommon'; // cordovaSocialSharingByEmail // cordovaSocialSharingByEmail
import ShareModalOption from './ShareModalOption';
import { returnFriendsModalTitle, returnShareModalTitle } from './ShareModalText';
import ShareModalTitleArea from './ShareModalTitleArea';


const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const ShareWithFriendsModalBodyWithController = React.lazy(() => import(/* webpackChunkName: 'ShareWithFriendsModalBodyWithController' */ '../Friends/ShareWithFriendsModalBodyWithController'));
const ShareWithFriendsModalTitleWithController = React.lazy(() => import(/* webpackChunkName: 'ShareWithFriendsModalTitleWithController' */ '../Friends/ShareWithFriendsModalTitleWithController'));


class ShareButtonFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateShare: false,
      chosenPreventSharingOpinions: false,
      currentFullUrlToShare: '',
      // hideShareButtonFooter: false,
      measureShare: false,
      officeShare: false,
      openShareButtonDrawer: false,
      organizationShare: false,
      readyShare: false,
      shareFooterStep: '',
      shareWithFriendsNow: false,
      showingOneCompleteYourProfileModal: false,
      showShareButton: true,
      showShareModal: false,
      showSignInModal: false,
      showVoterPlanModal: false,
    };
  }

  componentDidMount () {
    const pathname = normalizedHref();
    // console.log('ShareButtonFooter componentDidMount');
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    // const currentFullUrlAdjusted = this.getCurrentFullUrl();
    const currentFullUrlAdjusted = cordovaLinkToBeSharedFixes(window.location.href || '');
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();

    const ballotShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ballot');
    const candidateShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/candidate');
    const measureShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/measure');
    const officeShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/office');
    const readyShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ready');
    const organizationShare = !ballotShare && !candidateShare && !measureShare && !officeShare && !readyShare;

    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, false);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('ShareButtonFooter componentDidMount urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      let kindOfShare;
      if (candidateShare) {
        kindOfShare = 'CANDIDATE';
      } else if (measureShare) {
        kindOfShare = 'MEASURE';
      } else if (officeShare) {
        kindOfShare = 'OFFICE';
      } else if (organizationShare) {
        kindOfShare = 'ORGANIZATION';
      } else if (readyShare) {
        kindOfShare = 'READY';
      } else {
        kindOfShare = 'BALLOT';
      }
      ShareActions.sharedItemSave(currentFullUrlToShare, kindOfShare);
    }
    this.setState({
      candidateShare,
      chosenPreventSharingOpinions,
      currentFullUrlAdjusted,
      currentFullUrlToShare,
      measureShare,
      officeShare,
      organizationShare,
      readyShare,
      // friendsModalTitle: returnFriendsModalTitle(shareModalStepModified),
      // shareModalTitle: returnShareModalTitle(shareModalStepModified),
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSignInModal,
      showVoterPlanModal,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ShareButtonFooter caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    // const { openShareButtonDrawer } = this.state;
    const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    // const scrolledDown = AppObservableStore.getScrolledDown();
    // const hideShareButtonFooter = scrolledDown && !openShareButtonDrawer;
    // console.log('onAppObservableStoreChange scrolledDown:', scrolledDown, ', hideShareButtonFooter:', hideShareButtonFooter);
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    this.setState({
      chosenPreventSharingOpinions,
      // hideShareButtonFooter,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  onShareStoreChange () {
    // console.log('SharedModal onShareStoreChange');
    // const currentFullUrlAdjusted = this.getCurrentFullUrl();
    const currentFullUrlAdjusted = cordovaLinkToBeSharedFixes(window.location.href || '');
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, false);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('SharedModal onShareStoreChange urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    this.setState({
      currentFullUrlAdjusted,
      currentFullUrlToShare,
      showSignInModal,
      showVoterPlanModal,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    });
  }

  onVoterStoreChange () {
    // console.log('ShareButtonFooter, onVoterStoreChange voter: ', VoterStore.getVoter());
    // const currentFullUrlAdjusted = this.getCurrentFullUrl();
    const currentFullUrlAdjusted = cordovaLinkToBeSharedFixes(window.location.href || '');
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, false);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      ShareActions.sharedItemRetrieveByFullUrl(currentFullUrlToShare);
    }
    const showSignInModal = AppObservableStore.showSignInModal();
    this.setState({
      currentFullUrlAdjusted,
      currentFullUrlToShare,
      showSignInModal,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    });
  }

  // This has been replaced with cordovaLinkToBeSharedFixes in /src/js/common/utils/cordovaUtils.js
  //  but needs to be tested in Cordova
  // getCurrentFullUrl () {
  //   const { location: { href } } = window;
  //   let currentFullUrl = href || ''; // We intentionally don't use normalizedHref() here
  //   // Handles localhost and Cordova, always builds url to wevote.us
  //   if (currentFullUrl.startsWith('https://localhost')) {
  //     currentFullUrl = currentFullUrl.replace(/https:\/\/localhost.*?\//, 'https://wevote.us/');
  //     // console.log(`currentFullUrl adjusted for localhost: ${currentFullUrl}`);
  //   } else if (currentFullUrl.startsWith('file:///')) {
  //     currentFullUrl = currentFullUrl.replace(/file:.*?android_asset\/www\/index.html#\//, 'https://wevote.us/');
  //     // console.log(`currentFullUrl adjusted for Cordova android: ${currentFullUrl}`);
  //   } else if (currentFullUrl.startsWith('file://')) {
  //     currentFullUrl = currentFullUrl.replace(/file:\/\/.*?Vote.app\/www\/index.html#\//, 'https://wevote.us/');
  //     // console.log(`currentFullUrl adjusted for Cordova ios: ${currentFullUrl}`);
  //   }
  //   return currentFullUrl;
  // }

  setStep (shareFooterStep) {
    AppObservableStore.setShareModalStep(shareFooterStep);
    const showSignInModal = AppObservableStore.showSignInModal();
    this.setState({
      friendsModalTitle: returnFriendsModalTitle(shareFooterStep),
      shareFooterStep,
      shareModalTitle: returnShareModalTitle(shareFooterStep),
      showSignInModal,
    });
    // this.openSignInModalIfWeShould(shareFooterStep);
  }

  handleShareButtonClick = () => {
    const pathname = normalizedHref();
    const { currentFullUrlAdjusted } = this.state;
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();

    const ballotShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ballot');
    const candidateShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/candidate');
    const measureShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/measure');
    const officeShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/office');
    const readyShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ready');
    const organizationShare = !ballotShare && !candidateShare && !measureShare && !officeShare && !readyShare;

    let kindOfShare;
    if (candidateShare) {
      kindOfShare = 'CANDIDATE';
    } else if (measureShare) {
      kindOfShare = 'MEASURE';
    } else if (officeShare) {
      kindOfShare = 'OFFICE';
    } else if (organizationShare) {
      kindOfShare = 'ORGANIZATION';
    } else if (readyShare) {
      kindOfShare = 'READY';
    } else {
      kindOfShare = 'BALLOT';
    }
    ShareActions.sharedItemSave(currentFullUrlAdjusted, kindOfShare);
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const pigsCanFly = false;
    const defaultToAllOpinions = voterIsSignedIn && pigsCanFly;
    this.setState({
      candidateShare,
      currentFullUrlAdjusted,
      currentFullUrlToShare,
      measureShare,
      officeShare,
      openShareButtonDrawer: true,
      organizationShare,
      readyShare,
      shareFooterStep: '',
      showShareButton: false,
    }, () => this.openShareOptions(defaultToAllOpinions)); // openShareOptions advances directly to share
  }

  handleCloseShareButtonDrawer = () => {
    this.setState({
      openShareButtonDrawer: false,
      shareFooterStep: '',
      showShareButton: true,
    });
  }

  onClickGoBack = () => {
    this.setState({
      shareWithFriendsNow: false,
    });
  }

  openShareOptions = (withOpinions = false) => {
    // console.log('ShareButtonFooter openShareOptions');
    const { candidateShare, measureShare, officeShare, organizationShare, readyShare } = this.state;
    let shareFooterStep;
    if (candidateShare) {
      if (withOpinions) {
        shareFooterStep = 'candidateShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareCandidateAllOpinions(VoterStore.electionId());
      } else {
        shareFooterStep = 'candidateShareOptions';
        AnalyticsActions.saveActionShareCandidate(VoterStore.electionId());
      }
    } else if (measureShare) {
      if (withOpinions) {
        shareFooterStep = 'measureShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareMeasureAllOpinions(VoterStore.electionId());
      } else {
        shareFooterStep = 'measureShareOptions';
        AnalyticsActions.saveActionShareMeasure(VoterStore.electionId());
      }
    } else if (officeShare) {
      if (withOpinions) {
        shareFooterStep = 'officeShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareOfficeAllOpinions(VoterStore.electionId());
      } else {
        shareFooterStep = 'officeShareOptions';
        AnalyticsActions.saveActionShareOffice(VoterStore.electionId());
      }
    } else if (organizationShare) {
      if (withOpinions) {
        shareFooterStep = 'organizationShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareOrganizationAllOpinions(VoterStore.electionId());
      } else {
        shareFooterStep = 'organizationShareOptions';
        AnalyticsActions.saveActionShareOrganization(VoterStore.electionId());
      }
    } else if (readyShare) {
      if (withOpinions) {
        shareFooterStep = 'readyShareOptionsAllOpinions';
        AnalyticsActions.saveActionShareReadyAllOpinions(VoterStore.electionId());
      } else {
        shareFooterStep = 'readyShareOptions';
        AnalyticsActions.saveActionShareReady(VoterStore.electionId());
      }
      // Default to ballot
    } else if (withOpinions) {
      shareFooterStep = 'ballotShareOptionsAllOpinions';
      AnalyticsActions.saveActionShareBallotAllOpinions(VoterStore.electionId());
    } else {
      shareFooterStep = 'ballotShareOptions';
      AnalyticsActions.saveActionShareBallot(VoterStore.electionId());
    }
    this.setStep(shareFooterStep);
    // Make sure we have We Vote friends data
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
    if (apiCalming('voterContactListSave', 60000)) {
      VoterActions.voterContactListAugmentWithWeVoteData(true);
    }
  }

  // openSignInModalIfWeShould = (shareFooterStep) => {
  //   const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
  //   // console.log('ShareButtonFooter openSignInModalIfWeShould, shareFooterStep:', shareFooterStep, ', voterIsSignedIn:', voterIsSignedIn);
  //   if (stringContains('AllOpinions', shareFooterStep)) {
  //     if (!voterIsSignedIn) {
  //       AppObservableStore.setShowSignInModal(true);
  //       this.setState({
  //         shareFooterStep: shareFooterStep.replace('AllOpinions', ''),
  //       });
  //     }
  //   }
  // }

  saveActionShareButtonCopy = () => {      // Save Analytics
    openSnackbar({ message: 'Copied!' });
    AnalyticsActions.saveActionShareButtonCopy(VoterStore.electionId());
  }

  // saveActionShareButtonEmail = () => {     // Save Analytics
  //   AnalyticsActions.saveActionShareButtonEmail(VoterStore.electionId());
  // }

  saveActionShareButtonFacebook = () => {  // Save Analytics
    AnalyticsActions.saveActionShareButtonFacebook(VoterStore.electionId());
  }

  saveActionShareButtonFriends = () => {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    if (voterIsSignedIn) {
      this.setState({
        shareWithFriendsNow: true,
      });
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
    AnalyticsActions.saveActionShareButtonFriends(VoterStore.electionId());
  }

  saveActionShareButtonTwitter = () => {    // Save Analytics
    AnalyticsActions.saveActionShareButtonTwitter(VoterStore.electionId());
  }

  handleShareAllOpinionsToggle = (evt) => {
    const { shareFooterStep } = this.state;
    const { value } = evt.target;
    console.log('handleShareAllOpinionsToggle value:', value, ', shareFooterStep:', shareFooterStep);
    if (value === 'AllOpinions') {
      this.includeOpinions(shareFooterStep);
    } else {
      this.doNotIncludeOpinions(shareFooterStep);
    }
  };

  doNotIncludeOpinions (shareFooterStep) {
    if (stringContains('AllOpinions', shareFooterStep)) {
      const newShareFooterStep = shareFooterStep.replace('AllOpinions', '');
      this.setStep(newShareFooterStep);
    }
  }

  includeOpinions (shareFooterStep) {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    // console.log('ShareButtonFooter includeOpinions shareFooterStep:', shareFooterStep, ', voterIsSignedIn:', voterIsSignedIn);
    if (!stringContains('AllOpinions', shareFooterStep)) {
      if (voterIsSignedIn) {
        const newShareFooterStep = `${shareFooterStep}AllOpinions`;
        this.setStep(newShareFooterStep);
      } else {
        AppObservableStore.setShowSignInModal(true);
      }
    }
  }

  openNativeShare (linkToBeShared, shareTitle = '') {
    // console.log('openNativeShare linkToBeShared:', linkToBeShared, 'shareTitle:', shareTitle);
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        url: linkToBeShared,
      }).catch(console.error);
    } else {
      console.log('Could not open native share.');
    }
  }

  openShareModal (shareFooterStep) {
    AppObservableStore.setShowShareModal(true);
    AppObservableStore.setShareModalStep(shareFooterStep);
    const { location: { pathname } } = window;
    if (!stringContains('/modal/share', pathname) && isWebApp()) {
      const pathnameWithModalShare = `${pathname}/modal/share`;
      // console.log('openShareModal ', pathnameWithModalShare);
      historyPush(pathnameWithModalShare);
    }
  }

  generateShareMenuDescription (pageName) {
    return `Generate a link to this ${pageName}page. The 'Your Opinions' link will also show all of your opinions. ${isWebApp() ? 'A preview link on the next screen will show you what your friends will see.' : ''}`;
  }

  render () {
    renderLog('ShareButtonFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;
    const {
      candidateShare, chosenPreventSharingOpinions, currentFullUrlToShare,
      friendsModalTitle, measureShare, officeShare, // , hideShareButtonFooter
      openShareButtonDrawer, organizationShare, readyShare,
      shareFooterStep, shareModalTitle, shareWithFriendsNow, showingOneCompleteYourProfileModal, showShareButton,
      showShareModal, showSignInModal, showVoterPlanModal,
      urlWithSharedItemCode, urlWithSharedItemCodeAllOpinions,
    } = this.state;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    const { showFooterBar } = getApplicationViewBooleans(pathname);

    // Hide if scrolled down the page
    // if (hideShareButtonFooter) {
    //   // console.log('hideShareButtonFooter is TRUE. ShareButtonFooter HIDDEN');
    //   return null;
    // }

    if (!VoterStore.getVoterWeVoteId()) {
      // console.log('ShareButtonFooter, waiting for voterRetrieve to complete');
      return null;
    }

    const messageToFriendType = 'remindContacts';
    const results = createMessageToFriendDefaults(messageToFriendType);
    const { messageToFriendDefault } = results;
    const titleText = messageToFriendDefault;
    // let emailSubjectEncoded = '';
    // let emailBodyEncoded = '';
    let linkToBeShared = '';
    // console.log('shareFooterStep:', shareFooterStep);
    if (stringContains('AllOpinions', shareFooterStep)) {
      if (urlWithSharedItemCodeAllOpinions) {
        linkToBeShared = urlWithSharedItemCodeAllOpinions;
      } else {
        linkToBeShared = currentFullUrlToShare;
      }
    } else if (urlWithSharedItemCode) {
      linkToBeShared = urlWithSharedItemCode;
    } else {
      linkToBeShared = currentFullUrlToShare;
    }
    const linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    // const twitterTextEncoded = encodeURI('Check out this cool ballot tool!');
    // if (shareFooterStep === 'ballotShareOptions') {
    //   emailSubjectEncoded = encodeURI('Ready to vote?');
    //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    // } else if (shareFooterStep === 'ballotShareOptionsAllOpinions') {
    //   emailSubjectEncoded = encodeURI('Ready to vote?');
    //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    // } else if (shareFooterStep === 'candidateShareOptions') {
    //   emailSubjectEncoded = encodeURI('Ready to vote?');
    //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    // } else if (shareFooterStep === 'candidateShareOptionsAllOpinions') {
    //   emailSubjectEncoded = encodeURI('Ready to vote?');
    //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    // } else if (shareFooterStep === 'measureShareOptions') {
    //   emailSubjectEncoded = encodeURI('Ready to vote?');
    //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    // } else if (shareFooterStep === 'measureShareOptionsAllOpinions') {
    //   emailSubjectEncoded = encodeURI('Ready to vote?');
    //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    // } else if (shareFooterStep === 'officeShareOptions') {
    //   emailSubjectEncoded = encodeURI('Ready to vote?');
    //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    // } else if (shareFooterStep === 'officeShareOptionsAllOpinions') {
    //   emailSubjectEncoded = encodeURI('Ready to vote?');
    //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
    // }
    const shareButtonClasses = isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;
    let shareMenuItemsDescription;
    let shareMenuTextDefault;
    let shareMenuTextAllOpinions;
    if (candidateShare) {
      shareMenuItemsDescription = this.generateShareMenuDescription('Candidate ');
      shareMenuTextDefault = 'Candidate';
      shareMenuTextAllOpinions = 'Candidate + Your Opinions';
    } else if (measureShare) {
      shareMenuItemsDescription = this.generateShareMenuDescription('Measure ');
      shareMenuTextDefault = 'Measure';
      shareMenuTextAllOpinions = 'Measure + Your Opinions';
    } else if (officeShare) {
      shareMenuItemsDescription = this.generateShareMenuDescription('Office ');
      shareMenuTextDefault = 'Office';
      shareMenuTextAllOpinions = 'Office + Your Opinions';
    } else if (organizationShare) {
      shareMenuItemsDescription = this.generateShareMenuDescription('');
      shareMenuTextDefault = 'This Page';
      shareMenuTextAllOpinions = 'This Page + Your Opinions';
    } else if (readyShare) {
      shareMenuItemsDescription = this.generateShareMenuDescription('Ready ');
      shareMenuTextDefault = 'Ready Page';
      shareMenuTextAllOpinions = 'Ready Page + Your Opinions';
    } else {
      // Default to ballot
      shareMenuItemsDescription = this.generateShareMenuDescription('Ballot ');
      shareMenuTextDefault = 'Ballot';
      shareMenuTextAllOpinions = 'Ballot + Your Opinions';
    }
    linkToBeShared = cordovaLinkToBeSharedFixes(linkToBeShared);

    const hideFooterBehindModal = showingOneCompleteYourProfileModal || showShareModal || showSignInModal || showVoterPlanModal;
    // console.log('ShareButtonFooter render showShareButton: ', showShareButton, ', linkToBeShared:', linkToBeShared, ', showFooterBar:', showFooterBar, ', hideFooterBehindModal:', hideFooterBehindModal);

    let drawerHtml;
    if (shareWithFriendsNow) {
      drawerHtml = (
        <Drawer
          anchor="bottom"
          className="u-z-index-9010"
          direction="up"
          id="shareMenuFooter"
          onClose={this.handleCloseShareButtonDrawer}
          open={openShareButtonDrawer}
        >
          <ModalTitleAreaFixed notchOrIsland={hasIPhoneNotch() || hasDynamicIsland()}>
            <ModalTitleAreaFixedInnerWrapper>
              <Button
                className={classes.backButton}
                color="primary"
                id="shareButtonFooterBack"
                onClick={this.onClickGoBack}
              >
                <ArrowBackIos className={classes.backButtonIcon} />
                Back
              </Button>
              <IconButton
                aria-label="Close"
                className={classes.closeButtonAbsolute}
                onClick={this.handleCloseShareButtonDrawer}
                id="closeShareModal"
                size="large"
              >
                <Close />
              </IconButton>
            </ModalTitleAreaFixedInnerWrapper>
            <ModalTitleAreaFixedInnerWrapper>
              <Suspense fallback={<></>}>
                <ShareWithFriendsModalTitleWithController
                  friendsModalTitle={friendsModalTitle}
                  shareModalStep={shareFooterStep}
                  urlToShare={linkToBeShared}
                />
              </Suspense>
            </ModalTitleAreaFixedInnerWrapper>
          </ModalTitleAreaFixed>
          <Container
            shareOptionsMode={(
              (shareFooterStep === 'friends')
            )}
          >
            <>
              <AskFriendsModalBodyArea>
                <Suspense fallback={<></>}>
                  <ShareWithFriendsModalBodyWithController />
                </Suspense>
              </AskFriendsModalBodyArea>
            </>
          </Container>
        </Drawer>
      );
    } else {
      drawerHtml = (
        <Drawer
          anchor="bottom"
          className="u-z-index-9010"
          direction="up"
          id="shareMenuFooter"
          onClose={this.handleCloseShareButtonDrawer}
          open={openShareButtonDrawer}
        >
          <Container
            shareOptionsMode={(
              (shareFooterStep === 'ballotShareOptions') ||
              (shareFooterStep === 'ballotShareOptionsAllOpinions') ||
              (shareFooterStep === 'candidateShareOptions') ||
              (shareFooterStep === 'candidateShareOptionsAllOpinions') ||
              (shareFooterStep === 'measureShareOptions') ||
              (shareFooterStep === 'measureShareOptionsAllOpinions') ||
              (shareFooterStep === 'officeShareOptions') ||
              (shareFooterStep === 'officeShareOptionsAllOpinions') ||
              (shareFooterStep === 'organizationShareOptions') ||
              (shareFooterStep === 'organizationShareOptionsAllOpinions') ||
              (shareFooterStep === 'readyShareOptions') ||
              (shareFooterStep === 'readyShareOptionsAllOpinions')
            )}
          >
            {(shareFooterStep === 'ballotShareOptions') ||
              (shareFooterStep === 'ballotShareOptionsAllOpinions') ||
              (shareFooterStep === 'candidateShareOptions') ||
              (shareFooterStep === 'candidateShareOptionsAllOpinions') ||
              (shareFooterStep === 'measureShareOptions') ||
              (shareFooterStep === 'measureShareOptionsAllOpinions') ||
              (shareFooterStep === 'officeShareOptions') ||
              (shareFooterStep === 'officeShareOptionsAllOpinions') ||
              (shareFooterStep === 'organizationShareOptions') ||
              (shareFooterStep === 'organizationShareOptionsAllOpinions') ||
              (shareFooterStep === 'readyShareOptions') ||
              (shareFooterStep === 'readyShareOptionsAllOpinions') ? (
                <>
                  <ShareModalTitleArea
                    firstSlide={false}
                    shareFooterStep={shareFooterStep}
                    shareModalTitle={shareModalTitle}
                    handleShareAllOpinionsToggle={this.handleShareAllOpinionsToggle}
                    handleCloseShareButtonDrawer={this.handleCloseShareButtonDrawer}
                  />
                  <>
                    <Flex>
                      <ShareWeVoteFriends onClickFunction={() => this.saveActionShareButtonFriends()} />
                    </Flex>
                    {(!(isMobile() && navigator.share) || isCordova()) && (
                      <Flex>
                        <ShareFacebook titleText={titleText} saveActionShareButtonFacebook={this.saveActionShareButtonFacebook} linkToBeShared={linkToBeShared} />
                        <ShareTwitterAndCopy titleText={titleText} saveActionShareButtonTwitter={this.saveActionShareButtonTwitter} saveActionShareButtonCopy={this.saveActionShareButtonCopy} linkToBeSharedTwitter={linkToBeSharedUrlEncoded} linkToBeSharedCopy={linkToBeShared} />
                        {isWebApp() && (
                          <ShareModalOption
                            backgroundColor="#2E3C5D"
                            icon={isAndroid() ? <Share /> : <IosShare />}
                            noLink
                            onClickFunction={() => this.openNativeShare(linkToBeShared, 'Open Share')}
                            title="Device share options"
                            uniqueExternalId="shareButtonFooter-NativeShare"
                          />
                        )}
                      </Flex>
                    )}
                  </>
                  {(isWebApp() && (stringContains('AllOpinions', shareFooterStep) && voterIsSignedIn)) && (  // This has many problems in Cordova
                    <SharePreviewFriends classes={classes} linkToBeShared={linkToBeShared} />
                  )}
                  {/*
                  <Button className={classes.cancelButton} fullWidth onClick={this.handleCloseShareButtonDrawer} variant="outlined" color="primary">
                    Cancel
                  </Button>
                  */}
                </>
              ) : (
                <>
                  {shareMenuItemsDescription && (
                    <MenuDescription>
                      <Info classes={{ root: classes.informationIcon }} />
                      <Suspense fallback={<></>}>
                        <ReadMore
                          textToDisplay={shareMenuItemsDescription}
                          numberOfLines={2}
                        />
                      </Suspense>
                    </MenuDescription>
                  )}
                  <MenuItemsWrapper>
                    <MenuItem className={classes.menuItem} onClick={() => this.openShareOptions()}>
                      <MenuFlex>
                        <MenuIcon>
                          <i className="fas fa-list" />
                        </MenuIcon>
                        <MenuText>
                          {shareMenuTextDefault}
                        </MenuText>
                      </MenuFlex>
                    </MenuItem>
                    {!chosenPreventSharingOpinions && (
                      <>
                        <MenuSeparator />
                        <MenuItem className={classes.menuItem} onClick={() => this.openShareOptions(true)}>
                          <MenuFlex>
                            <MenuIcon>
                              <Comment />
                            </MenuIcon>
                            <MenuText>
                              {shareMenuTextAllOpinions}
                            </MenuText>
                          </MenuFlex>
                        </MenuItem>
                      </>
                    )}
                  </MenuItemsWrapper>
                  <Button className={classes.cancelButton} fullWidth onClick={this.handleCloseShareButtonDrawer} variant="outlined" color="primary">
                    Cancel
                  </Button>
                </>
              )}
          </Container>
        </Drawer>
      );
    }
    return (
      <ShareButtonFooterWrapper
        id="ShareButtonFooterWrapperInShareButtonFooter"
        className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
        shareBottomValue={shareBottomOffset(!showFooterBar)}
      >
        {showShareButton && (
          <Button
            aria-controls="shareMenuFooter"
            aria-haspopup="true"
            classes={{ root: shareButtonClasses }}
            color="primary"
            id="shareButtonFooter"
            onClick={this.handleShareButtonClick}
            variant="contained"
            style={isCordova() ? { backgroundColor: 'rgb(23,44,192,.5)' } : {}}
          >
            <Icon>
              <Reply
                classes={{ root: classes.shareIcon }}
              />
            </Icon>
            <span className="u-no-break">Share</span>
          </Button>
        )}
        {drawerHtml}
      </ShareButtonFooterWrapper>
    );
  }
}
ShareButtonFooter.propTypes = {
  classes: PropTypes.object,
};

const AskFriendsModalBodyArea = styled('div')`
  // There must be better way to float this under ModalTitleAreaFixed
  margin-top: 200px;
`;

/* eslint-disable no-nested-ternary */
const Container = styled('div', {
  shouldForwardProp: (prop) => !['shareOptionsMode'].includes(prop),
})(({ shareOptionsMode }) => (`
  margin: 0 auto;
  max-width: 576px;
  padding: ${isWebApp() ? (shareOptionsMode ? '16px 16px 32px' : '24px 16px 32px') : '40px 16px 32px'};
  width: 100%;
`));

const Flex = styled('div')`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0 0 0;
  justify-content: center;
  max-width: 320px !important;
  margin: 0 auto;
`;

const Icon = styled('span')`
  margin-right: 4px;
`;

const MenuDescription = styled('div')`
  font-size: 18px;
`;

const MenuFlex = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 14px 12px;
`;

const MenuIcon = styled('div')`
  width: 20px !important;
  height: 20px !important;
  top: -2px;
  position: relative;
  & * {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    min-height: 20px !important;
  }
  & svg {
    position: relative;
    left: -2px;
  }
`;

const MenuItemsWrapper = styled('div')`
  padding: 16px 0;
`;

const MenuText = styled('div')`
  margin-left: 12px;
`;

const MenuSeparator = styled('div')`
  height: 2px;
  background: #efefef;
  width: 80%;
  margin: 0 auto;
  position: absolute;
  left: 10%;
  z-index: 0 !important;
  @media (min-width: 568px) {
    width: 448px !important;
    margin: 0 auto;
  }
`;

const ModalTitleAreaFixed = styled('div', {
  shouldForwardProp: (prop) => !['notchOrIsland'].includes(prop),
})(({ notchOrIsland }) => (`
  background-color: #fff;
  padding-right: 16px;
  padding-left: 16px;
  padding-top: ${notchOrIsland ? '38px' : '16px'};
  position: fixed;
  text-align: left;
  width: 100%;
  z-index: 999;
`));

const ModalTitleAreaFixedInnerWrapper = styled('div')`
  width: 100%;
`;

const ShareButtonFooterWrapper = styled('div', {
  shouldForwardProp: (prop) => !['shareBottomValue'].includes(prop),
})(({ shareBottomValue }) => (`
  position: fixed;
  width: 100%;
  ${shareBottomValue ? `bottom: ${shareBottomValue}` : ''};
  display: block;
  background-color: white;
  @media (min-width: 576px) {
    display: none;
  }
`));

export default withStyles(shareStyles)(ShareButtonFooter);
