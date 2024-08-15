import React, { useEffect } from 'react';
import styled from 'styled-components';
import HowItWorks from '../../components/CompleteYourProfile/HowItWorksWizard';
import { action } from '@storybook/addon-actions';

const steps = [
  {
    id: 1,
    title: 'How WeVote works',
    buttonText: '',
    completed: false,
    description: '',
    onClick: (event) => action(event),
    titleCanBeClicked: true,
    width: '33.33%',
  },
  {
    id: 2,
    title: 'Your personalized score',
    buttonText: '',
    completed: false,
    description: '',
    onClick: action('Step 2 Clicked'),
    titleCanBeClicked: true,
    width: '33.33%',
  },
  {
    id: 3,
    title: 'Sign in or join to save your ballot choices/settings',
    buttonText: 'Sign up to save choices',
    completed: false,
    description: '',
    onClick: action('Step 3 Clicked'),
    titleCanBeClicked: false,
    width: '33.33%',
  },
];

// const activeStep = 1;

export default {
  title: 'Design System/CompleteYourProfile',
  component: HowItWorks,
  parameters: {
    layout: 'centered',
  },
  // argType: {
  //   steps: { control: 'select' },
  //   activeStep: { 
  //     options: [1, 2, 3],
  //     control: { type: 'select' },
  //    },
  // },
  argTypes: {
    activeStep: {
      options: steps.map((step) => step.id),
      control: { type: 'radio' },
      description: 'Select which step is active',
      onClick: action('Step Clicked'),
    },
  },
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const HowItWorksWizard = (args) => {
  useEffect(() => {
    action(`Active Step Changed to: ${args.activeStep}`)();
  }, [args.activeStep]);

  return (
    <Container>
      <HowItWorks steps={steps} activeStep={args.activeStep} {...args}/>
    </Container>
  );
};

HowItWorksWizard.args = {
  steps: steps,
  activeStep: 1,
};
