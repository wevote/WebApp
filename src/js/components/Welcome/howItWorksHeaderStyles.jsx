import styled from 'styled-components';

const Header = styled('div')`
  position: relative;
  width: 100%;
  color: white;
  background-image: linear-gradient(to bottom, #415a99, #2d3b5e);
  padding: 0 2em;
  margin-top: -72px;
  display: flex;
  flex-flow: row;
  padding-top: 84px;
  justify-content: center;
`;
export default Header;

export const Container = styled('div')(({ theme }) => (`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  width: 960px;
  padding-bottom: 1em;
  height: 48px;
  ${theme.breakpoints.down('lg')} {
    margin: 0 -1em;
  }
`));

export const Title = styled('h3')(({ theme }) => (`
  font-size: 24px;
  font-weight: bold;
  ${theme.breakpoints.down('lg')} {
    font-size: 18px;
    margin: auto 0;
  }
`));
