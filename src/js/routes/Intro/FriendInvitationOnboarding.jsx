import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Slider from 'react-slick';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles, withTheme } from '@material-ui/core/styles';
import closeIcon from '../../../img/global/icons/x-close.png';
import { cordovaFooterHeight, cordovaNetworkNextButtonTop } from '../../utils/cordovaOffsets';
import { cordovaDot, getAndroidSize, historyPush, isAndroid, isWebApp } from '../../utils/cordovaUtils';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import FriendInvitationOnboardingIntro from '../../components/Intro/FriendInvitationOnboardingIntro';
import FriendInvitationOnboardingValues from '../../components/Intro/FriendInvitationOnboardingValues';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';


class FriendInvitationOnboarding extends Component {
  static goToBallotLink () {
    const ballotLink = '/ballot';
    historyPush(ballotLink);
  }

  static propTypes = {
    classes: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeSlideBefore: 0,
      activeSlideAfter: 0,
      invitationMessage: '',
    };

    this.nextSlide = this.nextSlide.bind(this);
    this.previous = this.previous.bind(this);
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
  }

  nextSlide () {
    const { invitationSecretKey } = this.props.params;
    if (invitationSecretKey) {
      this.friendInvitationInformation(invitationSecretKey);
    }
    this.slider.current.slickNext();
  }

  previous () {
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
      activeSlideAfter, activeSlideBefore, friendFirstName, friendLastName,
      friendImageUrlHttpsTiny, friendIssueWeVoteIdList, invitationMessage,
    } = this.state;

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
      afterChange: current => this.setState({ activeSlideAfter: current }),
    };

    const showMyBallotNextTextOnThisSlide = 1;
    // console.log('activeSlideBefore: ', activeSlideBefore, ', activeSlideAfter:', activeSlideAfter);
    return (
      <div>
        <Helmet title="Invitation Accepted!" />
        <div className="intro-story container-fluid well u-inset--md" style={this.overrideMediaQueryForAndroidTablets()}>
          <span onClick={FriendInvitationOnboarding.goToBallotLink}>
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
                nextSlide={this.nextSlide}
              />
            </div>
            <div key={2}>
              <FriendInvitationOnboardingValues
                friendFirstName={friendFirstName}
                friendLastName={friendLastName}
                friendImageUrlHttpsTiny={friendImageUrlHttpsTiny}
                friendIssueWeVoteIdList={friendIssueWeVoteIdList}
                nextSlide={this.nextSlide}
              />
            </div>
          </Slider>
          <FooterBarWrapper style={{ height: `${cordovaFooterHeight()}` }}>
            <TwoButtonsWrapper>
              <BackButtonWrapper>
                <Button
                  classes={{ root: classes.nextButtonRoot }}
                  color="primary"
                  disabled={activeSlideAfter === 0}
                  fullWidth
                  id="voterGuideSettingsPositionsSeeFullBallot"
                  onClick={this.previous}
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
                  onClick={activeSlideBefore === showMyBallotNextTextOnThisSlide ? FriendInvitationOnboarding.goToBallotLink : this.nextSlide}
                >
                  {activeSlideBefore === showMyBallotNextTextOnThisSlide ? 'My Ballot >' : 'Next'}
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

const FooterBarWrapper = styled.div`
  background: #fff;
  border-top: 1px solid #eee;
  bottom: 0;
  box-shadow: 0 -4px 4px -1px rgba(0, 0, 0, .2), 0 -4px 5px 0 rgba(0, 0, 0, .14), 0 -1px 10px 0 rgba(0, 0, 0, .12);
  max-width: 750px;
  padding-bottom: env(safe-area-inset-bottom);
  position: fixed;
  width: 100%;
  @media print{
    display: none;
  }
`;

const TwoButtonsWrapper = styled.div`
  width: 100%;
  padding: 12px 8px 12px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButtonWrapper = styled.div`
  padding-right: 12px;
  width: 100%;
  @media(min-width: 520px) {
    padding-right: 12px;
  }
`;

const NextButtonWrapper = styled.div`
  width: 100%;
`;


export default withTheme(withStyles(styles)(FriendInvitationOnboarding));
