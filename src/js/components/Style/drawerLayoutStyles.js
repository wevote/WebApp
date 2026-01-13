import styled, { css, keyframes } from 'styled-components';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import { hasAndroidNotch } from '../../common/utils/cordovaUtils';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const DrawerHeaderAnimateDownOuterContainer = styled.div.attrs(({ scrolledDown }) => ({
  style: {
    display: scrolledDown ? 'block' : 'hidden',
  },
}))`
  width: 100%;
  background-color: #fff;
  overflow: hidden;
  position: fixed;
  z-index: 9000;
  right: 0;
  transform: translateY(${({ scrolledDown }) => (scrolledDown ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  visibility: ${({ scrolledDown }) => (scrolledDown ? 'visible' : 'hidden')};
  opacity: ${({ scrolledDown }) => (scrolledDown ? 1 : 0)};

  ${({ scrolledDown }) => scrolledDown &&
    css`
      animation: ${slideIn} 0.3s ease-out;
      border-bottom: 1px solid #aaa;
      box-shadow: ${standardBoxShadow('wide')};
    `}
`;

export const DrawerHeaderAnimateDownInnerContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

// export const DrawerHeaderContentContainer = styled('div')(({ theme }) => (`
//   margin: ${() => cordovaBallotFilterTopMargin()} auto 0 auto;
//   position: relative;
//   max-width: 960px;
//   width: 100%;
//   z-index: 0;
//   ${theme.breakpoints.down('sm')} {
//     min-height: 10px;
//     //margin: 0 10px;
//   }
// `));

export const DrawerTitle = styled('div')`
  font-weight: bold;
  margin: 0;
  text-align: left;
  padding-left: 16px;
`;

export const DrawerHeaderWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 0;
  min-height: 28px;
  padding-top: ${hasAndroidNotch() ? '40px' : ''};
`;

export const NavLinksContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-left: -16px;
  position: fixed;
  padding-top: ${hasAndroidNotch() ? '40px' : ''};
`;

export const CloseDrawerIconWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
`;
