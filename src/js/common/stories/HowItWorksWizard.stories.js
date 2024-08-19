import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HowItWorks from '../../components/CompleteYourProfile/HowItWorksWizard';
import { action } from '@storybook/addon-actions';

const initialSteps = [
  {
    id: 1,
    title: 'How WeVote works',
    buttonText: '',
    completed: false,
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

// const activeStep = 1;

export default {
  title: 'Design System/CompleteYourProfile',
  component: HowItWorks,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    activeStep: {
      control: { type: 'check' },
      options: initialSteps.map(step => step.id),
      description: 'Select which steps are active',
    },
    completed: {
      control: { type: 'boolean' },
      description: 'Toggle the completed status',
    },
    steps: {
      control: 'object',
      description: 'Modify the steps',
      defaultValue: initialSteps,
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: JSON.stringify(initialSteps) },
      },
      fields: {
        title: { control: 'text', description: 'Step title' },
        completed: { control: 'boolean', description: 'Step completed status' },
      },
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
  const [steps, setSteps] = useState(args.steps);
  useEffect(() => {
    setSteps(steps.map(step => ({
      ...step,
      completed: args.completed && args.activeStep.includes(step.id),
    })));
    action(`Active Step Changed to: ${args.activeStep}`)();
  }, [args.activeStep]);


  const handleStepToggle = (index) => {
    const updatedSteps = steps.map((step, i) =>
      i === index ? { ...step, completed: !step.completed } : step
    );
    setSteps(updatedSteps);
    action(`Step ${index + 1} Clicked - Completed: ${updatedSteps[index].completed}`)();
  };

  return (
    <Container>
      <HowItWorks steps={steps.map((step, i) => ({
        ...step,
        onClick: () => handleStepToggle(i),
      }))}
      activeStep={args.activeStep}/>
    </Container>
  );
};

HowItWorksWizard.args = {
  steps: initialSteps,
  activeStep: [1],
  completed: false,
};
