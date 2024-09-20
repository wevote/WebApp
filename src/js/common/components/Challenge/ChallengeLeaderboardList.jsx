// ChallengeLeaderboardList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChallengeParticipantListItem from './ChallengeParticipantListItem';

const LeaderboardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100vh - 270px);
`;

const ChallengeLeaderboardList = ({ currentVoterWeVoteId, participantList }) => (
  <LeaderboardListContainer>
    {participantList.map((participant) => (
      <ChallengeParticipantListItem
          key={`participantKey-${participant.voter_we_vote_id}`}
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
