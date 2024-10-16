// ChallengeParticipantList.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChallengeParticipantListItem from './ChallengeParticipantListItem';
import VoterStore from '../../../stores/VoterStore';

const ChallengeParticipantList = ({ participantList, uniqueExternalId }) => {
  const [voterWeVoteID, setVoterWeVoteID] = React.useState('');

  const handleVoterStoreChange = () => {
    const voterID = VoterStore.getVoterWeVoteId();
    // console.log('Fetching voterWeVoteID:', voterID);
    setVoterWeVoteID(voterID);
  };

  React.useEffect(() => {
    handleVoterStoreChange();
    const storeListener = VoterStore.addListener(handleVoterStoreChange);
    return () => {
      storeListener.remove();
    };
  }, []);

  return (
    <LeaderboardListContainer>
      {participantList.map((participant) => (
        <ChallengeParticipantListItem
          key={`participantKey-${participant.voter_we_vote_id}-${uniqueExternalId}`}
          participant={participant}
          isCurrentUser={participant.voter_we_vote_id === voterWeVoteID}
        />
      ))}
    </LeaderboardListContainer>
  );
};
ChallengeParticipantList.propTypes = {
  participantList: PropTypes.array,
  uniqueExternalId: PropTypes.string,
};

const LeaderboardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100vh - 270px);
  padding: 10px;
`;

export default ChallengeParticipantList;
