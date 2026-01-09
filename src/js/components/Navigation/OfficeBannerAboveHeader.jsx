import { Edit } from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import lookupPageNameAndPageTypeDict, { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import isMobileScreenSize, { isTablet } from '../../common/utils/isMobileScreenSize';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import VoterStore from '../../stores/VoterStore';
import AppObservableStore, { messageService } from '../../common/stores/AppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import useVoterCanEditPolitician from '../../hooks/useVoterCanEditPolitician';
import PoliticianStore from '../../common/stores/PoliticianStore';
import HeaderLogoImage from './HeaderLogoImage';
import {WeVoteLogo} from '../Style/SimpleProcessStyles';

const chosenSiteLogoUrl = '../../../img/global/svg-icons/we-vote-icon-square-color.svg';

export default function OfficeBannerAboveHeader() {
  const voterCanEditPoliticianProfile = useVoterCanEditPolitician();
  const [politicianWeVoteId, setPoliticianWeVoteId] = useState(AppObservableStore.getPoliticianWeVoteIdBeingViewed());

  const history = useHistory();
  const handleBallotButtonClick = () => history.push('/ballot')

  const onAppObservableStoreChange = useCallback(() => {
    if (AppObservableStore.getPoliticianWeVoteIdBeingViewed()) {
      setPoliticianWeVoteId(AppObservableStore.getPoliticianWeVoteIdBeingViewed());
      // console.log('PoliticianSelfEditDrawer onAppObservableStoreChange politicianWeVoteId:', AppObservableStore.getPoliticianWeVoteIdBeingViewed());
    }
  }, [setPoliticianWeVoteId]);

  const closeEditBar = (buttonId) => {
    AppObservableStore.setShowOfficeBannerAboveHeader(false);
    const dataLayerObject = {
      actionDetails: {
        actionType: 'closeModal',
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    TagManager.dataLayer({ dataLayer: dataLayerObject });
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
    <OfficeBannerAboveHeaderContainer>
      <BannerTextContainer>
        <div style={{display: "flex", gap: "10px"}}>
          <WeVoteLogo src={normalizedImagePath(chosenSiteLogoUrl)} className="u-show-desktop-tablet" height="36" width="36" />
          <BannerIntroTextMobile className="u-show-mobile">Welcome to WeVote, your personalized voter guide!</BannerIntroTextMobile>
          <BannerIntroTextDesktop className="u-show-desktop-tablet">Welcome to WeVote, your personalized voter guide:</BannerIntroTextDesktop>
        </div>
        <BannerElement>
        {/*{' '}*/}
          <BannerElementTitle>&#x1F5F3;&ensp; VOTE YOUR VALUES</BannerElementTitle>
          <BannerElementText>Get personalized ballot recommendations based on your interests and trusted connections.</BannerElementText>
        </BannerElement>
        <BannerElement>
          <BannerElementTitle>&#x1F91D;&ensp; SHARE & MOBILIZE</BannerElementTitle>
          <BannerElementText>Choose the candidates you support or oppose, and tell your friends.</BannerElementText>
        </BannerElement>
        <BannerElement>
          <BannerElementTitle>&#x1F50D;&ensp; SIMPLIFY VOTING</BannerElementTitle>
          <BannerElementText>Use clear, nonpartisan tools to understand your ballot and take action confidently.</BannerElementText>
        </BannerElement>
      </BannerTextContainer>
      <VerticalCenter className="u-show-desktop-tablet"><VerticalLine/></VerticalCenter>
      <ButtonHolder>
        <BallotButton onClick={handleBallotButtonClick}>
          <BannerIntroTextMobile className="u-show-mobile">View your full ballot</BannerIntroTextMobile>
          <BannerIntroTextDesktop className="u-show-desktop-tablet">View your full ballot to get started</BannerIntroTextDesktop>
        </BallotButton>
      </ButtonHolder>
      <ButtonHolder>
        <CloseButton id="closeOfficeBanner" onClick={() => closeEditBar('closeOfficeBanner')}>✕</CloseButton>
      </ButtonHolder>
    </OfficeBannerAboveHeaderContainer>
  );
}

const BallotButton = styled.button`
  background: ${DesignTokenColors.whiteUI};
  border: none;
  border-radius: 24px;
  color: ${DesignTokenColors.secondary800};
  cursor: pointer;
  font-weight: 500;
  padding: 8px 16px;
  margin-top: 32px;

  @media (max-width: 800px) {
    margin-top: 8px;
  }
  @media (max-width: 600px) {
    width: auto;
    order: 1;
  }
`;

const BannerElement = styled('div')`
`;

const BannerElementText = styled.div`
  margin-left: 2.5em;
`;

const BannerElementTitle = styled.div`
  font-weight: 500;
  margin-bottom: 2px;
  margin-left: 1em;
`;

const BannerIntroTextDesktop = styled('span')`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const BannerIntroTextMobile = styled('span')`
`;

const BannerTextContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 12px;
`;

const ButtonHolder = styled.div`
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  font-size: 20px;
  margin-left: 16px;

  display: flex;
  flex-direction: row;
  justify-content: center;

  @media (max-width: 600px) {
    order: 2;
    margin-left: 8px;
  }
`;

const OfficeBannerAboveHeaderContainer = styled.div`
  ${() => (!isMobileScreenSize() || isTablet() ? '' : 'flex-direction: column;')};
  ${() => (!isMobileScreenSize() || isTablet() ? '' : 'align-items: center;')};
  background: ${DesignTokenColors.secondary800};
  color: ${DesignTokenColors.whiteUI};
  display: flex;
  font-size: 14px;
  max-width: 960px;
  margin-left: -16px;
  margin-right: -16px;
  padding: 8px 16px;
  width: 100vw;
`;

const VerticalCenter = styled.div`
  margin-inline: 2%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const VerticalLine = styled('div')`
  border-left: 1px solid rgba(105, 105, 105, 0.6);
  height: 90%;
  margin-inline: 5%;
  margin: 5px;
`;

