import React, { Suspense, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import ChallengeParticipantList from './ChallengeParticipantList';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import FirstChallengeParticipantListController from './FirstChallengeParticipantListController';

// const FirstChallengeParticipantListController = React.lazy(() => import(/* webpackChunkName: 'FirstChallengeParticipantListController' */ './FirstChallengeParticipantListController'));

function ChallengeParticipantSimpleListRoot ({ challengeWeVoteId, uniqueExternalId, showSimpleList }) {
  const [participantList, setParticipantList] = useState([]);

  const onChallengeParticipantStoreChange = () => {
    const sortedParticipantsWithRank = ChallengeParticipantStore.getChallengeParticipantList(challengeWeVoteId);
    setParticipantList(sortedParticipantsWithRank);
  };

  React.useEffect(() => {
    // console.log('Fetching participants for:', challengeWeVoteId);
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();

    return () => {
      challengeParticipantStoreListener.remove();
    };
  }, [challengeWeVoteId]);

  // useEffect(() => {
  //   console.log('participantList from useEffect: ', participantList);
  // }, [participantList]);
  return (
    <ChallengeParticipantListRootContainer>
      <ChallengeParticipantList
        participantList={participantList}
        // participantList={participantListDummyData}
        uniqueExternalId={uniqueExternalId}
        showSimpleList={showSimpleList}
      />
      <Suspense fallback={<></>}>
        <FirstChallengeParticipantListController challengeWeVoteId={challengeWeVoteId} searchText="SEARCH TEXT HERE" />
      </Suspense>
    </ChallengeParticipantListRootContainer>
  );
}
ChallengeParticipantSimpleListRoot.propTypes = {
  classes: PropTypes.object.isRequired,
  // clearSearchFunction: PropTypes.func.isRequired,
  // searchFunction: PropTypes.func.isRequired,
  challengeWeVoteId: PropTypes.string,
  uniqueExternalId: PropTypes.string,
  showSimpleList: PropTypes.bool,
};

const styles = () => ({
  buttonDesktop: {
    padding: '2px 6px',
    borderRadius: 5,
    fontSize: 14,
  },
  searchButton: {
    borderRadius: 50,
  },
});

const ChallengeParticipantListRootContainer = styled.div`
  max-width: 100vw;
  margin: 0 auto;
`;
export default withStyles(styles)(ChallengeParticipantSimpleListRoot);
