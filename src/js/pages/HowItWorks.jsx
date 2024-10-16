import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import VoterActions from '../actions/VoterActions';
import { isCordova } from '../common/utils/isCordovaOrWebApp';
import { renderLog } from '../common/utils/logging';
import Header, { Container, Title } from '../components/Welcome/howItWorksHeaderStyles';
import AnnotatedSlideshow from '../components/Widgets/AnnotatedSlideshow';
import HeaderSwitch from '../components/Widgets/HeaderSwitch';
import StepsChips from '../components/Widgets/StepsChips';
import VoterConstants from '../constants/VoterConstants';
import AppObservableStore from '../common/stores/AppObservableStore';
import VoterStore from '../stores/VoterStore';
import cordovaScrollablePaneTopPadding from '../utils/cordovaScrollablePaneTopPadding';

const WelcomeAppbar = React.lazy(() => import(/* webpackChunkName: 'WelcomeAppbar' */ '../components/Navigation/WelcomeAppbar'));
const WelcomeFooter = React.lazy(() => import(/* webpackChunkName: 'WelcomeFooter' */ '../components/Welcome/WelcomeFooter'));


class HowItWorks extends Component {
  constructor (props) {
    super(props);
    this.state = {
      forCampaignsStepLabels: ['Claim', 'Import', 'Customize', 'Launch', 'Social Lift'],
      forCampaignsSteps: {
        Claim: {
          title: '1. Claim your campaign profile',
          description: 'Sign in & verify your account using your official X account or other secure method. WeVote takes verification very seriously. (No trolls allowed!)',
          imgSrc: '/img/how-it-works/HowItWorksForCampaigns-Claim-20190516.gif?',
          index: 0,
        },
        Import: {
          title: '2. Import your endorsements',
          description: 'We are here to help you get your opinions in front of voters, whether you have 5 endorsements, or 1,005. WeVote\'s unique tech instamagically captures endorsement data from your website, spreadsheets, or text lists of candidates. No formatting overhauls required.',
          imgSrc: '/img/how-it-works/HowItWorksForCampaigns-Import-20190425.gif?',
          index: 1,
        },
        Customize: {
          title: '3. Add more customizations for your supporters',
          description: 'Want all the bells and whistles?  WeVote offers a lot for free, but has paid premium features that include the endorsements from your chapters and partners, and give you deeper analytics.',
          imgSrc: '/img/how-it-works/HowItWorksForCampaigns-Customize-20190425.gif?',
          index: 2,
        },
        Launch: {
          title: '4. Launch to your people',
          description: 'Promote your unique url over your email, text, and social media channels. Add the WeVote widget directly to your campaign website.',
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
          description: 'Sign in & verify your organization using your official X account or other secure method. WeVote takes verification very seriously. (No trolls allowed!)',
          imgSrc: '/img/how-it-works/HowItWorksForOrgs-Claim-20190506.gif?',
          index: 0,
        },
        Customize: {
          title: '2. Customize your Election Center',
          description: 'Want all the bells and whistles?  WeVote offers a lot for free, but has paid premium features to help you further customize branding and messaging, and give you deeper analytics.',
          imgSrc: '/img/how-it-works/HowItWorksForOrgs-Customize-20190507.gif?',
          index: 1,
        },
        Launch: {
          title: '3. Launch',
          description: 'Share your unique url over your email, text, and social media channels. Add the WeVote widget directly to your website.',
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
          description: 'Learn from the people you trust. Their recommendations are highlighted on your ballot.',
          imgSrc: '/img/how-it-works/HowItWorksForVoters-Follow-20190507.gif?',
          index: 1,
        },
        Review: {
          title: '3. See who endorsed each choice on your ballot',
          description: 'Your personalized score for a candidate is the number of people who support the candidate, from among the people you follow.',
          imgSrc: '/img/how-it-works/HowItWorksForVoters-Review-20190401.gif?',
          index: 2,
        },
        Decide: {
          title: '4. Complete your ballot with confidence',
          description: 'WeVote is fast, mobile, and helps you decide on the go. Vote with confidence!',
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
    // console.log('how it works');
    let params = {};
    if (this.props.match) {
      const { match: { params: passedParams } } = this.props;
      params = passedParams || params;
    }
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (!this.props.inModal) {
      if (params.category_string === 'for-campaigns') {
        this.setState({
          getStartedMode: 'getStartedForCampaigns',
          // getStartedUrl: '/settings/profile',
          selectedCategoryIndex: 2,
          selectedStepIndex: 0,
        });
      } else if (params.category_string === 'for-organizations') {
        this.setState({
          getStartedMode: 'getStartedForOrganizations',
          // getStartedUrl: '/settings/profile',
          selectedCategoryIndex: 1,
          selectedStepIndex: 0,
        });
      } else {
        this.setState({
          getStartedMode: 'getStartedForVoters',
          // getStartedUrl: '/ballot',
          selectedCategoryIndex: 0,
          selectedStepIndex: 0,
        });
      }
      window.scrollTo(0, 0);
    } else {
      this.setState({
        getStartedMode: 'getStartedForVoters',
        // getStartedUrl: '/ballot',
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
    let nextParams = {};
    if (nextProps.match) {
      const { match: { params: passedParams } } = nextProps;
      nextParams = passedParams || nextParams;
    }
    if (!this.props.inModal) {
      if (nextParams.category_string === 'for-campaigns') {
        this.setState({
          getStartedMode: 'getStartedForCampaigns',
          // getStartedUrl: '/settings/profile',
          selectedCategoryIndex: 2,
          selectedStepIndex: 0,
        });
      } else if (nextParams.category_string === 'for-organizations') {
        this.setState({
          getStartedMode: 'getStartedForOrganizations',
          // getStartedUrl: '/settings/profile',
          selectedCategoryIndex: 1,
          selectedStepIndex: 0,
        });
      } else {
        this.setState({
          getStartedMode: 'getStartedForVoters',
          // getStartedUrl: '/ballot',
          selectedCategoryIndex: 0,
          selectedStepIndex: 0,
        });
      }
      window.scrollTo(0, 0);
    } else {
      this.setState({
        getStartedMode: 'getStartedForVoters',
        // getStartedUrl: '/ballot',
        selectedCategoryIndex: 0,
        // Commented line 211 which seems to be causing users who visit the How It Works modal for the first time to experience a glitch when moving from the first slide to the second slide.
        // selectedStepIndex: 0,
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
    const minimumStepIndexForCompletion = 1; // Was 2, but even opening it should get rid of the tickler
    if (!howItWorksWatched && selectedStepIndex >= minimumStepIndexForCompletion) {
      // Mark this, so we know to show 'How it Works' as completed
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
    // let getStartedUrl = '/ballot';
    if (selectedCategoryIndex === 1) {
      getStartedMode = 'getStartedForOrganizations';
      // getStartedUrl = '/settings/profile';
    } else if (selectedCategoryIndex === 2) {
      getStartedMode = 'getStartedForCampaigns';
      // getStartedUrl = '/settings/profile';
    }
    this.setState({
      getStartedMode,
      // getStartedUrl,
      selectedCategoryIndex: selectedCategoryIndex || 0,
      selectedStepIndex: 0,
    });
  };

  howItWorksGetStarted () {
    const { getStartedMode, howItWorksWatched, voter } = this.state;
    let isSignedIn = false;
    if (voter) {
      ({ is_signed_in: isSignedIn } = voter);
      isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;
    }
    if (!howItWorksWatched) {
      // Mark this, so we know to show 'How it Works' as completed
      VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.HOW_IT_WORKS_WATCHED);
    }
    if (isSignedIn) {
      // historyPush(getStartedUrl); // Not redirecting at this time. For user testing.
      AppObservableStore.setShowHowItWorksModal(false);
    } else {
      AppObservableStore.setGetStartedMode(getStartedMode);
      AppObservableStore.setShowHowItWorksModal(false);
      AppObservableStore.setShowSignInModal(true);
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
    let simulatedPathname;
    let stepLabels;
    if (selectedCategoryIndex === 2) {
      currentSlides = forCampaignsSteps;
      helmetTitle = 'How WeVote Works for Campaigns';
      simulatedPathname = '/how/for-campaigns';
      stepLabels = forCampaignsStepLabels;
    } else if (selectedCategoryIndex === 1) {
      currentSlides = forOrganizationsSteps;
      helmetTitle = 'How WeVote Works for Organizations';
      simulatedPathname = '/how/for-organizations';
      stepLabels = forOrganizationsStepLabels;
    } else {
      currentSlides = forVoterSteps;
      helmetTitle = 'How WeVote Works for Voters';
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
            <HowItWorksTwoButtonsWrapper>
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
            </HowItWorksTwoButtonsWrapper>
          )
        }
      </>
    ) : (
      <Wrapper id="HowItWorks_Wrapper">
        <Helmet title={helmetTitle} />
        <Suspense fallback={<></>}>
          <WelcomeAppbar pathname={simulatedPathname} id="HowItWorks_WelcomeAppbar" />
        </Suspense>
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
            <MobileTabletView>
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
              <HowItWorksTwoButtonsWrapper>
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
              </HowItWorksTwoButtonsWrapper>
            )
          }
        </Section>
        <Suspense fallback={<></>}>
          <WelcomeFooter />
        </Suspense>
      </Wrapper>
    );
  }
}
HowItWorks.propTypes = {
  classes: PropTypes.object,
  inModal: PropTypes.bool,
  match: PropTypes.object,
};

const styles = ({
  getStartedButtonRoot: {
    width: '100%',
  },
});

const Wrapper = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: white;
  overflow-x: hidden;
  padding-top: ${cordovaScrollablePaneTopPadding()};
`;

const Section = styled('div')`
  background: white;
  display: flex;
  flex-flow: column;
  width: 960px;
  max-width: 90%;
  padding-bottom: 2em;
`;

const DesktopView = styled('div')(({ theme }) => (`
  display: inherit;
  ${theme.breakpoints.down('lg')} {
    display: none;
  }
`));

const MobileTabletView = styled('div')(({ theme }) => (`
  display: inherit;
  margin-top: ${isCordova() ? '' : '-11px'};
  ${theme.breakpoints.up('lg')} {
    display: none;
  }
`));

const HowItWorksTwoButtonsWrapper = styled('div')(({ theme }) => (`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0 0 0;
  width: 100%;
  ${theme.breakpoints.down('lg')} {
    justify-content: space-between;
  }
`));

const BackButtonWrapper = styled('div')(({ theme }) => (`
  margin: 0 12px 0 0;
  width: 100%;
  // ${theme.breakpoints.down('lg')} {
  //   margin-right: 8px;
  // }
`));

const NextButtonWrapper = styled('div')(({ theme }) => (`
  margin: 0;
  width: 100%;
  // ${theme.breakpoints.down('lg')} {
  //   margin-right: 8px;
  // }
`));

export default withStyles(styles)(HowItWorks);
