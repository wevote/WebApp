import React from 'react';
import styled from 'styled-components';
import HeartFavoriteToggleBase from '../components/Widgets/HeartFavoriteToggle/HeartFavoriteToggleBase';

export default {
  title: 'Design System/Inputs',
  component: HeartFavoriteToggleBase,
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

// const counterHandler = () => {
//   let counter = 2340;
//   counter += 1;
//   console.log(counter, 'counter');
//   return counter;
// };

export const Like = () => (
  <Container>
    {/* <HeartFavoriteToggleBase onClick={counterHandler} counter={counterHandler} /> */}
    <HeartFavoriteToggleBase />
  </Container>
);
