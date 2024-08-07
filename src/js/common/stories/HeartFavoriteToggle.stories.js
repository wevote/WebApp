import React  from 'react';
import styled from 'styled-components';
import HeartFavoriteToggleBase from '../components/Widgets/HeartFavoriteToggle/HeartFavoriteToggleBase';

export default {
  title: 'Design System/Like',
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
    showSignInPromptSupports: true,
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 340px;
  width: 340px;
`;

export const AllStates = (args) => (
  <Container>
    <HeartFavoriteToggleBase
      {...args}
      voterSupports={false}
    />
    <HeartFavoriteToggleBase
      {...args}
      voterSupports
    />
    <HeartFavoriteToggleBase
      {...args}
      voterOpposes
      voterSupports={false}
    />
    <HeartFavoriteToggleBase
      voterSignedInWithEmail={false}
      showSignInPromptSupports
    />

  </Container>
);

const Template = (args) => (
  <Container>
    <HeartFavoriteToggleBase
        {...args}
        voterSupports={args.voterSupports}
    />
  </Container>
);

export const Default =  {
  args: {
    voterSupports: false,
  },
};

export const Like =  {
  args: {
    voterSupports: true,
  },
};

export const Dislike =  {
  args: {
    voterOpposes: true,
    voterSupports: false,
  },
};
