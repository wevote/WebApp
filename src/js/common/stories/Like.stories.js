import React from 'react';
import styled from 'styled-components';
import BaseLike from '../../components/Like/BaseLike';

export default {
  title: 'Design System/Inputs',
  component: BaseLike,
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
    {/* <BaseLike onClick={counterHandler} counter={counterHandler} /> */}
    <BaseLike />
  </Container>
);
