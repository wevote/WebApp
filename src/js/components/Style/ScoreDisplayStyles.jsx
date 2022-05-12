import styled from 'styled-components';


const DecidedIconWrapper = styled('span')`
  margin-right: 6px;
`;

const NetworkScore = styled('div', {
  shouldForwardProp: (prop) => !['hideNumbersOfAllPositions', 'voterOpposesBallotItem', 'voterPersonalNetworkScoreIsNegative', 'voterPersonalNetworkScoreIsPositive', 'voterSupportsBallotItem'].includes(prop),
})(({ hideNumbersOfAllPositions, voterOpposesBallotItem, voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive, voterSupportsBallotItem }) => (`
  background: ${(voterSupportsBallotItem && 'rgb(31, 192, 111)') || (voterOpposesBallotItem && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (hideNumbersOfAllPositions && 'rgb(211, 211, 211)') || '#888'};
  align-items: center;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  margin-top: 2px;
  width: 40px;
  height: 40px;
  @media print{
    border-width: 1px;
    border-style: solid;
    border-color: ${(voterSupportsBallotItem && 'rgb(31, 192, 111)') || (voterOpposesBallotItem && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (hideNumbersOfAllPositions && 'rgb(211, 211, 211)') || '#888'};
  }
`));

const NetworkScoreSmall = styled('div', {
  shouldForwardProp: (prop) => !['hideNumbersOfAllPositions', 'voterOpposesBallotItem', 'voterPersonalNetworkScoreIsNegative', 'voterPersonalNetworkScoreIsPositive', 'voterSupportsBallotItem'].includes(prop),
})(({ hideNumbersOfAllPositions, voterOpposesBallotItem, voterPersonalNetworkScoreIsNegative, voterPersonalNetworkScoreIsPositive, voterSupportsBallotItem }) => (`
  background: ${(voterSupportsBallotItem && 'rgb(31, 192, 111)') || (voterOpposesBallotItem && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (hideNumbersOfAllPositions && 'rgb(211, 211, 211)') || '#888'};
  color: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  float: left;
  font-size: 10px;
  font-weight: bold;
  @media print{
    border-width: 1px;
    border-style: solid;
    border-color: ${(voterSupportsBallotItem && 'rgb(31, 192, 111)') || (voterOpposesBallotItem && 'rgb(255, 73, 34)') || (voterPersonalNetworkScoreIsPositive && 'rgb(31, 192, 111)') || (voterPersonalNetworkScoreIsNegative && 'rgb(255, 73, 34)') || (hideNumbersOfAllPositions && 'rgb(211, 211, 211)') || '#888'};
  }
`));

const PopoverBodyText = styled('div')`
  margin-bottom: 8px;
`;

const RenderedOrganizationsWrapper = styled('div')`
  margin-top: 6px;
`;

const ShowCandidateFooterWrapper = styled('div')`
  margin-top: 10px;
`;

const TutorialTextBlue = styled('div')`
`;

const YourOpinion = styled('div')`
  margin-bottom: 8px;
`;

const YourPersonalNetworkIntroText = styled('div')`
  margin-top: 6px;
`;

export {
  DecidedIconWrapper,
  NetworkScore,
  NetworkScoreSmall,
  PopoverBodyText,
  RenderedOrganizationsWrapper,
  ShowCandidateFooterWrapper,
  TutorialTextBlue,
  YourOpinion,
  YourPersonalNetworkIntroText,
};
