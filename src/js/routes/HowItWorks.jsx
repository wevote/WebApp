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
      stepLabels: ['Choose', 'Follow', 'Review', 'Six Minutes', 'Share'],
      steps: {
        Choose: {
          title: 'Choose your interests',
          description: 'Follow topics that interest you. We will suggest endorsements based on your interests.',
          imgSrc: '/img/global/intro-story/FollowValues-20190401.gif',
        },
        Follow: {
          title: 'Follow organizations and people you trust',
          description: 'As you follow trusted organizations and people you know, their recommendations are added to your ballot.',
          imgSrc: '/img/global/intro-story/FollowOrganizations-20190401.gif',
        },
      },
    };
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
            <HeaderSwitch
              color="white"
              choices={['For Voters', 'For Campaigns']}
              selected={selectedChoice}
              onSwitch={() => this.setState({ selectedChoice: selectedChoice ? 0 : 1 })}
            />
          </Container>
        </Header>
        <Section>
          <StepsChips selected={selectedStep} chips={stepLabels} />
          <AnnotatedSlideshow title={step.title} description={step.description} imgSrc={step.imgSrc} />
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

export default HowItWorks;
