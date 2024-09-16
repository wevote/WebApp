// ChallengeLeaderboardList.jsx
import React from 'react';
import styled from 'styled-components';
import ChallengeParticipantListItem from './ChallengeParticipantListItem';

const participants = [
  { rank: 5340, name: 'Melina H.', points: 142, friendsJoined: 3, invited: 10, viewed: 8, totalViews: 21 },
  { rank: 5341, name: 'David N.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
  { rank: 5340, name: 'Melina H.', points: 142, friendsJoined: 3, invited: 10, viewed: 8, totalViews: 21 },
  { rank: 5341, name: 'David B.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
  { rank: 5340, name: 'Melina H.', points: 142, friendsJoined: 3, invited: 10, viewed: 8, totalViews: 21 },
  { rank: 5341, name: 'David A.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
  { rank: 5341, name: 'David B.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
  { rank: 5340, name: 'Melina H.', points: 142, friendsJoined: 3, invited: 10, viewed: 8, totalViews: 21 },
  { rank: 5341, name: 'David A.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
  { rank: 5341, name: 'David B.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
  { rank: 5340, name: 'Melina H.', points: 142, friendsJoined: 3, invited: 10, viewed: 8, totalViews: 21 },
  { rank: 5341, name: 'David A.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
  { rank: 5341, name: 'David B.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
  { rank: 5340, name: 'Melina H.', points: 142, friendsJoined: 3, invited: 10, viewed: 8, totalViews: 21 },
  { rank: 5341, name: 'David A.', points: 121, friendsJoined: 1, invited: 7, viewed: 3, totalViews: 18 },
  { rank: 5342, name: 'Anusha G.', points: 118, friendsJoined: 1, invited: 5, viewed: 2, totalViews: 15 },
];

const currentUserName = 'David N.'; // Assume this is the logged-in user

const LeaderboardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100vh - 270px);
`;

const ChallengeLeaderboardList = () => (
  <LeaderboardListContainer>
    {participants.map((participant, index) => (
      <ChallengeParticipantListItem
          key={index}
          participant={participant}
          isCurrentUser={participant.name === currentUserName}
      />
    ))}
  </LeaderboardListContainer>
);

export default ChallengeLeaderboardList;
