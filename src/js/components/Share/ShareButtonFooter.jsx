import { ArrowBackIos, Close, IosShare, Reply, Share } from '@mui/icons-material'; // , Comment, Info
import { Button, Drawer, IconButton } from '@mui/material'; // , MenuItem
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import ShareActions from '../../common/actions/ShareActions';
import { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import ShareStore from '../../common/stores/ShareStore';
import apiCalming from '../../common/utils/apiCalming';
import { hasDynamicIsland, hasIPhoneNotch, isAndroid } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import webAppConfig from '../../config';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
import { shareBottomOffset } from '../../utils/cordovaOffsets';
import createMessageToFriendDefaults from '../../utils/createMessageToFriendDefaults';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import isMobile from '../../utils/isMobile';
import { CopyLink, getKindOfShareFromURL, getWhatAndHowMuchToShareDefault, saveActionShareAnalytics, ShareFacebook, SharePreviewFriends, shareStyles, ShareTwitter, ShareWeVoteFriends } from './shareButtonCommon'; // cordovaSocialSharingByEmail // cordovaSocialSharingByEmail
import ShareModalOption from './ShareModalOption';
import { generateShareLinks } from './ShareModalText';
import ShareModalTitleArea from './ShareModalTitleArea';


// const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));
const ShareWithFriendsModalBodyWithController = React.lazy(() => import(/* webpackChunkName: 'ShareWithFriendsModalBodyWithController' */ '../Friends/ShareWithFriendsModalBodyWithController'));
const ShareWithFriendsModalTitleWithController = React.lazy(() => import(/* webpackChunkName: 'ShareWithFriendsModalTitleWithController' */ '../Friends/ShareWithFriendsModalTitleWithController'));


class ShareButtonFooter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      openShareButtonDrawer: false,
      shareWithFriendsNow: false,
      showingOneCompleteYourProfileModal: false,
      showShareButton: true,
      showShareModal: false,
      showSignInModal: false,
      showVoterPlanModal: false,
    };
  }

  componentDidMount () {
    // console.log('ShareButtonFooter componentDidMount');
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    if (apiCalming('friendListsAll', 3000)) {
      FriendActions.friendListsAll();
    }
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();

    this.setState({
      // chosenPreventSharingOpinions,
      currentFriendList,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ShareButtonFooter caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.friendStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    // const { openShareButtonDrawer } = this.state;
    // const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    // const scrolledDown = AppObservableStore.getScrolledDown();
    // const hideShareButtonFooter = scrolledDown && !openShareButtonDrawer;
    // console.log('onAppObservableStoreChange scrolledDown:', scrolledDown, ', hideShareButtonFooter:', hideShareButtonFooter);
    const {
      linkToBeShared,
      linkToBeSharedUrlEncoded,
    } = generateShareLinks();
    // console.log('onAppObservableStoreChange linkToBeShared:', linkToBeShared, ', linkToBeSharedUrlEncoded:', linkToBeSharedUrlEncoded);
    const showingOneCompleteYourProfileModal = AppObservableStore.showingOneCompleteYourProfileModal();
    const showShareModal = AppObservableStore.showShareModal();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    this.setState({
      linkToBeShared,
      linkToBeSharedUrlEncoded,
      showingOneCompleteYourProfileModal,
      showShareModal,
      showSignInModal,
      showVoterPlanModal,
    });
  }

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
    const {
      linkToBeShared,
      linkToBeSharedUrlEncoded,
    } = generateShareLinks();
    const showSignInModal = AppObservableStore.showSignInModal();
    const showVoterPlanModal = AppObservableStore.showVoterPlanModal();
    this.setState({
      linkToBeShared,
      linkToBeSharedUrlEncoded,
      showSignInModal,
      showVoterPlanModal,
    });
  }

  onVoterStoreChange () {
    // console.log('ShareButtonFooter, onVoterStoreChange voter: ', VoterStore.getVoter());
    const {
      currentFullUrlToShare,
      linkToBeShared,
      linkToBeSharedUrlEncoded,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    } = generateShareLinks();
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      if (apiCalming(`sharedItemRetrieve${currentFullUrlToShare}`, 10000)) {
        ShareActions.sharedItemRetrieveByFullUrl(currentFullUrlToShare);
      }
    }
    const showSignInModal = AppObservableStore.showSignInModal();
    this.setState({
      linkToBeShared,
      linkToBeSharedUrlEncoded,
      showSignInModal,
    });
  }

  handleShareButtonClick = () => {
    const {
      currentFullUrlToShare,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    } = generateShareLinks();
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      const kindOfShare = getKindOfShareFromURL();
      ShareActions.sharedItemSave(currentFullUrlToShare, kindOfShare);
    }

    this.setState({
      openShareButtonDrawer: true,
      showShareButton: false,
    }, () => this.openShareOptions()); // openShareOptions advances directly to share
  }

  handleCloseShareButtonDrawer = () => {
    this.setState({
      openShareButtonDrawer: false,
      showShareButton: true,
    });
  }

  onClickGoBack = () => {
    this.setState({
      shareWithFriendsNow: false,
    });
  }

  openShareOptions = () => {
    // console.log('ShareButtonFooter openShareOptions');
    const whatAndHowMuchToShare = AppObservableStore.getWhatAndHowMuchToShare();
    if (whatAndHowMuchToShare === '') {
      const whatAndHowMuchToShareDefault = getWhatAndHowMuchToShareDefault();
      AppObservableStore.setWhatAndHowMuchToShare(whatAndHowMuchToShareDefault);
    }
    saveActionShareAnalytics();
    const showSignInModal = AppObservableStore.showSignInModal();
    this.setState({
      showSignInModal,
    });
    // Make sure we have WeVote friends data
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
    if (apiCalming('voterContactListSave', 60000)) {
      VoterActions.voterContactListAugmentWithWeVoteData(true);
    }
  }

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

  render () {
    renderLog('ShareButtonFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { location: { pathname } } = window;
    const { classes } = this.props;
    const {
      linkToBeShared,
      linkToBeSharedUrlEncoded,
      openShareButtonDrawer,
      shareWithFriendsNow, showingOneCompleteYourProfileModal, showShareButton,
      showShareModal, showSignInModal, showVoterPlanModal,
    } = this.state;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    let shareHtml = (
      <>Loading...</>
    );
    const whatAndHowMuchToShare = AppObservableStore.getWhatAndHowMuchToShare();
    // if ((!whatAndHowMuchToShare) || (whatAndHowMuchToShare === '')) {
    //   return shareHtml;
    // }
    if (!VoterStore.getVoterWeVoteId()) {
      // console.log('ShareButtonFooter, waiting for voterRetrieve to complete');
      return null;
    }

    const { showFooterBar } = getApplicationViewBooleans(pathname);

    // Hide if scrolled down the page
    // if (hideShareButtonFooter) {
    //   // console.log('hideShareButtonFooter is TRUE. ShareButtonFooter HIDDEN');
    //   return null;
    // }

    const messageToFriendType = 'remindContacts';
    const results = createMessageToFriendDefaults(messageToFriendType);
    const { messageToFriendDefault } = results;
    const titleText = messageToFriendDefault;

    const shareButtonClasses = isWebApp() ? classes.buttonDefault : classes.buttonDefaultCordova;

    const hideFooterBehindModal = showingOneCompleteYourProfileModal || showShareModal || showSignInModal || showVoterPlanModal;
    // console.log('ShareButtonFooter render showShareButton: ', showShareButton, ', linkToBeShared:', linkToBeShared, ', showFooterBar:', showFooterBar, ', hideFooterBehindModal:', hideFooterBehindModal);

    if (shareWithFriendsNow) {
      shareHtml = (
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
                style={isCordova() ? { display: 'none' } : {}}
              >
                <Close />
              </IconButton>
            </ModalTitleAreaFixedInnerWrapper>
            <ModalTitleAreaFixedInnerWrapper>
              <Suspense fallback={<></>}>
                <ShareWithFriendsModalTitleWithController
                  whatAndHowMuchToShare={whatAndHowMuchToShare}
                  urlToShare={linkToBeShared}
                />
              </Suspense>
            </ModalTitleAreaFixedInnerWrapper>
          </ModalTitleAreaFixed>
          <ContainerShareFooter
            shareOptionsMode={(
              (whatAndHowMuchToShare === 'friends')
            )}
          >
            <>
              <AskFriendsModalBodyArea>
                <Suspense fallback={<></>}>
                  <ShareWithFriendsModalBodyWithController />
                </Suspense>
              </AskFriendsModalBodyArea>
            </>
          </ContainerShareFooter>
        </Drawer>
      );
    } else if ((whatAndHowMuchToShare === 'ballotShareOptions') ||
        (whatAndHowMuchToShare === 'ballotShareOptionsAllOpinions') ||
        (whatAndHowMuchToShare === 'candidateShareOptions') ||
        (whatAndHowMuchToShare === 'candidateShareOptionsAllOpinions') ||
        (whatAndHowMuchToShare === 'measureShareOptions') ||
        (whatAndHowMuchToShare === 'measureShareOptionsAllOpinions') ||
        (whatAndHowMuchToShare === 'officeShareOptions') ||
        (whatAndHowMuchToShare === 'officeShareOptionsAllOpinions') ||
        (whatAndHowMuchToShare === 'organizationShareOptions') ||
        (whatAndHowMuchToShare === 'organizationShareOptionsAllOpinions') ||
        (whatAndHowMuchToShare === 'readyShareOptions') ||
        (whatAndHowMuchToShare === 'readyShareOptionsAllOpinions')
    ) {
      shareHtml = (
        <Drawer
          anchor="bottom"
          className="u-z-index-9010"
          direction="up"
          id="shareMenuFooter"
          onClose={this.handleCloseShareButtonDrawer}
          open={openShareButtonDrawer}
        >
          <ContainerShareFooter>
            <ShareModalTitleArea
              firstSlide={false}
              handleCloseShareButtonDrawer={this.handleCloseShareButtonDrawer}
            />
            <>
              <Flex>
                <CopyLink
                  titleText={titleText}
                  saveActionShareButtonCopy={this.saveActionShareButtonCopy}
                  linkToBeSharedCopy={linkToBeShared}
                />
                {isWebApp() && (
                  <ShareModalOption
                    backgroundColor="#2E3C5D"
                    icon={isAndroid() ? <Share /> : <IosShare />}
                    noLink
                    onClickFunction={() => this.openNativeShare(linkToBeShared, 'Open Share')}
                    title="Share options"
                    uniqueExternalId="shareButtonFooter-NativeShare"
                  />
                )}
                <ShareWeVoteFriends onClickFunction={() => this.saveActionShareButtonFriends()} />
                {(!(isMobile() && navigator.share) || isCordova()) && (
                  <>
                    {webAppConfig.ENABLE_FACEBOOK && (
                      <ShareFacebook titleText={titleText} saveActionShareButtonFacebook={this.saveActionShareButtonFacebook} linkToBeShared={linkToBeShared} />
                    )}
                    <ShareTwitter titleText={titleText} saveActionShareButtonTwitter={this.saveActionShareButtonTwitter} saveActionShareButtonCopy={this.saveActionShareButtonCopy} linkToBeSharedTwitter={linkToBeSharedUrlEncoded} linkToBeSharedCopy={linkToBeShared} />
                  </>
                )}
              </Flex>
            </>
            {(isWebApp() && voterIsSignedIn) && (
              <>
                {stringContains('AllOpinions', whatAndHowMuchToShare) ? (
                  <SharePreviewFriends classes={classes} linkToBeShared={linkToBeShared} />
                ) : (
                  <SharePreviewFriendsSpacer />
                )}
              </>
            )}
          </ContainerShareFooter>
        </Drawer>
      );
    } else {
      shareHtml = (
        <Drawer
          anchor="bottom"
          className="u-z-index-9010"
          direction="up"
          id="shareMenuFooter"
          onClose={this.handleCloseShareButtonDrawer}
          open={openShareButtonDrawer}
        >
          {/*
          <Container>
            {shareMenuItemsDescription && (
              <MenuDescription>
                <Info classes={{ root: classes.informationIcon }} />
                <Sus(Cordova build script can't handle the sus pense function in commented out code)pense fallback={<></>}>
                  <ReadMore
                    textToDisplay={shareMenuItemsDescription}
                    numberOfLines={2}
                  />
                </Sus(Cordova build script can't handle the sus pense function in commented out code)pense>
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
          </Container>
          */}
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
        {shareHtml}
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
const ContainerShareFooter = styled('div', {
  shouldForwardProp: (prop) => !['shareOptionsMode'].includes(prop),
})(({ shareOptionsMode }) => (`
  margin: 0 auto;
  max-width: 576px;
  padding: ${isWebApp() ? (shareOptionsMode ? '16px 16px 32px' : '24px 16px 32px') : '8px 16px 32px'};
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

const SharePreviewFriendsSpacer = styled('div')`
  margin-top: 40px;
`;

export default withStyles(shareStyles)(ShareButtonFooter);
