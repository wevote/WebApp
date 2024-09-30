import withStyles from '@mui/styles/withStyles';
import { EventOutlined, CampaignOutlined, EmojiEventsOutlined } from '@mui/icons-material';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../Style/DesignTokenColors';
import { renderLog } from '../../utils/logging';

function CardForListBody() {
  renderLog('ChallengeAbout');

  // Variables to hold dummy data
  const challengeDates = (
    <span>
      Jan 20, 24 - Sep 10, 24 ·
      {' '}
      <strong>5 days left</strong>
    </span>
  );
  const remindFriends = 'Remind as many friends as you can about the date of the election, and let them know you will be voting.';
  const currentLeader = 'Current leader: Tamika M.';
  const friendsInvited = (
    <span>
      <strong>31,477 friends invited</strong> by 6,441 participants
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
            {currentLeader && friendsInvited && (
              <FlexDivLeft>
                <SvgImageWrapper>
                  <EmojiEventsOutlined />
                </SvgImageWrapper>
                <ChallengeLeaderWrapper>
                  <CurrentLeaderDiv>{currentLeader}</CurrentLeaderDiv>
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

const styles = () => ({
  howToVoteRoot: {
    color: '#999',
    height: 18,
    width: 18,
  },
});

export const CardForListRow = styled('div')`
  color: ${DesignTokenColors.neutral500};
  font-size: 12px;
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

export default withStyles(styles)(CardForListBody);
