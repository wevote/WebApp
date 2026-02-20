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
    opposersCount: 24,
    supportersCount: 234,
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

export function AllStates (args) {
  return (
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
      voterSignedIn={false}
      showSignInPromptSupports
      />

    </Container>
  );
}

function Template (args) {
  return (
    <Container>
      <HeartFavoriteToggleBase
        {...args}
        voterSupports={args.voterSupports}
      />
    </Container>
  );
}

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
