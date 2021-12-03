import { Button, Drawer, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { ArrowBackIos, Comment, FileCopyOutlined, Info, Reply } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import VoterStore from '../../stores/VoterStore';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
import { shareBottomOffset } from '../../utils/cordovaOffsets';
import { cordovaLinkToBeSharedFixes, isAndroid, isCordova, isWebApp } from '../../utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { normalizedHref } from '../../utils/hrefUtils';
import isMobile from '../../utils/isMobile';
import { renderLog } from '../../common/utils/logging';
import { stringContains } from '../../utils/textFormat';
import { openSnackbar } from '../Widgets/SnackNotifier';
import { androidFacebookClickHandler, androidTwitterClickHandler, cordovaSocialSharingByEmail } from './shareButtonCommon';
import ShareModalOption from './ShareModalOption';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

class ShareButtonFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidateShare: false,
      chosenPreventSharingOpinions: false,
      currentFullUrlToShare: '',
      hideShareButtonFooter: false,
      measureShare: false,
      officeShare: false,
      openShareButtonDrawer: false,
      organizationShare: false,
      readyShare: false,
      shareFooterStep: '',
      showingOneCompleteYourProfileModal: false,
      showShareButton: true,
      showShareModal: false,
      showSignInModal: false,
      showVoterPlanModal: false,
      voterIsSignedIn: false,
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
    const currentFullUrlAdjusted = this.getCurrentFullUrl();
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '');

    const ballotShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ballot');
    const candidateShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/candidate');
    const measureShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/measure');
    const officeShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/office');
    const readyShare = typeof pathname !== 'undefined' && pathname && pathname.startsWith('/ready');
    const organizationShare = !ballotShare && !candidateShare && !measureShare && !officeShare && !readyShare;

    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
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
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      candidateShare,
      chosenPreventSharingOpinions,
      currentFullUrlAdjusted,
      currentFullUrlToShare,
      measureShare,
      officeShare,
      organizationShare,
      readyShare,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSignInModal,
      showVoterPlanModal,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
      voterIsSignedIn,
    });
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const { openShareButtonDrawer } = this.state;
    const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    const scrolledDown = AppObservableStore.getScrolledDown();
    const hideShareButtonFooter = scrolledDown && !openShareButtonDrawer;
    // console.log('scrolledDown:', scrolledDown, ', hideShareButtonFooter:', hideShareButtonFooter);
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    this.setState({
      chosenPreventSharingOpinions,
      hideShareButtonFooter,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  onShareStoreChange () {
    // console.log('SharedModal onShareStoreChange');
    const currentFullUrlAdjusted = this.getCurrentFullUrl();
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
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
    const voter = VoterStore.getVoter();
    // console.log('ShareButtonFooter, onVoterStoreChange voter: ', VoterStore.getVoter());
    const voterIsSignedIn = voter.is_signed_in;
    const currentFullUrlAdjusted = this.getCurrentFullUrl();
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
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
      voterIsSignedIn,
    });
  }

  getCurrentFullUrl () {
    const { location: { href } } = window;
    let currentFullUrl = href || ''; // We intentionally don't use normalizedHref() here
    // Handles localhost and Cordova, always builds url to wevote.us
    if (currentFullUrl.startsWith('https://localhost')) {
      currentFullUrl = currentFullUrl.replace(/https:\/\/localhost.*?\//, 'https://wevote.us/');
      // console.log(`currentFullUrl adjusted for localhost: ${currentFullUrl}`);
    } else if (currentFullUrl.startsWith('file:///')) {
      currentFullUrl = currentFullUrl.replace(/file:.*?android_asset\/www\/index.html#\//, 'https://wevote.us/');
      // console.log(`currentFullUrl adjusted for Cordova android: ${currentFullUrl}`);
    } else if (currentFullUrl.startsWith('file://')) {
      currentFullUrl = currentFullUrl.replace(/file:\/\/.*?Vote.app\/www\/index.html#\//, 'https://wevote.us/');
      // console.log(`currentFullUrl adjusted for Cordova ios: ${currentFullUrl}`);
    }
    return currentFullUrl;
  }

  setStep (shareFooterStep) {
    AppObservableStore.setShareModalStep(shareFooterStep);
    const showSignInModal = AppObservableStore.showSignInModal();
    this.setState({
      shareFooterStep,
      showSignInModal,
    });
    this.openSignInModalIfWeShould(shareFooterStep);
  }

  handleShareButtonClick = () => {
    const pathname = normalizedHref();
    const { currentFullUrlAdjusted } = this.state;
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '');

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
    });
  }

  handleCloseShareButtonDrawer = () => {
    this.setState({
      openShareButtonDrawer: false,
      shareFooterStep: '',
      showShareButton: true,
    });
  }

  handleBackButtonClick = () => {
    this.setState({
      shareFooterStep: '',
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
  }

  openSignInModalIfWeShould = (shareFooterStep) => {
    const { voterIsSignedIn } = this.state;
    // console.log('ShareButtonFooter openSignInModalIfWeShould, shareFooterStep:', shareFooterStep, ', voterIsSignedIn:', voterIsSignedIn);
    if (stringContains('AllOpinions', shareFooterStep)) {
      if (!voterIsSignedIn) {
        AppObservableStore.setShowSignInModal(true);
        this.setState({
          shareFooterStep: shareFooterStep.replace('AllOpinions', ''),
        });
      }
    }
  }

  saveActionShareButtonCopy = () => {      // Save Analytics
    openSnackbar({ message: 'Copied!' });
    AnalyticsActions.saveActionShareButtonCopy(VoterStore.electionId());
  }

  saveActionShareButtonEmail = () => {     // Save Analytics
    AnalyticsActions.saveActionShareButtonEmail(VoterStore.electionId());
  }

  saveActionShareButtonFacebook = () => {  // Save Analytics
    AnalyticsActions.saveActionShareButtonFacebook(VoterStore.electionId());
  }

  saveActionShareButtonFriends = () => {
    // TODO To be modified
    const { voterIsSignedIn } = this.state;
    if (!voterIsSignedIn) {
      AppObservableStore.setShowSignInModal(true);
      this.setStep('friends');
    } else {
      this.setStep('friends');
    }
    AnalyticsActions.saveActionShareButtonFriends(VoterStore.electionId());
  }

  saveActionShareButtonTwitter = () => {    // Save Analytics
    AnalyticsActions.saveActionShareButtonTwitter(VoterStore.electionId());
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

  doNotIncludeOpinions (shareFooterStep) {
    if (stringContains('AllOpinions', shareFooterStep)) {
      const newShareFooterStep = shareFooterStep.replace('AllOpinions', '');
      this.setStep(newShareFooterStep);
    }
  }

  includeOpinions (shareFooterStep) {
    const { voterIsSignedIn } = this.state;
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

  generateShareMenuDescription (pageName) {
    return `Generate a link to this ${pageName}page. The 'Your Opinions' link will also show all of your opinions. ${isWebApp() ? 'A preview link on the next screen will show you what your friends will see.' : ''}`;
  }

  render () {
    renderLog('ShareButtonFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { location: { pathname } } = window;
    const {
      candidateShare, chosenPreventSharingOpinions, currentFullUrlToShare,
      hideShareButtonFooter, measureShare, officeShare,
      openShareButtonDrawer, organizationShare, readyShare,
      shareFooterStep, showingOneCompleteYourProfileModal, showShareButton,
      showShareModal, showSignInModal, showVoterPlanModal,
      urlWithSharedItemCode, urlWithSharedItemCodeAllOpinions,
    } = this.state;
    const { showFooterBar } = getApplicationViewBooleans(pathname);

    // Hide if scrolled down the page
    // console.log('ShareButtonFooter hideShareButtonFooter:', hideShareButtonFooter, ', showFooterBar:', showFooterBar);
    if (hideShareButtonFooter) {
      return null;
    }

    if (!VoterStore.getVoterWeVoteId()) {
      // console.log('ShareButtonFooter, waiting for voterRetrieve to complete');
      return null;
    }

    const titleText = 'This is a website I am using to get ready to vote.';
    // let emailSubjectEncoded = '';
    // let emailBodyEncoded = '';
    let linkToBeShared = '';
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
    // linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
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
    // console.log('ShareButtonFooter showShareButton: ', showShareButton, ', linkToBeShared:', linkToBeShared);

    const hideFooterBehindModal = showingOneCompleteYourProfileModal || showShareModal || showSignInModal || showVoterPlanModal;
    const developmentFeatureTurnedOn = false;
    return (
      <Wrapper
        className={hideFooterBehindModal ? 'u-z-index-1000' : 'u-z-index-9000'}
        shareBottomValue={() => shareBottomOffset(!showFooterBar)}
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
          >
            <Icon>
              <Reply
                classes={{ root: classes.shareIcon }}
              />
            </Icon>
            <span className="u-no-break">Share Page</span>
            <Info classes={{ root: classes.informationIconInButton }} />
          </Button>
        )}
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
                  <ModalTitleArea>
                    <Button
                      className={classes.backButton}
                      color="primary"
                      id="shareButtonFooterBack"
                      onClick={this.handleBackButtonClick}
                    >
                      <ArrowBackIos className={classes.backButtonIcon} />
                      Back
                    </Button>
                    <Title>
                      Share:
                      {' '}
                      <strong>
                        {(shareFooterStep === 'ballotShareOptions') && 'Ballot'}
                        {(shareFooterStep === 'ballotShareOptionsAllOpinions') && 'Ballot + Your Opinions'}
                        {(shareFooterStep === 'candidateShareOptions') && 'Candidate'}
                        {(shareFooterStep === 'candidateShareOptionsAllOpinions') && 'Candidate + Your Opinions'}
                        {(shareFooterStep === 'measureShareOptions') && 'Measure'}
                        {(shareFooterStep === 'measureShareOptionsAllOpinions') && 'Measure + Your Opinions'}
                        {(shareFooterStep === 'officeShareOptions') && 'Office'}
                        {(shareFooterStep === 'officeShareOptionsAllOpinions') && 'Office + Your Opinions'}
                        {(shareFooterStep === 'organizationShareOptions') && 'This Page'}
                        {(shareFooterStep === 'organizationShareOptionsAllOpinions') && 'This Page + Your Opinions'}
                        {(shareFooterStep === 'readyShareOptions') && 'Ready Page'}
                        {(shareFooterStep === 'readyShareOptionsAllOpinions') && 'Ready Page + Your Opinions'}
                      </strong>
                    </Title>
                    <SubTitle>
                      {(shareFooterStep === 'ballotShareOptions') && (
                        <>Send friends to their ballot so they can get ready to vote.</>
                      )}
                      {(shareFooterStep === 'ballotShareOptionsAllOpinions') && (
                        <>Send friends to their ballot.</>
                      )}
                      {(shareFooterStep === 'candidateShareOptions') && (
                        <>Send friends this candidate.</>
                      )}
                      {(shareFooterStep === 'candidateShareOptionsAllOpinions') && (
                        <>Send friends to this candidate.</>
                      )}
                      {(shareFooterStep === 'measureShareOptions') && (
                        <>Send friends to this measure/proposition.</>
                      )}
                      {(shareFooterStep === 'measureShareOptionsAllOpinions') && (
                        <>Send friends to this measure/proposition.</>
                      )}
                      {(shareFooterStep === 'officeShareOptions') && (
                        <>Send friends to this office.</>
                      )}
                      {(shareFooterStep === 'officeShareOptionsAllOpinions') && (
                        <>Send friends to this office.</>
                      )}
                      {(shareFooterStep === 'organizationShareOptions') && (
                        <>Send friends to this page.</>
                      )}
                      {(shareFooterStep === 'organizationShareOptionsAllOpinions') && (
                        <>Send friends to this page.</>
                      )}
                      {(shareFooterStep === 'readyShareOptions') && (
                        <>Send friends to their own Ready page.</>
                      )}
                      {(shareFooterStep === 'readyShareOptionsAllOpinions') && (
                        <>Send friends to their own Ready page.</>
                      )}
                      {stringContains('AllOpinions', shareFooterStep) ? (
                        <>
                          {' '}
                          {isWebApp() ? 'A three-step intro to We Vote will be shown in a popup.' : ''}
                          {' '}
                          This link will give permission to see your opinions.
                          {' '}
                          <span className="u-link-color u-underline u-cursor--pointer" onClick={() => this.doNotIncludeOpinions(shareFooterStep)}>
                            Don&apos;t include your opinions.
                          </span>
                        </>
                      ) : (
                        <>
                          {' '}
                          {isWebApp() ? 'A three-step intro to We Vote will be shown in a popup.' : ''}
                          {' '}
                          Your opinions are NOT included.
                          {' '}
                          {!chosenPreventSharingOpinions && (
                            <span className="u-link-color u-underline u-cursor--pointer" onClick={() => this.includeOpinions(shareFooterStep)}>
                              Include your opinions.
                            </span>
                          )}
                        </>
                      )}
                    </SubTitle>
                  </ModalTitleArea>
                  {(developmentFeatureTurnedOn && isMobile() && navigator.share) ? (
                    <Flex>
                      {developmentFeatureTurnedOn && (
                        <ShareModalOption
                          noLink
                          onClickFunction={() => this.openShareModal('friends')}
                          backgroundColor="#2E3C5D"
                          icon={<img src="../../../img/global/svg-icons/we-vote-icon-square-color.svg" alt="" />}
                          title="We Vote Friends"
                          uniqueExternalId="shareButtonFooter-Friends"
                        />
                      )}
                      <ShareModalOption
                        backgroundColor="#2E3C5D"
                        copyLink
                        icon={<FileCopyOutlined />}
                        link={linkToBeShared}
                        onClickFunction={this.saveActionShareButtonCopy}
                        title="Copy Link"
                        uniqueExternalId="shareButtonFooter-CopyLink"
                      />
                      <ShareModalOption
                        backgroundColor="#2E3C5D"
                        icon={<Reply />}
                        noLink
                        onClickFunction={() => this.openNativeShare(linkToBeShared, 'Open Share')}
                        title="Share"
                        uniqueExternalId="shareButtonFooter-NativeShare"
                      />
                    </Flex>
                  ) : (
                    <Flex>
                      <ShareWrapper>
                        <div id="androidFacebook"
                             onClick={() => isAndroid() &&
                               androidFacebookClickHandler(`${linkToBeShared}&t=WeVote`)}
                        >
                          <FacebookShareButton
                            className="no-decoration"
                            id="shareFooterFacebookButton"
                            onClick={this.saveActionShareButtonFacebook}
                            quote={titleText}
                            url={`${linkToBeShared}&t=WeVote`}
                            windowWidth={750}
                            windowHeight={600}
                            disabled={isAndroid()}
                            disabledStyle={isAndroid() ? { opacity: 1 } : {}}
                          >
                            <FacebookIcon
                              bgStyle={{ background: '#3b5998' }}
                              round="True"
                              size={68}
                            />
                            <Text>
                              Facebook
                            </Text>
                          </FacebookShareButton>
                        </div>
                      </ShareWrapper>
                      <ShareWrapper>
                        <div id="androidTwitter"
                             onClick={() => isAndroid() &&
                               androidTwitterClickHandler(linkToBeShared)}
                        >
                          <TwitterShareButton
                            className="no-decoration"
                            id="shareFooterTwitterButton"
                            onClick={this.saveActionShareButtonTwitter}
                            title={titleText}
                            url={`${linkToBeShared}`}
                            windowWidth={750}
                            windowHeight={600}
                            disabled={isAndroid()}
                            disabledStyle={isAndroid() ? { opacity: 1 } : {}}
                          >
                            <TwitterIcon
                              bgStyle={{ background: '#38A1F3' }}
                              round="True"
                              size={68}
                            />
                            <Text>
                              Twitter
                            </Text>
                          </TwitterShareButton>
                        </div>
                      </ShareWrapper>
                      <ShareWrapper>
                        {/* The EmailShareButton works in Cordova, but ONLY if an email client is configured, so it doesn't work in a simulator */}
                        <div id="cordovaEmail"
                             onClick={() => isCordova() &&
                               cordovaSocialSharingByEmail('Ready to vote?', linkToBeShared, this.handleCloseShareButtonDrawer)}
                        >
                          <EmailShareButton
                            body={`${titleText} ${linkToBeShared}`}
                            className="no-decoration"
                            id="shareFooterEmailButton"
                            beforeOnClick={this.saveActionShareButtonEmail}
                            openShareDialogOnClick
                            subject="Ready to vote?"
                            url={`${linkToBeShared}`}
                            windowWidth={750}
                            windowHeight={600}
                            disabled={isCordova()}
                            disabledStyle={isCordova() ? { opacity: 1 } : {}}
                          >
                            <EmailIcon
                              bgStyle={{ fill: '#2E3C5D' }}
                              round="True"
                              size={68}
                            />
                            <Text>
                              Email
                            </Text>
                          </EmailShareButton>
                        </div>
                      </ShareWrapper>
                      <ShareModalOption
                        backgroundColor="#2E3C5D"
                        copyLink
                        icon={<FileCopyOutlined />}
                        link={linkToBeShared}
                        onClickFunction={this.saveActionShareButtonCopy}
                        title="Copy Link"
                        uniqueExternalId="shareButtonFooter-CopyLink"
                      />
                    </Flex>
                  )}
                  {isWebApp() && (  // This has many problems in Cordova
                    <Suspense fallback={<></>}>
                      <OpenExternalWebSite
                        linkIdAttribute="allOpinions"
                        url={linkToBeShared}
                        target="_blank"
                        // title={this.props.title}
                        className="u-no-underline"
                        body={(
                          <Button className={classes.previewButton} variant="outlined" fullWidth color="primary">
                            Preview Link in New Window
                          </Button>
                        )}
                        style={isCordova() ? { display: 'none' } : {}}
                      />
                    </Suspense>
                  )}
                  <Button className={classes.cancelButton} fullWidth onClick={this.handleCloseShareButtonDrawer} variant="outlined" color="primary">
                    Cancel
                  </Button>
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
      </Wrapper>
    );
  }
}
ShareButtonFooter.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  buttonDefault: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '45px !important',
  },
  buttonDefaultCordova: {
    padding: '0 12px',
    width: '100%',
    boxShadow: 'none !important',
    borderRadius: '0 !important',
    height: '35px !important',
  },
  backButton: {
    marginBottom: 6,
    marginLeft: -8,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 12,
  },
  informationIcon: {
    color: '#999',
    width: 20,
    height: 20,
    marginTop: '-3px',
    marginRight: 3,
  },
  informationIconInButton: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginLeft: 3,
  },
  menuItem: {
    zIndex: '9 !important',
    padding: '0 !important',
    marginBottom: '-2px !important',
    paddingBottom: '1px !important',
    '&:last-child': {
      paddingBottom: '0 !important',
      paddingTop: '1px !important',
    },
    '&:hover': {
      background: '#efefef',
    },
  },
  previewButton: {
    marginTop: 0,
  },
  shareIcon: {
    transform: 'scaleX(-1)',
    position: 'relative',
    top: -1,
  },
});

