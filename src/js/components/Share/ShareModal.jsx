import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import People from '@material-ui/icons/People';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Mail from '@material-ui/icons/Mail';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { Button, Tooltip } from '@material-ui/core';
import AppActions from '../../actions/AppActions';
import { cordovaDot, hasIPhoneNotch } from '../../utils/cordovaUtils';
import FriendActions from '../../actions/FriendActions';
import FriendsShareList from '../Friends/FriendsShareList';
import FriendStore from '../../stores/FriendStore';
import MessageCard from '../Widgets/MessageCard';
import { renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';
import ShareActions from '../../actions/ShareActions';
import ShareModalOption from './ShareModalOption';
import ShareStore from '../../stores/ShareStore';
import VoterStore from '../../stores/VoterStore';


class ShareModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
    voterIsSignedIn: PropTypes.bool,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    shareModalStep: PropTypes.string,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      pathname: '',
      currentFullUrlToShare: '',
      currentFriendsList: [],
      // friendsToShareWith: [],
      shareModalStep: '',
      signInModalOpenedOnce: false,
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

    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    FriendActions.currentFriends();
    this.shareStoreListener = ShareStore.addListener(this.onShareStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const currentFullUrl = window.location.href || '';
    const currentFullUrlToShare = currentFullUrl.replace('/modal/share', '').toLowerCase();
    const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare);
    const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
    // console.log('ShareModal componentDidMount urlWithSharedItemCode:', urlWithSharedItemCode, ', urlWithSharedItemCodeAllOpinions:', urlWithSharedItemCodeAllOpinions);
    if (!urlWithSharedItemCode || !urlWithSharedItemCodeAllOpinions) {
      ShareActions.sharedItemSave(currentFullUrlToShare);
    }
    this.setState({
      currentFriendsList: FriendStore.currentFriends(),
      currentFullUrlToShare,
      pathname: this.props.pathname,
      shareModalStep: shareModalStep || 'ballotShareOptions',
      urlWithSharedItemCode,
      urlWithSharedItemCodeAllOpinions,
      voterIsSignedIn,
    });
    this.openSignInModalIfWeShould(shareModalStep, voterIsSignedIn);
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.shareStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    const { currentFriendsList } = this.state;
    if (currentFriendsList.length !== FriendStore.currentFriends().length) {
      this.setState({ currentFriendsList: FriendStore.currentFriends() });
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
    this.openSignInModalIfWeShould(shareModalStep, voterIsSignedIn);
  }

  openSignInModalIfWeShould = (shareModalStep, voterIsSignedIn) => {
    if (stringContains('AllOpinions', shareModalStep)) {
      if (!voterIsSignedIn) {
        AppActions.setShowSignInModal(true);
      }
    }
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
        AppActions.setShowSignInModal(true);
      }
    }
  }

  closeShareModal () {
    this.props.toggleFunction(this.state.pathname);
  }

  render () {
    renderLog('ShareModal');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('ShareModal render');
    const { classes } = this.props;
    const { currentFullUrlToShare, shareModalStep, urlWithSharedItemCode, urlWithSharedItemCodeAllOpinions, voterIsSignedIn } = this.state;
    let shareModalHtml = (
      <>Loading...</>
    );
    // console.log('shareModalStep:', shareModalStep);
    if ((!shareModalStep) || (shareModalStep === '')) {
      return shareModalHtml;
    }
    const featureStillInDevelopment = true;

    let emailSubjectEncoded = '';
    let emailBodyEncoded = '';
    let linkToBeShared = '';
    let linkToBeSharedUrlEncoded = '';
    if ((shareModalStep === 'ballotShareOptions') ||
        (shareModalStep === 'ballotShareOptionsAllOpinions') ||
        (shareModalStep === 'candidateShareOptions') ||
        (shareModalStep === 'candidateShareOptionsAllOpinions') ||
        (shareModalStep === 'measureShareOptions') ||
        (shareModalStep === 'measureShareOptionsAllOpinions') ||
        (shareModalStep === 'officeShareOptions') ||
        (shareModalStep === 'officeShareOptionsAllOpinions')
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
      linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
      const twitterTextEncoded = encodeURI('Check out this cool ballot tool!');
      if (shareModalStep === 'ballotShareOptions') {
        emailSubjectEncoded = encodeURI('Ready to vote?');
        emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      } else if (shareModalStep === 'ballotShareOptionsAllOpinions') {
        emailSubjectEncoded = encodeURI('Ready to vote?');
        emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      } else if (shareModalStep === 'candidateShareOptions') {
        emailSubjectEncoded = encodeURI('Ready to vote?');
        emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      } else if (shareModalStep === 'candidateShareOptionsAllOpinions') {
        emailSubjectEncoded = encodeURI('Ready to vote?');
        emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      } else if (shareModalStep === 'measureShareOptions') {
        emailSubjectEncoded = encodeURI('Ready to vote?');
        emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      } else if (shareModalStep === 'measureShareOptionsAllOpinions') {
        emailSubjectEncoded = encodeURI('Ready to vote?');
        emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      } else if (shareModalStep === 'officeShareOptions') {
        emailSubjectEncoded = encodeURI('Ready to vote?');
        emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      } else if (shareModalStep === 'officeShareOptionsAllOpinions') {
        emailSubjectEncoded = encodeURI('Ready to vote?');
        emailBodyEncoded = encodeURI(`Check out this cool ballot tool! ${linkToBeShared}`);
      }
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.toggleFunction(this.state.pathname); }}
        >
          <ModalTitleArea firstSlide>
            <div>
              <Title>
                Share:
                {' '}
                <strong>
                  {(shareModalStep === 'ballotShareOptions') && 'Ballot'}
                  {(shareModalStep === 'ballotShareOptionsAllOpinions') && 'Ballot + Your Opinions'}
                  {(shareModalStep === 'candidateShareOptions') && 'Candidate for this Election'}
                  {(shareModalStep === 'candidateShareOptionsAllOpinions') && 'Candidate + Your Opinions'}
                  {(shareModalStep === 'measureShareOptions') && 'Measure for this Election'}
                  {(shareModalStep === 'measureShareOptionsAllOpinions') && 'Measure + Your Opinions'}
                  {(shareModalStep === 'officeShareOptions') && 'Office for this Election'}
                  {(shareModalStep === 'officeShareOptionsAllOpinions') && 'Office + Your Opinions'}
                </strong>
              </Title>
              <SubTitle>
                {(shareModalStep === 'ballotShareOptions') && (
                  <>Share a link to this election so that your friends can get ready to vote.</>
                )}
                {(shareModalStep === 'ballotShareOptionsAllOpinions') && (
                  <>Share a link to all of your opinions for this year. </>
                )}
                {(shareModalStep === 'candidateShareOptions') && (
                  <>Share a link to this candidate. </>
                )}
                {(shareModalStep === 'candidateShareOptionsAllOpinions') && (
                  <>Share a link to this candidate. </>
                )}
                {(shareModalStep === 'measureShareOptions') && (
                  <>Share a link to this measure/proposition. </>
                )}
                {(shareModalStep === 'measureShareOptionsAllOpinions') && (
                  <>Share a link to this measure/proposition. </>
                )}
                {(shareModalStep === 'officeShareOptions') && (
                  <>Share a link to this office. </>
                )}
                {(shareModalStep === 'officeShareOptionsAllOpinions') && (
                  <>Share a link to this office. </>
                )}
                {stringContains('AllOpinions', shareModalStep) ? (
                  <>
                    {' '}
                    All of your opinions for this year are included.
                    {' '}
                    <span className="u-link-color u-underline u-cursor--pointer" onClick={() => this.doNotIncludeOpinions(shareModalStep)}>
                      Don&apos;t include your opinions.
                    </span>
                  </>
                ) : (
                  <>
                    {' '}
                    Your opinions are NOT included.
                    {' '}
                    <span className="u-link-color u-underline u-cursor--pointer" onClick={() => this.includeOpinions(shareModalStep)}>
                      Include your opinions.
                    </span>
                  </>
                )
                }
              </SubTitle>
            </div>
            <IconButton
              aria-label="Close"
              className={classes.closeButtonAbsolute}
              onClick={this.closeShareModal}
              id="closeShareModal"
            >
              <CloseIcon />
            </IconButton>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <div className="full-width">
              <Flex>
                {featureStillInDevelopment ? null : (
                  <ShareModalOption
                    background="#2E3C5D"
                    icon={<img src={cordovaDot('../../../img/global/svg-icons/we-vote-icon-square-color.svg')} alt="" />}
                    id="shareWithFriends"
                    noLink
                    onClickFunction={() => {
                      if (!voterIsSignedIn) {
                        AppActions.setShowSignInModal(true);
                        this.setStep('friends');
                      } else {
                        this.setStep('friends');
                      }
                    }}
                    title="We Vote Friends"
                  />
                )}
                <ShareModalOption
                  background="#3b5998"
                  icon={<i className="fab fa-facebook-f" />}
                  id="shareViaFacebook"
                  link={`https://www.facebook.com/sharer/sharer.php?u=${linkToBeSharedUrlEncoded}&t=WeVote`}
                  target="_blank"
                  title="Facebook"
                />
                <ShareModalOption
                  background="#38A1F3"
                  icon={<i className="fab fa-twitter" />}
                  id="shareViaTwitter"
                  link={`https://twitter.com/share?text=${twitterTextEncoded}&url=${linkToBeSharedUrlEncoded}`}
                  title="Twitter"
                />
                <ShareModalOption
                  background="#2E3C5D"
                  icon={<Mail />}
                  id="shareViaEmail"
                  link={`mailto:?subject=${emailSubjectEncoded}&body=${emailBodyEncoded}`}
                  title="Email"
                />
                <ShareModalOption
                  background="#2E3C5D"
                  copyLink
                  icon={<FileCopyOutlinedIcon />}
                  id="copyShareLink"
                  link={linkToBeShared}
                  title="Copy Link"
                />
              </Flex>
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if (shareModalStep === 'friends' && !voterIsSignedIn) {
      // historyPush('/ballot/modal/share');
      // AppActions.setShowSignInModal(true);


      // cookies.setItem('sign_in_start_full_url', signInStartFullUrl, 86400, '/', 'wevote.us');
      // shareModalHtml = (
      //   <Dialog
      //     classes={{ paper: classes.dialogPaper }}
      //     open={this.props.show}
      //     onClose={() => { this.props.toggleFunction(this.state.pathname); }}
      //   >
      //     <ModalTitleArea onSignInSlide>
      //       <Title onSignInSlide bold>Sign In</Title>
      //       <IconButton
      //         aria-label="Close"
      //         className={classes.closeButtonAbsolute}
      //         onClick={this.closeShareModal}
      //         id="profileCloseShareModal"
      //       >
      //         <CloseIcon />
      //       </IconButton>
      //     </ModalTitleArea>
      //     <DialogContent classes={{ root: classes.dialogContent }}>
      //       <SettingsAccount inShareModal inModal pleaseSignInTitle="Sign in to share with your friends" />
      //     </DialogContent>
      //   </Dialog>
      // );
    } else if (shareModalStep === 'friends' && voterIsSignedIn && this.state.currentFriendsList.length > 0) {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.toggleFunction(this.state.pathname); }}
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
              <CloseIcon />
            </IconButton>
          </ModalTitleArea>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <div className="full-width">
              <FriendsShareTextWrapper>
                <Title left>
                  <strong>Share Ballot With Friends</strong>
                  {' '}
                  <Tooltip title="Share a link to this election so that your friends can get ready to vote. Your opinions are NOT included." arrow enterDelay={300}>
                    <i className="fas fa-info-circle" />
                  </Tooltip>
                </Title>
                <SubTitle larger left>
                  Invite friends by email or phone
                </SubTitle>
              </FriendsShareTextWrapper>
              <FriendsShareList list={this.state.currentFriendsList} />
            </div>
          </DialogContent>
        </Dialog>
      );
    } else {
      shareModalHtml = (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.props.show}
          onClose={() => { this.props.toggleFunction(this.state.pathname); }}
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
              <CloseIcon />
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
    padding: '24px 24px 36px 24px',
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
});

