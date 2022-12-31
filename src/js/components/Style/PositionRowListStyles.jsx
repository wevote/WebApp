import styled from 'styled-components';

export const CandidateEndorsementsContainer = styled('div')`
  border-left: 1px dotted #dcdcdc;
  display: flex;
  justify-content: flex-start;
`;

export const EmptyPhotoOuterWrapper = styled('div')`
  display: flex;
  justify-content: start;
  padding: 8px 3px 6px 4px;
  width: 128px;
`;

export const EmptyText = styled('div')`
  font-size: 14px;
  font-weight: normal;
  margin-top: 0;
  white-space: normal;
`;

export const EmptyTextWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 3px 3px 4px 4px;
  width: 124px;
`;

export const HorizontalSpacer = styled('div')`
  border-bottom: 1px dotted #dcdcdc;
`;

export const OrganizationPhotoInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  height: 50px;
  width: 50px;
  justify-content: center;
  & img, & svg, & path {
    border: 1px solid #ccc;
    border-radius: 48px;
    width: 48px !important;
    height: 48px !important;
    max-width: 48px !important;
    display: flex;
    align-items: flex-start;
  }
`;

export const OverflowContainer = styled('div')`
`;

export const PositionRowItemEmptyWrapper = styled('div')`
  align-items: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const PositionRowListInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

export const PositionRowListEmptyWrapper = styled('div')`
`;

export const PositionRowListOneWrapper = styled('div')`
`;

export const PositionRowListOuterWrapper = styled('div')`
  margin-top: 10px;
`;

export const PositionRowListScoreColumn = styled('div')`
  padding-right: 0;
`;

export const PositionRowListScoreHeader = styled('div')`
  border-bottom: 1px solid #dcdcdc;
  color: #999;
  line-height: 20px;
  margin-top: 0;
`;

export const PositionRowListScoreSpacer = styled('div')`
  cursor: pointer;
  margin-top: 85px;
  margin-right: 7px;
`;
