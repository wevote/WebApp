import React from 'react';
import styled from 'styled-components';
import HowItWorks from '../../components/CompleteYourProfile/CompleteYourProfile2024';

export default {
  title: 'Design System/Wizard',
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
    <HowItWorks />
  </Container>
);
