import React from 'react';
import styled from 'styled-components';
import BaseSearchbox from '../../components/Search/BaseSearchbox';

export default {
  title: 'Design System/Inputs',
  component: BaseSearchbox,
  parameters: {
    layout: 'centered',
  },
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 340px;
`;

export const Searchbox = () => (
  <Container>
    <BaseSearchbox placeholder="Search by name, office or state"/>
  </Container>
);
