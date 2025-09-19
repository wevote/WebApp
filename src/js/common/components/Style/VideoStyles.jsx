import styled from 'styled-components';

export const Video = styled('iframe')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const PlayerContainer = styled('div')(({ theme }) => (`
  width: 640px;
  height: 360px;
  max-width: 90%;
  max-height: calc(80vw * 0.5625);
  position: relative;
  background-color: black;
  margin: 1em auto;
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
