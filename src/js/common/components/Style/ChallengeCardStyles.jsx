import styled, { css } from 'styled-components';
import DesignTokenColors from './DesignTokenColors';

export const ChallengeCardForListWrapper = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  ${limitCardWidth ? 'width: 290px;' : ''}
  white-space: normal;
`));

export const ChallengesNotAvailableToShow = styled('div')(({ theme }) => (`
  color: #555;
  // font-size: 18px;
  text-align: left;
  // margin: 0 2em 6em;
  // ${theme.breakpoints.down('md')} {
  //   font-size: 16px;
  //   margin: 0 1em 5em;
  // }
`));

export const ChallengeImageDesktopSharedStyles = css`
  cursor: pointer;
  margin: 0;
`;

export const ChallengeImageDesktopPlaceholder = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth', 'profileImageBackgroundColor', 'useVerticalCard'].includes(prop),
})(({ limitCardWidth, profileImageBackgroundColor, useVerticalCard }) => (`
  align-items: center;
  background-color: ${profileImageBackgroundColor ||  DesignTokenColors.neutralUI50};
  ${useVerticalCard ? `border: 1px solid ${DesignTokenColors.neutralUI100};` : ''}
  ${useVerticalCard ? 'border-radius: 12px;' : ''}
  display: flex;
  ${limitCardWidth ? 'height: 157px;' : `${useVerticalCard ? 'height: 200px;' : 'height: 117px;'}`}
  ${limitCardWidth ? 'min-height: 157px;' : `${useVerticalCard ? 'min-height: 200px;' : 'min-height: 117px;'}`}
  justify-content: center;
  ${limitCardWidth ? 'width: 300px;' : `${useVerticalCard ? 'width: 100%;' : 'width: 224px;'}`}
  ${ChallengeImageDesktopSharedStyles}
`));

export const ChallengeImageDesktop = styled('img', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  // We don't want to set height/width here because this component is also used for very large versions of this image
  // ${limitCardWidth ? 'height: 157px;' : 'height: 117px;'}
  // ${limitCardWidth ? 'width: 300px;' : 'width: 224px;'}
  ${ChallengeImageDesktopSharedStyles}
`));

export const ChallengeImageMobileSharedStyles = css`
  cursor: pointer;
  margin: 0;
  max-width: 100%;
`;

export const ChallengeImageMobilePlaceholder = styled('div', {
  shouldForwardProp: (prop) => !['profileImageBackgroundColor', 'useVerticalCard'].includes(prop),
})(({ profileImageBackgroundColor, useVerticalCard }) => (`
  align-items: center;
  background-color: ${profileImageBackgroundColor || DesignTokenColors.neutralUI50};
  ${useVerticalCard ? `border: 1px solid ${DesignTokenColors.neutralUI100};` : ''}
  ${useVerticalCard ? 'border-radius: 12px;' : ''}
  display: flex;
  height: 157px;
  justify-content: center;
  max-height: 157px;
  min-height: 157px;
  ${ChallengeImageMobileSharedStyles}
`));

export const ChallengeImagePlaceholderText = styled('div')`
  color: ${DesignTokenColors.neutralUI400};
  margin-top: 0;
`;

export const ChallengeImageMobile = styled('img')`
  max-height: 157px;
  ${ChallengeImageMobileSharedStyles}
`;

export const ListWrapper = styled('div', {
  shouldForwardProp: (prop) => !['useVerticalCard'].includes(prop),
})(({ useVerticalCard }) => (`
  display: flex;
  ${useVerticalCard ? 'flex-direction: row;' : 'flex-direction: column;'}
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

// https://css-tricks.com/snippets/css/css-box-shadow/
export const OneChallengeInnerWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hideCardMargins', 'useVerticalCard'].includes(prop),
})(({ hideCardMargins, useVerticalCard }) => (`
  // background-color: #fff;
  ${useVerticalCard ? 'border-radius: 12px;' : ''}
  ${hideCardMargins ? '' : 'box-shadow: 0 0 80px -16px rgba(46,55,77,.3);'}
  display: flex;
  ${useVerticalCard ? 'flex-direction: column-reverse;' : 'flex-direction: row;'}
  ${useVerticalCard ? 'justify-content: flex-start;' : 'justify-content: space-between;'}
  ${hideCardMargins ? '' : '&:hover { box-shadow: 0 20px 50px -16px rgba(46,55,77,.7); }'}
`));

export const OneChallengeOuterWrapper = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth'].includes(prop),
})(({ limitCardWidth }) => (`
  ${limitCardWidth ? 'margin-right: 15px;' : ''} // margin-bottom: 15px;
  // ${limitCardWidth ? 'height: 400px;' : ''}
`));

export const OneChallengePhotoDesktopColumn = styled('div', {
  shouldForwardProp: (prop) => !['limitCardWidth', 'profileImageBackgroundColor', 'useVerticalCard'].includes(prop),
})(({ hideCardMargins, limitCardWidth, profileImageBackgroundColor, useVerticalCard }) => (`
  align-items: center;
  ${profileImageBackgroundColor ? `background-color: ${profileImageBackgroundColor};` : 'background-color: #fff;'}
  // ${useVerticalCard ? `border: 1px solid ${DesignTokenColors.neutralUI100};` : ''}
  ${useVerticalCard ? 'border-radius: 12px;' : ''}
  display: flex;
  ${limitCardWidth ? 'height: 157px;' : `${useVerticalCard ? 'height: 200px;' : 'height: 117px;'}`}
  justify-content: center;
  ${useVerticalCard ? '' : 'margin-left: 15px;'}
  ${useVerticalCard ? `${hideCardMargins ? 'margin: 0 0 6px 0;' : 'margin: 10px 10px 6px 10px;'}` : 'margin-bottom: 0; margin-top: 0;'}
  ${limitCardWidth ? 'width: 276px;' : `${useVerticalCard ? '' : 'width: 224px;'}`}
`));

export const OneChallengePhotoWrapperMobile = styled('div')(({ theme }) => (`
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 8px;
  margin-top: 8px;
  height: 157px;
  min-height: 157px;
  max-height: 157px;
  ${theme.breakpoints.down('xs')} {
    margin-top: 0;
    min-height: auto;
    width: 100%;
  }
`));

export const OneChallengeTextColumn = styled('div', {
  shouldForwardProp: (prop) => !['hideCardMargins'].includes(prop),
})(({ hideCardMargins }) => (`
  ${hideCardMargins ? 'padding: 0;' : 'padding: 0 10px;'}
`));

export const OneChallengeTitleLink = styled('h1')(({ theme }) => (`
  font-size: 22px;
  font-weight: 400;
  margin: 20px 0 4px 0;
  ${theme.breakpoints.down('sm')} {
    // margin-bottom: 4px;
  }
`));

export const TitleAndTextWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hideCardMargins'].includes(prop),
})(({ hideCardMargins }) => (`
  ${hideCardMargins ? '' : 'height: 60px;'}
`));
