import styled from 'styled-components';
import colors from '../../common/components/Style/Colors';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize'; // 2024-04-16 Upgrade to using this

export const BallotAddress = styled('div', {
  shouldForwardProp: (prop) => !['centerText', 'allowTextWrap'].includes(prop),
})(({ allowTextWrap, centerText }) => (`
  margin-left: 2px;
  ${isMobileScreenSize() || isCordova() ? '' : 'font-size: 18px;'}
  ${allowTextWrap || isMobileScreenSize() || isCordova() ? '' : 'overflow: hidden;'}
  ${allowTextWrap || isMobileScreenSize() || isCordova() ? '' : 'text-overflow: ellipsis;'}
  ${allowTextWrap || isMobileScreenSize() || isCordova() ? '' : 'white-space: nowrap;'}
  ${centerText ? 'text-align: center;' : ''}
`));

export const ClickBlockWrapper = styled('div')`
`;

export const ComponentWrapper = styled('div')`
`;

export const ContentWrapper = styled('div', {
  shouldForwardProp: (prop) => !['spaceBetween'].includes(prop),
})(({ spaceBetween }) => (`
  display: flex;
  flex: 1;
  min-height: 0px;
  ${spaceBetween ? 'justify-content: space-between;' : 'justify-content: center;'}
`));

export const ElectionDateBelow = styled('div')`
`;

export const ElectionDateRight = styled('div')`
    font-size: 18px;
`;

export const ElectionNameBlock = styled('div', {
  shouldForwardProp: (prop) => !['allowTextWrap'].includes(prop),
})(({ allowTextWrap }) => (`
  ${allowTextWrap ? '' : 'overflow: hidden;'}
  ${allowTextWrap ? '' : 'text-overflow: ellipsis;'}
  ${allowTextWrap ? '' : 'white-space: nowrap;'}
`));

export const ElectionNameH1 = styled('h1', {
  shouldForwardProp: (prop) => !['centerText'].includes(prop),
})(({ centerText, theme }) => (`
  font-size: 30px;
  padding-top: 5px;
  padding-bottom: 18px;
  ${theme.breakpoints.down('sm')} {
    font-size: 26px;
    padding-top: 5px;
    padding-bottom: 12px;
  }
  line-height: 1;
  margin: 0px;
  ${centerText ? 'text-align: center;' : ''}
  word-wrap: break-word;    // e.g 'District of Columbia General Election' in mobile/Cordova
  white-space: normal;
`));

export const ElectionNameScrollContent = styled('div')`
`;

export const ElectionStateLabel = styled('div', {
  shouldForwardProp: (prop) => !['centerText'].includes(prop),
})(({ centerText }) => (`
  color: ${colors.middleGrey};
  font-size: 14px;
  font-weight: 600;
  letter-spacing: .1em;
  margin-left: 2px;
  ${centerText ? 'text-align: center;' : ''}
  text-transform: uppercase;
`));

/* eslint-disable no-nested-ternary */
export const OverflowContent = styled('div', {
  shouldForwardProp: (prop) => !['turnOffVoteByBelow'].includes(prop),
})(({ theme, turnOffVoteByBelow }) => (`
  display: block;
  flex: 1;
  ${isWebApp() ? (turnOffVoteByBelow ? 'height: 72px;' : 'height: 97px;') : ''}
  ${theme.breakpoints.down('sm')} {
    height: unset;
  }
`));

export const OverflowContainer = styled('div', {
  shouldForwardProp: (prop) => !['allowTextWrap'].includes(prop),
})(({ allowTextWrap }) => (`
  ${allowTextWrap ? '' : 'max-width: fit-content;'}
  ${allowTextWrap ? '' : 'overflow: hidden;'}
  ${allowTextWrap ? '' : 'text-overflow: ellipsis;'}
  ${allowTextWrap ? '' : 'white-space: nowrap;'}
`));

export const VoteByBelowLabel = styled('div')`
  margin-right: 4px;
`;

export const VoteByBelowWrapper = styled('div', {
  shouldForwardProp: (prop) => !['centerText', 'electionDateBelow'].includes(prop),
})(({ centerText, electionDateBelow, theme }) => (`
  display: flex;
  ${centerText ? 'justify-content: center;' : 'justify-content: start;'}
  margin: -2px 0 0 2px;
  // ${theme.breakpoints.up('md')} {
  //   ${electionDateBelow ? '' : 'display: none;'}
  // }
`));

export const VoteByRightLabel = styled('div')`
  color: ${DesignTokenColors.neutral600};
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
`;

export const VoteByRightWrapper = styled('div', {
  shouldForwardProp: (prop) => !['electionDateBelow'].includes(prop),
})(({ electionDateBelow, theme }) => (`
  // ${electionDateBelow ? 'display: none;' : 'display: block;'}
  margin-left: 8px;
  margin-top: 4px;
  ${theme.breakpoints.down('md')} {
    display: none;
  }
`));
