import withStyles from '@mui/styles/withStyles';
import { EventOutlined, CampaignOutlined, EmojiEventsOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import { renderLog } from '../../utils/logging';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';

function ChallengeAbout ({ challengeWeVoteId }) {
  renderLog('ChallengeAbout');
  const [challengeInviteesCount, setChallengeInviteesCount] = React.useState(0);
  const [challengeParticipantCount, setChallengeParticipantCount] = React.useState(0);
  const [daysLeft, setDaysLeft] = React.useState(0);
  const [participantNameWithHighestRank, setParticipantNameWithHighestRank] = React.useState('');

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
      {' '}
      ·
      {' '}
      <strong>
        {daysLeft}
        {' '}
        days left
      </strong>
    </span>
  );
  const remindFriends = 'Remind as many friends as you can about the date of the election, and let them know you will be voting.';
  const currentLeader = `Current leader: ${participantNameWithHighestRank}`;
  const friendsInvited = (
    <span>
      <strong>
        {challengeInviteesCount}
        {' '}
        friends invited
      </strong>
      {' '}
      by
      {' '}
      {challengeParticipantCount}
      {' '}
      participants
    </span>
  );

  return (
    <ChallengeAboutWrapper>
      <CardRowsWrapper>
        {challengeDates && (
          <CardForListRow>
            <FlexDivLeft>
              <SvgImageWrapper>
                <EventOutlined />
              </SvgImageWrapper>
              <ChallengeDatesDiv>{challengeDates}</ChallengeDatesDiv>
            </FlexDivLeft>
          </CardForListRow>
        )}
        <CardForListRow>
          <Suspense fallback={<></>}>
            {remindFriends && (
              <FlexDivLeft>
                <SvgImageWrapper>
                  <CampaignOutlined />
                </SvgImageWrapper>
                <RemindFriendsDiv>{remindFriends}</RemindFriendsDiv>
              </FlexDivLeft>
            )}
          </Suspense>
        </CardForListRow>
        <CardForListRow>
          <Suspense fallback={<></>}>
            {friendsInvited && (
              <FlexDivLeft>
                <SvgImageWrapper>
                  <EmojiEventsOutlined />
                </SvgImageWrapper>
                <ChallengeLeaderWrapper>
                  {!!(participantNameWithHighestRank) && (
                    <CurrentLeaderDiv>{currentLeader}</CurrentLeaderDiv>
                  )}
                  <FriendsInvitedDiv>{friendsInvited}</FriendsInvitedDiv>
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

export const CardForListRow = styled('div')`
  color: ${DesignTokenColors.neutral500};
  font-size: 14px;
  padding: 3px 0;
`;

export const CardRowsWrapper = styled('div')`
  margin-top: 2px;
`;

const ChallengeAboutWrapper = styled('div')`
  white-space: normal;
`;

export const FlexDivLeft = styled('div')`
  align-items: flex-start;
  display: flex;
  justify-content: start;
`;

export const SvgImageWrapper = styled('div')`
  max-width: 25px;
  min-width: 25px;
  width: 25px;
  margin-right: 15px;
`;

export const ChallengeDatesDiv = styled('div')`
`;

export const RemindFriendsDiv = styled('div')`
`;

export const ChallengeLeaderWrapper = styled('div')`
`;

export const CurrentLeaderDiv = styled('div')`
`;

export const FriendsInvitedDiv = styled('div')`
`;

export default withStyles(styles)(ChallengeAbout);
