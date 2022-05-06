import styled from 'styled-components';

const OverflowContainer = styled('div')`
  flex: 1;
  overflow-x: hidden;
  overflow-y: hidden;
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
  margin-left: 48px;
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
  OverflowContainer,
  PositionRowListEmptyWrapper,
  PositionRowListInnerWrapper,
  PositionRowListOneWrapper,
  PositionRowListOuterWrapper,
  PositionRowListScoreColumn,
  PositionRowListScoreHeader,
  PositionRowListScoreSpacer,
};
