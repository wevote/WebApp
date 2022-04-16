import styled from 'styled-components';

const DesktopNextButtonsInnerWrapper = styled('div')`
  align-items: center;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0;
`;

const DesktopNextButtonsOuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin: 20px 0 0 0;
  width: 100%;
`;

const MobileStaticNextButtonsInnerWrapper = styled('div')`
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 20px;
`;

const MobileStaticNextButtonsOuterWrapper = styled('div')`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

export {
  DesktopNextButtonsInnerWrapper,
  DesktopNextButtonsOuterWrapper,
  MobileStaticNextButtonsInnerWrapper,
  MobileStaticNextButtonsOuterWrapper,
};
