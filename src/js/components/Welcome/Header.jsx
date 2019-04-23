import styled, { keyframes } from 'styled-components';

const Header = styled.div`
  position: relative;
  height: 72vh;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 50vh;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 50vh;
  }
`;

const HeaderForCampaigns = styled.div`
  position: relative;
  height: 32vh;
  width: 110%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  border-bottom-left-radius: 50% 25%;
  border-bottom-right-radius: 50% 25%;
  padding: 0 2em;
  margin-top: -72px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    height: 28vh;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    height: 32vh;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 36px;
  text-align: center;
  margin-top: 3em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 28px;
    margin-top: 4em;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    margin-top: 3em;
  }
`;

const BlueTitle = styled.span`
  color: rgb(167, 231, 255);
  margin-bottom: 1em;
`;

const fadeIn = keyframes`
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

const SubTitle = styled.h3`
  font-weight: 300;
  font-size: 24px;
  text-align: center;
  visibility: ${props => (props.out ? 'hidden' : 'visible')};
  animation: ${props => (props.out ? fadeOut : fadeIn)} 300ms ease-in;
  transition: visibility 1s linear;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 20px;
  }
`;

const Video = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const PlayerContainer = styled.div`
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
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 75%;
    max-height: calc(60vw * 0.5625);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 90%;
    max-height: calc(80vw * 0.5625);
  }
`;

export { HeaderForCampaigns, Title, BlueTitle, SubTitle, Video, PlayerContainer };

export default Header;
