import styled from 'styled-components';

export const CampaignDescription = styled('div')`
  font-size: 16px;
  line-height: 1.1;
  text-align: left;
  white-space: pre-wrap;
`;

export const CampaignDescriptionDesktop = styled('div')`
  font-size: 16px;
  line-height: 1.1;
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

export const Comment = styled('div')`
  font-size: 18px;
  margin: 0;
  // From MostRecentCampaignSupport
  // color: #999;
  // font-size: 14px;
  // margin: 0;
`;

export const CommentName = styled('span')`
  color: #808080;
  font-weight: 500 !important;
`;

export const CommentNameTwitterFollowers = styled('div')`
  white-space: nowrap;
`;

export const CommentNameOuterWrapper = styled('div')`
  color: #999;
  display: flex;
  font-size: 12px;
  justify-content: start;
  width: 100%;
  flex-wrap: wrap;
`;

export const CommentNameWithTimeWrapper = styled('div')`
  // white-space: nowrap;
`;

export const CommentNameWrapper = styled('div')`
  color: #999;
  font-size: 12px;
`;

export const CommentsListWrapper = styled('div')(({ theme }) => (`
  margin-bottom: 25px;
  ${theme.breakpoints.down('md')} {
    margin: 0 10px 25px 10px;
  }
`));

export const CommentTextInnerWrapper = styled('div')`
  white-space: pre-wrap;
`;

export const CommentTextWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  // margin-top: 5px;
`;

export const CommentVoterPhotoWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  margin-right: 6px;
  min-width: 48px;
`;

export const CommentWrapper = styled('div')`
  border-radius: 10px;
  border-top-left-radius: 0;
  display: flex;
  justify-content: flex-start;
  margin: 8px 0;
  width: 100%;
`;

export const DetailsSectionDesktopTablet = styled('div')`
  display: flex;
  flex-flow: column;
`;

export const DetailsSectionMobile = styled('div')`
  display: flex;
  flex-flow: column;
`;

export const OneCampaignInnerWrapper = styled('div')(({ theme }) => (`
  margin: 15px 0;
  ${theme.breakpoints.up('sm')} {
    display: flex;
    justify-content: space-between;
    margin: 15px;
  }
`));

export const OneCampaignOuterWrapper = styled('div')(({ theme }) => (`
  border-top: 1px solid #ddd;
  margin-top: 15px;
  ${theme.breakpoints.up('sm')} {
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`));

export const ReadMoreSpan = styled('div')`
  color: #4371cc;
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

export const SupportButtonFooterWrapperAboveFooterButtons = styled('div')`
  position: fixed;
  width: 100%;
  bottom: 55px;
  display: block;
`;

export const SupportButtonPanel = styled('div')`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;
