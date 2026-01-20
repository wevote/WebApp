import React from 'react';
import TagManager from 'react-gtm-module';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import VoterStore from '../../stores/VoterStore';
import AppObservableStore from '../../common/stores/AppObservableStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { WeVoteLogo } from '../Style/SimpleProcessStyles';

const chosenSiteLogoUrl = '../../../img/global/svg-icons/we-vote-icon-square-color.svg';

export default function OfficeBannerAboveHeader () {
  const history = useHistory();
  const handleBallotButtonClick = () => history.push('/ballot');

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

  return (
    <OfficeBannerAboveHeaderContainer>
      <OfficeBannerMainColumn>
        <BannerTextContainer>
          <div style={{ display: 'flex', gap: '10px' }}>
            <WeVoteLogo src={normalizedImagePath(chosenSiteLogoUrl)} className="u-show-desktop-tablet" height="36" width="36" />
            <BannerIntroTextMobile className="u-show-mobile">Welcome to WeVote!</BannerIntroTextMobile>
            <BannerIntroTextDesktop className="u-show-desktop-tablet">Welcome to WeVote, your personalized voter guide:</BannerIntroTextDesktop>
          </div>
          <BannerElement>
            <BannerElementTitle>
              <BannerEmoji>&#x1F5F3;&ensp;</BannerEmoji>
              VOTE YOUR VALUES
            </BannerElementTitle>
            <BannerElementText className="u-show-mobile">Get personalized ballot recommendations.</BannerElementText>
            <BannerElementText className="u-show-desktop-tablet">Get personalized ballot recommendations based on your interests and trusted connections.</BannerElementText>
          </BannerElement>
          <BannerElement>
            <BannerElementTitle>
              <BannerEmoji>&#x1F91D;&ensp;</BannerEmoji>
              SHARE & MOBILIZE
            </BannerElementTitle>
            <BannerElementText className="u-show-mobile">Choose the candidates you support or oppose, and tell your friends.</BannerElementText>
            <BannerElementText className="u-show-desktop-tablet">Choose the candidates you support or oppose, and tell your friends.</BannerElementText>
          </BannerElement>
          <BannerElement>
            <BannerElementTitle>
              <BannerEmoji>&#x1F50D;&ensp;</BannerEmoji>
              SIMPLIFY VOTING
            </BannerElementTitle>
            <BannerElementText className="u-show-mobile">Uunderstand your ballot and take action confidently.</BannerElementText>
            <BannerElementText className="u-show-desktop-tablet">Use clear, nonpartisan tools to understand your ballot and take action confidently.</BannerElementText>
          </BannerElement>
        </BannerTextContainer>
      </OfficeBannerMainColumn>
      <VerticalCenter className="u-show-desktop-tablet"><VerticalLine /></VerticalCenter>
      <ButtonHolder>
        <BallotButton onClick={handleBallotButtonClick}>
          <BannerIntroTextMobile className="u-show-mobile">View full ballot</BannerIntroTextMobile>
          <BannerIntroTextDesktop className="u-show-desktop-tablet">View your full ballot to get started</BannerIntroTextDesktop>
        </BallotButton>
      </ButtonHolder>
      <CloseButton id="closeOfficeBanner" onClick={() => closeEditBar('closeOfficeBanner')}>✕</CloseButton>
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
  display: flex;
  align-items: center;
  font-weight: 600;
`;

const BannerEmoji = styled.div`
  font-size: 22px;
`;
const BannerIntroTextDesktop = styled('span')`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const BannerIntroTextMobile = styled('span')`
  font-size: 16px;
  font-weight: 500;
`;

const BannerTextContainer = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 12px;
`;

const ButtonHolder = styled.div`
  display: flex;
  align-items: center;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${DesignTokenColors.whiteUI};
  cursor: pointer;
  font-size: 20px;
  padding: 8px 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const OfficeBannerAboveHeaderContainer = styled.div`
  background: ${DesignTokenColors.secondary800};
  color: ${DesignTokenColors.whiteUI};
  display: flex;
  max-width: 960px;
`;

const OfficeBannerMainColumn = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 14px;
  max-width: 960px;
  padding: 8px 8px;
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

