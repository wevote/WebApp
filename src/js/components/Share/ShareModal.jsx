import { ArrowBackIos, Close, People } from '@mui/icons-material';
import { Button, Dialog, DialogContent, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import apiCalming from '../../common/utils/apiCalming';
import { cordovaLinkToBeSharedFixes } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp'; // isCordova
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore from '../../stores/AppObservableStore'; // , { messageService }
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import createMessageToFriendDefaults from '../../utils/createMessageToFriendDefaults';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import MessageCard from '../Widgets/MessageCard';
import { ShareFacebook, SharePreviewFriends, shareStyles, ShareTwitterAndCopy } from './shareButtonCommon'; // cordovaSocialSharingByEmail
import ShareModalOption from './ShareModalOption';
import { returnFriendsModalTitle, returnShareModalTitle } from './ShareModalText';
import ShareModalTitleArea from './ShareModalTitleArea';

const ShareWithFriendsModalBodyWithController = React.lazy(() => import(/* webpackChunkName: 'ShareWithFriendsModalBodyWithController' */ '../Friends/ShareWithFriendsModalBodyWithController'));
const ShareWithFriendsModalTitleWithController = React.lazy(() => import(/* webpackChunkName: 'ShareWithFriendsModalTitleWithController' */ '../Friends/ShareWithFriendsModalTitleWithController'));


class ShareModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // chosenPreventSharingOpinions: false,
      currentFullUrlToShare: '',
      currentFriendList: [],
      friendsModalTitle: '',
      // friendsToShareWith: [],
      shareModalStep: '',
      shareModalTitle: '',
      shareWithFriendsNow: false,
      urlWithSharedItemCode: '',
      urlWithSharedItemCodeAllOpinions: '',
    };
  }

  // Steps: ballotShareOptions, friends

  componentDidMount () {
    const { shareModalStep } = this.props;
    // console.log('shareModalStep componentDidMount this.props:', shareModalStep);

    // this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    if (apiCalming('friendListsAll', 3000)) {
      FriendActions.friendListsAll();
    }
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    const currentFullUrlAdjusted = cordovaLinkToBeSharedFixes(window.location.href || '');
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, false);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('ShareModal componentDidMount urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      ShareActions.sharedItemSave(currentFullUrlToShare);
    }
    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    const shareModalStepModified = shareModalStep || 'ballotShareOptions';
    this.setState({
      // chosenPreventSharingOpinions,
      currentFriendList,
      currentFullUrlToShare,
      friendsModalTitle: returnFriendsModalTitle(shareModalStepModified),
      shareModalStep: shareModalStepModified,
      shareModalTitle: returnShareModalTitle(shareModalStepModified),
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    });
    // this.openSignInModalIfWeShould(shareModalStep, voterIsSignedIn);
    AnalyticsActions.saveActionModalShare(VoterStore.electionId());

    // Make sure we have We Vote friends data
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
    if (apiCalming('voterContactListSave', 60000)) {
      VoterActions.voterContactListAugmentWithWeVoteData(true);
    }
  }

  componentWillUnmount () {
    // this.appStateSubscription.unsubscribe();
    this.friendStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  // onAppObservableStoreChange () {
  //   const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
  //   this.setState({
  //     chosenPreventSharingOpinions,
  //   });
  // }

  onFriendStoreChange () {
    let { currentFriendList } = this.state;
    if (currentFriendList.length !== FriendStore.currentFriends().length) {
      const currentFriendListUnsorted = FriendStore.currentFriends();
      currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
      this.setState({ currentFriendList });
    }
  }

  onShareStoreChange () {
    // console.log('SharedModal onShareStoreChange');
    const currentFullUrlAdjusted = cordovaLinkToBeSharedFixes(window.location.href || '');
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, false);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('SharedModal onShareStoreChange urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    this.setState({
      currentFullUrlToShare,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    });
  }

  onVoterStoreChange () {
    const currentFullUrlAdjusted = cordovaLinkToBeSharedFixes(window.location.href || '');
    const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, false);
    // console.log('onVoterStoreChange urlWithSharedItemCode:', urlWithSharedItemCode);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      ShareActions.sharedItemRetrieveByFullUrl(currentFullUrlToShare);
    }
    this.setState({
      currentFullUrlToShare,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    });
  }

  onClickGoBack = () => {
    this.setState({
      shareWithFriendsNow: false,
    });
  }

  setStep = (shareModalStep, voterIsSignedInIncoming = null) => {
    let voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    if (voterIsSignedInIncoming !== null) {
      voterIsSignedIn = voterIsSignedInIncoming;
    }
    this.setState({
      friendsModalTitle: returnFriendsModalTitle(shareModalStep),
      shareModalStep,
      shareModalTitle: returnShareModalTitle(shareModalStep),
    });
    AppObservableStore.setShareModalStep(shareModalStep);
    this.openSignInModalIfWeShould(shareModalStep, voterIsSignedIn);
  }

  openSignInModalIfWeShould = (shareModalStep, voterIsSignedIn) => {
    if (stringContains('AllOpinions', shareModalStep)) {
      if (!voterIsSignedIn) {
        AppObservableStore.setShowSignInModal(true);
      }
    }
  }

  saveActionShareButtonCopy = () => {
    AnalyticsActions.saveActionShareButtonCopy(VoterStore.electionId());
  }

  saveActionShareButtonEmail = () => {
    AnalyticsActions.saveActionShareButtonEmail(VoterStore.electionId());
  }

  saveActionShareButtonFacebook = () => {
    AnalyticsActions.saveActionShareButtonFacebook(VoterStore.electionId());
  }

  saveActionShareButtonFriends = () => {
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    // console.log('saveActionShareButtonFriends voterIsSignedIn:', voterIsSignedIn);
    if (voterIsSignedIn) {
      this.setState({
        shareWithFriendsNow: true,
      });
    } else {
      AppObservableStore.setShowSignInModal(true);
    }
    AnalyticsActions.saveActionShareButtonFriends(VoterStore.electionId());
  }

  saveActionShareButtonTwitter = () => {
    AnalyticsActions.saveActionShareButtonTwitter(VoterStore.electionId());
  }

  closeShareModal = () => {
    const { location: { pathname } } = window;
    this.props.closeShareModal(pathname);
  }

  handleShareAllOpinionsToggle = (evt) => {
    const { shareModalStep } = this.state;
    const { value } = evt.target;
    // console.log('handleShareAllOpinionsToggle value:', value, ', shareModalStep:', shareModalStep);
    if (value === 'AllOpinions') {
      this.includeOpinions(shareModalStep);
    } else {
      this.doNotIncludeOpinions(shareModalStep);
    }
  };

  doNotIncludeOpinions (shareModalStep) {
    if (stringContains('AllOpinions', shareModalStep)) {
      const newShareModalStep = shareModalStep.replace('AllOpinions', '');
      this.setStep(newShareModalStep);
    }
  }

  includeOpinions (shareModalStep) {
    if (!stringContains('AllOpinions', shareModalStep)) {
      const newShareModalStep = `${shareModalStep}AllOpinions`;
      this.setStep(newShareModalStep);
    }
  }

  render () {
    renderLog('ShareModal');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ShareModal render');
    const { location: { pathname } } = window;
    const { classes } = this.props;
    const {
      currentFullUrlToShare, friendsModalTitle, shareModalStep, shareModalTitle, // chosenPreventSharingOpinions
      shareWithFriendsNow, urlWithSharedItemCode, urlWithSharedItemCodeAllOpinions,
    } = this.state;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    let shareModalHtml = (
      <>Loading...</>
    );
    // console.log('shareModalStep:', shareModalStep);
    if ((!shareModalStep) || (shareModalStep === '')) {
      return shareModalHtml;
    }
    const messageToFriendType = 'remindContacts';
    const results = createMessageToFriendDefaults(messageToFriendType);
    const { messageToFriendDefault } = results;
    const titleText = messageToFriendDefault;

    // let emailSubjectEncoded = '';
    // let emailBodyEncoded = '';
    let linkToBeShared = '';
    let linkToBeSharedUrlEncoded = '';
    // console.log('shareModalStep: ', shareModalStep);
    if (stringContains('AllOpinions', shareModalStep)) {
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
    linkToBeShared = cordovaLinkToBeSharedFixes(linkToBeShared);
    linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
    // console.log('ShareModal linkToBeShared:', linkToBeShared);

    if (shareWithFriendsNow) {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.closeShareModal(pathname); }}
        >
          <ModalTitleAreaMini>
            <div>
              <Button className={classes.backButton} color="primary" onClick={() => { this.onClickGoBack(); }}>
                <ArrowBackIos className={classes.backButtonIcon} />
                Back
              </Button>
              <IconButton
                aria-label="Close"
                className={classes.closeButtonAbsolute}
                onClick={this.closeShareModal}
                id="profileCloseShareModal"
                size="large"
              >
                <Close />
              </IconButton>
            </div>
            <Suspense fallback={<></>}>
              <ShareWithFriendsModalTitleWithController
                friendsModalTitle={friendsModalTitle}
                shareModalStep={shareModalStep}
                urlToShare={linkToBeShared}
              />
            </Suspense>
          </ModalTitleAreaMini>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <div className="full-width">
              <Suspense fallback={<></>}>
                <ShareWithFriendsModalBodyWithController />
              </Suspense>
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if ((shareModalStep === 'ballotShareOptions') ||
        (shareModalStep === 'ballotShareOptionsAllOpinions') ||
        (shareModalStep === 'candidateShareOptions') ||
        (shareModalStep === 'candidateShareOptionsAllOpinions') ||
        (shareModalStep === 'measureShareOptions') ||
        (shareModalStep === 'measureShareOptionsAllOpinions') ||
        (shareModalStep === 'officeShareOptions') ||
        (shareModalStep === 'officeShareOptionsAllOpinions') ||
        (shareModalStep === 'organizationShareOptions') ||
        (shareModalStep === 'organizationShareOptionsAllOpinions') ||
        (shareModalStep === 'readyShareOptions') ||
        (shareModalStep === 'readyShareOptionsAllOpinions')
    ) {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.closeShareModal(pathname); }}
        >
          <ShareModalTitleArea
            firstSlide
            shareFooterStep={shareModalStep}
            shareModalTitle={shareModalTitle}
            handleShareAllOpinionsToggle={this.handleShareAllOpinionsToggle}
            handleCloseShareButtonDrawer={this.closeShareModal}
          />

          <DialogContent classes={{ root: classes.dialogContent }}>
            <div className="full-width">
              <Flex>
                <ShareModalOption
                  backgroundColor="#0834cd"
                  icon={<img src={normalizedImagePath('../../../img/global/svg-icons/we-vote-icon-square-color.svg')} alt="" />}
                  id="shareWithFriends"
                  noLink
                  onClickFunction={this.saveActionShareButtonFriends}
                  title="We Vote friends"
                  uniqueExternalId="shareModalOption-shareWithFriends"
                  // urlToShare={linkToBeShared}
                />
              </Flex>
            </div>
            <div className="full-width">
              <Flex>
                <ShareFacebook titleText={titleText} saveActionShareButtonFacebook={this.saveActionShareButtonFacebook} linkToBeShared={linkToBeSharedUrlEncoded} />
                <ShareTwitterAndCopy titleText={titleText} saveActionShareButtonTwitter={this.saveActionShareButtonTwitter} saveActionShareButtonCopy={this.saveActionShareButtonCopy} linkToBeSharedTwitter={linkToBeSharedUrlEncoded} linkToBeSharedCopy={linkToBeShared} />
              </Flex>
              {(isWebApp() && stringContains('AllOpinions', shareModalStep) && voterIsSignedIn) && (
                <SharePreviewFriends classes={classes} linkToBeShared={linkToBeShared} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    } else {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.closeShareModal(pathname); }}
        >
          <ModalTitleAreaMini>
            <Button className={classes.backButton} color="primary" onClick={() => { this.setStep('ballotShareOptions'); }}>
              <ArrowBackIos className={classes.backButtonIcon} />
              Back
            </Button>
            <IconButton
              aria-label="Close"
              className={classes.closeButton}
              onClick={this.closeShareModal}
              id="profileCloseShareModal"
              size="large"
            >
              <Close />
            </IconButton>
          </ModalTitleAreaMini>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <MessageCard
              mainText="You haven't added any friends yet."
              buttonText="Add friends"
              buttonURL="/friends/invite"
              noCard
              fullWidthButton
              secondaryText="By adding friends you enjoy discussing politics with to We Vote, you can help each other get ready for elections."
              inShareModal
              icon={<People />}
              onClickFunc={this.closeShareModal}
            />
          </DialogContent>
        </Dialog>
      );
    }
    return (
      <>
        { shareModalHtml }
      </>
    );
  }
}
ShareModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  shareModalStep: PropTypes.string,
  closeShareModal: PropTypes.func.isRequired,
};

/* eslint no-nested-ternary: ["off"] */
const  ModalTitleAreaMini = styled('div', {
  shouldForwardProp: (prop) => !['firstSlide', 'onSignInSlide'].includes(prop),
})(({ firstSlide, onSignInSlide }) => (`
  justify-content: flex-start;
  flex-flow: column;
  width: 100%;
  padding: ${firstSlide ? '24px 24px 12px 24px' : (onSignInSlide ? '20px 14px 10px' : '10px 14px')};
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: ${onSignInSlide ? 'block' : 'flex'};
  text-align: ${onSignInSlide ? 'center' : 'left'};
`));

const Flex = styled('div')`
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
`;

export default withTheme(withStyles(shareStyles)(ShareModal));