const Container = styled.div`
  margin: 0 auto;
  max-width: 576px;
  padding: ${(props) => (props.shareOptionsMode ? '16px 16px 32px' : '24px 16px 32px')};
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0 0 0;
  justify-content: center;
  max-width: 320px !important;
  margin: 0 auto;
`;

const Icon = styled.span`
  margin-right: 4px;
`;

const MenuDescription = styled.div`
  font-size: 18px;
`;

const MenuFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 14px 12px;
`;

const MenuIcon = styled.div`
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

const MenuItemsWrapper = styled.div`
  padding: 16px 0;
`;

const MenuText = styled.div`
  margin-left: 12px;
`;

const MenuSeparator = styled.div`
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

const ModalTitleArea = styled.div`
  text-align: left;
  width: 100%;
  padding: 0;
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  ${({ noBoxShadowMode }) => ((noBoxShadowMode) ? '@media (max-width: 376px) {\n    padding: 8px 6px;\n  }' : '')}
`;

// Media queries cause a lot of problems in Cordova, please test in Cordova first, or avoid them
const ShareWrapper = styled.div`
  cursor: pointer;
  display: block !important;
  // margin-bottom: 12px;
  @media (min-width: 600px) {
    flex: 1 1 0;
  }
  height: 100%;
  text-align: center;
  text-decoration: none !important;
  color: black !important;
  transition-duration: .25s;
  &:hover {
    text-decoration: none !important;
    color: black !important;
    transform: scale(1.05);
    transition-duration: .25s;
  }
  @media (max-width: 600px) {
    width: 33.333%;
  }
  @media (max-width: 476px) {
    width: 50%;
  }
`;

const SubTitle = styled.div`
  margin-top: 0;
  font-size: 19px;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 17px;
  }
`;

const Text = styled.h3`
  font-weight: normal;
  font-size: 16px;
  color: black !important;
  padding: 6px;
`;

const Title = styled.h3`
  font-weight: normal;
  font-size: 21px;
  color: black;
  margin-top: 0;
  margin-bottom: 4px;
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    font-size: 17px;
    margin-bottom: 8px;
  }
`;

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom:  ${(props) => (props.shareBottomValue)};
  display: block;
  @media (min-width: 576px) {
    display: none;
  }
`;

export default withStyles(styles)(ShareButtonFooter);
