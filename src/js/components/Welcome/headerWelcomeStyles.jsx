import { keyframes } from '@emotion/react';
import styled from 'styled-components';

export const Title = styled('h1')(({ theme }) => (`
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-top: 3em;
  ${theme.breakpoints.down('md')} {
    font-size: 28px;
    margin-top: 4em;
  }
  ${theme.breakpoints.down('xs')} {
    margin-top: 3em;
  }
`));

export const BlueTitle = styled('span')`
  color: rgb(167, 231, 255);
  margin-bottom: 1em;
`;

const fadeIn = keyframes`  // March 2022, from @emotion/react (hope these libraries can be mixed)
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const SubTitle = styled('h3', {
  shouldForwardProp: (prop) => !['out'].includes(prop),
})(({ out, theme }) => (`
  font-weight: 300;
  font-size: 24px;
  text-align: center;
  visibility: ${out ? 'hidden' : 'visible'};
  animation: ${out ? fadeOut : fadeIn} 300ms ease-in;
  transition: visibility 1s linear;
  ${theme.breakpoints.down('md')} {
    font-size: 20px;
  }
`));
