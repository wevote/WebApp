import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Divider = styled('div')`
  width: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 .3em;
  padding: 12px 0;
`;

const LogoContainer = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('md')} {
    width: 100px;
  }
`));

const MobileNavDivider = styled('div')`
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin: .6em 0;
`;

const MobileNavigationMenu = styled('div')`
  position: absolute;
  left: -32px;
  top: 0;
  display: flex;
  flex-flow: column;
  width: calc(100vw + 32px);
  height: 120vh;
  background: rgba(0, 0, 0, .9);
  padding: 16px 32px 16px 48px;
  transition: all 150ms ease-in;
`;

const Navigation = styled('div')`
  display: flex;
  flex-flow: row;
  color: white;
`;

const NavLink = styled(Link)(({ theme }) => (`
  text-transform: uppercase;
  font-size: 14px;
  color: white !important;
  margin: auto 1em;
  ${theme.breakpoints.down('lg')} {
    margin: auto .4em;
    margin-left: 0;
    font-size: 12px;
  }
`));

const NavNonLink = styled('div')(({ theme }) => (`
  color: white !important;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 14px;
  margin: auto 1em;
  &:hover {
    text-decoration: underline;
  }
  ${theme.breakpoints.down('lg')} {
    margin: auto .4em;
    margin-left: 0;
    font-size: 12px;
  }
`));

const NavRow = styled('div')`
  display: flex;
  height: 32px;
  justify-content: space-between;
`;

export { Divider, LogoContainer, MobileNavDivider, MobileNavigationMenu, Navigation, NavLink, NavNonLink, NavRow };

