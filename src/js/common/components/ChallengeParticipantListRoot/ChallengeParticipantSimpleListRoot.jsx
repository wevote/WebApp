import React, { Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import ChallengeParticipantList from './ChallengeParticipantList';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import FirstChallengeParticipantListController from './FirstChallengeParticipantListController';
import ChallengeStore from '../../stores/ChallengeStore';

// const FirstChallengeParticipantListController = React.lazy(() => import(/* webpackChunkName: 'FirstChallengeParticipantListController' */ './FirstChallengeParticipantListController'));

const ChallengeParticipantSimpleListRoot = ({ challengeWeVoteId, classes, uniqueExternalId, showSimpleList }) => {
  // eslint-disable-next-line no-unused-vars
  const [participantList, setParticipantList] = React.useState([]);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [rankOfVoter, setRankOfVoter] = React.useState(0);
  const [voterIsChallengeParticipant, setVoterIsChallengeParticipant] = React.useState(false);

  const onAppObservableStoreChange = () => {
    setRankOfVoter(AppObservableStore.getChallengeParticipantRankOfVoterByChallengeWeVoteId(challengeWeVoteId));
  };

  const onChallengeParticipantStoreChange = () => {
    const sortedParticipantsWithRank = ChallengeParticipantStore.getChallengeParticipantList(challengeWeVoteId);
    setParticipantList(sortedParticipantsWithRank);
    setParticipantsCount(sortedParticipantsWithRank.length);
  };

  const onChallengeStoreChange = () => {
    setVoterIsChallengeParticipant(ChallengeStore.getVoterIsChallengeParticipant(challengeWeVoteId));
  };

  React.useEffect(() => {
    // console.log('Fetching participants for:', challengeWeVoteId);
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();
    const challengeStoreListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();
    console.log(participantList);

    return () => {
      appStateSubscription.unsubscribe();
      challengeParticipantStoreListener.remove();
      challengeStoreListener.remove();
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
};
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
