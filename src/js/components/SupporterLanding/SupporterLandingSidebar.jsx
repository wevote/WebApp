import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ProfilePicturePrompt from './ProfilePicturePrompt';

// Desktop-only left rail: mission tagline and the profile-picture nudge. The brand
// logo lives in the global app header, so it is intentionally not repeated here.
export default function SupporterLandingSidebar () {
  return (
    <Sidebar className="u-show-desktop-tablet">
      <Tagline>Helping turn your values into voting decisions</Tagline>
      <ProfilePicturePrompt initials="Dn" />
    </Sidebar>
  );
}

const Sidebar = styled.aside`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 18px;
  /* Pull the sidebar up under the logo, cancelling the top bar's bottom padding
     without moving the top bar nav or the main column */
  margin-top: -12px;
  min-width: 175px;
  padding: 0;
  width: 190px;
`;

const Tagline = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 15px;
  line-height: 1.4;
  margin: 0;
  /* Wrap within the width of the We Vote logo that sits above it */
  max-width: 141px;
`;
