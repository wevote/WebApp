import React from 'react';
import styled from 'styled-components';
import AppObservableStore from '../../common/stores/AppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

// Landing-specific header row: the We Vote wordmark on the left (the same navy
// -color-dark svg the global site header uses) and the landing nav on the right.
// Desktop / tablet only — on mobile the global app header covers this.
const weVoteLogo = '../../../img/global/svg-icons/we-vote-logo-horizontal-color-dark-tight.svg';

export default function SupporterLandingTopBar () {
  // Opens the same "How It Works" modal the global header's "How it works" menu item does.
  const openHowItWorksModal = () => AppObservableStore.setShowHowItWorksModal(true);

  return (
    <TopBar className="u-show-desktop-tablet">
      <LogoImage src={normalizedImagePath(weVoteLogo)} alt="We Vote" />
      <Nav>
        <NavLink type="button" onClick={openHowItWorksModal}>How WeVote works</NavLink>
        <ViewBallotButton type="button">View your ballot</ViewBallotButton>
      </Nav>
    </TopBar>
  );
}

const LogoImage = styled.img`
  display: block;
  height: auto;
  width: 125px;
`;

const Nav = styled.nav`
  align-items: center;
  display: flex;
  gap: 20px;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const TopBar = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 4px 0 12px;
`;

const ViewBallotButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.primary600};
  border-radius: 9999px;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  padding: 5px 20px;
  white-space: nowrap;

  &:hover {
    background: ${DesignTokenColors.primary50};
  }
`;
