import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import {
  DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet,
  MobileStaticNextButtonsInnerWrapper, MobileStaticNextButtonsOuterWrapperUShowMobile,
} from '../../components/Style/NextButtonStyles';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';


class FriendIntroLanding extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationInformationCalled: false,
      showWhatIsWeVote: false,
      skipForNowOff: false,
      voterContactEmailListCount: 0,
      voterContactEmailGoogleCount: 0,
    };
  }

  componentDidMount () {
    // this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params: { invitationSecretKey }  } } = this.props;
    const voterDeviceId = VoterStore.voterDeviceId();
    // console.log('FriendIntroLanding, componentDidMount, invitation_secret_key: ', invitationSecretKey);
    if (voterDeviceId && invitationSecretKey) {
      FriendActions.friendInvitationInformation(invitationSecretKey);
      this.setState({
        friendInvitationInformationCalled: true,
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
    // console.log('onFriendStoreChange friendInvitationInformationCalled:', friendInvitationInformationCalled);
    const voterDeviceId = VoterStore.voterDeviceId();
    if (voterDeviceId && invitationSecretKey && !friendInvitationInformationCalled) {
      FriendActions.friendInvitationInformation(invitationSecretKey);
      this.setState({
        friendInvitationInformationCalled: true,
      });
    } else {
      const friendInvitationInformation = FriendStore.getFriendInvitationInformation();
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
                this.friendInvitationTimer = setTimeout(() => {
                  FriendActions.friendInvitationInformation(invitationSecretKey);
                  // console.log('onFriendStoreChange !invitationSecretKeyBelongsToThisVoter friendInvitationInformation called');
                  this.setState({
                    friendInvitationInformationCalled: true,
                  });
                }, 3000);
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
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voter = VoterStore.getVoter();
    const {
      signed_in_apple: voterSignedInApple,
      signed_in_facebook: voterSignedInFacebook,
      signed_in_twitter: voterSignedInTwitter,
    } = voter;
    const voterContactEmailGoogleCount = VoterStore.getVoterContactEmailGoogleCount();
    const voterContactEmailListCount = voterContactEmailList.length;
    this.setState({
      voterContactEmailGoogleCount,
      voterContactEmailListCount,
      voterFirstName: VoterStore.getFirstName(),
      voterPhotoUrlLarge: VoterStore.getVoterPhotoUrlLarge(),
      voterSignedInApple,
      voterSignedInFacebook,
      voterSignedInTwitter,
    }, () => this.setNextStepVariables());
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
      voterFirstName, voterPhotoUrlLarge,
      voterSignedInApple, voterSignedInFacebook, voterSignedInTwitter,
    } = this.state;
    let socialSignInOffered = false; // Temporarily false until Twitter/Facebook sign in offered
    const voterSignedInWithSocialSite = voterSignedInApple || voterSignedInFacebook || voterSignedInTwitter;
    if (voterFirstName && voterPhotoUrlLarge) {
      socialSignInOffered = false;
    } else if (voterSignedInWithSocialSite) {
      socialSignInOffered = false;
    }

    let nextStepButtonText = 'Next';
    let setUpAccountEntryPath;
    let skipForNowOff = false;
    if (voterFirstName && voterPhotoUrlLarge) {
      setUpAccountEntryPath = '/ballot'; // Temporary redirection
      nextStepButtonText = 'View your ballot';
      skipForNowOff = true;
      // if (voterContactEmailGoogleCount) {
      //   setUpAccountEntryPath = '/setupaccount/invitecontacts';
      //   nextStepButtonText = 'Find other friends';
      // } else {
      //   setUpAccountEntryPath = '/setupaccount/importcontacts';
      //   nextStepButtonText = 'Find other friends';
      // }
    } else if (voterPhotoUrlLarge) {
      setUpAccountEntryPath = '/setupaccount/editname';
    } else if (voterFirstName) {
      setUpAccountEntryPath = '/setupaccount/addphoto';
    } else {
      setUpAccountEntryPath = '/ballot'; // Temporary redirection
      // setUpAccountEntryPath = '/setupaccount';
    }
    this.setState({
      nextStepButtonText,
      setUpAccountEntryPath,
      skipForNowOff,
      socialSignInOffered,
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
      showWhatIsWeVote, skipForNowOff, socialSignInOffered, voterFirstName,
    } = this.state;

    return (
      <div>
        <Helmet title="We Vote - Invitation Accepted!" />
        <PageContentContainerFriendIntro>
          {showWhatIsWeVote ? (
            <FriendIntroRootWrapper>
              <WeVoteLogoSpacer />
              <BodyWrapper>
                <FriendIntroTitle>What is We Vote?</FriendIntroTitle>
                <Button
                  classes={{ root: classes.mobileSimpleLink }}
                  color="primary"
                  onClick={this.toggleWhatIsWeVote}
                >
                  Close
                </Button>
              </BodyWrapper>
            </FriendIntroRootWrapper>
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
                  {friendImageUrlHttpsLarge && (
                    <FriendPhotoOuterWrapper>
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
                    </FriendPhotoOuterWrapper>
                  )}
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
                  <WhatIsWeVoteWrapper>
                    <Button
                      classes={{ root: classes.mobileSimpleLink }}
                      color="primary"
                      onClick={this.toggleWhatIsWeVote}
                    >
                      What is We Vote?
                    </Button>
                  </WhatIsWeVoteWrapper>
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
`;

const EnterInfoManuallyWrapper = styled('div')`
  margin-top: 48px;
`;

const FriendIntroRootWrapper = styled('div')`
  max-width: 550px;
  padding: 40px 20px 110% 20px;
`;

const FriendIntroTitle = styled('div')`
  font-size: 24px;
  text-align: center;
`;

const FriendPhotoInnerWrapper = styled('div')`
  min-height: 100px;
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
`;

const PageContentContainerFriendIntro = styled('div')`
  display: flex;
  justify-content: center;
`;

const VoterPhotoImage = styled('img')`
  border-radius: 100px;
  max-width: 200px;
`;

const WhatIsWeVoteWrapper = styled('div')`
  margin-top: 48px;
`;

const WeVoteLogoSpacer = styled('div')`
  margin-bottom: 158px;
`;

export default withTheme(withStyles(styles)(FriendIntroLanding));
