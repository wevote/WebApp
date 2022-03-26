import { keyframes } from '@emotion/react';
import styled from '@mui/material/styles/styled';


const Title = styled('h1')(({ theme }) => (`
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

const BlueTitle = styled('span')`
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

const SubTitle = styled('h3', {
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

const Video = styled('iframe')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const PlayerContainer = styled('div')(({ theme }) => (`
  width: 640px;
  height: 360px;
  max-width: 90%;
  max-height: calc(80vw * 0.5625);
  position: relative;
  background-color: black;
  margin: 2em auto;
  -webkit-box-shadow: 0px 3px 15px 2px rgba(0,0,0,.3);
  -moz-box-shadow: 0px 3px 15px 2px rgba(0,0,0,.3);
  box-shadow: 0px 3px 15px 2px rgba(0,0,0,.3);
  ${theme.breakpoints.down('md')} {
    max-width: 75%;
    max-height: calc(60vw * 0.5625);
  }
  ${theme.breakpoints.down('sm')} {
    max-width: 90%;
    max-height: calc(80vw * 0.5625);
  }
`));

export { Title, BlueTitle, SubTitle, Video, PlayerContainer };
