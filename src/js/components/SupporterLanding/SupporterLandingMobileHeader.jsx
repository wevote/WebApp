import React from 'react';
import styled from 'styled-components';
import AppObservableStore from '../../common/stores/AppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import VoterAvatar from './VoterAvatar';

// Mobile-only landing header (< 576px), matching the phone mockup:
//   row 1: We Vote logo | "How WeVote works · Your ballot" | avatar
//   row 2: mission tagline | "Add your profile picture"
// On desktop/tablet this is hidden and SupporterLandingTopBar + the sidebar take over.
const weVoteLogo = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-tight.svg';

export default function SupporterLandingMobileHeader () {
  const openHowItWorksModal = () => AppObservableStore.setShowHowItWorksModal(true);

  return (
    <Header className="u-show-mobile">
      <TopRow>
        <LogoImage src={normalizedImagePath(weVoteLogo)} alt="We Vote" />
        <NavCluster>
          <NavLink type="button" onClick={openHowItWorksModal}>How WeVote works</NavLink>
          <NavBar>|</NavBar>
          <NavLink type="button">Your ballot</NavLink>
          <VoterAvatar initials="D" size={38} />
        </NavCluster>
      </TopRow>
      <BottomRow>
        <Tagline>Helping turn your values into voting decisions</Tagline>
        <ProfileLink type="button">Add your profile picture</ProfileLink>
      </BottomRow>
    </Header>
  );
}

const BottomRow = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0 4px;
`;

const LogoImage = styled.img`
  display: block;
  height: auto;
  width: 92px;
`;

const NavBar = styled.span`
  color: ${DesignTokenColors.neutralUI300};
`;

const NavCluster = styled.nav`
  align-items: center;
  display: flex;
  gap: 8px;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

// Matches the nav links above; right edge lines up with the avatar's edit badge
// (which sits 2px past the avatar's edge).
const ProfileLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font-size: 13px;
  margin-right: -2px;
  padding: 0;
  text-align: right;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const Tagline = styled.p`
  color: ${DesignTokenColors.neutral600};
  font-size: 14px;
  font-style: italic;
  line-height: 1.35;
  margin: 0;
  max-width: 165px;
`;

const TopRow = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: space-between;
`;
