import withStyles from '@mui/styles/withStyles';
import { EventOutlined, CampaignOutlined, EmojiEventsOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import { renderLog } from '../../utils/logging';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import normalizedImagePath from '../../utils/normalizedImagePath';

import rocketShipNoThrust from '../../../../img/global/svg-icons/rocket-ship-no-thrust.svg';

function ChallengeAbout ({ challengeWeVoteId }) {
  renderLog('ChallengeAbout');
  const [challengeCreator, setChallengeCreator] = React.useState('');
  const [challengeInviteesCount, setChallengeInviteesCount] = React.useState(0);
  const [challengeIsSupporting, setChallengeIsSupporting] = React.useState('');
  const [challengeParticipantCount, setChallengeParticipantCount] = React.useState(0);
  const [daysLeft, setDaysLeft] = React.useState(0);
  const [participantNameWithHighestRank, setParticipantNameWithHighestRank] = React.useState('');
  const [showDaysLeft, setShowDaysLeft] = React.useState(true);

  const onAppObservableStoreChange = () => {
    setParticipantNameWithHighestRank(AppObservableStore.getChallengeParticipantNameWithHighestRankByChallengeWeVoteId(challengeWeVoteId));
  };

  const onChallengeStoreChange = () => {
    if (challengeInviteesCount < ChallengeStore.getNumberOfInviteesInChallenge(challengeWeVoteId)) {
      setChallengeInviteesCount(ChallengeStore.getNumberOfInviteesInChallenge(challengeWeVoteId));
    }
    if (challengeParticipantCount < ChallengeStore.getNumberOfParticipantsInChallenge(challengeWeVoteId)) {
      setChallengeParticipantCount(ChallengeStore.getNumberOfParticipantsInChallenge(challengeWeVoteId));
    }
    setDaysLeft(ChallengeStore.getDaysUntilChallengeEnds(challengeWeVoteId));
    setChallengeCreator('Anusha P.');
    setChallengeIsSupporting('John Smith');
  };
  const onChallengeParticipantStoreChange = () => {
    if (challengeParticipantCount < ChallengeParticipantStore.getNumberOfParticipantsInChallenge(challengeWeVoteId)) {
      setChallengeParticipantCount(ChallengeParticipantStore.getNumberOfParticipantsInChallenge(challengeWeVoteId));
    }
  };

  React.useEffect(() => {
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();
    const challengeStoreListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      challengeParticipantStoreListener.remove();
      challengeStoreListener.remove();
    };
  }, [challengeWeVoteId]);

  // Variables to hold dummy data
  const challengeDates = (
    <span>
      {/* Jan 20, 24 - Sep 10, 24 · */}
      Ends Nov 5, 2024
      {showDaysLeft && (
        <ShowDaysLeftText>
          {' '}
          ·
          {' '}
          {daysLeft}
          {' '}
          days left
        </ShowDaysLeftText>
      )}

    </span>
  );
  const challengeStarted = (
    <span>
      Challenge started by
      {' '}
      {challengeCreator}
    </span>
  );
  const remindFriends = 'Remind as many friends as you can about the date of the election, and let them know you will be voting.';
  const currentLeader = `Current leader: ${participantNameWithHighestRank}`;
  const friendsInvited = (
    <span>
      {challengeInviteesCount}
      {' '}
      friends invited
      {' '}
      by
      {' '}
      {challengeParticipantCount}
      {' '}
      participants
    </span>
  );

  const showStartedBy = false;
  return (
    <ChallengeAboutWrapper>
      <CardRowsWrapper>
        <CardForListRow>
          <Suspense fallback={<></>}>
            {remindFriends && (
              <FlexDivLeft>
                <SvgImageWrapper>
                  <CampaignOutlinedStyled />
                </SvgImageWrapper>
                <RemindFriendsDiv>{remindFriends}</RemindFriendsDiv>
              </FlexDivLeft>
            )}
          </Suspense>
        </CardForListRow>
        {challengeDates && (
          <CardForListRow>
            <FlexDivLeft>
              <SvgImageWrapper>
                <EventOutlinedStyled />
              </SvgImageWrapper>
              <ChallengeDatesDiv>{challengeDates}</ChallengeDatesDiv>
            </FlexDivLeft>
          </CardForListRow>
        )}
        {showStartedBy && (
          <CardForListRow>
            <Suspense fallback={<></>}>
              {challengeStarted && (
                <FlexDivLeft>
                  <SvgImageWrapper style={{ paddingTop: '3px' }}>
                    <ReactSVG
                      src={normalizedImagePath(rocketShipNoThrust)}
                      alt="Rocket Ship"
                      beforeInjection={(svg) => {
                        // Fill property applied to the path element, not SVG element. querySelector to grab the path element and set the attribute.
                        svg.querySelectorAll('path').forEach((path) => {
                          path.setAttribute('fill', 'none');
                          path.setAttribute('stroke', '#606060');
                        });
                      }}
                    />
                  </SvgImageWrapper>
                  <ChallengeStartedDiv>{challengeStarted}</ChallengeStartedDiv>
                </FlexDivLeft>
              )}
            </Suspense>
          </CardForListRow>
        )}
        <CardForListRow>
          <Suspense fallback={<></>}>
            {friendsInvited && (
              <FlexDivLeft>
                <SvgImageWrapper>
                  <EmojiEventsOutlinedStyled />
                </SvgImageWrapper>
                <ChallengeLeaderWrapper>
                  <FriendsInvitedDiv>{friendsInvited}</FriendsInvitedDiv>
                  {!!(participantNameWithHighestRank) && (
                    <CurrentLeaderDiv>{currentLeader}</CurrentLeaderDiv>
                  )}
                </ChallengeLeaderWrapper>
              </FlexDivLeft>
            )}
          </Suspense>
        </CardForListRow>
      </CardRowsWrapper>
    </ChallengeAboutWrapper>
  );
}
ChallengeAbout.propTypes = {
  challengeWeVoteId: PropTypes.string,
};

const styles = () => ({
  howToVoteRoot: {
    color: '#999',
    height: 18,
    width: 18,
  },
});

export const CampaignOutlinedStyled = styled(CampaignOutlined)`
  font-size: 30px;
`;

export const EmojiEventsOutlinedStyled = styled(EmojiEventsOutlined)`
  margin-top: 2px;
`;

export const EventOutlinedStyled = styled(EventOutlined)`
  font-size: 25px;
`;

export const CardForListRow = styled('div')`
  color: ${DesignTokenColors.neutral500};
  font-size: 16px;
  padding: 3px 0;
`;

export const CardRowsWrapper = styled('div')`
  margin-top: 2px;
`;

const ChallengeAboutWrapper = styled('div')`
  white-space: normal;
`;

const ChallengeStartedDiv = styled('div')`
`;

export const FlexDivLeft = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: start;
`;

export const SvgImageWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  max-width: 35px;
  min-width: 35px;
  width: 35px;
  margin-right: 5px;
  margin-top: -4px;
`;

export const ChallengeDatesDiv = styled('div')`
`;

export const RemindFriendsDiv = styled('div')`
  font-weight: 600;
`;

export const ChallengeLeaderWrapper = styled('div')`
`;

export const CurrentLeaderDiv = styled('div')`
`;

export const FriendsInvitedDiv = styled('div')`
`;

const ShowDaysLeftText = styled('span')`
`;

export default withStyles(styles)(ChallengeAbout);
