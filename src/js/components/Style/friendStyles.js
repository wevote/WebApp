import styled from '@mui/material/styles/styled';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';

const CancelButtonWrapper = styled('div')`
  width: fit-content;
  margin-bottom: 0;
  margin-left: 8px;
`;

const FriendButtonsWrapper = styled('div')`
  width: 100%;
  margin: 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const FriendColumnWithoutButtons = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const FriendDetailsLine = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  @media (min-width: 400px){
    display: block;
    width: fit-content;
  }
`;

const FriendDetailsWrapperNotInColumn = `
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

const FriendDetailsWrapper = isWebApp() ? styled('div', {
  shouldForwardProp: (prop) => !['inSideColumn'].includes(prop),
})(({ inSideColumn }) => (`
  margin: 0 auto;
  ${inSideColumn ? '' : FriendDetailsWrapperNotInColumn}
`)) : styled('div')`
  margin: 0 auto;
`;

const FriendDisplayOuterWrapperShowButtonsOnRight = `
  @media(min-width: 601px) {
    align-items: center;
    flex-direction: row;
    flex-flow: row nowrap;
    height: 68px;
    justify-content: flex-start;
    margin-right: 20px;
  }
`;

// When wider than 601px, show Buttons to the right
// Otherwise, show Buttons under FriendColumnWithoutButtons
// If inSideColumn is true, force buttons under FriendColumnWithoutButtons regardless of screen width
const FriendDisplayOuterWrapper = styled('div', {
  shouldForwardProp: (prop) => !['inSideColumn'].includes(prop),
})(({ inSideColumn }) => (`
  // In this default, fill up the full width with both Friend info & buttons
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 12px 0;
  position: relative;
  width: 100%;
  ${inSideColumn ? '' : FriendDisplayOuterWrapperShowButtonsOnRight}
`));

const FriendNameInSideColumn = `
  font-size: 14px;
  max-width: 16ch;
  text-align: left;
`;

const FriendNameNotInSideColumn = `
  font-size: 20px;
  max-width: 32ch;
  @media(max-width: 321px) {
    font-size: 16px;
    max-width: 14ch;
  }
  @media (min-width: 322px) and (max-width: 400px) {
    font-size: 18px;
    max-width: 14ch;
  }
  @media (min-width: 601px) and (max-width: 787px) {
    max-width: 18ch;
  }
  @media (min-width: 788px) and (max-width: 991px) {
    max-width: 30ch;
  }
  @media(min-width: 400px) {
    font-size: 22px;
    width: fit-content;
  }
`;

const FriendName = styled('h3', {
  shouldForwardProp: (prop) => !['inSideColumn'].includes(prop),
})(({ inSideColumn }) => (`
  color: black !important;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  ${inSideColumn ? FriendNameInSideColumn : FriendNameNotInSideColumn}
`));

export {
  CancelButtonWrapper,
  FriendButtonsWrapper,
  FriendColumnWithoutButtons,
  FriendDetailsLine,
  FriendDetailsWrapper,
  FriendDisplayOuterWrapper,
  FriendName,
};
