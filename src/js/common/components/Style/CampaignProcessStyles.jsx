import styled from 'styled-components';

export const CampaignImage = styled('img', {
  shouldForwardProp: (prop) => !['noBorderRadius'].includes(prop),
})(({ noBorderRadius }) => (`
  ${noBorderRadius ? '' : 'border-radius: 5px;'}
  max-height: 324px; // Added to deal with 200x200 images
  max-width: 620px;
  min-height: 117px;
  // width: 100%; // Problematic with 200x200 images
`));

export const CampaignProcessStepIntroductionText = styled('div')(({ theme }) => (`
  color: #555;
  font-size: 16px;
  max-width: 620px;
  text-align: left;
  ${theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`));

export const CampaignProcessStepTitle = styled('div')(({ theme }) => (`
  font-size: 32px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  max-width: 620px;
  ${theme.breakpoints.down('sm')} {
    font-size: 22px;
  }
`));
