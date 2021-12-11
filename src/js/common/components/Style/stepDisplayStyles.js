import styled from 'styled-components';
import muiTheme from './mui-theme';

const theme = muiTheme;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
`;

export const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

export const OuterWrapperPageTitle = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0 0 0;
`;

export const OuterWrapperSteps = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0 35px;
  min-height: 34px;
  @media (max-width: ${() => theme.breakpoints.sm}) {
    margin-bottom: 25px;
  }
`;

export const OuterWrapperStepsOff = styled.div`
  margin: 0 0 35px;
  @media (max-width: ${() => theme.breakpoints.sm}) {
    margin-bottom: 25px;
  }
`;

export const PageWrapper = styled.div`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

export const PageTitle = styled.div`
  color: #808080;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
`;

export const StepCircle = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.inverseColor ? props.theme.colors.brandBlue : 'white')};
  border: 2px solid ${(props) => props.theme.colors.brandBlue};
  border-radius: 18px;
  width: 30px;
  height: 30px;
`;

export const StepCircleGray = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.inverseColor ? props.theme.colors.brandBlue : 'white')};
  border: 1px solid ${(props) => (props.inverseColor ? props.theme.colors.brandBlue : '#BEBEBE')};
  border-radius: 18px;
  width: 30px;
  height: 30px;
`;

export const StepNumber = styled.div`
  color: ${(props) => (props.inverseColor ? 'white' : props.theme.colors.brandBlue)};
  font-size: 16px;
  font-weight: 600;
  margin-top: -2px;
  @media (max-width: ${() => theme.breakpoints.sm}) {
    font-size: 14px;
  }
`;

export const StepNumberBordered = styled.div`
  background: white;
  border: 2px solid ${(props) => props.theme.colors.brandBlue};
  border-radius: 4px;
  color: ${(props) => props.theme.colors.brandBlue};
  font-size: 16px;
  font-weight: 600;
  width: 22px;
  height: 22px;
  padding-top: 1px;
  @media (max-width: ${() => theme.breakpoints.sm}) {
    font-size: 14px;
    min-width: 20px;
    width: 20px;
    height: 20px;
  }
`;

export const StepNumberPlaceholder = styled.div`
  width: 27px;
  height: 22px;
  @media (max-width: ${() => theme.breakpoints.sm}) {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }
`;

export const StepWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  width: 90px;
  @media (max-width: ${() => theme.breakpoints.sm}) {
    width: 70px;
  }
`;
