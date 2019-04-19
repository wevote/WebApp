import React, { Component } from 'react';
import styled from 'styled-components';
import WelcomeAppbar from '../components/Welcome/WelcomeAppbar';
import Footer from '../components/Welcome/Footer';
import Header, { Container, Title } from '../components/Welcome/HowItWorksHeader';
import HeaderSwitch from '../components/Widgets/HeaderSwitch';
import StepsChips from '../components/Widgets/StepsChips';
import AnnotatedSlideshow from '../components/Widgets/AnnotatedSlideshow';

class HowItWorks extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedChoice: 0,
      selectedStep: 0,
      stepLabels: ['Choose', 'Follow', 'Review', 'Six Minutes', 'Friends'],
      steps: {
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
        'Six Minutes': {
          title: 'Fill the whole thing out in under six minutes',
          description: 'We Vote is fast, mobile, and helps you decide on the go.',
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

  handleChangeSlide = (selectedStep) => {
    this.setState({ selectedStep });
  }

  render () {
    const { selectedChoice, selectedStep, stepLabels, steps } = this.state;
    const step = steps[stepLabels[selectedStep]];
    return (
      <Wrapper>
        <WelcomeAppbar />
        <Header>
          <Container>
            <Title>How it Works</Title>
            <DesktopView>
              <HeaderSwitch
                color="white"
                choices={['For Voters', 'For Campaigns']}
                selected={selectedChoice}
                onSwitch={() => this.setState({ selectedChoice: selectedChoice ? 0 : 1 })}
              />
            </DesktopView>
            <MobileTabletView>
              <StepsChips selected={selectedStep} chips={stepLabels} mobile />
            </MobileTabletView>
          </Container>
        </Header>
        <Section>
          <DesktopView>
            <StepsChips selected={selectedStep} chips={stepLabels} />
          </DesktopView>
          <AnnotatedSlideshow
            slides={steps}
            index={step.index}
            onChangeSlide={this.handleChangeSlide}
          />
        </Section>
        <Footer />
      </Wrapper>
    );
  }
}

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

export default HowItWorks;
