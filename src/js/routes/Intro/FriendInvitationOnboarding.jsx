import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Slider from 'react-slick';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import closeIcon from '../../../img/global/icons/x-close.png';
import { hideZenDeskHelpVisibility, showZenDeskHelpVisibility } from '../../utils/applicationUtils';
import { cordovaFooterHeight, cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import { cordovaDot, getAndroidSize, historyPush, isAndroid, isWebApp } from '../../utils/cordovaUtils';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import FriendInvitationOnboardingIntro from '../../components/Intro/FriendInvitationOnboardingIntro';
import FriendInvitationOnboardingValues from '../../components/Intro/FriendInvitationOnboardingValues';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';
import PersonalizedScoreIntroBody from '../../components/CompleteYourProfile/PersonalizedScoreIntroBody';
import { renderLog } from '../../utils/logging';
import StepsChips from '../../components/Widgets/StepsChips';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import VoterStore from '../../stores/VoterStore';

class FriendInvitationOnboarding extends Component {
  static propTypes = {
    classes: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeSlideBefore: 0,
      personalizedScoreIntroWatchedThisSession: false,
      invitationMessage: '',
    };

    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
    this.slider = React.createRef();
  }

  componentWillMount () {
    document.body.style.backgroundColor = '#A3A3A3';
    document.body.className = 'story-view';
  }

  componentDidMount () {
    // this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { invitationSecretKey } = this.props.params;
    // console.log('FriendInvitationOnboarding, componentDidMount, this.props.params.invitation_secret_key: ', invitationSecretKey);
    if (invitationSecretKey) {
      this.friendInvitationInformation(invitationSecretKey);
    }
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
    const friendInvitationInformation = FriendStore.getFriendInvitationInformation();
    if (friendInvitationInformation) {
      const {
        friendFirstName, friendLastName, friendImageUrlHttpsTiny, friendIssueWeVoteIdList, invitationMessage,
      } = friendInvitationInformation;
      this.setState({
        friendFirstName,
        friendLastName,
        friendImageUrlHttpsTiny,
        friendIssueWeVoteIdList,
        invitationMessage,
      });
    }
  }

  onVoterStoreChange () {
    this.onFriendStoreChange();
    const personalizedScoreIntroCompleted = VoterStore.getInterfaceFlagState(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    this.setState({
      personalizedScoreIntroCompleted,
    });
  }

  goToSpecificSlide = (index) => {
    // console.log('goToSpecificSlide index:', index);
    if (index === 2) {
      this.setState({ personalizedScoreIntroWatchedThisSession: true });
    }
    hideZenDeskHelpVisibility();
    this.slider.current.slickGoTo(index);
  }

  onExitOnboarding = () => {
    const { personalizedScoreIntroWatchedThisSession } = this.state;
    if (personalizedScoreIntroWatchedThisSession) {
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.PERSONALIZED_SCORE_INTRO_COMPLETED);
    }
    const ballotLink = '/ready';
    showZenDeskHelpVisibility();
    historyPush(ballotLink);
  }

  personalizedScoreIntroModalToggle = () => {
    //
  }

  nextSlide () {
    const { invitationSecretKey } = this.props.params;
    if (invitationSecretKey) {
      this.friendInvitationInformation(invitationSecretKey);
    }
    hideZenDeskHelpVisibility();
    const { activeSlideBefore } = this.state;
    // console.log('nextSlide activeSlideBefore:', activeSlideBefore);
    if (activeSlideBefore === 1) {
      this.setState({ personalizedScoreIntroWatchedThisSession: true });
    }
    this.slider.current.slickNext();
  }

  previousSlide () {
    // console.log('previousSlide, activeSlideBefore:', activeSlideBefore);
    hideZenDeskHelpVisibility();
    this.slider.current.slickPrev();
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

  friendInvitationInformation (invitationSecretKey) {
    FriendActions.friendInvitationInformation(invitationSecretKey);
  }

  render () {
    renderLog('FriendInvitationOnboarding');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const {
      activeSlideBefore, friendFirstName, friendLastName,
      friendImageUrlHttpsTiny, friendIssueWeVoteIdList, howItWorksWatched,
      invitationMessage, personalizedScoreIntroCompleted,
    } = this.state;
    // console.log('render:', imageFollowReloadUrl);

    // These are settings for the react-slick slider
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      accessibility: true,
      arrows: false,
      beforeChange: (current, next) => this.setState({ activeSlideBefore: next }),
      // afterChange: current => this.setState({ activeSlideAfter: current }),
    };

    const showReadyNextTextOnThisSlide = personalizedScoreIntroCompleted ? 1 : 2;
    // console.log('activeSlideBefore: ', activeSlideBefore, ', activeSlideAfter:', activeSlideAfter);
    const stepLabels = personalizedScoreIntroCompleted ? ['Invitation Accepted', 'Values'] : ['Invitation Accepted', 'Values', 'Personalized Score'];
    return (
      <div>
        <Helmet title="We Vote - Invitation Accepted!" />
        <div className="intro-story container-fluid well u-inset--md" style={this.overrideMediaQueryForAndroidTablets()}>
          <span onClick={this.onExitOnboarding}>
            <img
              src={cordovaDot(closeIcon)}
              className={`x-close x-close__black ${isWebApp() ? '' : 'x-close__cordova'}`}
              alt="close"
            />
          </span>
          <Slider {...settings} dotsClass="slick-dots intro-modal__gray-dots" ref={this.slider}>
            <div key={1}>
              <FriendInvitationOnboardingIntro
                friendFirstName={friendFirstName}
                friendLastName={friendLastName}
                friendImageUrlHttpsTiny={friendImageUrlHttpsTiny}
                invitationMessage={invitationMessage}
              />
            </div>
            <div key={2}>
              <FriendInvitationOnboardingValues
                friendFirstName={friendFirstName}
                friendLastName={friendLastName}
                friendImageUrlHttpsTiny={friendImageUrlHttpsTiny}
                friendIssueWeVoteIdList={friendIssueWeVoteIdList}
              />
            </div>
            {!personalizedScoreIntroCompleted && (
              <div key={3}>
                <HowItWorksWrapper>
                  <WeVoteLogoWrapper>
                    <img
                      className="header-logo-img"
                      alt="We Vote logo"
                      src={cordovaDot(logoDark)}
                    />
                  </WeVoteLogoWrapper>
                  <SlideShowTitle>
                    What&apos;s a Personalized Score?
                  </SlideShowTitle>
                  <HowItWorksDescription>
                    <PersonalizedScoreIntroBody
                      pathname=""
                      show
                      toggleFunction={this.personalizedScoreIntroModalToggle}
                    />
                  </HowItWorksDescription>
                </HowItWorksWrapper>
              </div>
            )}
          </Slider>
          <FooterBarWrapper style={{ height: `${cordovaFooterHeight()}` }}>
            <StepsOuterWrapper>
              <StepsWrapper width={howItWorksWatched ? 86 : 210}>
                <StepsChips onSelectStep={this.goToSpecificSlide} selected={activeSlideBefore} chips={stepLabels} mobile />
              </StepsWrapper>
            </StepsOuterWrapper>
            <TwoButtonsWrapper>
              <BackButtonWrapper>
                <Button
                  classes={{ root: classes.nextButtonRoot }}
                  color="primary"
                  disabled={activeSlideBefore === 0}
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
                  onClick={activeSlideBefore === showReadyNextTextOnThisSlide ? this.onExitOnboarding : this.nextSlide}
                >
                  {activeSlideBefore === showReadyNextTextOnThisSlide ? 'Done!' : 'Next'}
                </Button>
              </NextButtonWrapper>
            </TwoButtonsWrapper>
          </FooterBarWrapper>
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  buttonRoot: {
    fontSize: 12,
    padding: '4px 8px',
    height: 32,
    width: '100%',
    [theme.breakpoints.down('md')]: {
    },
    [theme.breakpoints.down('sm')]: {
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

const BackButtonWrapper = styled.div`
  padding-right: 12px;
  width: 100%;
  @media(min-width: 520px) {
    padding-right: 12px;
  }
`;

const FooterBarWrapper = styled.div`
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

const HowItWorksDescription = styled.div`
  font-size: 16px;
  padding-bottom: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-bottom: 30px;
  }
`;

const HowItWorksWrapper = styled.div`
  padding-left: 24px;
  padding-right: 24px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

const NextButtonWrapper = styled.div`
  width: 100%;
`;

const SlideShowTitle = styled.h3`
  font-weight: bold;
  font-size: 24px;
  margin-top:  16px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 20px;
    margin-top: 32px;
  }
`;

const StepsOuterWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding-top: 4px;
  width: 100%;
`;

const StepsWrapper = styled.div`
  width: ${({ width }) => `${width}px`};
`;

const TwoButtonsWrapper = styled.div`
  width: 100%;
  padding: 4px 8px 12px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WeVoteLogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px;
`;

export default withTheme(withStyles(styles)(FriendInvitationOnboarding));
