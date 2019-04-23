import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import WelcomeAppbar from '../components/Welcome/WelcomeAppbar';
import Footer from '../components/Welcome/Footer';
import Header, { Container, Title } from '../components/Welcome/HowItWorksHeader';
import HeaderSwitch from '../components/Widgets/HeaderSwitch';
import StepsChips from '../components/Widgets/StepsChips';
import AnnotatedSlideshow from '../components/Widgets/AnnotatedSlideshow';
import { historyPush } from '../utils/cordovaUtils';

class HowItWorks extends Component {
  static propTypes = {
    classes: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      selectedCategoryIndex: 0,
      selectedStepIndex: 0,
      forCampaignsStepLabels: ['Claim', 'Import', 'Customize', 'Launch'],
      forCampaignsSteps: {
        Claim: {
          title: 'Claim your campaign profile',
          description: 'Sign in & verify your account using your official Twitter account or other secure method. We Vote takes verification very seriously. (No trolls allowed!)',
          imgSrc: '',
          index: 0,
        },
        Import: {
          title: 'Import your endorsements',
          description: 'We are here to help you get your opinions in front of voters, whether you have 5 endorsements, or 1,005.',
          imgSrc: '',
          index: 1,
        },
        Customize: {
          title: 'Add more customizations for your supporters',
          description: 'Want all the bells and whistles?  We Vote offers a lot for free, but offers premium features as well.',
          imgSrc: '',
          index: 2,
        },
        Launch: {
          title: 'Launch to your people!',
          description: 'Promote your unique url over your email, text, and social media channels. Add the We Vote widget directly to your campaign website. Watch your social lift in real time.',
          imgSrc: '',
          index: 3,
        },
      },
      forOrganizationsStepLabels: ['Claim', 'Customize', 'Launch'],
      forOrganizationsSteps: {
        Claim: {
          title: 'Claim your organization profile',
          description: 'Sign in & verify your account using your official Twitter account or other secure method. We Vote takes verification very seriously. (No trolls allowed!)',
          imgSrc: '',
          index: 0,
        },
        Customize: {
          title: 'Customize your Election Center',
          description: 'Want all the bells and whistles?  We Vote offers a lot for free, but offers premium features as well to help you further customize branding and messaging.',
          imgSrc: '',
          index: 1,
        },
        Launch: {
          title: 'Launch!',
          description: 'Promote your unique url over your email, text, and social media channels. Add the We Vote widget directly to your campaign website. Watch your social lift in real time.',
          imgSrc: '',
          index: 2,
        },
      },
      forVoterStepLabels: ['Choose', 'Follow', 'Review', 'Decide', 'Friends'],
      forVoterSteps: {
        Choose: {
          title: 'Choose your interests',
          description: 'Follow topics that interest you. We will suggest endorsements based on your interests.',
          imgSrc: '/img/global/intro-story/FollowValues-20190401.gif',
          index: 0,
        },
        Follow: {
          title: 'Follow organizations and people you trust',
          description: 'As you follow trusted organizations and people you know, their recommendations are added to your ballot.',
          imgSrc: '/img/global/intro-story/FollowOrganizations-20190401.gif',
          index: 1,
        },
        Review: {
          title: 'See who endorsed each choice on your ballot',
          description: 'Learn from the people you trust.',
          imgSrc: '/img/global/intro-story/CandidateScore-20190401.gif',
          index: 2,
        },
        Decide: {
          title: 'Fill the whole thing out in under six minutes',
          description: 'We Vote is fast, mobile, and helps you decide on the go. Vote with confidence!',
          imgSrc: '/img/global/intro-story/Decide-20190401.gif',
          index: 3,
        },
        Friends: {
          title: 'Share with friends who could use a guide',
          description: 'Are your family and friends feeling lost when it’s time to vote? Be their hero.',
          imgSrc: '/img/global/intro-story/ShareWithFriends-20190401.gif',
          index: 4,
        },
      },
    };
  }

  componentDidMount () {
    if (this.props.params.category_string === 'for-campaigns') {
      this.setState({
        selectedCategoryIndex: 2,
        selectedStepIndex: 0,
      });
    } else if (this.props.params.category_string === 'for-organizations') {
      this.setState({
        selectedCategoryIndex: 1,
        selectedStepIndex: 0,
      });
    } else {
      this.setState({
        selectedCategoryIndex: 0,
        selectedStepIndex: 0,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.category_string === 'for-campaigns') {
      this.setState({
        selectedCategoryIndex: 2,
        selectedStepIndex: 0,
      });
    } else if (nextProps.params.category_string === 'for-organizations') {
      this.setState({
        selectedCategoryIndex: 1,
        selectedStepIndex: 0,
      });
    } else {
      this.setState({
        selectedCategoryIndex: 0,
        selectedStepIndex: 0,
      });
    }
  }

  handleChangeSlide = (selectedStepIndex) => {
    this.setState({ selectedStepIndex });
  }

  switchToDifferentCategoryFunction = (selectedCategoryIndex) => {
    this.setState({
      selectedCategoryIndex: selectedCategoryIndex || 0,
      selectedStepIndex: 0,
    });
  }

  render () {
    const { classes } = this.props;
    const { forCampaignsStepLabels, forCampaignsSteps,
      forOrganizationsStepLabels, forOrganizationsSteps,
      forVoterStepLabels, forVoterSteps,
      selectedCategoryIndex } = this.state;
    const { selectedStepIndex } = this.state;
    let currentSlides;
    let simulatedPathname = '/how';
    let stepLabels;
    if (selectedCategoryIndex === 2) {
      currentSlides = forCampaignsSteps;
      simulatedPathname = '/how/for-campaigns';
      stepLabels = forCampaignsStepLabels;
    } else if (selectedCategoryIndex === 1) {
      currentSlides = forOrganizationsSteps;
      simulatedPathname = '/how/for-organizations';
      stepLabels = forOrganizationsStepLabels;
    } else {
      currentSlides = forVoterSteps;
      simulatedPathname = '/how/for-voters';
      stepLabels = forVoterStepLabels;
    }
    // console.log('HowItWorks, selectedStepIndex: ', selectedStepIndex);

    return (
      <Wrapper>
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
              <MobileTabletView>
                <Button
                  classes={{ root: classes.getStartedButtonRoot }}
                  color="primary"
                  variant="contained"
                  onClick={() => historyPush('/ballot')}
                >
                  Get Started
                </Button>
              </MobileTabletView>
            )
          }
        </Section>
        <Footer />
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
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export default withStyles(styles)(HowItWorks);
