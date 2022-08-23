import styled from 'styled-components';

const CandidateEndorsementsContainer = styled('div')`
  border-left: 1px dotted #dcdcdc;
  display: flex;
  justify-content: flex-start;
`;

const EmptyPhotoOuterWrapper = styled('div')`
  display: flex;
  justify-content: start;
  padding: 8px 3px 6px 4px;
  width: 128px;
`;

const EmptyText = styled('div')`
  font-size: 14px;
  font-weight: normal;
  margin-top: 0;
  white-space: normal;
`;

const EmptyTextWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-flow: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 3px 3px 4px 4px;
  width: 124px;
`;

const HorizontalSpacer = styled('div')`
  border-bottom: 1px dotted #dcdcdc;
`;

const OrganizationPhotoInnerWrapper = styled('div')`
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

const OverflowContainer = styled('div')`
`;

const PositionRowItemEmptyWrapper = styled('div')`
  align-items: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PositionRowListInnerWrapper = styled('div')`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const PositionRowListEmptyWrapper = styled('div')`
`;

const PositionRowListOneWrapper = styled('div')`
`;

const PositionRowListOuterWrapper = styled('div')`
  margin-top: 10px;
`;

const PositionRowListScoreColumn = styled('div')`
  padding-right: 0;
`;

const PositionRowListScoreHeader = styled('div')`
  border-bottom: 1px solid #dcdcdc;
  color: #999;
  line-height: 20px;
  margin-top: 0;
`;

const PositionRowListScoreSpacer = styled('div')`
  cursor: pointer;
  margin-top: 85px;
  margin-right: 7px;
`;

export {
  CandidateEndorsementsContainer,
  EmptyPhotoOuterWrapper,
  EmptyText,
  EmptyTextWrapper,
  HorizontalSpacer,
  OrganizationPhotoInnerWrapper,
  OverflowContainer,
  PositionRowItemEmptyWrapper,
  PositionRowListEmptyWrapper,
  PositionRowListInnerWrapper,
  PositionRowListOneWrapper,
  PositionRowListOuterWrapper,
  PositionRowListScoreColumn,
  PositionRowListScoreHeader,
  PositionRowListScoreSpacer,
};
