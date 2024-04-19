import React from 'react';
import styled from 'styled-components';
import HowItWorks from '../../components/CompleteYourProfile/HowItWorksWizard';

const steps = [
  {
    id: 1,
    title: 'How WeVote works',
    buttonText: '',
    completed: true,
    description: '',
    onClick: '',
    titleCanBeClicked: true,
    width: '33.33%',
  },
  {
    id: 2,
    title: 'Your personalized score',
    buttonText: '',
    completed: false,
    description: '',
    onClick: '',
    titleCanBeClicked: true,
    width: '33.33%',
  },
  {
    id: 3,
    title: 'Sign in or join to save your ballot choices/settings',
    buttonText: 'Sign up to save choices',
    completed: false,
    description: '',
    onClick: '',
    titleCanBeClicked: false,
    width: '33.33%',
  },
];

const activeStep = 1;

export default {
  title: 'Design System/CompleteYourProfile',
  component: HowItWorks,
  parameters: {
    layout: 'centered',
  },
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const HowItWorksWizard = () => (
  <Container>
    <HowItWorks steps={steps} activeStep={activeStep} />
  </Container>
);
