import { ArrowBackIos, Close, People } from '@mui/icons-material';
import { Button, Dialog, DialogContent, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { generateShareLinks } from './ShareModalText';
import ShareModalTitleArea from './ShareModalTitleArea';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import apiCalming from '../../common/utils/apiCalming';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp'; // isCordova
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import createMessageToFriendDefaults from '../../utils/createMessageToFriendDefaults';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import MessageCard from '../Widgets/MessageCard';
import {
  CopyLink,
  getKindOfShareFromURL,
  saveActionShareAnalytics,
  ShareFacebook,
  SharePreviewFriends,
  shareStyles,
  ShareTwitter,
  ShareWeVoteFriends,
} from './shareButtonCommon'; // cordovaSocialSharingByEmail

const ShareWithFriendsModalBodyWithController = React.lazy(() => import(/* webpackChunkName: 'ShareWithFriendsModalBodyWithController' */ '../Friends/ShareWithFriendsModalBodyWithController'));
const ShareWithFriendsModalTitleWithController = React.lazy(() => import(/* webpackChunkName: 'ShareWithFriendsModalTitleWithController' */ '../Friends/ShareWithFriendsModalTitleWithController'));


class ShareModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // chosenPreventSharingOpinions: false,
      currentFriendList: [],
      // friendsToShareWith: [],
      shareWithFriendsNow: false,
    };
  }

  // Steps: ballotShareOptions, friends

  componentDidMount () {
    // console.log('ShareModal componentDidMount');
    this.onVoterStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    if (apiCalming('friendListsAll', 3000)) {
      FriendActions.friendListsAll();
    }
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const {
      currentFullUrlToShare,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    } = generateShareLinks();
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      const kindOfShare = getKindOfShareFromURL();
      ShareActions.sharedItemSave(currentFullUrlToShare, kindOfShare);
    }
    saveActionShareAnalytics();
    // const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    this.setState({
      // chosenPreventSharingOpinions,
      currentFriendList,
    });
    AnalyticsActions.saveActionModalShare(VoterStore.electionId());

    // Make sure we have We Vote friends data
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
    if (apiCalming('voterContactListSave', 60000)) {
      VoterActions.voterContactListAugmentWithWeVoteData(true);
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('ShareModal caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.friendStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const {
      linkToBeShared,
      linkToBeSharedUrlEncoded,
    } = generateShareLinks();
    // console.log('onAppObservableStoreChange linkToBeShared:', linkToBeShared, ', linkToBeSharedUrlEncoded:', linkToBeSharedUrlEncoded);
    this.setState({
      linkToBeShared,
      linkToBeSharedUrlEncoded,
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
    // console.log('SharedModal onShareStoreChange urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    this.setState({
      linkToBeShared,
      linkToBeSharedUrlEncoded,
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
      ShareActions.sharedItemRetrieveByFullUrl(currentFullUrlToShare);
    }
    this.setState({
      linkToBeShared,
      linkToBeSharedUrlEncoded,
    });
  }

  onClickGoBack = () => {
    this.setState({
      shareWithFriendsNow: false,
    });
  }

  saveActionShareButtonCopy = () => {
    AnalyticsActions.saveActionShareButtonCopy(VoterStore.electionId());
  }

  // saveActionShareButtonEmail = () => {
  //   AnalyticsActions.saveActionShareButtonEmail(VoterStore.electionId());
  // }

  saveActionShareButtonFacebook = () => {
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

  saveActionShareButtonTwitter = () => {
    AnalyticsActions.saveActionShareButtonTwitter(VoterStore.electionId());
  }

  closeShareModal = () => {
    const { location: { pathname } } = window;
    this.props.closeShareModal(pathname);
  }

  render () {
    renderLog('ShareModal');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ShareModal render');
    const { location: { pathname } } = window;
    const { classes } = this.props;
    const {
      linkToBeShared,
      linkToBeSharedUrlEncoded,
      shareWithFriendsNow,
    } = this.state;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    let shareHtml = (
      <>Loading...</>
    );
    const whatAndHowMuchToShare = AppObservableStore.getWhatAndHowMuchToShare();
    // console.log('ShareModal render whatAndHowMuchToShare:', whatAndHowMuchToShare);
    if ((!whatAndHowMuchToShare) || (whatAndHowMuchToShare === '')) {
      return shareHtml;
    }
    if (!VoterStore.getVoterWeVoteId()) {
      // console.log('ShareModal, waiting for voterRetrieve to complete');
      return null;
    }

    const messageToFriendType = 'remindContacts';
    const results = createMessageToFriendDefaults(messageToFriendType);
    const { messageToFriendDefault } = results;
    const titleText = messageToFriendDefault;

    if (shareWithFriendsNow) {
      shareHtml = (
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
                whatAndHowMuchToShare={whatAndHowMuchToShare}
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
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.closeShareModal(pathname); }}
        >
          <ShareModalTitleArea
            firstSlide
            handleCloseShareButtonDrawer={this.closeShareModal}
          />

          <DialogContent classes={{ root: classes.dialogContent }}>
            <div className="full-width">
              <Flex>
                <CopyLink
                  titleText={titleText}
                  saveActionShareButtonCopy={this.saveActionShareButtonCopy}
                  linkToBeSharedCopy={linkToBeShared}
                />
                <ShareWeVoteFriends onClickFunction={() => this.saveActionShareButtonFriends()} />
                <ShareFacebook titleText={titleText} saveActionShareButtonFacebook={this.saveActionShareButtonFacebook} linkToBeShared={linkToBeSharedUrlEncoded} />
                <ShareTwitter titleText={titleText} saveActionShareButtonTwitter={this.saveActionShareButtonTwitter} linkToBeSharedTwitter={linkToBeSharedUrlEncoded} />
              </Flex>
              {(isWebApp() && voterIsSignedIn) && (
                <>
                  {stringContains('AllOpinions', whatAndHowMuchToShare) ? (
                    <SharePreviewFriends classes={classes} linkToBeShared={linkToBeShared} />
                  ) : (
                    <SharePreviewFriendsSpacer />
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    } else {
      shareHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.closeShareModal(pathname); }}
        >
          <ModalTitleAreaMini>
            <Button className={classes.backButton} color="primary">
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
        {shareHtml}
      </>
    );
  }
}
ShareModal.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  closeShareModal: PropTypes.func.isRequired,
};

const Flex = styled('div')`
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
`;

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

const SharePreviewFriendsSpacer = styled('div')`
  margin-top: 40px;
`;

export default withTheme(withStyles(shareStyles)(ShareModal));
