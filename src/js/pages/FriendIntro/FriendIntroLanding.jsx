import { Close } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import SvgImage from '../../common/components/Widgets/SvgImage';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import {
  DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet,
  MobileStaticNextButtonsInnerWrapper, MobileStaticNextButtonsOuterWrapperUShowMobile,
} from '../../components/Style/NextButtonStyles';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';


const FAQModal = React.lazy(() => import(/* webpackChunkName: 'FAQModal' */ '../../components/FriendIntro/FAQModal'));

const logoGrey = '../../../img/global/svg-icons/we-vote-icon-square-color-grey.svg';
const voteFlag = '../../../img/get-started/your-vote-counts-cropped-200x200.gif';

class FriendIntroLanding extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationInformationCalled: false,
      friendInvitationInformationCalledCount: 0,
      showFAQModal: false,
      showWhatIsWeVote: false,
      skipForNowOff: false,
      voterContactEmailListCount: 0,
      voterSignedIn: false,
      voterSignedInApple: false,
      voterSignedInFacebook: false,
      voterSignedInTwitter: false,
    };
  }

  componentDidMount () {
    // this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    VoterActions.voterContactListRetrieve();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params: { invitationSecretKey }  } } = this.props;
    let friendInvitationInformationCalledCount = 0;
    const voterDeviceId = VoterStore.voterDeviceId();
    // console.log('FriendIntroLanding, componentDidMount, invitation_secret_key: ', invitationSecretKey);
    if (voterDeviceId && invitationSecretKey) {
      FriendActions.friendInvitationInformation(invitationSecretKey);
      friendInvitationInformationCalledCount += 1;
      this.setState({
        friendInvitationInformationCalled: true,
        friendInvitationInformationCalledCount,
      });
    }
    this.onVoterStoreChange();
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = '';
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.friendInvitationTimer) clearTimeout(this.friendInvitationTimer);
  }

  onFriendStoreChange () {
    const { match: { params: { invitationSecretKey }  } } = this.props;
    const { friendInvitationInformationCalled } = this.state;
    let { friendInvitationInformationCalledCount } = this.state;
    // console.log('onFriendStoreChange friendInvitationInformationCalledCount:', friendInvitationInformationCalledCount);
    const voterDeviceId = VoterStore.voterDeviceId();
    if (voterDeviceId && invitationSecretKey && !friendInvitationInformationCalled && (friendInvitationInformationCalledCount < 10)) {
      FriendActions.friendInvitationInformation(invitationSecretKey);
      friendInvitationInformationCalledCount += 1;
      this.setState({
        friendInvitationInformationCalled: true,
        friendInvitationInformationCalledCount,
      });
    } else {
      const friendInvitationInformation = FriendStore.getFriendInvitationInformation();
      // console.log('onFriendStoreChange friendInvitationInformation:', friendInvitationInformation);
      if (friendInvitationInformation) {
        const {
          friendFirstName,
          friendLastName,
          friendImageUrlHttpsLarge,
          invitationSecretKeyBelongsToThisVoter,
        } = friendInvitationInformation;
        if (!invitationSecretKeyBelongsToThisVoter) {
          // We have a response, but voterMergeTwoAccounts hasn't finished
          // console.log('onFriendStoreChange !invitationSecretKeyBelongsToThisVoter');
          if (voterDeviceId && invitationSecretKey) {
            if (friendInvitationInformationCalled) {
              this.setState({
                friendInvitationInformationCalled: false,
              }, () => {
                // console.log('onFriendStoreChange !invitationSecretKeyBelongsToThisVoter !friendInvitationInformationCalled RESET');
                if (friendInvitationInformationCalledCount < 10) {
                  this.friendInvitationTimer = setTimeout(() => {
                    FriendActions.friendInvitationInformation(invitationSecretKey);
                    friendInvitationInformationCalledCount += 1;
                    // console.log('onFriendStoreChange !invitationSecretKeyBelongsToThisVoter friendInvitationInformation called');
                    this.setState({
                      friendInvitationInformationCalled: true,
                      friendInvitationInformationCalledCount,
                    });
                  }, 3000);
                }
              });
            } else {
              // console.log('onFriendStoreChange !invitationSecretKeyBelongsToThisVoter !friendInvitationInformationCalled');
            }
          }
        } else {
          this.setState({
            friendFirstName,
            friendLastName,
            friendImageUrlHttpsLarge,
          });
        }
      }
    }
  }

  onVoterStoreChange () {
    // console.log('onVoterStoreChange');
    this.onFriendStoreChange();
    const voter = VoterStore.getVoter();
    const {
      is_signed_in: voterSignedIn,
      signed_in_apple: voterSignedInApple,
      signed_in_facebook: voterSignedInFacebook,
      signed_in_twitter: voterSignedInTwitter,
    } = voter;
    this.setState({
      voterContactEmailListCount: VoterStore.getVoterContactEmailListCount(),
      voterFirstName: VoterStore.getFirstName(),
      voterPhotoUrlLarge: VoterStore.getVoterPhotoUrlLarge(),
      voterSignedIn,
      voterSignedInApple,
      voterSignedInFacebook,
      voterSignedInTwitter,
    }, () => this.setNextStepVariables());
  }

  closeFAQModal = () => {
    this.setState({
      showFAQModal: false,
      showWhatIsWeVote: true,
    });
  }

  goToNextStep = () => {
    const { location: { pathname: currentPathname } } = window;
    AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
    const { setUpAccountEntryPath } = this.state;
    AppObservableStore.setSetUpAccountEntryPath(setUpAccountEntryPath);
    historyPush(setUpAccountEntryPath);
  }

  goToSkipForNow = () => {
    historyPush('/ballot');
  }

  setNextStepVariables = () => {
    const {
      voterContactEmailListCount, voterFirstName, voterPhotoUrlLarge,
      voterSignedIn, voterSignedInApple, voterSignedInFacebook, voterSignedInTwitter,
    } = this.state;
    // console.log('FriendIntroLanding setNextStepVariables, voterContactEmailListCount: ', voterContactEmailListCount);
    let socialSignInOffered = false; // Temporarily false until Twitter/Facebook sign in offered
    const voterSignedInWithSocialSite = voterSignedInApple || voterSignedInFacebook || voterSignedInTwitter;
    if (voterFirstName && voterPhotoUrlLarge) {
      socialSignInOffered = false;
    } else if (voterSignedInWithSocialSite) {
      socialSignInOffered = false;
    }

    const nextStepButtonText = 'Next';
    let setUpAccountEntryPath;
    const skipForNowOff = false;
    if (!voterSignedIn) {
      // If not signed in, then the voter is returning to this link
      //  re-route to the findfriends process, which doesn't assume sign in
      setUpAccountEntryPath = '/findfriends/importcontacts';
    } else if (!voterFirstName) {
      setUpAccountEntryPath = '/setupaccount/editname';
    } else if (!voterPhotoUrlLarge) {
      setUpAccountEntryPath = '/setupaccount/addphoto';
    } else if (voterContactEmailListCount > 0) {
      setUpAccountEntryPath = '/setupaccount/invitecontacts';
    } else {
      setUpAccountEntryPath = '/setupaccount/importcontacts';
    }
    this.setState({
      nextStepButtonText,
      setUpAccountEntryPath,
      skipForNowOff,
      socialSignInOffered,
    });
  }

  toggleFAQModal = () => {
    const { showFAQModal } = this.state;
    this.setState({
      showFAQModal: !showFAQModal,
    });
  }

  toggleWhatIsWeVote = () => {
    const { showWhatIsWeVote } = this.state;
    this.setState({
      showWhatIsWeVote: !showWhatIsWeVote,
    });
  }

  render () {
    renderLog('FriendIntroLanding');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      friendFirstName, friendLastName, friendImageUrlHttpsLarge, nextStepButtonText,
      showFAQModal, showWhatIsWeVote, skipForNowOff, socialSignInOffered, voterFirstName,
    } = this.state;

    return (
      <div>
        <Helmet title="We Vote - Invitation Accepted!" />
        <PageContentContainerFriendIntro>
          {showWhatIsWeVote ? (
            <WhatIsWeVoteWrapper>
              <CloseButtonDiv>
                <IconButton
                  aria-label="Close"
                  onClick={this.toggleWhatIsWeVote}
                  size="large"
                >
                  <Close />
                </IconButton>
              </CloseButtonDiv>
              <BodyWrapperWhatIs>
                <FlagImageWrapper>
                  <FlagImage src={normalizedImagePath(voteFlag)} alt="Your vote counts" />
                </FlagImageWrapper>
                <WeVoteTextTitle>What is We Vote?</WeVoteTextTitle>
                <WeVoteTextBody>
                  We Vote shows you information about the next election, side-by-side with your
                  friend’s opinions. Use We Vote to track your ballot, see endorsements from your
                  network for candidates and measures, and collaborate with folks who share your values.
                </WeVoteTextBody>
                <WeVoteLogoWrapper>
                  <div style={{ cursor: 'pointer', width: 'fit-content' }} onClick={this.toggleFAQModal}>
                    <SvgImage
                      imageName={logoGrey}
                      stylesTextIncoming="fill: #999 !important; width:48px; height: 48px;"
                    />
                  </div>
                </WeVoteLogoWrapper>
                <LinkToFAQ>
                  <div style={{ cursor: 'pointer', width: 'fit-content' }} onClick={this.toggleFAQModal}>
                    Read Our FAQ
                  </div>
                </LinkToFAQ>
                {showFAQModal && (
                  <Suspense fallback={<></>}>
                    <FAQModal
                      show={showFAQModal}
                      toggleFunction={this.closeFAQModal}
                    />
                  </Suspense>
                )}
              </BodyWrapperWhatIs>
            </WhatIsWeVoteWrapper>
          ) : (
            <>
              <FriendIntroRootWrapper>
                <WeVoteLogoSpacer />
                <BodyWrapper>
                  <FriendIntroTitle>
                    Welcome to We Vote
                    {voterFirstName && (
                      <>
                        ,
                        {' '}
                        {voterFirstName}
                      </>
                    )}
                    .
                    {' '}
                    {friendFirstName ? (
                      <>
                        <div>
                          {friendFirstName ? (
                            <>
                              You are
                              {' '}
                              {friendFirstName}
                              &apos;s friend!
                            </>
                          ) : (
                            <>
                              Invitation accepted!
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        Invitation accepted!
                      </>
                    )}
                  </FriendIntroTitle>
                  <FriendPhotoOuterWrapper>
                    {friendImageUrlHttpsLarge && (
                      <>
                        <FriendPhotoInnerWrapper>
                          <VoterPhotoImage src={friendImageUrlHttpsLarge} alt="Profile Photo" />
                        </FriendPhotoInnerWrapper>
                        {(friendFirstName && friendLastName) && (
                          <FriendPhotoName>
                            {friendFirstName && (
                              <>
                                {friendFirstName}
                                {friendLastName && (
                                  <>
                                    {' '}
                                    {friendLastName}
                                  </>
                                )}
                              </>
                            )}
                          </FriendPhotoName>
                        )}
                      </>
                    )}
                  </FriendPhotoOuterWrapper>
                  <ActionButtonsWrapper>
                    {socialSignInOffered ? (
                      <EnterInfoManuallyWrapper>
                        <Button
                          classes={{ root: classes.enterInfoLink }}
                          color="primary"
                          onClick={this.goToNextStep}
                        >
                          Enter info manually
                        </Button>
                      </EnterInfoManuallyWrapper>
                    ) : (
                      <>
                        <DesktopNextButtonsOuterWrapperUShowDesktopTablet breakValue={isCordovaWide() ? 1000 : 'sm'}>
                          <DesktopNextButtonsInnerWrapper>
                            <NextStepButtons
                              classes={classes}
                              desktopMode
                              goToSkipForNow={this.goToSkipForNow}
                              nextStepButtonText={nextStepButtonText}
                              onClickNextButton={this.goToNextStep}
                              skipForNowOff={skipForNowOff}
                            />
                          </DesktopNextButtonsInnerWrapper>
                        </DesktopNextButtonsOuterWrapperUShowDesktopTablet>
                      </>
                    )}
                  </ActionButtonsWrapper>
                  <WhatIsWeVoteLinkWrapper>
                    <Button
                      classes={{ root: classes.mobileSimpleLink }}
                      color="primary"
                      onClick={this.toggleWhatIsWeVote}
                    >
                      What is We Vote?
                    </Button>
                  </WhatIsWeVoteLinkWrapper>
                </BodyWrapper>
              </FriendIntroRootWrapper>
              <MobileStaticNextButtonsOuterWrapperUShowMobile breakValue={isCordovaWide() ? 1000 : 'sm'}>
                <MobileStaticNextButtonsInnerWrapper>
                  <NextStepButtons
                    classes={classes}
                    goToSkipForNow={this.goToSkipForNow}
                    nextStepButtonText={nextStepButtonText}
                    onClickNextButton={this.goToNextStep}
                    skipForNowOff={skipForNowOff}
                  />
                </MobileStaticNextButtonsInnerWrapper>
              </MobileStaticNextButtonsOuterWrapperUShowMobile>
            </>
          )}
        </PageContentContainerFriendIntro>
      </div>
    );
  }
}
FriendIntroLanding.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

