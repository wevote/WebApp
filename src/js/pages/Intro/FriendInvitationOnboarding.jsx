import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from '@mui/material/styles/styled';
import FriendActions from '../../actions/FriendActions';
import IssueActions from '../../actions/IssueActions';
import VoterActions from '../../actions/VoterActions';
import PersonalizedScoreIntroBody from '../../components/CompleteYourProfile/PersonalizedScoreIntroBody';
import FriendInvitationOnboardingIntro from '../../components/Intro/FriendInvitationOnboardingIntro';
import FriendInvitationOnboardingValues from '../../components/Intro/FriendInvitationOnboardingValues';
import StepsChips from '../../components/Widgets/StepsChips';
import VoterConstants from '../../constants/VoterConstants';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaFooterHeight, cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import { getAndroidSize, isAndroid } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';

const closeIcon = '../../../img/global/icons/x-close.png';
const logoDark = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';

class FriendInvitationOnboarding extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentSlideIndex: 0,
      friendInvitationInformationCalled: false,
      personalizedScoreIntroWatchedThisSession: false,
      invitationMessage: '',
    };

    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillMount () {
    document.body.style.backgroundColor = '#A3A3A3';
    document.body.className = 'story-view';
  }

  componentDidMount () {
    // this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { match: { params: { invitationSecretKey }  } } = this.props;
    const voterDeviceId = VoterStore.voterDeviceId();
    // console.log('FriendInvitationOnboarding, componentDidMount, invitation_secret_key: ', invitationSecretKey);
    if (voterDeviceId && invitationSecretKey) {
      FriendActions.friendInvitationInformation(invitationSecretKey);
      this.setState({
        friendInvitationInformationCalled: true,
      });
    }
    // Pre-load this so it is ready for slide 2
    IssueActions.issueDescriptionsRetrieve(VoterStore.getVoterWeVoteId());
    IssueActions.issuesFollowedRetrieve(VoterStore.getVoterWeVoteId());
    this.onVoterStoreChange();
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.setState({
      personalizedScoreIntroCompleted,
    });
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = '';
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    const { match: { params: { invitationSecretKey }  } } = this.props;
    const { friendInvitationInformationCalled } = this.state;
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
          friendImageUrlHttpsTiny,
          friendIssueWeVoteIdList,
          invitationMessage,
          invitationSecretKeyBelongsToThisVoter,
        } = friendInvitationInformation;
        if (!invitationSecretKeyBelongsToThisVoter) {
          // We have a response, but voterMergeTwoAccounts hasn't finished
          if (voterDeviceId && invitationSecretKey) {
            FriendActions.friendInvitationInformation(invitationSecretKey);
            this.setState({
              friendInvitationInformationCalled: true,
            });
          }
        } else {
          this.setState({
            friendFirstName,
            friendLastName,
            friendImageUrlHttpsTiny,
            friendIssueWeVoteIdList,
            invitationMessage,
          }, this.updateSlideshowVariables);
        }
      }
    }
  }

  onVoterStoreChange () {
    this.onFriendStoreChange();
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.setState({
      personalizedScoreIntroCompleted,
    }, this.updateSlideshowVariables);
  }

  goToSpecificSlide = (index) => {
    const { maxSlideIndex } = this.state;
    // console.log('goToSpecificSlide index:', index);
    const minSlideIndex = 0;
    if (index <= maxSlideIndex && index >= minSlideIndex) {
      this.setState({
        currentSlideIndex: index,
      });
    }
  }

  onExitOnboarding = () => {
    const { personalizedScoreIntroWatchedThisSession } = this.state;
    if (personalizedScoreIntroWatchedThisSession) {
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    }
    const ballotLink = '/ready';
    historyPush(ballotLink);
  }

  markPersonalizedScoreIntroCompleted = () => {
    // We don't want to set this in the API server until the onboarding modal is closed
    this.setState({
      personalizedScoreIntroWatchedThisSession: true,
    });
  }

  updateSlideshowVariables = () => {
    const {
      friendFirstName, friendLastName,
      friendImageUrlHttpsTiny, friendIssueWeVoteIdList,
      invitationMessage, personalizedScoreIntroCompleted,
    } = this.state;
    // We want to show two or three slides, because we need to take training opportunities.
    let maxSlideIndex;
    let showCloseModalTextOnThisSlideIndex;
    let showPersonalizedScoreIntro = true;
    const slideHtmlContentDict = {};
    let stepLabels;
    if (personalizedScoreIntroCompleted) {
      showPersonalizedScoreIntro = false;
    }
    if (showPersonalizedScoreIntro) {
      maxSlideIndex = 2;
      showCloseModalTextOnThisSlideIndex = 2;
      stepLabels = ['Introduction', 'Values', 'Personalized Score'];
    } else {
      maxSlideIndex = 1;
      showCloseModalTextOnThisSlideIndex = 1;
      stepLabels = ['Introduction', 'Values'];
    }
    slideHtmlContentDict[0] = (
      <FriendInvitationOnboardingIntro
        friendFirstName={friendFirstName}
        friendLastName={friendLastName}
        friendImageUrlHttpsTiny={friendImageUrlHttpsTiny}
        invitationMessage={invitationMessage}
      />
    );
    slideHtmlContentDict[1] = (
      <FriendInvitationOnboardingValues
        friendFirstName={friendFirstName}
        friendLastName={friendLastName}
        friendImageUrlHttpsTiny={friendImageUrlHttpsTiny}
        friendIssueWeVoteIdList={friendIssueWeVoteIdList}
      />
    );
    if (showPersonalizedScoreIntro) {
      slideHtmlContentDict[2] = (
        <HowItWorksWrapper>
          <WeVoteLogoWrapper>
            <img
              className="header-logo-img"
              alt="We Vote logo"
              src={normalizedImagePath(logoDark)}
            />
          </WeVoteLogoWrapper>
          <SlideShowTitle>
            What&apos;s a Personalized Score?
          </SlideShowTitle>
          <HowItWorksDescription>
            <PersonalizedScoreIntroBody
              markPersonalizedScoreIntroCompleted={this.markPersonalizedScoreIntroCompleted}
              show
            />
          </HowItWorksDescription>
        </HowItWorksWrapper>
      );
    }
    this.setState({
      maxSlideIndex,
      showCloseModalTextOnThisSlideIndex,
      slideHtmlContentDict,
      stepLabels,
    });
  }

  nextSlide () {
    const { match: { params: { invitationSecretKey } } } = this.props;
    if (invitationSecretKey) {
      FriendActions.friendInvitationInformation(invitationSecretKey);
    }
    const { currentSlideIndex, maxSlideIndex } = this.state;
    // console.log('nextSlide currentSlideIndex:', currentSlideIndex);
    if (currentSlideIndex < maxSlideIndex) {
      this.setState({
        currentSlideIndex: currentSlideIndex + 1,
      });
    }
  }

  previousSlide () {
    // console.log('previousSlide, currentSlideIndex:', currentSlideIndex);
    const { currentSlideIndex } = this.state;
    const minSlideIndex = 0;
    if (currentSlideIndex > minSlideIndex) {
      this.setState({
        currentSlideIndex: currentSlideIndex - 1,
      });
    }
  }

  overrideMediaQueryForAndroidTablets () {
    // Media queries in CSS often don't work as expected in Cordova, due to window.devicePixelRatio greater than one
    if (isAndroid()) {
      const sizeString = getAndroidSize();
      if (sizeString === '--xl') {
        return {
          maxHeight: 'unset',
          maxWidth: 'unset',
        };
      }
    }
    return {};
  }

  render () {
    renderLog('FriendInvitationOnboarding');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      currentSlideIndex, personalizedScoreIntroCompleted, showCloseModalTextOnThisSlideIndex,
      slideHtmlContentDict, stepLabels,
    } = this.state;
    // console.log('render:', imageFollowReloadUrl);
    if (!slideHtmlContentDict || slideHtmlContentDict.length === 0) {
      return null;
    }

    const slideHtmlContent = slideHtmlContentDict[currentSlideIndex];
    return (
      <div>
        <Helmet title="We Vote - Invitation Accepted!" />
        <div className="intro-story container-fluid well u-inset--md" style={this.overrideMediaQueryForAndroidTablets()}>
          <span onClick={this.onExitOnboarding}>
            <img
              src={normalizedImagePath(closeIcon)}
              className={`x-close x-close__black ${isWebApp() ? '' : 'x-close__cordova'}`}
              alt="close"
            />
          </span>
          {slideHtmlContent}
          <FooterBarWrapper style={{ height: `${cordovaFooterHeight()}` }}>
            <StepsOuterWrapper>
              <StepsWrapper width={personalizedScoreIntroCompleted ? 86 : 210}>
                <StepsChips onSelectStep={this.goToSpecificSlide} selected={currentSlideIndex} chips={stepLabels} mobile />
              </StepsWrapper>
            </StepsOuterWrapper>
            <TwoButtonsWrapper>
              <BackButtonWrapper>
                <Button
                  classes={{ root: classes.nextButtonRoot }}
                  color="primary"
                  disabled={currentSlideIndex === 0}
                  fullWidth
                  id="voterGuideSettingsPositionsSeeFullBallot"
                  onClick={this.previousSlide}
                  style={{ top: `${cordovaNetworkNextButtonTop()}` }}
                  variant="outlined"
                >
                  Back
                </Button>
              </BackButtonWrapper>
              <NextButtonWrapper>
                <Button
                  color="primary"
                  id="howItWorksNext"
                  variant="contained"
                  classes={{ root: classes.nextButtonRoot }}
                  onClick={currentSlideIndex === showCloseModalTextOnThisSlideIndex ? this.onExitOnboarding : this.nextSlide}
                >
                  {currentSlideIndex === showCloseModalTextOnThisSlideIndex ? 'Done!' : 'Next'}
                </Button>
              </NextButtonWrapper>
            </TwoButtonsWrapper>
          </FooterBarWrapper>
        </div>
      </div>
    );
  }
}
FriendInvitationOnboarding.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = (theme) => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('lg')]: {
    },
    [theme.breakpoints.down('md')]: {
      padding: '4px 4px',
    },
  },
  buttonOutlinedPrimary: {
    background: 'white',
  },
  nextButtonRoot: {
    width: '100%',
  },
});

