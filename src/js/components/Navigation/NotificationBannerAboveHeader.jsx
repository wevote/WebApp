import { Edit } from '@mui/icons-material';
import React, { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import VoterStore from '../../stores/VoterStore';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import useVoterCanEditPolitician from '../../hooks/useVoterCanEditPolitician';

// React functional component example
export default function NotificationBannerAboveHeader () {
  const voterCanEditPoliticianProfile = useVoterCanEditPolitician();

  const closeEditBar = () => {
    AppObservableStore.setShowNotificationBannerAboveHeader(false);
  };

  function pushDataLayer (linkTo, buttonId = '') {
    const destinationPage = lookupPageNameAndPageTypeDict(linkTo);

    const dataLayerObject = {
      actionDetails: {
        actionType: 'navigate',
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      destinationDetails: {
        destinationPageName: destinationPage.pageName || 'notSet',
        destinationPageType: destinationPage.pageType || 'notSet',
        destinationPathname: linkTo,
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  const handleEditProfile = () => {
    alert('Edit politician information');
  };

  const onAppObservableStoreChange = () => {
    //
  };

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    return () => {
      appStateSubscription.unsubscribe();
    };
  }, []);

  return (
    <NotificationBannerAboveHeaderContainer>
      {voterCanEditPoliticianProfile ? (
        <BannerText>
          <BannerIntroTextMobile className="u-show-mobile">Review for accuracy.</BannerIntroTextMobile>
          <BannerIntroTextDesktop className="u-show-desktop-tablet">Review your candidate’s profile for accuracy or add more info.</BannerIntroTextDesktop>
          <TipsLink className="u-show-desktop-tablet" href="tips-for-strong-profiles" target="_blank" rel="noopener noreferrer">
            {/* TODO link for Tips for strong profiles */}
            Tips for strong profiles
          </TipsLink>
          <EditButton onClick={handleEditProfile}>
            <EditStyled />
            {' '}
            <BannerIntroTextMobile className="u-show-mobile">Edit</BannerIntroTextMobile>
            <BannerIntroTextDesktop className="u-show-desktop-tablet">Make profile edits</BannerIntroTextDesktop>
          </EditButton>
        </BannerText>
      ) : (
        <BannerText>
          <BannerIntroTextMobile className="u-show-mobile">Claim and edit.</BannerIntroTextMobile>
          <BannerIntroTextDesktop className="u-show-desktop-tablet">Claim this candidate’s profile and make edits.</BannerIntroTextDesktop>
          <EditButton onClick={() => AppObservableStore.setShowClaimProfileWithEmailModal(true)}>
            <EditStyled />
            {' '}
            Claim this profile
          </EditButton>
        </BannerText>
      )}
      <CloseButton onClick={closeEditBar}>✕</CloseButton>
    </NotificationBannerAboveHeaderContainer>
  );
}

const BannerIntroTextDesktop = styled('span')`
`;

const BannerIntroTextMobile = styled('span')`
`;

const BannerText = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  font-size: 20px;
  position: relative;

  @media (max-width: 600px) {
    order: 2;
    margin-left: 8px;
    top: auto;
    right: auto;
  }
`;

const NotificationBannerAboveHeaderContainer = styled.div`
  align-items: center;
  background: ${DesignTokenColors.secondary800};
  color: ${DesignTokenColors.whiteUI};
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  justify-content: space-between;
  max-width: 960px;
  padding: 12px 16px;
  width: 100%;
`;
const EditButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: none;
  border-radius: 9999px;
  color: ${DesignTokenColors.secondary800};
  cursor: pointer;
  font-weight: 500;
  padding: 6px 14px;
  white-space: nowrap;

  @media (max-width: 800px) {
    margin-top: 8px;
  }
    @media (max-width: 600px) {
    width: auto;
    order: 1;
  }
`;

const EditStyled = styled(Edit)`
  height: 16px;
  width: 16px;
`;

const TipsLink = styled.a`
  color: #b0d9ff;
  margin-left: 6px;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;
