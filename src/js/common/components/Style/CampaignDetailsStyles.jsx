import styled from 'styled-components';

export const CampaignDescription = styled('div')`
  font-size: 18px;
  text-align: left;
  white-space: pre-wrap;
`;

export const CampaignDescriptionDesktop = styled('div')`
  font-size: 18px;
  margin-top: 32px;
  text-align: left;
  white-space: pre-wrap;
`;

export const CampaignDescriptionWrapper = styled('div')`
  margin: 10px;
`;

export const CampaignDescriptionDesktopWrapper = styled('div')(({ theme }) => (`
  margin-bottom: 10px;
  margin-top: 2px;
  ${theme.breakpoints.down('md')} {
  }
`));

export const CampaignImage = styled('img')`
  width: 100%;
`;

export const CampaignImageDesktop = styled('img')`
  border-radius: 5px;
  width: 100%;
`;

export const CampaignImagePlaceholder = styled('div')(({ theme }) => (`
  background-color: #eee;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 183px;
  ${theme.breakpoints.up('sm')} {
    min-height: 174px;
  }
  ${theme.breakpoints.down('md')} {
    min-height: 239px;
  }
  ${theme.breakpoints.up('lg')} {
    min-height: 319px;
  }
`));

export const CampaignImagePlaceholderText = styled('div')`
  color: #ccc;
`;

export const CampaignImageDesktopWrapper = styled('div')(({ theme }) => (`
  margin-bottom: 10px;
  min-height: 180px;
  ${theme.breakpoints.up('sm')} {
    min-height: 174px;
  }
  ${theme.breakpoints.up('md')} {
    min-height: 239px;
  }
  ${theme.breakpoints.up('lg')} {
    min-height: 300px;
  }
`));

export const CampaignImageMobileWrapper = styled('div')(({ theme }) => (`
  min-height: 174px;
  ${theme.breakpoints.down('xs')} {
    min-height: 117px;
  }
`));

export const CampaignOwnersDesktopWrapper = styled('div')`
  margin-bottom: 8px;
`;

export const CampaignOwnersWrapper = styled('div')`
`;

export const CampaignSubSectionTitle = styled('h2')`
  font-size: 22px;
  margin: 50px 0 10px 0;
`;

export const CampaignTitleAndScoreBar = styled('div')(({ theme }) => (`
  margin: 10px;
  ${theme.breakpoints.down('md')} {
  }
`));

export const CampaignTitleDesktop = styled('h1')(({ theme }) => (`
  font-size: 28px;
  text-align: center;
  margin: 30px 20px 40px 20px;
  min-height: 34px;
  ${theme.breakpoints.down('md')} {
    font-size: 24px;
    min-height: 29px;
  }
`));

export const CampaignTitleMobile = styled('h1')`
  font-size: 22px;
  margin: 0 0 10px 0;
  min-height: 27px;
  text-align: left;
`;

export const CommentsListWrapper = styled('div')(({ theme }) => (`
  margin-bottom: 25px;
  ${theme.breakpoints.down('md')} {
    margin: 0 10px 25px 10px;
  }
`));

export const DetailsSectionDesktopTablet = styled('div')`
  display: flex;
  flex-flow: column;
`;

export const DetailsSectionMobile = styled('div')`
  display: flex;
  flex-flow: column;
`;

export const SpeakerAndPhotoOuterWrapper = styled('div')(({ theme }) => (`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  ${theme.breakpoints.down('sm')} {
    margin: 0 6px 10px 6px;
  }
`));

export const SpeakerName = styled('span')`
  // color: #808080;
  font-size: 16px;
  font-weight: 500 !important;
`;

export const SpeakerVoterPhotoWrapper = styled('div')`
  margin-right: 6px;
`;

export const SupportButtonFooterWrapper = styled('div')`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

export const SupportButtonPanel = styled('div')`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;