const BackButtonWrapper = styled('div')`
  padding-right: 12px;
  width: 100%;
  @media(min-width: 520px) {
    padding-right: 12px;
  }
`;

const FooterBarWrapper = styled('div')`
  background: #fff;
  border-top: 1px solid #eee;
  bottom: 0;
  // box-shadow: 0 -4px 4px -1px rgba(0, 0, 0, .2), 0 -4px 5px 0 rgba(0, 0, 0, .14), 0 -1px 10px 0 rgba(0, 0, 0, .12);
  max-width: 750px;
  padding-bottom: env(safe-area-inset-bottom);
  position: fixed;
  width: 100%;
  @media print{
    display: none;
  }
`;

const HowItWorksDescription = styled('div')`
  font-size: 16px;
  margin-top: 30px;
  padding-bottom: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-bottom: 30px;
  }
`;

const HowItWorksWrapper = styled('div')`
  padding-left: 24px;
  padding-right: 24px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

const NextButtonWrapper = styled('div')`
  width: 100%;
`;

const SlideShowTitle = styled('h3')`
  font-weight: bold;
  font-size: 24px;
  margin-top:  16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
    margin-top: 32px;
  }
`;

const StepsOuterWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  padding-top: 4px;
  width: 100%;
`;

const StepsWrapper = styled('div')`
  width: ${({ width }) => `${width}px`};
`;

const TwoButtonsWrapper = styled('div')`
  width: 100%;
  padding: 4px 8px 12px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WeVoteLogoWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 12px;
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboarding));
