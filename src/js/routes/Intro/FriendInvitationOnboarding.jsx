import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Slider from 'react-slick';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import closeIcon from '../../../img/global/icons/x-close.png';
import { cordovaFooterHeight, cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import { cordovaDot, getAndroidSize, historyPush, isAndroid, isWebApp } from '../../utils/cordovaUtils';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import FriendInvitationOnboardingIntro from '../../components/Intro/FriendInvitationOnboardingIntro';
import FriendInvitationOnboardingValues from '../../components/Intro/FriendInvitationOnboardingValues';
import logoDark from '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-141x46.svg';
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
      howItWorksWatchedThisSession: false,
      imageDecideUrl: '/img/how-it-works/HowItWorksForVoters-Decide-20190401.gif',
      imageDecideReloadUrl: '/img/how-it-works/HowItWorksForVoters-Decide-20190401.gif',
      imageFollowUrl: '/img/how-it-works/HowItWorksForVoters-Follow-20190507.gif',
      imageFollowReloadUrl: '/img/how-it-works/HowItWorksForVoters-Follow-20190507.gif',
      imageReviewUrl: '/img/how-it-works/HowItWorksForVoters-Review-20190401.gif',
      imageReviewReloadUrl: '/img/how-it-works/HowItWorksForVoters-Review-20190401.gif',
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
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    this.setState({
      howItWorksWatched,
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
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    this.setState({
      howItWorksWatched,
    });
  }

  goToSpecificSlide = (index) => {
    // console.log('goToSpecificSlide index:', index);
    const { imageDecideUrl, imageFollowUrl, imageReviewUrl } = this.state;
    // Force the animated gifs to restart the animation
    if (index === 2) {
      this.setState({ imageFollowReloadUrl: '' });
      setTimeout(() => {
        this.setState({ imageFollowReloadUrl: imageFollowUrl });
      }, 0);
    } else if (index === 3) {
      this.setState({ imageReviewReloadUrl: '' });
      setTimeout(() => {
        this.setState({ imageReviewReloadUrl: imageReviewUrl });
      }, 0);
    } else if (index === 4) {
      this.setState({ imageDecideReloadUrl: '' });
      setTimeout(() => {
        this.setState({ imageDecideReloadUrl: imageDecideUrl });
      }, 0);
      this.setState({ howItWorksWatchedThisSession: true });
    }
    this.slider.current.slickGoTo(index);
  }

  onExitOnboarding = () => {
    const { howItWorksWatchedThisSession } = this.state;
    if (howItWorksWatchedThisSession) {
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.HOW_IT_WORKS_WATCHED);
    }
    const ballotLink = '/ready';
    historyPush(ballotLink);
  }

  nextSlide () {
    const { invitationSecretKey } = this.props.params;
    if (invitationSecretKey) {
      this.friendInvitationInformation(invitationSecretKey);
    }
    const { activeSlideBefore, imageDecideUrl, imageFollowUrl, imageReviewUrl } = this.state;
    // console.log('nextSlide activeSlideBefore:', activeSlideBefore);
    // Force the animated gifs to restart the animation
    if (activeSlideBefore === 1) {
      this.setState({ imageFollowReloadUrl: '' });
      setTimeout(() => {
        this.setState({ imageFollowReloadUrl: imageFollowUrl });
      }, 0);
    } else if (activeSlideBefore === 2) {
      this.setState({ imageReviewReloadUrl: '' });
      setTimeout(() => {
        this.setState({ imageReviewReloadUrl: imageReviewUrl });
      }, 0);
    } else if (activeSlideBefore === 3) {
      this.setState({ imageDecideReloadUrl: '' });
      setTimeout(() => {
        this.setState({ imageDecideReloadUrl: imageDecideUrl });
      }, 0);
      this.setState({ howItWorksWatchedThisSession: true });
    }
    this.slider.current.slickNext();
  }

  previousSlide () {
    const { activeSlideBefore, imageFollowUrl, imageReviewUrl } = this.state;
    // console.log('previousSlide, activeSlideBefore:', activeSlideBefore);
    // Force the animated gifs to restart the animation
    if (activeSlideBefore === 3) {
      this.setState({ imageFollowReloadUrl: '' });
      setTimeout(() => {
        this.setState({ imageFollowReloadUrl: imageFollowUrl });
      }, 0);
    } else if (activeSlideBefore === 4) {
      this.setState({ imageReviewReloadUrl: '' });
      setTimeout(() => {
        this.setState({ imageReviewReloadUrl: imageReviewUrl });
      }, 0);
    }
    // Cannot get to imageDecide using the previousSlide function
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
      imageDecideReloadUrl, imageFollowReloadUrl, imageReviewReloadUrl,
      invitationMessage,
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

    const showReadyNextTextOnThisSlide = howItWorksWatched ? 1 : 4;
    // console.log('activeSlideBefore: ', activeSlideBefore, ', activeSlideAfter:', activeSlideAfter);
    const stepLabels = howItWorksWatched ? ['Invitation Accepted', 'Values'] : ['Invitation Accepted', 'Values', 'Follow', 'Review', 'Decide'];
    return (
      <div>
        <Helmet title="Invitation Accepted!" />
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
            {!howItWorksWatched && (
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
                    Follow organizations and people you trust
                  </SlideShowTitle>
                  <HowItWorksDescription>
                    Follow those you trust as you look through your ballot, and in the Values section.
                  </HowItWorksDescription>
                  <HowItWorksImage src={imageFollowReloadUrl ? cordovaDot(imageFollowReloadUrl) : ''} />
                </HowItWorksWrapper>
              </div>
            )}
            {!howItWorksWatched && (
              <div key={4}>
                <HowItWorksWrapper>
                  <WeVoteLogoWrapper>
                    <img
                      className="header-logo-img"
                      alt="We Vote logo"
                      src={cordovaDot(logoDark)}
                    />
                  </WeVoteLogoWrapper>
                  <SlideShowTitle>
                    See who endorsed each choice on your ballot
                  </SlideShowTitle>
                  <HowItWorksDescription>
                    Learn from the people you trust. Their recommendations will be highlighted on your ballot.
                  </HowItWorksDescription>
                  <HowItWorksImage src={imageReviewReloadUrl ? cordovaDot(imageReviewReloadUrl) : ''} />
                </HowItWorksWrapper>
              </div>
            )}
            {!howItWorksWatched && (
              <div key={5}>
                <HowItWorksWrapper>
                  <WeVoteLogoWrapper>
                    <img
                      className="header-logo-img"
                      alt="We Vote logo"
                      src={cordovaDot(logoDark)}
                    />
                  </WeVoteLogoWrapper>
                  <SlideShowTitle>
                    Complete your ballot in under six minutes
                  </SlideShowTitle>
                  <HowItWorksDescription>
                    We Vote is fast, mobile, and helps you decide on the go. Vote with confidence!
                  </HowItWorksDescription>
                  <HowItWorksImage src={imageDecideReloadUrl ? cordovaDot(imageDecideReloadUrl) : ''} />
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

const HowItWorksImage = styled.img`
  border: 1px solid #999;
  border-radius: 16px;
  box-shadow: 2px 2px 4px 2px ${({ theme }) => theme.colors.grayLight};
  width: 100%;
  height: auto;
  transition: all 150ms ease-in;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 90vw;
    height: calc(90vw * 0.5625);
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
