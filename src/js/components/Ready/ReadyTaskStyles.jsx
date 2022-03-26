import { Button } from '@mui/material';
import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';

const ButtonLeft = styled('div')`
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
`;

const ButtonText = styled('div')(({ theme }) => (`
  font-size: 14px;
  ${theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`));

const ReadyCard = styled('div', {
  shouldForwardProp: (prop) => !['showProgressColor'].includes(prop),
})(({ showProgressColor, theme }) => (`
  padding: 16px;
  padding-left: 82px;
  position: relative;
  min-height: 205px;
  ${() => (isCordova() ? { marginTop: '8px' } : {})};  // Might be needed for WebApp too...
  ${theme.breakpoints.down('sm')} {
    min-height: 10px;
  }
  ::after {
    content: "";
    display: block;
    position: absolute;
    background: ${showProgressColor ? 'rgb(31,192,111)' : '#bed1fb'};
    width: 4px;
    z-index: 0;
    height: calc(100% - 32px);
    left: 39px;
    top: 16px;
  }
  ${theme.breakpoints.down('sm')} {
    padding-left: 58px;
    ::after {
      left: 29px;
    }
  }
`));

const Icon = styled('div')(({ theme }) => (`
  align-items: center;
  border-radius: 50px;
  display: flex;
  position: absolute;
  left: 16px;
  top: 16px;
  z-index: 999;
  width: 50px;
  height: 50px;
  justify-content: center;
  ${theme.breakpoints.down('sm')} {
    width: 30px;
    height: 30px;
  }
`));

const PercentComplete = styled('div', {
  shouldForwardProp: (prop) => !['showProgressColor'].includes(prop),
})(({ showProgressColor, theme }) => (`
  color: ${showProgressColor ? 'green' : 'black'};
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 12px;
  ${theme.breakpoints.down('sm')} {
    font-size: 18px;
    margin-top: 0;
  }
`));

const TitleRowWrapper = styled('div')`
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
`;

const Title = styled('h3')(({ theme }) => (`
  margin: 0;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 12px;
  ${theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-top: 0;
  }
  ${theme.breakpoints.down('xs')} {
    font-size: 20px;
    margin-top: 0;
  }
`));

const SubTitle = styled('small')`
  margin: 0;
  font-size: 16px;
  color: #555;
`;

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => !['completed', 'withoutsteps'].includes(prop),
})(({ completed, withoutsteps, theme }) => (`
  border: 1.5px solid ${completed ? 'rgb(31,192,111)' : '#ddd'} !important;
  padding: 8px 12px !important;
  margin-top: 12px !important;
  border-radius: 5px !important;
  ${completed ? '' : 'font-weight: bold !important;'}
  font-size: 16px !important;
  width: 100% !important;
  color: ${completed ? 'rgb(31,192,111)' : 'inherit'} !important;
  .MuiButton-label {
    width: 100% !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: ${withoutsteps ? 'flex-start' : 'space-between'} !important;
  }
  :hover {
    background: #f7f7f7 !important;
  }
  ${theme.breakpoints.down('sm')} {
    padding: 8px 8px !important;
  }
`));

const StyledCheckbox = styled('div')(({ theme }) => (`
  width: 20px;
  height: 20px;
  background: transparent;
  border-radius: 40px;
  margin: 0;
  margin-right: 12px;
  border: 1.5px solid #ddd;
  ${theme.breakpoints.down('sm')} {
    margin-right: 8px;
  }
`));

const StyledCheckboxCompleted = styled('div')(({ theme }) => (`
  width: 25px;
  height: 25px;
  border-radius: 50px;
  margin: 0;
  margin-right: 12px;
  margin-top: -5px;
  ${theme.breakpoints.down('sm')} {
    margin-right: 8px;
  }
`));

export {
  ButtonLeft, ButtonText, Icon, PercentComplete, ReadyCard, StyledButton, StyledCheckbox, StyledCheckboxCompleted, SubTitle, Title, TitleRowWrapper,
};

