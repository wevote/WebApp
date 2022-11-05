import { ArrowBackIos, Close, FileCopyOutlined, People } from '@mui/icons-material';
import { Button, Dialog, DialogContent, FormControl, FormControlLabel, IconButton, Radio } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'; // EmailIcon, EmailShareButton,
import styled from 'styled-components';
import { returnFriendsModalTitle, returnShareModalTitle } from './ShareModalText';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import ShareActions from '../../common/actions/ShareActions';
import ShareStore from '../../common/stores/ShareStore';
import apiCalming from '../../common/utils/apiCalming';
import { cordovaLinkToBeSharedFixes, hasIPhoneNotch, isAndroid, isAndroidSizeMD } from '../../common/utils/cordovaUtils';
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
import { androidFacebookClickHandler, androidTwitterClickHandler } from './shareButtonCommon'; // cordovaSocialSharingByEmail
import ShareModalOption from './ShareModalOption';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
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
          <ModalTitleArea>
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
          </ModalTitleArea>
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
          <ModalTitleArea firstSlide>
            <div>
              <ShareModalTitle>
                {shareModalTitle}
              </ShareModalTitle>
              <FormControl classes={{ root: classes.formControl }}>
                <RadioGroup
                  onChange={this.handleShareAllOpinionsToggle}
                >
                  <RadioItem>
                    <FormControlLabel
                      classes={{ label: classes.radioLabel }}
                      // disabled={!voterIsSignedIn}
                      disabled
                      id="shareModalAllOpinionsRadioButton"
                      value="AllOpinions"
                      // label={voterIsSignedIn ? 'Share my voter guide' : 'Sign in to share my voter guide'}
                      label="Share my voter guide (coming in 2023)"
                      labelPlacement="end"
                      control={
                        (
                          <Radio
                            classes={{ colorPrimary: classes.radioPrimary }}
                            color="primary"
                            checked={voterIsSignedIn && stringContains('AllOpinions', shareModalStep)}
                          />
                        )
                      }
                      style={{ marginRight: `${isAndroidSizeMD() ? '10px' : ''}` }}
                    />
                  </RadioItem>
                  <RadioItem>
                    <FormControlLabel
                      id="shareModalBallotOnlyRadioButton"
                      classes={{ label: classes.radioLabel }}
                      value="BallotOnly"
                      label="Ballot only"
                      labelPlacement="end"
                      control={
                        (
                          <Radio
                            classes={{ colorPrimary: classes.radioPrimary }}
                            color="primary"
                            checked={!voterIsSignedIn || !stringContains('AllOpinions', shareModalStep)}
                          />
                        )
                      }
                    />
                  </RadioItem>
                </RadioGroup>
              </FormControl>
            </div>
            <IconButton
              aria-label="Close"
              className={classes.closeButtonAbsolute}
              onClick={this.closeShareModal}
              id="closeShareModal"
              size="large"
            >
              <Close />
            </IconButton>
          </ModalTitleArea>
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
                <Wrapper>
                  <div id="androidFacebook"
                       onClick={() => isAndroid() &&
                         androidFacebookClickHandler(`${linkToBeSharedUrlEncoded}&t=WeVote`)}
                  >
                    <FacebookShareButton
                      className="no-decoration"
                      id="shareModalFacebookButton"
                      onClick={this.saveActionShareButtonFacebook}
                      quote={titleText}
                      url={`${linkToBeSharedUrlEncoded}`}
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
                </Wrapper>
                <Wrapper>
                  <div id="androidTwitter"
                       onClick={() => isAndroid() &&
                         androidTwitterClickHandler(linkToBeSharedUrlEncoded)}
                  >
                    <TwitterShareButton
                      className="no-decoration"
                      id="shareModalTwitterButton"
                      onClick={this.saveActionShareButtonTwitter}
                      title={titleText}
                      url={`${linkToBeSharedUrlEncoded}`}
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
                </Wrapper>
                {/*
                <Wrapper>
                  {/* The EmailShareButton works in Cordova, but ONLY if an email client is configured, so it doesn't work in a simulator
                  <div id="cordovaEmail"
                       onClick={() => isCordova() &&
                         cordovaSocialSharingByEmail('Ready to vote?',
                           linkToBeShared, this.props.closeShareModal)}
                  >
                    <EmailShareButton
                      body={`${titleText}`}
                      className="no-decoration"
                      id="shareModalEmailButton"
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
                </Wrapper>
                */}
                <ShareModalOption
                  backgroundColor="#2E3C5D"
                  copyLink
                  icon={<FileCopyOutlined />}
                  id="copyShareLink"
                  urlToShare={linkToBeShared}
                  onClickFunction={this.saveActionShareButtonCopy}
                  title="Copy link"
                  uniqueExternalId="shareModalOption-copyShareLink"
                />
              </Flex>
              {(isWebApp() && stringContains('AllOpinions', shareModalStep) && voterIsSignedIn) && (  // This has many problems in Cordova
                <Suspense fallback={<></>}>
                  <OpenExternalWebSite
                    linkIdAttribute="allOpinions"
                    url={linkToBeShared}
                    target="_blank"
                    // title={this.props.title}
                    className="u-no-underline"
                    body={(
                      <Button className={classes.previewButton} variant="outlined" fullWidth color="primary">
                        Preview what your friends will see
                      </Button>
                    )}
                  />
                </Suspense>
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
          <ModalTitleArea>
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
          </ModalTitleArea>
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

const styles = () => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    '@media (min-width: 576px)': {
      maxWidth: '600px',
      width: '90%',
      height: 'fit-content',
      margin: '0 auto',
      minWidth: 0,
      minHeight: 0,
      transitionDuration: '.25s',
    },
    minWidth: '100%',
    maxWidth: '100%',
    width: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    height: '100%',
    margin: '0 auto',
  },
  dialogContent: {
    padding: '0px 24px 36px 24px',
    background: 'white',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '@media(max-width: 576px)': {
      justifyContent: 'flex-start !important',
    },
  },
  backButton: {
    // marginBottom: 6,
    // marginLeft: -8,
    paddingTop: 0,
    paddingBottom: 0,
  },
  backButtonIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  closeButtonAbsolute: {
    position: 'absolute',
    right: 5,
    top: 3,
  },
  previewButton: {
    marginTop: 0,
  },
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled('div', {
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

const RadioGroup = styled('div', {
  shouldForwardProp: (prop) => !['preventStackedButtons'].includes(prop),
})(({ preventStackedButtons, theme }) => (`
  display: flex;
  flex-flow: column;
  width: 100%;
  ${theme.breakpoints.down('md')} {
    margin-bottom: -10px;
  }
  ${theme.breakpoints.down('xs')} {
    ${preventStackedButtons ? '' : 'flex-flow: row wrap;'}
    margin-bottom: 0;
  }
`));

const RadioItem = styled('div', {
  shouldForwardProp: (prop) => !['preventStackedButtons'].includes(prop),
})(({ preventStackedButtons, theme }) => (`
  ${!preventStackedButtons && theme.breakpoints.down('xs') ? (`
      // width: 100% !important;
      // min-width: 100% !important;
      // margin-bottom: -6px;
  `) : ''}
`));

const ShareModalTitle = styled('h3', {
  shouldForwardProp: (prop) => !['onSignInSlide'].includes(prop),
})(({ left, onSignInSlide }) => (`
  font-size: 30px;
  color: black;
  margin: ${onSignInSlide ? '0 auto' : '0'};
  margin-top: 0;
  margin-bottom: 0;
  font-weight: bold;
  text-align: ${left && 'left'};
`));

// const SubTitle = styled('div', {
//   shouldForwardProp: (prop) => !['larger', 'left'].includes(prop),
// })(({ larger, left }) => (`
//   margin-top: 0;
//   font-size: ${larger ? '18px' : '14px'};
//   width: 100%;
//   text-align: ${left && 'left'};
//   @media(min-width: 420px) {
//     // width: 80%;
//   }
// `));

const Text = styled('h3')`
  font-weight: normal;
  font-size: 16px;
  color: black !important;
  padding: 6px;
`;

const Wrapper = styled('div')`
  cursor: pointer;
  display: block !important;
  margin-bottom: 12px;
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


export default withTheme(withStyles(styles)(ShareModal));
