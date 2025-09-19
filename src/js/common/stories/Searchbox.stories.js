import React from 'react';
import styled from 'styled-components';
import SearchBase from '../components/Search/SearchBase';

export default {
  title: 'Design System/Inputs',
  component: SearchBase,
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
    <SearchBase placeholder="Search by name or office" />
  </Container>
);
