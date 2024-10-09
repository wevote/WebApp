import styled from 'styled-components';
import { isIPadMini } from '../../utils/cordovaUtils';
import { isCordova, isWebApp } from '../../utils/isCordovaOrWebApp';
import standardBoxShadow from './standardBoxShadow';


export const payToPromoteProcessStyles = () => ({
  buttonDefault: {
    boxShadow: 'none !important',
    fontSize: '14px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  buttonRoot: {
    border: '1px solid #2e3c5d',
    fontSize: 18,
    textTransform: 'none',
    width: '100%',
    color: 'black',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#0834CD',
      color: '#fff',
    },
  },
  buttonRootSelected: {
    border: '1px solid #236AC7',  // as in the Material UI example
    fontSize: 18,
    fontWeight: 600,
    textTransform: 'none',
    width: '100%',
    color: '#236AC7',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#0834CD',
      color: '#fff',
    },
  },
  buttonSimpleLink: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textDecoration: 'underline',
    textTransform: 'none',
    minWidth: 250,
    '&:hover': {
      color: '#4371cc',
      textDecoration: 'underline',
    },
  },
  textFieldRoot: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
    boxShadow: standardBoxShadow(),
  },
  textFieldInputRoot: {
    fontSize: 18,
    color: 'black',
    backgroundColor: 'white',
  },
  stripeAlertError: {
    background: 'rgb(255, 177, 160)',
    color: 'rgb(163, 40, 38)',
    boxShadow: 'none',
    pointerEvents: 'none',
    fontWeight: 'bold',
    marginBottom: 8,
    // height: 40,
    fontSize: 14,
    width: '100%',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    '@media (max-width: 569px)': {
      // height: 35,
      fontSize: 14,
    },
  },
});

export const CampaignSupportDesktopButtonPanel = styled('div')`
  background-color: #fff;
  margin-top: 8px;
`;

export const CampaignSupportDesktopButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const CampaignSupportImageWrapper = styled('div', {
  shouldForwardProp: (prop) => !['borderRadiusOnTop'].includes(prop),
})(({ borderRadiusOnTop, theme }) => (`
  align-items: center;
  background-color: #eee;
  ${borderRadiusOnTop ? `border-radius: ${borderRadiusOnTop} ${borderRadiusOnTop} 0 0;` : 'border-radius: 5px;'}
  display: flex;
  justify-content: center;
  min-height: 324px;
  ${theme.breakpoints.down('md')} {
    min-height: 279px;
  }
  ${theme.breakpoints.down('sm')} {
    min-height: 146px;
  }
`));

export const CampaignSupportImageWrapperText = styled('div')`
  color: #ccc;
`;

export const CampaignSupportMobileButtonPanel = styled('div')`
  background-color: #fff;
  margin-top: 8px;
`;

export const CampaignSupportMobileButtonWrapper = styled('div')`
  display: block;
  width: 100%;
`;

export const CampaignSupportMobileButtonFixedWrapper = styled('div')`
  bottom: 0;
  display: block;
  position: fixed;
  width: ${() => (isCordova() && !isIPadMini() ? '95%' : '100%')};
  left: ${() => (isCordova() && !isIPadMini() ? '2.5%' : '')};
`;

export const CampaignSupportSection = styled('div', {
  shouldForwardProp: (prop) => !['marginBottomOff'].includes(prop),
})(({ marginBottomOff }) => (`
  ${marginBottomOff ? '' : 'margin-bottom: 20px !important;'}
  width: 100%;
`));

export const CampaignSupportSectionWrapper = styled('div', {
  shouldForwardProp: (prop) => !['marginTopOff'].includes(prop),
})(({ marginTopOff }) => (`
  display: flex;
  justify-content: center;
  ${marginTopOff ? '' : 'margin-top: 20px;'}
  max-width: 620px;
`));

export const SkipForNowButtonPanel = styled('div')`
  background-color: #fff;
  margin-top: ${isWebApp() ? '40px' : ''};
`;

export const SkipForNowButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
  ${isCordova() ? 'padding-bottom: 16px' : ''};
`;
