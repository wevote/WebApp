import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import apiCalming from '../../common/utils/apiCalming';
import { isCordovaWide } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import {
  DesktopNextButtonsInnerWrapper, DesktopNextButtonsOuterWrapperUShowDesktopTablet,
  MobileStaticNextButtonsInnerWrapper, MobileStaticNextButtonsOuterWrapperUShowMobile,
} from '../../components/Style/NextButtonStyles';
import NextStepButtons from '../../components/FriendIntro/NextStepButtons';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';


const WhatIsWeVote = React.lazy(() => import(/* webpackChunkName: 'WhatIsWeVote' */ '../../components/FriendIntro/WhatIsWeVote'));

class FriendIntroLanding extends Component {
  constructor (props) {
    super(props);
    this.state = {
      friendInvitationInformationCalled: false,
      friendInvitationInformationCalledCount: 0,
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
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
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
      if (this.friendInvitationTimer) clearTimeout(this.friendInvitationTimer);
      const friendInvitationInformationDelayTime = 250;
      this.friendInvitationTimer = setTimeout(() => {
        FriendActions.friendInvitationInformation(invitationSecretKey);
      }, friendInvitationInformationDelayTime);
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
            <Suspense fallback={<></>}>
              <WhatIsWeVote toggleWhatIsWeVote={this.toggleWhatIsWeVote} />
            </Suspense>
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
  padding: 40px 20px 110% 20px;
`;

const EnterInfoManuallyWrapper = styled('div')`
  margin-top: 48px;
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

const WhatIsWeVoteLinkWrapper = styled('div')`
  margin-top: 48px;
`;


export default withTheme(withStyles(styles)(FriendIntroLanding));
