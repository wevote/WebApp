import styled from 'styled-components';
import { Button } from '@material-ui/core';

const ButtonLeft = styled.div`
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
`;

const ButtonText = styled.div`
  font-size: 14px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 12px;
  }
`;

const Card = styled.div`
  padding: 16px;
  padding-left: 82px;
  position: relative;
  ::after {
    content: "";
    display: block;
    position: absolute;
    background: ${props => (props.completed ? 'rgb(31,192,111)' : '#bed1fb')};
    width: 4px;
    z-index: 0;
    height: calc(100% - 32px);
    left: 39px;
    top: 16px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-left: 58px;
    ::after {
      left: 29px;
    }
  }
`;

const Icon = styled.div`
  align-items: center;
  background: ${props => (props.completed ? 'rgb(31,192,111)' : '#bed1fb')};
  border-radius: 50px;
  display: flex;
  position: absolute;
  left: 16px;
  top: 16px;
  z-index: 999;
  height 100%;
  width: fit-content;
  width: 50px;
  height: 50px;
  justify-content: center;
  svg, path, * {
    color: white;
    width: 35px !important;
    display: block !important;
    height: 35px !important;
    font-size: 35px !important;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 30px;
    height: 30px;
    svg, path, * {
      width: 25px !important;
      height: 25px !important;
      font-size: 25px !important;
    }
  }
`;

const Hexagon = styled.div`
  position: relative;
  width: 50px;
  height: 28.87px;
  background-color: #bed1fb;
  margin: 14.43px 0;

  ::before,
  ::after {
    content: "";
    position: absolute;
    width: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
  }

  ::before {
    bottom: 100%;
    border-bottom: 14.43px solid #bed1fb;
  }

  ::after {
    top: 100%;
    width: 0;
    border-top: 14.43px solid #bed1fb;
  }
`;

const PercentComplete = styled.div`
  color: ${props => (props.completed ? 'green' : 'black')};
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 18px;
    margin-top: 0;
  }
`;

const TitleRowWrapper = styled.div`
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 12px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 18px;
    margin-top: 0;
  }
`;

const SubTitle = styled.small`
  margin: 0;
  font-size: 16px;
  color: #555;
`;

const StyledButton = styled(Button)`
  border: 1.5px solid ${props => (props.completed ? 'rgb(31,192,111)' : '#ddd')} !important;
  padding: 8px 12px !important;
  margin-top: 12px !important;
  border-radius: 5px !important;
  ${props => (props.completed ? '' : 'font-weight: bold !important;')}
  font-size: 16px !important;
  width: 100% !important;
  color: ${props => (props.completed ? 'rgb(31,192,111)' : 'inherit')} !important;
  .MuiButton-label {
    width: 100% !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: ${props => (props.completed || props.withoutSteps ? 'flex-start' : 'space-between')} !important;
  }
  :hover {
    background: #f7f7f7 !important;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 8px 8px !important;
  }
`;

const StyledCheckbox = styled.div`
  width: 20px;
  height: 20px;
  background: transparent;
  border-radius: 40px;
  margin: 0;
  margin-right: 12px;
  border: 1.5px solid #ddd;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-right: 8px;
  }
`;

const StyledCheckboxCompleted = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50px;
  margin: 0;
  margin-right: 12px;
  margin-top: -5px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-right: 8px;
  }
`;

export {
  ButtonLeft, ButtonText, Card, Hexagon, Icon, PercentComplete, StyledButton, StyledCheckbox, StyledCheckboxCompleted, SubTitle, Title, TitleRowWrapper,
};

