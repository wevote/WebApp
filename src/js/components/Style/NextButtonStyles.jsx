import styled from 'styled-components';

const DesktopNextButtonsInnerWrapper = styled('div')`
  align-items: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0;
`;

const DesktopNextButtonsOuterWrapperUShowDesktopTablet  = styled('div', {
  shouldForwardProp: (prop) => !['breakValue'].includes(prop),
})(({ breakValue, theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: '20px 0 0 0',
  width: '100%',
  [theme.breakpoints.down(breakValue)]: {
    display: 'none !important',
  },
}));

const MobileStaticNextButtonsInnerWrapper = styled('div')`
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 20px;
`;

const MobileStaticNextButtonsOuterWrapperUShowMobile   = styled('div', {
  shouldForwardProp: (prop) => !['breakValue'].includes(prop),
})(({ breakValue, theme }) => ({
  position: 'fixed',
  width: '100%',
  bottom: 0,
  display: 'block',
  [theme.breakpoints.up(breakValue)]: {
    display: 'none !important',
  },
}));

export {
  DesktopNextButtonsInnerWrapper,
  DesktopNextButtonsOuterWrapperUShowDesktopTablet,
  MobileStaticNextButtonsInnerWrapper,
  MobileStaticNextButtonsOuterWrapperUShowMobile,
};
