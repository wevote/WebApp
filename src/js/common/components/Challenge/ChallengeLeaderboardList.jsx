// ChallengeLeaderboardList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChallengeParticipantListItem from './ChallengeParticipantListItem';

const participants = [
  { rank: 5340, participant_name: 'Melina H.', points: 142, friends_who_joined: 3, friends_invited: 10, friends_who_viewed: 8, friends_who_viewed_plus: 21, voter_we_vote_id: 'wv02voter1238' },
  { rank: 5341, participant_name: 'David N.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter1237' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter1236' },
  { rank: 5340, participant_name: 'Melina H.', points: 142, friends_who_joined: 3, friends_invited: 10, friends_who_viewed: 8, friends_who_viewed_plus: 21, voter_we_vote_id: 'wv02voter1235' },
  { rank: 5341, participant_name: 'David B.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter1234' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter123' },
  { rank: 5340, participant_name: 'Melina H.', points: 142, friends_who_joined: 3, friends_invited: 10, friends_who_viewed: 8, friends_who_viewed_plus: 21, voter_we_vote_id: 'wv02voter12333' },
  { rank: 5341, participant_name: 'David A.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter12344' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter12355' },
  { rank: 5341, participant_name: 'David B.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter12366' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter12377' },
  { rank: 5340, participant_name: 'Melina H.', points: 142, friends_who_joined: 3, friends_invited: 10, friends_who_viewed: 8, friends_who_viewed_plus: 21, voter_we_vote_id: 'wv02voter12388' },
  { rank: 5341, participant_name: 'David A.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter12399' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter12390' },
  { rank: 5341, participant_name: 'David B.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter12312' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter12314' },
  { rank: 5340, participant_name: 'Melina H.', points: 142, friends_who_joined: 3, friends_invited: 10, friends_who_viewed: 8, friends_who_viewed_plus: 21, voter_we_vote_id: 'wv02voter12315' },
  { rank: 5341, participant_name: 'David A.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter12316' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter12317' },
  { rank: 5341, participant_name: 'David B.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter12318' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter12319' },
  { rank: 5340, participant_name: 'Melina H.', points: 142, friends_who_joined: 3, friends_invited: 10, friends_who_viewed: 8, friends_who_viewed_plus: 21, voter_we_vote_id: 'wv02voter12323' },
  { rank: 5341, participant_name: 'David A.', points: 121, friends_who_joined: 1, friends_invited: 7, friends_who_viewed: 3, friends_who_viewed_plus: 18, voter_we_vote_id: 'wv02voter12324' },
  { rank: 5342, participant_name: 'Anusha G.', points: 118, friends_who_joined: 1, friends_invited: 5, friends_who_viewed: 2, friends_who_viewed_plus: 15, voter_we_vote_id: 'wv02voter12325' },
];

const LeaderboardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100vh - 270px);
`;

const ChallengeLeaderboardList = ({ currentVoterWeVoteId, participantList }) => (
  <LeaderboardListContainer>
    {participants.map((participant, index) => (
      <ChallengeParticipantListItem
          key={index}
          participant={participant}
          isCurrentUser={participant.voter_we_vote_id === currentVoterWeVoteId}
      />
    ))}
  </LeaderboardListContainer>
);
ChallengeLeaderboardList.propTypes = {
  currentVoterWeVoteId: PropTypes.string,
  participantList: PropTypes.array,
};

export default ChallengeLeaderboardList;
