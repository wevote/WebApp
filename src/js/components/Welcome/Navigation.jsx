import styled from 'styled-components';

const LogoContainer = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100px;
  }
`;

const Navigation = styled.div`
  display: flex;
  flex-flow: row;
  color: white;
`;

const NavLink = styled.a`
  text-transform: uppercase;
  font-size: 14px;
  color: white !important;
  margin: auto 1em;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: auto .4em;
    margin-left: 0;
    font-size: 12px;
  }
`;

const Divider = styled.div`
  width: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 .3em;
  padding: 12px 0;
`;

const MobileNavigationMenu = styled.div`
  position: absolute;
  left: -32px;
  top: 0;
  display: flex;
  flex-flow: column;
  width: calc(100vw + 32px);
  height: 120vh;
  background: rgba(0, 0, 0, .9);
  padding: 16px 48px;
  transition: all 150ms ease-in;
`;

const MobileNavDivider = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin: .6em 0;
`;

const NavRow = styled.div`
  display: flex;
  height: 32px;
  justify-content: space-between;
`;

export { LogoContainer, NavLink, Divider, MobileNavigationMenu, MobileNavDivider, NavRow };
export default Navigation;
