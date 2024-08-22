import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';

export const BallotSharedCandidateNameH4 = styled('h4')`
  color: #4371cc;
  font-weight: 400;
  font-size: 24px;
  margin-bottom: 0 !important;
  min-width: 124px;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
`;

export const BallotSharedCandidateParty = styled('div')`
  opacity: 0.8;
  white-space: nowrap;
`;

export const BallotSharedCandidatesOuterWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  // height: 100%;
  width: 100%;
`;

export const BallotSharedOfficeNameH2 = styled('div')(({ theme }) => (`
  // For some reason if styled('h2') it breaks down
  font-size: 20px;
  margin-bottom: 6px;
  white-space: nowrap;
  width: fit-content;
  ${theme.breakpoints.down('sm')} {
    font-size: 28px;
  }
`));

export const BallotSharedOfficeItemWrapper = styled('div')`
  align-items: center;
  display: flex;
  border: 1px solid #fff;
  flex-direction: column;
  margin-bottom: 60px;
  padding: 0 !important;
  position: relative;
`;

export const Candidate = styled('div')`
  display: flex;
  flex-grow: 8;
`;

export const CandidateBottomRow = styled('div')`
  margin-top: 4px;
`;

export const CandidateContainer = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

export const CandidateInfo = styled('div')(({ theme }) => (`
  border: 1px solid #fff;
  display: block;
  height: 100%;
  margin: 0 !important;
  padding: 8px !important;
  transition: all 200ms ease-in;
  ${theme.breakpoints.down('md')} {
    padding: 8px 8px 4px 8px !important;
  }
`));

export const constrainedTextMobileStyles = isMobileScreenSize() || isCordova() ? `
  height: auto;
  white-space: initial;
` : '';

// Defaults to style in mobile
export const CandidateNameH1 = styled('h1')(({ theme }) => (`
  font-size: 14px;
  margin-bottom: 2px;
  margin-top: 8px;
  font-weight: bold;
  ${theme.breakpoints.up('md')} {
    margin-top: 0;
    font-size: 16px;
  }
`));

export const CandidateNameH4 = styled('button')`
  color: #4371cc;
  font-weight: 400;
  font-size: 20px;
  margin-bottom: 0 !important;
  // min-width: 124px;
  white-space: normal;
  border: none;
  background-color: transparent;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
  ${constrainedTextMobileStyles}
`;

export const CandidateNameAndPartyWrapper = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const CandidateParty = styled('div')`
  opacity: 0.8;
  white-space: normal;
`;

export const CandidateTopRow = styled('div')`
  cursor: pointer;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

export const CandidateWrapper = styled('div')(({ theme }) => (`
  width: 320px;
  ${theme.breakpoints.down('sm')} {
    width: 100%;
  }
  ${theme.breakpoints.up('sm')} {
    // margin-left: 48px;
    min-width: 320px;
  }
`));

export const OfficeNameH2 = styled('div')(({ theme }) => (`
  // For some reason if styled('h2') it breaks down
  font-size: 32px;
  margin-bottom: 6px;
  width: fit-content;
  ${theme.breakpoints.down('sm')} {
    font-size: 28px;
  }
`));

export const OfficeItemCompressedWrapper = styled('div')`
  display: flex;
  border: 1px solid #fff;
  flex-direction: column;
  margin-bottom: 60px;
  padding: 0 !important;
  position: relative;
`;

export const VoteAgainstCandidate = styled('span')`
  color: red;
  font-size: 16px;
`;

export const VoteAgainstMeasure = styled('span')`
`;

export const VoteForCandidate = styled('span')`
  font-size: 16px;
`;

export const VoteForMeasure = styled('span')`
`;
