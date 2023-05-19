import styled from 'styled-components';

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
  margin-top: 40px;
`;

export const SkipForNowButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;
