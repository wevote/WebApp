import { Edit } from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import VoterStore from '../../stores/VoterStore';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import useVoterCanEditPolitician from '../../hooks/useVoterCanEditPolitician';
import PoliticianStore from '../../common/stores/PoliticianStore';

// React functional component example
export default function NotificationBannerAboveHeader () {
  const voterCanEditPoliticianProfile = useVoterCanEditPolitician();
  const [politicianWeVoteId, setPoliticianWeVoteId] = useState(AppObservableStore.getPoliticianWeVoteIdBeingViewed());

  const onAppObservableStoreChange = useCallback(() => {
    if (AppObservableStore.getPoliticianWeVoteIdBeingViewed()) {
      setPoliticianWeVoteId(AppObservableStore.getPoliticianWeVoteIdBeingViewed());
      // console.log('PoliticianSelfEditDrawer onAppObservableStoreChange politicianWeVoteId:', AppObservableStore.getPoliticianWeVoteIdBeingViewed());
    }
  }, [setPoliticianWeVoteId]);

  const closeEditBar = (buttonId) => {
    AppObservableStore.setShowNotificationBannerAboveHeader(false);
    const dataLayerObject = {
      actionDetails: {
        actionType: 'closeModal',
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  };

  function sendGTMDataLayer (actionType = 'openModal', buttonId = '', destinationPageName = '') {
    const { location: { pathname: currentPathname } } = window;
    const destinationPage = lookupPageNameAndPageTypeDict(currentPathname);
    const dataLayerObject = {
      actionDetails: {
        actionType,
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
      destinationDetails: {
        destinationPageName: destinationPageName || 'notSet',
        destinationPageType: destinationPage.pageType || 'notSet',
        destinationPathname: currentPathname,
      },
    };
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  const handleOpenClaimProfileModal = (buttonId) => {
    AppObservableStore.setShowClaimProfileWithEmailModal(true);
    sendGTMDataLayer('openModal', buttonId, 'ClaimProfileWithEmailModal');
  };

  const handleOpenEditProfileDrawer = (buttonId) => {
    AppObservableStore.setDrawerOpen('politicianSelfEditDrawerOpen', true);
    sendGTMDataLayer('openModal', buttonId, 'PoliticianSelfEditDrawer');
  };

  useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(onAppObservableStoreChange);
    onAppObservableStoreChange();
    return () => {
      setPoliticianWeVoteId('');
      appStateSubscription.unsubscribe();
    };
  }, [onAppObservableStoreChange]);

  return (
    <NotificationBannerAboveHeaderContainer>
      {voterCanEditPoliticianProfile ? (
        <BannerText>
          <BannerIntroTextMobile className="u-show-mobile">Review for accuracy.</BannerIntroTextMobile>
          <BannerIntroTextDesktop className="u-show-desktop-tablet">Review your candidate’s profile for accuracy or add more info.</BannerIntroTextDesktop>
          {/* TODO link for Tips for strong profiles
          <TipsLink className="u-show-desktop-tablet" href="tips-for-strong-profiles" target="_blank" rel="noopener noreferrer">
            Tips for strong profiles
          </TipsLink>
          */}
          <EditButton id="editThisProfileNotificationBanner" onClick={() => handleOpenEditProfileDrawer('editThisProfileNotificationBanner')}>
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
          <EditButton id="claimThisProfileNotificationBanner" onClick={() => handleOpenClaimProfileModal('claimThisProfileNotificationBanner')}>
            <EditStyled />
            {' '}
            Claim this profile
          </EditButton>
        </BannerText>
      )}
      {voterCanEditPoliticianProfile ? (
        <CloseButton id="closePoliticianSelfEditBanner" onClick={() => closeEditBar('closePoliticianSelfEditBanner')}>✕</CloseButton>
      ) : (
        <CloseButton id="closePoliticianClaimProfileBanner" onClick={() => closeEditBar('closePoliticianClaimProfileBanner')}>✕</CloseButton>
      )}
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
  justify-content: center;
  text-align: center;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  font-size: 20px;
  margin-left: 32px;
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
  justify-content: center;
  margin-left: -16px;
  margin-right: -16px;
  padding: 8px 16px;
  width: 100vw;
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

// const TipsLink = styled.a`
//   color: #b0d9ff;
//   margin-left: 6px;
//   text-decoration: underline;
//
//   &:hover {
//     text-decoration: none;
//   }
// `;