function NextStepButtons (props) {
  renderLog('NextStepButtons functional component');
  return (
    <>
      <Button
        color="primary"
        onClick={props.onClickNextButton}
        style={props.desktopMode ? {
          boxShadow: 'none !important',
          textTransform: 'none',
          width: 250,
        } : {
          boxShadow: 'none !important',
          textTransform: 'none',
          width: '100%',
        }}
        variant="contained"
      >
        {props.nextStepButtonText}
      </Button>
      {!props.skipForNowOff && (
        <Button
          classes={props.desktopMode ? { root: props.classes.desktopSimpleLink } : { root: props.classes.mobileSimpleLink }}
          color="primary"
          onClick={props.goToSkipForNow}
        >
          Skip for now
        </Button>
      )}
    </>
  );
}
NextStepButtons.propTypes = {
  classes: PropTypes.object,
  desktopMode: PropTypes.bool,
  goToSkipForNow: PropTypes.func,
  nextStepButtonText: PropTypes.string,
  onClickNextButton: PropTypes.func,
  skipForNowOff: PropTypes.bool,
};

const styles = () => ({
  closeButton: {
    color: '#999',
  },

  enterInfoLink: {
    boxShadow: 'none !important',
    fontWeight: 500,
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
  mobileSimpleLink: {
    boxShadow: 'none !important',
    color: '#999',
    marginTop: 10,
    padding: '0 20px',
    textTransform: 'none',
    width: '100%',
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
});

const ActionButtonsWrapper = styled('div')`
  margin-top: 48px;
`;

const BodyWrapper = styled('div')`
  padding: 40px 20px 110% 20px;
`;

const BodyWrapperWhatIs = styled('div')`
  padding: 0px 20px 0 20px;
`;

const CloseButtonDiv = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 10px 12px 0 12px;
  z-index: 999;
`;

const EnterInfoManuallyWrapper = styled('div')`
  margin-top: 48px;
`;

const FlagImage = styled('img')`
  max-width: 200px;
  align-items:center;
`;

const FlagImageWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const FriendIntroRootWrapper = styled('div')`
  max-width: 550px;
`;

const FriendIntroTitle = styled('div')`
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
`;

const FriendPhotoInnerWrapper = styled('div')`
  min-height: 200px;
  text-align: center
`;

const FriendPhotoName = styled('div')`
  font-size: 16px;
  margin-top: 8px;
`;

const FriendPhotoOuterWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  min-height: 240px;
`;

const LinkToFAQ = styled('div')`
  color: #999;
  display: flex;
  font-size: 16px;
  justify-content: center;
`;

const PageContentContainerFriendIntro = styled('div')`
  display: flex;
  justify-content: center;
`;

const VoterPhotoImage = styled('img')`
  border-radius: 100px;
  max-width: 200px;
  align-items:center;
`;

const WeVoteLogoSpacer = styled('div')`
  margin-bottom: 100px;
`;

const WeVoteLogoWrapper = styled('div')`
  color: '#999';
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const WeVoteTextBody = styled('div')`
  color: #555;
  font-size: 16px;
  text-align: center;
`;

const WeVoteTextTitle = styled('div')`
  color: #555;
  font-size: 24px;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const WhatIsWeVoteLinkWrapper = styled('div')`
  margin-top: 48px;
`;

const WhatIsWeVoteWrapper = styled('div')`
  max-width: 550px;
`;


export default withTheme(withStyles(styles)(FriendIntroLanding));
