import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChallengeParticipantListItem from './ChallengeParticipantListItem';
import VoterStore from '../../../stores/VoterStore';

const ChallengeParticipantList = ({ participantList, uniqueExternalId, showSimpleList, challengeWeVoteId }) => {
  const [voterWeVoteID, setVoterWeVoteID] = React.useState('');

  const handleVoterStoreChange = () => {
    const voterID = VoterStore.getVoterWeVoteId();
    setVoterWeVoteID(voterID);
  };

  React.useEffect(() => {
    handleVoterStoreChange();
    const storeListener = VoterStore.addListener(handleVoterStoreChange);
    return () => {
      storeListener.remove();
    };
  }, []);

  const sortedParticipantList = [...participantList].sort((a, b) => a.rank - b.rank);

  const currentUser = sortedParticipantList.find(
    (participant) => participant.voter_we_vote_id === voterWeVoteID,
  );

  let simpleParticipantList = [];
  if (currentUser) {
    const currentUsersRank = currentUser.rank;

    simpleParticipantList = sortedParticipantList.filter((participant) => {
      const { rank } = participant;

      if (rank === currentUsersRank) {
        return true;
      }

      if (rank === currentUsersRank - 1 && rank > 0) {
        return true;
      }

      if (rank === currentUsersRank + 1 && rank <= sortedParticipantList.length) {
        return true;
      }

      return false;
    });
  }

  return (
    <LeaderboardListContainer>
      {showSimpleList && simpleParticipantList.map((participant) => (
        <ChallengeParticipantListItem
          challengeWeVoteId={challengeWeVoteId}
          isCurrentUser={participant.voter_we_vote_id === voterWeVoteID}
          key={`participantKey-${participant.voter_we_vote_id}-${uniqueExternalId}`}
          participant={participant}
          showSimpleList={showSimpleList}
        />
      ))}
      {!showSimpleList && participantList.map((participant) => (
        <ChallengeParticipantListItem
          challengeWeVoteId={challengeWeVoteId}
          isCurrentUser={participant.voter_we_vote_id === voterWeVoteID}
          key={`participantKey-${participant.voter_we_vote_id}-${uniqueExternalId}`}
          participant={participant}
          showSimpleList={showSimpleList}
        />
      ))}
    </LeaderboardListContainer>
  );
};

ChallengeParticipantList.propTypes = {
  challengeWeVoteId: PropTypes.string,
  participantList: PropTypes.array,
  uniqueExternalId: PropTypes.string,
  showSimpleList: PropTypes.bool,
};

const LeaderboardListContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100vh - 270px);
  padding: 10px;
`;

export default ChallengeParticipantList;
