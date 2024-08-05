import React  from 'react';
import styled from 'styled-components';
import HeartFavoriteToggleBase from '../components/Widgets/HeartFavoriteToggle/HeartFavoriteToggleBase';

export default {
  title: 'Design System/Inputs',
  component: HeartFavoriteToggleBase,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    voterSupportsLocal: false,
    campaignXOpposersCount: 24,
    campaignXSupportersCount: 234,
    voterSignedInWithEmail: true,
    voterSupports: true,
    voterOpposes: false,
  },
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 340px;
`;

const Template = (args) => (
  <Container>
    <HeartFavoriteToggleBase
        {...args}
        voterSupports={args.voterSupports}
    />
  </Container>
);

export const Like =  Template.bind({});
Like.args = {
  voterSupportsLocal: false,
  campaignXOpposersCount: 24,
  campaignXSupportersCount: 234,
  voterSignedInWithEmail: true,
  voterSupports: true,
  voterOpposes: false,
  campaignXWeVoteId: 'wv01camp',
  submitOppose: () => console.log('submitOppose'),
  submitStopOpposing: () => console.log('submitStopOpposing'),
  submitStopSupporting: () => console.log('submitStopSupporting'),
  submitSupport: () => console.log('submitSupport'),
};
