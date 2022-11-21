import styled from 'styled-components';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';

const BallotAddress = styled('div', {
  shouldForwardProp: (prop) => !['centerText', 'allowTextWrap'].includes(prop),
})(({ allowTextWrap, centerText }) => (`
  margin-left: 2px;
  ${allowTextWrap ? '' : 'overflow: hidden;'}
  ${allowTextWrap ? '' : 'text-overflow: ellipsis;'}
  ${allowTextWrap ? '' : 'white-space: nowrap;'}
  ${centerText ? 'text-align: center;' : ''}
`));

const ClickBlockWrapper = styled('div')`
`;

const ComponentWrapper = styled('div')`
`;

const ContentWrapper = styled('div', {
  shouldForwardProp: (prop) => !['spaceBetween'].includes(prop),
})(({ spaceBetween }) => (`
  display: flex;
  flex: 1;
  min-height: 0px;
  ${spaceBetween ? 'justify-content: space-between;' : 'justify-content: center;'}
`));

const ElectionDateBelow = styled('div')`
`;

const ElectionDateRight = styled('div')`
    font-size: 18px;
`;

const ElectionNameBlock = styled('div', {
  shouldForwardProp: (prop) => !['allowTextWrap'].includes(prop),
})(({ allowTextWrap }) => (`
  ${allowTextWrap ? '' : 'overflow: hidden;'}
  ${allowTextWrap ? '' : 'text-overflow: ellipsis;'}
  ${allowTextWrap ? '' : 'white-space: nowrap;'}
`));

const ElectionNameH1 = styled('h1', {
  shouldForwardProp: (prop) => !['centerText'].includes(prop),
})(({ centerText, theme }) => (`
  font-size: 32px;
  ${theme.breakpoints.down('sm')} {
    font-size: 26px;
  }
  line-height: 1;
  margin: 0px;
  ${centerText ? 'text-align: center;' : ''}
  word-wrap: break-word;    // e.g 'District of Columbia General Election' in mobile/Cordova
  white-space: normal;
`));

const ElectionNameScrollContent = styled('div')`
`;

const ElectionStateLabel = styled('div', {
  shouldForwardProp: (prop) => !['centerText'].includes(prop),
})(({ centerText }) => (`
  color: #888;
  font-size: 12px;
  letter-spacing: .1em;
  margin-left: 2px;
  ${centerText ? 'text-align: center;' : ''}
  text-transform: uppercase;
`));

/* eslint-disable no-nested-ternary */
const OverflowContent = styled('div', {
  shouldForwardProp: (prop) => !['turnOffVoteByBelow'].includes(prop),
})(({ theme, turnOffVoteByBelow }) => (`
  display: block;
  flex: 1;
  ${isWebApp() ? (turnOffVoteByBelow ? 'height: 72px;' : 'height: 97px;') : ''}
  ${theme.breakpoints.down('sm')} {
    height: unset;
  }
`));

const OverflowContainer = styled('div', {
  shouldForwardProp: (prop) => !['allowTextWrap'].includes(prop),
})(({ allowTextWrap }) => (`
  ${allowTextWrap ? '' : 'max-width: fit-content;'}
  ${allowTextWrap ? '' : 'overflow: hidden;'}
  ${allowTextWrap ? '' : 'text-overflow: ellipsis;'}
  ${allowTextWrap ? '' : 'white-space: nowrap;'}
`));

const VoteByBelowLabel = styled('div')`
  margin-right: 4px;
`;

const VoteByBelowWrapper = styled('div', {
  shouldForwardProp: (prop) => !['centerText', 'electionDateBelow'].includes(prop),
})(({ centerText, electionDateBelow, theme }) => (`
  display: flex;
  ${centerText ? 'justify-content: center;' : 'justify-content: start;'}
  margin: -2px 0 0 2px;
  ${theme.breakpoints.up('md')} {
    ${electionDateBelow ? '' : 'display: none;'}
  }
`));

const VoteByRightLabel = styled('div')`
  color: #888;
  font-size: 12px;
  letter-spacing: .1em;
  text-transform: uppercase;
`;

const VoteByRightWrapper = styled('div', {
  shouldForwardProp: (prop) => !['electionDateBelow'].includes(prop),
})(({ electionDateBelow, theme }) => (`
  ${electionDateBelow ? 'display: none;' : 'display: block;'}
  margin-left: 8px;
  margin-top: 4px;
  ${theme.breakpoints.down('md')} {
    display: none;
  }
`));

export {
  BallotAddress,
  ClickBlockWrapper,
  ComponentWrapper,
  ContentWrapper,
  ElectionDateBelow,
  ElectionDateRight,
  ElectionNameBlock,
  ElectionNameH1,
  ElectionNameScrollContent,
  ElectionStateLabel,
  OverflowContainer,
  OverflowContent,
  VoteByBelowLabel,
  VoteByBelowWrapper,
  VoteByRightLabel,
  VoteByRightWrapper,
};
