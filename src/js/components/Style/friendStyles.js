import styled from 'styled-components';
import { isAndroidSizeMD, isAndroidSizeSM } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';

export const CancelButtonWrapper = styled('div')`
  width: fit-content;
  margin-bottom: 0;
  margin-left: 8px;
`;

export const FriendButtonsWrapper = styled('div')(({ theme }) => (`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  ${theme.breakpoints.down('sm')} {
    margin: 4px 0 0;
  }
  width: fit-content;
`));

export const FriendButtonWithStatsWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

export const FriendColumnWithoutButtons = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

export const FriendDetailsLine = styled('div')`
  // margin-top: -3px;
  width: 100%;
  @media (min-width: 400px){
    display: block;
    width: fit-content;
  }
`;

export const FriendDetailsWrapperNotInColumn = `
  @media(min-width: 400px) {
    width: fit-content;
    margin: 0;
    margin-bottom: 0;
  }
  @media (min-width: 380px) {
    margin-bottom: auto;
  }
  @media(min-width: 520px) {
    margin-bottom: 0;
  }
`;

export const FriendDetailsWrapper = isWebApp() ? styled('div', {
  shouldForwardProp: (prop) => !['inSideColumn'].includes(prop),
})(({ inSideColumn }) => (`
  margin: 0 auto;
  width: 100%;
  ${inSideColumn ? '' : FriendDetailsWrapperNotInColumn}
`)) : styled('div')`
  margin: 0 auto;
  width: 100%;
`;

export const FriendDisplayDesktopButtonsWrapper = styled('div')`
  margin-left: 24px;
`;

// When wider than sm, show Buttons to the right
// Otherwise, show Buttons under FriendColumnWithoutButtons
// If inSideColumn is true, force buttons under FriendColumnWithoutButtons regardless of screen width
export const FriendDisplayOuterWrapper = styled('div', {
  shouldForwardProp: (prop) => !['inSideColumn'].includes(prop),
})(({ inSideColumn, theme }) => (`
  // In this default, fill up the full width with both Friend info & buttons
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 12px 0 18px 0;
  position: relative;
  width: 100%;
  ${inSideColumn ? '' : (`
    ${theme.breakpoints.up('sm')} {
      align-items: flex-start;
      flex-direction: row;
      flex-flow: row nowrap;
      height: 68px;
      justify-content: flex-start;
      margin-right: 20px;
    }
  `)}
`));

export const FriendNameInSideColumn = `
  font-size: 14px;
  max-width: 16ch;
  text-align: left;
`;

export const FriendNameNotInSideColumn = `
  font-size: 18px;
`;

export const FriendName = styled('h3', {
  shouldForwardProp: (prop) => !['inSideColumn'].includes(prop),
})(({ inSideColumn }) => (`
  color: black !important;
  font-weight: bold;
  margin-bottom: 0;
  max-width: 18ch;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${inSideColumn ? FriendNameInSideColumn : FriendNameNotInSideColumn}
`));

export const InviteToWeVoteLine = styled('div')`
  margin-top: 4px;
  width: 100%;
  @media (min-width: 400px){
    display: block;
    width: fit-content;
  }
`;

export const SectionDescription = styled('div')`
  margin-bottom: 16px;
  width: fit-content;
`;

export const SectionTitle = styled('h2')`
  font-size: 18px;
  font-weight: bold;
  width: fit-content;
`;

export const ToRightOfPhotoContentBlock = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

export const ToRightOfPhotoTopRow = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ToRightOfPhotoWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

export function smallButtonIfNeeded () {
  return isAndroidSizeSM() || isAndroidSizeMD() ? { fontSize: '13px' } : {};
}
