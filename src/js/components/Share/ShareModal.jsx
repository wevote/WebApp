import { Button, Dialog, DialogContent, IconButton, Tooltip } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { ArrowBackIos, Close, FileCopyOutlined, People } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import ShareActions from '../../common/actions/ShareActions';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import ShareStore from '../../common/stores/ShareStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaDot, cordovaLinkToBeSharedFixes, hasIPhoneNotch, isAndroid, isCordova, isWebApp } from '../../utils/cordovaUtils';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import { renderLog } from '../../common/utils/logging';
import { stringContains } from '../../utils/textFormat';
import FriendsShareList from '../Friends/FriendsShareList';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';
import MessageCard from '../Widgets/MessageCard';
import { androidFacebookClickHandler, androidTwitterClickHandler, cordovaSocialSharingByEmail } from './shareButtonCommon';
import ShareModalOption from './ShareModalOption';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));


class ShareModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chosenPreventSharingOpinions: false,
      currentFullUrlToShare: '',
      currentFriendList: [],
      // friendsToShareWith: [],
      shareModalStep: '',
      urlWithSharedItemCode: '',
      urlWithSharedItemCodeAllOpinions: '',
      voterIsSignedIn: false,
    };

    this.closeShareModal = this.closeShareModal.bind(this);
    this.setStep = this.setStep.bind(this);
  }

  // Steps: ballotShareOptions, friends

  componentDidMount () {
    const { shareModalStep, voterIsSignedIn } = this.props;
    // console.log('shareModalStep componentDidMount this.props:', shareModalStep);

    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    FriendActions.currentFriends();
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    const currentFullUrl = cordovaLinkToBeSharedFixes(window.location.href || '');
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('ShareModal componentDidMount urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      ShareActions.sharedItemSave(currentFullUrlToShare);
    }
    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    this.setState({
      chosenPreventSharingOpinions,
      currentFriendList,
      currentFullUrlToShare,
      shareModalStep: shareModalStep || 'ballotShareOptions',
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
      voterIsSignedIn,
    });
    this.openSignInModalIfWeShould(shareModalStep, voterIsSignedIn);
    AnalyticsActions.saveActionModalShare(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.friendStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onAppObservableStoreChange () {
    const chosenPreventSharingOpinions = AppObservableStore.getChosenPreventSharingOpinions();
    this.setState({
      chosenPreventSharingOpinions,
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
    const currentFullUrl = window.location.href || '';
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('SharedModal onShareStoreChange urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    this.setState({
      currentFullUrlToShare,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    const currentFullUrl = window.location.href || '';
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      ShareActions.sharedItemRetrieveByFullUrl(currentFullUrlToShare);
    }
    this.setState({
      currentFullUrlToShare,
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
      voterIsSignedIn,
    });
  }

  setStep (shareModalStep, voterIsSignedInIncoming = null) {
    let { voterIsSignedIn } = this.state;
    if (voterIsSignedInIncoming !== null) {
      voterIsSignedIn = voterIsSignedInIncoming;
    }
    this.setState({ shareModalStep });
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
    const { voterIsSignedIn } = this.state;
    if (!voterIsSignedIn) {
      AppObservableStore.setShowSignInModal(true);
      this.setStep('friends');
    } else {
      this.setStep('friends');
    }
    AnalyticsActions.saveActionShareButtonFriends(VoterStore.electionId());
  }

  saveActionShareButtonTwitter = () => {
    AnalyticsActions.saveActionShareButtonTwitter(VoterStore.electionId());
  }

  doNotIncludeOpinions (shareModalStep) {
    if (stringContains('AllOpinions', shareModalStep)) {
      const newShareModalStep = shareModalStep.replace('AllOpinions', '');
      this.setStep(newShareModalStep);
    }
  }

  includeOpinions (shareModalStep) {
    const { voterIsSignedIn } = this.state;
    if (!stringContains('AllOpinions', shareModalStep)) {
      if (voterIsSignedIn) {
        const newShareModalStep = `${shareModalStep}AllOpinions`;
        this.setStep(newShareModalStep);
      } else {
        AppObservableStore.setShowSignInModal(true);
      }
    }
  }

  closeShareModal () {
    const { location: { pathname } } = window;
    this.props.closeShareModal(pathname);
  }

  render () {
    renderLog('ShareModal');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ShareModal render');
    const { location: { pathname } } = window;
    const { classes } = this.props;
    const {
      chosenPreventSharingOpinions, currentFullUrlToShare, shareModalStep,
      urlWithSharedItemCode, urlWithSharedItemCodeAllOpinions,
      voterIsSignedIn,
    } = this.state;
    let shareModalHtml = (
      <>Loading...</>
    );
    // console.log('shareModalStep:', shareModalStep);
    if ((!shareModalStep) || (shareModalStep === '')) {
      return shareModalHtml;
    }
    const developmentFeatureTurnedOn = false;
    const titleText = 'This is a website I am using to get ready to vote.';

    // let emailSubjectEncoded = '';
    // let emailBodyEncoded = '';
    let linkToBeShared = '';
    let linkToBeSharedUrlEncoded = '';
    if ((shareModalStep === 'ballotShareOptions') ||
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

      // const twitterTextEncoded = encodeURI('Check out this cool ballot tool!');
      // if (shareModalStep === 'ballotShareOptions') {
      //   emailSubjectEncoded = encodeURI('Ready to vote?');
      //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      // } else if (shareModalStep === 'ballotShareOptionsAllOpinions') {
      //   emailSubjectEncoded = encodeURI('Ready to vote?');
      //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      // } else if (shareModalStep === 'candidateShareOptions') {
      //   emailSubjectEncoded = encodeURI('Ready to vote?');
      //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      // } else if (shareModalStep === 'candidateShareOptionsAllOpinions') {
      //   emailSubjectEncoded = encodeURI('Ready to vote?');
      //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      // } else if (shareModalStep === 'measureShareOptions') {
      //   emailSubjectEncoded = encodeURI('Ready to vote?');
      //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      // } else if (shareModalStep === 'measureShareOptionsAllOpinions') {
      //   emailSubjectEncoded = encodeURI('Ready to vote?');
      //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      // } else if (shareModalStep === 'officeShareOptions') {
      //   emailSubjectEncoded = encodeURI('Ready to vote?');
      //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      // } else if (shareModalStep === 'officeShareOptionsAllOpinions') {
      //   emailSubjectEncoded = encodeURI('Ready to vote?');
      //   emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      // }
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.closeShareModal(pathname); }}
        >
          <ModalTitleArea firstSlide>
            <div>
              <Title>
                Share:
                {' '}
                <strong>
                  {(shareModalStep === 'ballotShareOptions') && 'Ballot'}
                  {(shareModalStep === 'ballotShareOptionsAllOpinions') && 'Ballot + Your Opinions'}
                  {(shareModalStep === 'candidateShareOptions') && 'Candidate'}
                  {(shareModalStep === 'candidateShareOptionsAllOpinions') && 'Candidate + Your Opinions'}
                  {(shareModalStep === 'measureShareOptions') && 'Measure'}
                  {(shareModalStep === 'measureShareOptionsAllOpinions') && 'Measure + Your Opinions'}
                  {(shareModalStep === 'officeShareOptions') && 'Office'}
                  {(shareModalStep === 'officeShareOptionsAllOpinions') && 'Office + Your Opinions'}
                  {(shareModalStep === 'organizationShareOptions') && 'This Page'}
                  {(shareModalStep === 'organizationShareOptionsAllOpinions') && 'This Page + Your Opinions'}
                  {(shareModalStep === 'readyShareOptions') && 'Ready Page'}
                  {(shareModalStep === 'readyShareOptionsAllOpinions') && 'Ready Page + Your Opinions'}
                </strong>
              </Title>
              <SubTitle>
                {(shareModalStep === 'ballotShareOptions') && (
                  <>Send friends to their ballot so they can get ready to vote.</>
                )}
                {(shareModalStep === 'ballotShareOptionsAllOpinions') && (
                  <>Send friends to their ballot.</>
                )}
                {(shareModalStep === 'candidateShareOptions') && (
                  <>Send friends to this candidate.</>
                )}
                {(shareModalStep === 'candidateShareOptionsAllOpinions') && (
                  <>Send friends to this candidate.</>
                )}
                {(shareModalStep === 'measureShareOptions') && (
                  <>Send friends to this measure/proposition.</>
                )}
                {(shareModalStep === 'measureShareOptionsAllOpinions') && (
                  <>Send friends to this measure/proposition.</>
                )}
                {(shareModalStep === 'officeShareOptions') && (
                  <>Send friends to this office.</>
                )}
                {(shareModalStep === 'officeShareOptionsAllOpinions') && (
                  <>Send friends to this office.</>
                )}
                {(shareModalStep === 'organizationShareOptions') && (
                  <>Send friends to this page.</>
                )}
                {(shareModalStep === 'organizationShareOptionsAllOpinions') && (
                  <>Send friends to this page.</>
                )}
                {(shareModalStep === 'readyShareOptions') && (
                  <>Send friends to their own Ready page.</>
                )}
                {(shareModalStep === 'readyShareOptionsAllOpinions') && (
                  <>Send friends to their own Ready page.</>
                )}
                {stringContains('AllOpinions', shareModalStep) ? (
                  <>
                    {' '}
                    {isWebApp() ? 'A three-step intro to We Vote will be shown in a popup.' : ''}
                    {' '}
                    This link will give permission to see your opinions.
                    {' '}
                    <span className="u-link-color u-underline u-cursor--pointer" onClick={() => this.doNotIncludeOpinions(shareModalStep)}>
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
                      <span className="u-link-color u-underline u-cursor--pointer" onClick={() => this.includeOpinions(shareModalStep)}>
                        Include your opinions.
                      </span>
                    )}
                  </>
                )}
              </SubTitle>
            </div>
            <IconButton
              aria-label="Close"
              className={classes.closeButtonAbsolute}
              onClick={this.closeShareModal}
              id="closeShareModal"
            >
              <Close />
            </IconButton>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <div className="full-width">
              <Flex>
                {developmentFeatureTurnedOn && (
                  <ShareModalOption
                    background="#2E3C5D"
                    icon={<img src={cordovaDot('../../../img/global/svg-icons/we-vote-icon-square-color.svg')} alt="" />}
                    id="shareWithFriends"
                    noLink
                    onClickFunction={this.saveActionShareButtonFriends}
                    title="We Vote Friends"
                    uniqueExternalId="shareModalOption-shareWithFriends"
                  />
                )}
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
                <Wrapper>
                  {/* The EmailShareButton works in Cordova, but ONLY if an email client is configured, so it doesn't work in a simulator */}
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
                <ShareModalOption
                  background="#2E3C5D"
                  copyLink
                  icon={<FileCopyOutlined />}
                  id="copyShareLink"
                  link={linkToBeShared}
                  onClickFunction={this.saveActionShareButtonCopy}
                  title="Copy Link"
                  uniqueExternalId="shareModalOption-copyShareLink"
                />
              </Flex>
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
                  />
                </Suspense>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if (shareModalStep === 'friends' && !voterIsSignedIn) {
      // historyPush('/ballot/modal/share');
      // AppObservableStore.setShowSignInModal(true);


      // cookies.setItem('sign_in_start_full_url', signInStartFullUrl, 86400, '/', 'wevote.us');
      // shareModalHtml = (
      //   <Dialog
      //     classes={{ paper: classes.dialogPaper }}
      //     open={this.props.show}
      //     onClose={() => { this.props.closeShareModal(pathname); }}
      //   >
      //     <ModalTitleArea onSignInSlide>
      //       <Title onSignInSlide bold>Sign In</Title>
      //       <IconButton
      //         aria-label="Close"
      //         className={classes.closeButtonAbsolute}
      //         onClick={this.closeShareModal}
      //         id="profileCloseShareModal"
      //       >
      //         <Close />
      //       </IconButton>
      //     </ModalTitleArea>
      //     <DialogContent classes={{ root: classes.dialogContent }}>
      //       <SettingsAccount inShareModal inModal pleaseSignInTitle="Sign in to share with your friends" />
      //     </DialogContent>
      //   </Dialog>
      // );
    } else if (shareModalStep === 'friends' && voterIsSignedIn && this.state.currentFriendList.length > 0) {
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
            >
              <Close />
            </IconButton>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <div className="full-width">
              <FriendsShareTextWrapper>
                <Title left>
                  <strong>Share Ballot With Friends</strong>
                  {' '}
                  <Tooltip title="Send friends to their ballot so they can get ready to vote. Your opinions are NOT included." arrow enterDelay={300}>
                    <InfoCircleIcon />
                  </Tooltip>
                </Title>
                <SubTitle larger left>
                  Invite friends by email or phone
                </SubTitle>
              </FriendsShareTextWrapper>
              <FriendsShareList list={this.state.currentFriendList} />
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
            >
              <Close />
            </IconButton>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <MessageCard
              mainText="You haven't added any friends yet."
              buttonText="Add Friends"
              buttonURL="/friends/invite"
              noCard
              fullWidthButton
              secondaryText="By adding friends who you enjoy discussing politics with to We Vote, you can help eachother get ready for elections."
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
  voterIsSignedIn: PropTypes.bool,
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
    right: 14,
    top: 14,
  },
  previewButton: {
    marginTop: 0,
  },
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled.div`
  justify-content: flex-start;
  width: 100%;
  padding: ${(props) => (props.firstSlide ? '24px 24px 12px 24px' : props.onSignInSlide ? '20px 14px 10px' : '10px 14px')};
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: ${(props) => (props.onSignInSlide ? 'block' : 'flex')};
  text-align: ${(props) => (props.onSignInSlide ? 'center' : 'left')};
`;

const FriendsShareTextWrapper = styled.div`
  position: relative;
  top: -16px;
  margin-bottom: 12px;
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
`;

const SubTitle = styled.div`
  margin-top: 0;
  font-size: ${(props) => (props.larger ? '18px' : '14px')};
  width: 100%;
  text-align: ${(props) => (props.left && 'left')};
  @media(min-width: 420px) {
    // width: 80%;
  }
`;

const Text = styled.h3`
  font-weight: normal;
  font-size: 16px;
  color: black !important;
  padding: 6px;
`;

const Title = styled.h3`
  font-size: ${(props) => (props.bold ? '30px' : '24px')};
  color: black;
  margin: ${(props) => (props.onSignInSlide ? '0 auto' : '0')};
  margin-top: 0;
  margin-bottom: ${(props) => (props.bold ? '0' : '12px')};
  font-weight: ${(props) => (props.bold ? 'bold' : 'initial')};
  text-align: ${(props) => (props.left && 'left')};
`;

const Wrapper = styled.div`
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
