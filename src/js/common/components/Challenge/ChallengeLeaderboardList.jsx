// ChallengeLeaderboardList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChallengeParticipantListItem from './ChallengeParticipantListItem';
import VoterStore from '../../../stores/VoterStore';

const ChallengeLeaderboardList = ({ participantList }) => {
  const [voterWeVoteID, setVoterWeVoteID] = React.useState('');
  React.useEffect(() => {
    // console.log('Fetching voterWeVoteID:', voterWeVoteID);
    setVoterWeVoteID(VoterStore.getVoterWeVoteId());
  }, []);

  return (
    <LeaderboardListContainer>
      {participantList.map((participant) => (
        <ChallengeParticipantListItem
          key={`participantKey-${participant.voter_we_vote_id}`}
          participant={participant}
          isCurrentUser={participant.voter_we_vote_id === voterWeVoteID}
        />
      ))}
    </LeaderboardListContainer>
  );
};
ChallengeLeaderboardList.propTypes = {
  currentVoterWeVoteId: PropTypes.string,
  participantList: PropTypes.array,
};
const LeaderboardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100vh - 270px);
`;

export default ChallengeLeaderboardList;