/* eslint no-nested-ternary: ["off"] */
const ModalTitleArea = styled.div`
  justify-content: flex-start;
  width: 100%;
  padding: ${props => (props.firstSlide ? '24px 24px 12px 24px' : props.onSignInSlide ? '20px 14px 10px' : '10px 14px')};
  z-index: 999;
  @media (min-width: 769px) {
    border-bottom: 2px solid #f7f7f7;
  }
  display: ${props => (props.onSignInSlide ? 'block' : 'flex')};
  text-align: ${props => (props.onSignInSlide ? 'center' : 'left')};
`;

const FriendsShareTextWrapper = styled.div`
  position: relative;
  top: -16px;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: ${props => (props.bold ? '30px' : '24px')};
  color: black;
  margin: ${props => (props.onSignInSlide ? '0 auto' : '0')};
  margin-top: 0;
  margin-bottom: ${props => (props.bold ? '0' : '12px')};
  font-weight: ${props => (props.bold ? 'bold' : 'initial')};
  text-align: ${props => (props.left && 'left')};
`;

const SubTitle = styled.div`
  margin-top: 0;
  font-size: ${props => (props.larger ? '18px' : '14px')};
  width: 100%;
  text-align: ${props => (props.left && 'left')};
  @media(min-width: 420px) {
    // width: 80%;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
`;

export default withTheme(withStyles(styles)(ShareModal));
