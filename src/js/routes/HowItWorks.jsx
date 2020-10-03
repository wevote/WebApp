import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AnnotatedSlideshow from '../components/Widgets/AnnotatedSlideshow';
import AppActions from '../actions/AppActions';
import { cordovaScrollablePaneTopPadding } from '../utils/cordovaOffsets';
import { historyPush, isCordova } from '../utils/cordovaUtils';
import WelcomeFooter from '../components/Welcome/WelcomeFooter';
import Header, { Container, Title } from '../components/Welcome/HowItWorksHeader';
import HeaderSwitch from '../components/Widgets/HeaderSwitch';
import { renderLog } from '../utils/logging';
import StepsChips from '../components/Widgets/StepsChips';
import VoterActions from '../actions/VoterActions';
import VoterConstants from '../constants/VoterConstants';
import VoterStore from '../stores/VoterStore';
import WelcomeAppbar from '../components/Navigation/WelcomeAppbar';

class HowItWorks extends Component {
  static propTypes = {
    classes: PropTypes.object,
    inModal: PropTypes.bool,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      forCampaignsStepLabels: ['Claim', 'Import', 'Customize', 'Launch', 'Social Lift'],
      forCampaignsSteps: {
        Claim: {
          title: '1. Claim your campaign profile',
          description: 'Sign in & verify your account using your official Twitter account or other secure method. We Vote takes verification very seriously. (No trolls allowed!)',
          imgSrc: '/img/how-it-works/HowItWorksForCampaigns-Claim-20190516.gif?',
          index: 0,
        },
        Import: {
          title: '2. Import your endorsements',
          description: 'We are here to help you get your opinions in front of voters, whether you have 5 endorsements, or 1,005. We Vote\'s unique tech instamagically captures endorsement data from your website, spreadsheets, or text lists of candidates. No formatting overhauls required.',
          imgSrc: '/img/how-it-works/HowItWorksForCampaigns-Import-20190425.gif?',
          index: 1,
        },
        Customize: {
          title: '3. Add more customizations for your supporters',
          description: 'Want all the bells and whistles?  We Vote offers a lot for free, but has paid premium features that include the endorsements from your chapters and partners, and give you deeper analytics.',
          imgSrc: '/img/how-it-works/HowItWorksForCampaigns-Customize-20190425.gif?',
          index: 2,
        },
        Launch: {
          title: '4. Launch to your people',
          description: 'Promote your unique url over your email, text, and social media channels. Add the We Vote widget directly to your campaign website.',
          imgSrc: '/img/how-it-works/HowItWorksForCampaigns-Launch-20190506.gif?',
          index: 3,
        },
        SocialLift: {
          title: '5. Social lift',
          description: 'Let your people share with their friends. Watch your social lift in real time.',
          imgSrc: '/img/how-it-works/HowItWorksForCampaigns-SocialLift-20190506.gif?',
          index: 4,
        },
      },
      forOrganizationsStepLabels: ['Claim', 'Customize', 'Launch', 'Social Lift'],
      forOrganizationsSteps: {
        Claim: {
          title: '1. Claim your organization profile',
          description: 'Sign in & verify your organization using your official Twitter account or other secure method. We Vote takes verification very seriously. (No trolls allowed!)',
          imgSrc: '/img/how-it-works/HowItWorksForOrgs-Claim-20190506.gif?',
          index: 0,
        },
        Customize: {
          title: '2. Customize your Election Center',
          description: 'Want all the bells and whistles?  We Vote offers a lot for free, but has paid premium features to help you further customize branding and messaging, and give you deeper analytics.',
          imgSrc: '/img/how-it-works/HowItWorksForOrgs-Customize-20190507.gif?',
          index: 1,
        },
        Launch: {
          title: '3. Launch',
          description: 'Share your unique url over your email, text, and social media channels. Add the We Vote widget directly to your website.',
          imgSrc: '/img/how-it-works/HowItWorksForOrgs-Launch-20190506.gif?',
          index: 2,
        },
        SocialLift: {
          title: '4. Social lift',
          description: 'Let your people share with their friends. Watch your social lift in real time.',
          imgSrc: '/img/how-it-works/HowItWorksForOrgs-SocialLift-20190506.gif?',
          index: 3,
        },
      },
      forVoterStepLabels: ['Choose', 'Follow', 'Review', 'Decide', 'Friends'],
      forVoterSteps: {
        Choose: {
          title: '1. Choose your interests',
          description: 'Follow topics that interest you. We will suggest endorsements based on your interests.',
          imgSrc: '/img/how-it-works/HowItWorksForVoters-Choose-20190507.gif?',
          index: 0,
        },
        Follow: {
          title: '2. Follow organizations and people you trust',
          description: 'Their recommendations are highlighted on your ballot.',
          imgSrc: '/img/how-it-works/HowItWorksForVoters-Follow-20190507.gif?',
          index: 1,
        },
        Review: {
          title: '3. See who endorsed each choice on your ballot',
          description: 'Learn from the people you trust.',
          imgSrc: '/img/how-it-works/HowItWorksForVoters-Review-20190401.gif?',
          index: 2,
        },
        Decide: {
          title: '4. Complete your ballot in under six minutes',
          description: 'We Vote is fast, mobile, and helps you decide on the go. Vote with confidence!',
          imgSrc: '/img/how-it-works/HowItWorksForVoters-Decide-20190401.gif?',
          index: 3,
        },
        Friends: {
          title: '5. Share with friends who could use a guide',
          description: 'Are your family and friends feeling lost when it\'s time to vote? Be their hero, no matter which state they vote in.',
          imgSrc: '/img/how-it-works/HowItWorksForVoters-Friends-20190401.gif?',
          index: 4,
        },
      },
      howItWorksWatched: false,
      selectedCategoryIndex: 0,
      selectedStepIndex: 0,
      voter: {},
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (!this.props.inModal) {
      if (this.props.params.category_string === 'for-campaigns') {
        this.setState({
          getStartedMode: 'getStartedForCampaigns',
          getStartedUrl: '/settings/profile',
          selectedCategoryIndex: 2,
          selectedStepIndex: 0,
        });
      } else if (this.props.params.category_string === 'for-organizations') {
        this.setState({
          getStartedMode: 'getStartedForOrganizations',
          getStartedUrl: '/settings/profile',
          selectedCategoryIndex: 1,
          selectedStepIndex: 0,
        });
      } else {
        this.setState({
          getStartedMode: 'getStartedForVoters',
          getStartedUrl: '/ballot',
          selectedCategoryIndex: 0,
          selectedStepIndex: 0,
        });
      }
    } else {
      this.setState({
        getStartedMode: 'getStartedForVoters',
        getStartedUrl: '/ballot',
        selectedCategoryIndex: 0,
        selectedStepIndex: 0,
      });
    }
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    this.setState({
      howItWorksWatched,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!this.props.inModal) {
      if (nextProps.params.category_string === 'for-campaigns') {
        this.setState({
          getStartedMode: 'getStartedForCampaigns',
          getStartedUrl: '/settings/profile',
          selectedCategoryIndex: 2,
          selectedStepIndex: 0,
        });
      } else if (nextProps.params.category_string === 'for-organizations') {
        this.setState({
          getStartedMode: 'getStartedForOrganizations',
          getStartedUrl: '/settings/profile',
          selectedCategoryIndex: 1,
          selectedStepIndex: 0,
        });
      } else {
        this.setState({
          getStartedMode: 'getStartedForVoters',
          getStartedUrl: '/ballot',
          selectedCategoryIndex: 0,
          selectedStepIndex: 0,
        });
      }
    } else {
      this.setState({
        getStartedMode: 'getStartedForVoters',
        getStartedUrl: '/ballot',
        selectedCategoryIndex: 0,
        selectedStepIndex: 0,
      });
    }
    const howItWorksWatched = VoterStore.getInterfaceFlagState(VoterConstants.HOW_IT_WORKS_WATCHED);
    this.setState({
      howItWorksWatched,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  handleChangeSlide = (selectedStepIndex) => {
    const { howItWorksWatched } = this.state;
    const minimumStepIndexForCompletion = 2;
    if (!howItWorksWatched && selectedStepIndex >= minimumStepIndexForCompletion) {
      // Mark this so we know to show 'How it Works' as completed
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.HOW_IT_WORKS_WATCHED);
      this.setState({ howItWorksWatched: true });
    }
    this.setState({ selectedStepIndex });
  };

  handleChangeSlideGoBack = () => {
    const { selectedStepIndex } = this.state;
    this.setState({ selectedStepIndex: selectedStepIndex - 1 });
  };

  switchToDifferentCategoryFunction = (selectedCategoryIndex) => {
    let getStartedMode = 'getStartedForVoters';
    let getStartedUrl = '/ballot';
    if (selectedCategoryIndex === 1) {
      getStartedMode = 'getStartedForOrganizations';
      getStartedUrl = '/settings/profile';
    } else if (selectedCategoryIndex === 2) {
      getStartedMode = 'getStartedForCampaigns';
      getStartedUrl = '/settings/profile';
    }
    this.setState({
      getStartedMode,
      getStartedUrl,
      selectedCategoryIndex: selectedCategoryIndex || 0,
      selectedStepIndex: 0,
    });
  };

  howItWorksGetStarted () {
    const { getStartedMode, getStartedUrl, howItWorksWatched, voter } = this.state;
    let isSignedIn = false;
    if (voter) {
      ({ is_signed_in: isSignedIn } = voter);
      isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;
    }
    if (!howItWorksWatched) {
      // Mark this so we know to show 'How it Works' as completed
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.HOW_IT_WORKS_WATCHED);
    }
    if (isSignedIn) {
      historyPush(getStartedUrl);
      AppActions.setShowHowItWorksModal(false);
    } else {
      AppActions.setGetStartedMode(getStartedMode);
      AppActions.setShowHowItWorksModal(false);
      AppActions.setShowSignInModal(true);
    }
  }

  render () {
    renderLog('HowItWorks');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { forCampaignsStepLabels, forCampaignsSteps,
      forOrganizationsStepLabels, forOrganizationsSteps,
      forVoterStepLabels, forVoterSteps,
      selectedCategoryIndex } = this.state;
    const { selectedStepIndex } = this.state;
    let currentSlides;
    let helmetTitle;
    let simulatedPathname = '/how';
    let stepLabels;
    if (selectedCategoryIndex === 2) {
      currentSlides = forCampaignsSteps;
      helmetTitle = 'How We Vote Works for Campaigns';
      simulatedPathname = '/how/for-campaigns';
      stepLabels = forCampaignsStepLabels;
    } else if (selectedCategoryIndex === 1) {
      currentSlides = forOrganizationsSteps;
      helmetTitle = 'How We Vote Works for Organizations';
      simulatedPathname = '/how/for-organizations';
      stepLabels = forOrganizationsStepLabels;
    } else {
      currentSlides = forVoterSteps;
      helmetTitle = 'How We Vote Works for Voters';
      simulatedPathname = '/how/for-voters';
      stepLabels = forVoterStepLabels;
    }
    // console.log('HowItWorks, selectedStepIndex: ', selectedStepIndex);

    return this.props.inModal ? (
      <>
        <AnnotatedSlideshow
          inModal
          slides={currentSlides}
          selectedStepIndex={selectedStepIndex}
          onChangeSlide={this.handleChangeSlide}
        />
        {
          selectedStepIndex === (stepLabels.length - 1) && (
            <TwoButtonsWrapper>
              <BackButtonWrapper>
                <Button
                  classes={{ root: classes.nextButtonRoot }}
                  id="howItWorksBackDesktopButton"
                  color="primary"
                  fullWidth
                  onClick={() => this.handleChangeSlideGoBack()}
                  variant="outlined"
                >
                  Back
                </Button>
              </BackButtonWrapper>
              <NextButtonWrapper>
                <Button
                  classes={{ root: classes.getStartedButtonRoot }}
                  id="howItWorksGetStartedDesktopButton"
                  color="primary"
                  variant="contained"
                  onClick={() => this.howItWorksGetStarted()}
                >
                  Get Started
                </Button>
              </NextButtonWrapper>
            </TwoButtonsWrapper>
          )
        }
      </>
    ) : (
      <Wrapper padTop={cordovaScrollablePaneTopPadding()}>
        <Helmet title={helmetTitle} />
        <WelcomeAppbar pathname={simulatedPathname} />
        <Header>
          <Container>
            <Title>How it Works</Title>
            <DesktopView>
              <HeaderSwitch
                color="white"
                choices={['For Voters', 'For Organizations', 'For Campaigns']}
                selectedCategoryIndex={selectedCategoryIndex}
                switchToDifferentCategoryFunction={this.switchToDifferentCategoryFunction}
              />
            </DesktopView>
            <MobileTabletView margin={isCordova()}>
              <StepsChips onSelectStep={this.handleChangeSlide} selected={selectedStepIndex} chips={stepLabels} mobile />
            </MobileTabletView>
          </Container>
        </Header>
        <Section>
          <DesktopView>
            <StepsChips onSelectStep={this.handleChangeSlide} selected={selectedStepIndex} chips={stepLabels} />
          </DesktopView>
          <AnnotatedSlideshow
            slides={currentSlides}
            selectedStepIndex={selectedStepIndex}
            onChangeSlide={this.handleChangeSlide}
          />
          {
            selectedStepIndex === stepLabels.length - 1 && (
              <TwoButtonsWrapper>
                <BackButtonWrapper className="u-show-mobile-tablet">
                  <Button
                    classes={{ root: classes.nextButtonRoot }}
                    id="howItWorksBackMobileButton"
                    color="primary"
                    fullWidth
                    onClick={() => this.handleChangeSlideGoBack()}
                    variant="outlined"
                  >
                    Back
                  </Button>
                </BackButtonWrapper>
                <NextButtonWrapper>
                  <Button
                    classes={{ root: classes.getStartedButtonRoot }}
                    id="howItWorksGetStartedMobileButton"
                    color="primary"
                    variant="contained"
                    onClick={() => this.howItWorksGetStarted()}
                  >
                    Get Started
                  </Button>
                </NextButtonWrapper>
              </TwoButtonsWrapper>
            )
          }
        </Section>
        <WelcomeFooter />
      </Wrapper>
    );
  }
}

const styles = ({
  getStartedButtonRoot: {
    width: '100%',
  },
});

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
  padding-top: ${({ padTop }) => padTop};
`;

const Section = styled.div`
  background: white;
  display: flex;
  flex-flow: column;
  width: 960px;
  max-width: 90%;
  padding-bottom: 2em;
`;

const DesktopView = styled.div`
  display: inherit;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const MobileTabletView = styled.div`
  display: inherit;
  margin-top: ${({ marginTop }) => marginTop || '-11px'};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

const TwoButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: space-between;
  }
`;

const BackButtonWrapper = styled.div`
  margin: 0;
  margin-right: 12px;
  width: 100%;
  @media(max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-right: 8px;
  }
`;

const NextButtonWrapper = styled.div`
  margin: 0;
  margin-right: 0;
  width: 50%;
  @media(max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-right: 8px;
    width: 100%;
  }
`;

export default withStyles(styles)(HowItWorks);
