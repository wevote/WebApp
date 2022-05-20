import styled from 'styled-components';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';

const CancelButtonWrapper = styled('div')`
  width: fit-content;
  margin-bottom: 0;
  margin-left: 8px;
`;

const FriendButtonsWrapper = styled('div')`
  width: 100%;
  margin: 4px 0 0;
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
  width: 100%;
  ${inSideColumn ? '' : FriendDetailsWrapperNotInColumn}
`)) : styled('div')`
  margin: 0 auto;
  width: 100%;
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
  margin: 12px 0 18px 0;
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
  font-size: 18px;
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
