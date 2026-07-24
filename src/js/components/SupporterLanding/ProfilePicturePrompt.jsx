import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import VoterAvatar from './VoterAvatar';

// Purple voter avatar plus an "Add your profile picture" nudge, stacked for the sidebar.
export default function ProfilePicturePrompt ({ initials = 'Dn' }) {
  return (
    <PromptWrapper>
      <VoterAvatar initials={initials} size={46} />
      <PromptText>
        <PromptLink type="button">Add your profile picture</PromptLink>
        <PromptSubText>to build trust and show you&apos;re a real voter.</PromptSubText>
      </PromptText>
    </PromptWrapper>
  );
}
ProfilePicturePrompt.propTypes = {
  initials: PropTypes.string,
};

const PromptLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.25;
  padding: 0;
  text-align: left;
`;

const PromptSubText = styled.span`
  color: ${DesignTokenColors.neutral700};
  font-size: 14px;
  line-height: 1.35;
`;

const PromptText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const PromptWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
