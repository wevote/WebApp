import styled, { css } from 'styled-components';

export const BottomActionButtonWrapper = styled('div')`
  margin-top: 4px;
`;

export const CampaignActionButtonsWrapper = styled('div')`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 166px;
  justify-content: flex-end;
  // width: 100%;
  // width: 300px;
`;

export const CandidateCardForListWrapper = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  ${limitCardWidth ? 'width: 315px;' : ''}
  white-space: normal;
`));

export const CampaignsNotAvailableToShow = styled('div')(({ theme }) => (`
  color: #555;
  // font-size: 18px;
  text-align: left;
  // margin: 0 2em 6em;
  // ${theme.breakpoints.down('md')} {
  //   font-size: 16px;
  //   margin: 0 1em 5em;
  // }
`));

export const CampaignImageDesktopSharedStyles = css`
  border-radius: 5px;
  cursor: pointer;
  margin: 0;
`;

export const CampaignImageDesktopPlaceholder = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  ${limitCardWidth ? 'height: 157px;' : 'height: 117px;'}
  align-items: center;
  background-color: #eee;
  display: flex;
  justify-content: center;
  ${limitCardWidth ? 'width: 300px;' : 'width: 224px;'}
  ${CampaignImageDesktopSharedStyles}
`));


export const CampaignImageDesktop = styled('img', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  // We don't want to set height/width here because this component is also used for very large versions of this image
  // ${limitCardWidth ? 'height: 157px;' : 'height: 117px;'}
  // ${limitCardWidth ? 'width: 300px;' : 'width: 224px;'}
  ${CampaignImageDesktopSharedStyles}
`));

export const CampaignImageMobileSharedStyles = css`
  border-radius: 5px;
  cursor: pointer;
  margin: 0;
  max-width: 100%;
`;

export const CampaignImageMobilePlaceholder = styled('div')`
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 157px;
  min-height: 150px;
  ${CampaignImageMobileSharedStyles}
`;

export const CampaignImagePlaceholderText = styled('div')`
  color: #ccc;
`;

export const CampaignImageMobile = styled('img')`
  max-height: 157px;
  ${CampaignImageMobileSharedStyles}
`;

export const ListWrapper = styled('div', {
  shouldForwardProp: (prop) => !['verticalListOn'].includes(prop),
})(({ verticalListOn }) => (`
  display: flex;
  ${verticalListOn ? 'flex-direction: row;' : 'flex-direction: column;'}
`));

export const LoadMoreItemsManuallyWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  margin-bottom: 0;
  min-width: 300px;
  @media print{
    display: none;
  }
`;

export const OneCampaignDescription = styled('div')`
  font-size: 14px;
  margin: 4px 0;
`;

// https://css-tricks.com/snippets/css/css-box-shadow/
export const OneCampaignInnerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  background-color: #fff;
  // box-shadow: 0 16px 64px -16px rgba(46,55,77,.3);
  // box-shadow: 0 0 80px -27px rgba(46,55,77,.3);
  box-shadow: 0 0 80px -16px rgba(46,55,77,.3);
  display: flex;
  ${limitCardWidth ? 'flex-direction: column-reverse;' : 'flex-direction: row;'}
  ${limitCardWidth ? 'justify-content: flex-start;' : 'justify-content: space-between;'}
  &:hover {
    box-shadow: 0 20px 50px -16px rgba(46,55,77,.7);
  }
`));

export const OneCampaignOuterWrapper = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth, theme }) => (`
  ${limitCardWidth ? 'margin-right: 15px;' : 'margin-bottom: 15px;'}
  ${limitCardWidth ? 'height: 400px;' : ''}
  // border-top: 1px solid #ddd;
  // margin-top: 15px;
  ${theme.breakpoints.up('sm')} {
    // border: 1px solid #ddd;
    // border-radius: 5px;
  }
`));

export const OneCampaignPhotoDesktopColumn = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  ${limitCardWidth ? 'height: 157px;' : 'height: 117px;'}
  margin-bottom: 0;
  ${limitCardWidth ? '' : 'margin-left: 15px;'}
  margin-top: 0;
  ${limitCardWidth ? 'width: 300px;' : 'width: 224px;'}
`));

export const OneCampaignPhotoWrapperMobile = styled('div')(({ theme }) => (`
  cursor: pointer;
  margin-bottom: 8px;
  margin-top: 8px;
  min-height: 150px;
  max-height: 157px;
  ${theme.breakpoints.down('xs')} {
    margin-top: 0;
    min-height: auto;
    width: 100%;
  }
`));

export const OneCampaignTextColumn = styled('div')`
  padding: 0 10px 10px 10px;
  // width: 100%;
`;

export const OneCampaignTitle = styled('h1')(({ theme }) => (`
  font-size: 18px;
  margin: 0;
   ${theme.breakpoints.down('sm')} {
    margin-bottom: 4px;
  }
`));

export const StartACampaignWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  min-height: 300px;
  justify-content: center;
  margin-bottom: 0;
  min-width: 300px;
  @media print{
    display: none;
  }
`;

export const SupportersActionLink = styled('span')`
  font-size: 14px;
`;

export const SupportersCount = styled('span')`
  color: #808080;
  font-weight: 600 !important;
  font-size: 14px;
`;

export const SupportersWrapper = styled('div')`
  margin-bottom: 6px;
`;
