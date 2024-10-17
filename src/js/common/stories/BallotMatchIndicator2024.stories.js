import React from 'react';
import BallotMatchIndicator2024 from '../../components/BallotItem/BallotMatchIndicator2024';

export default {
  title: 'Components/BallotMatchIndicator2024',
  component: BallotMatchIndicator2024,
};

// eslint-disable-next-line react/jsx-props-no-spreading
const BallotMatchIndicatorTemplate = (args) => <BallotMatchIndicator2024 {...args} />;

export const BestMatch = BallotMatchIndicatorTemplate.bind({});
BestMatch.args = {
  isBestMatch: true,
};

export const GoodMatch = BallotMatchIndicatorTemplate.bind({});
GoodMatch.args = {
  isGoodMatch: true,
};

export const FairMatch = BallotMatchIndicatorTemplate.bind({});
FairMatch.args = {
  isFairMatch: true,
};

export const PoorMatch = BallotMatchIndicatorTemplate.bind({});
PoorMatch.args = {
  isPoorMatch: true,
};

export const NoData = BallotMatchIndicatorTemplate.bind({});
NoData.args = {
  noData: true,
};

export const IsItAMatch = BallotMatchIndicatorTemplate.bind({});
IsItAMatch.args = {
  isItAMatch: true,
};
