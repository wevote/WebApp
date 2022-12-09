import styled from 'styled-components';

const BlockedIndicator = styled('span')`
  background-color: #efc2c2;
  border-radius: 4px;
  color: #2e3c5d;
  cursor: pointer;
  font-size: 14px;
  // margin-right: 10px;
  // margin-top: 10px;
  padding: 5px 12px;
  &:hover {
    background-color: #eaaeae;
  }
`;

const BlockedReason = styled('div')(({ theme }) => (`
  background-color: #efc2c2;
  border-radius: 4px;
  color: #2e3c5d;
  font-size: 18px;
  margin-top: 10px;
  ${theme.breakpoints.down('lg')} {
    margin: 10px;
  }
  padding: 5px 12px;
`));

const DraftModeIndicator = styled('span')`
  background-color: #ccc;
  border-radius: 4px;
  color: #2e3c5d;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 12px;
  &:hover {
    background-color: #bfbfbf;
  }
`;

const EditIndicator = styled('span')`
  background-color: #fff;
  border: 1px solid rgba(46, 60, 93, 0.5);
  border-radius: 4px;
  color: #2e3c5d;
  cursor: pointer;
  font-size: 14px;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 500;
  line-height: 1.75;
  user-select: none;
  letter-spacing: 0.02857em;
  padding: 4px 12px;
  text-transform: none;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ElectionInPast = styled('span')`
  background-color: #00cc66;
  border-radius: 4px;
  color: #2e3c5d;
  // cursor: pointer;
  font-size: 14px;
  // margin-right: 10px;
  // margin-top: 10px;
  padding: 5px 12px;
  // &:hover {
  //   background-color: #00b359;
  // }
`;

const IndicatorButtonWrapper = styled('div')`
  margin-bottom: 4px;
  margin-right: 8px;
`;

const IndicatorDefaultButtonWrapper = styled('div')`
  cursor: pointer;
  margin-bottom: 4px;
  margin-right: 8px;
  margin-top: 2px;
`;

const IndicatorRow = styled('div')`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  margin-top: 12px;
`;

export {
  BlockedIndicator,
  BlockedReason,
  DraftModeIndicator,
  EditIndicator,
  ElectionInPast,
  IndicatorButtonWrapper,
  IndicatorDefaultButtonWrapper,
  IndicatorRow,
};
