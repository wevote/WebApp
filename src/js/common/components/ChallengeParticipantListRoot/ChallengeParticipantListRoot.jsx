import React, { Suspense, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import ChallengeParticipantList from './ChallengeParticipantList';
import SearchBar2024 from '../Search/SearchBar2024';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import FirstChallengeParticipantListController from './FirstChallengeParticipantListController';
import YourRankOutOf from '../Challenge/YourRankOutOf';
import ChallengeStore from '../../stores/ChallengeStore';

// const FirstChallengeParticipantListController = React.lazy(() => import(/* webpackChunkName: 'FirstChallengeParticipantListController' */ './FirstChallengeParticipantListController'));

function clearSearchFunction () {
  // This is just a stub
  return true;
}

function searchFunction () {
  // This is just a stub
  return true;
}


function ChallengeParticipantListRoot ({ challengeWeVoteId, classes, uniqueExternalId }) {
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

    return () => {
      appStateSubscription.unsubscribe();
      challengeParticipantStoreListener.remove();
      challengeStoreListener.remove();
    };
  }, [challengeWeVoteId]);
  return (
    <ChallengeParticipantListRootContainer>
      <TopSection>
        {voterIsChallengeParticipant && (
          <ButtonAndSearchWrapper>
            <ButtonWrapper>
              <Button
                classes={{ root: classes.buttonDesktop }}
                color="primary"
                id="challengeLeaderboardYouButton"
                onClick={() => console.log('You button clicked', challengeWeVoteId)}
                variant="outlined"
              >
                You
              </Button>
              <Button
                classes={{ root: classes.buttonDesktop }}
                color="primary"
                id="challengeLeaderboardTop50Button"
                onClick={() => console.log('Top 50 button clicked')}
                variant="outlined"
              >
                Top&nbsp;50
              </Button>
            </ButtonWrapper>
            <SearchBarWrapper>
              <SearchBar2024
                clearButton
                searchButton
                placeholder="Search by rank or name"
                searchFunction={searchFunction}
                clearFunction={clearSearchFunction}
                searchUpdateDelayTime={500}
              />
            </SearchBarWrapper>
          </ButtonAndSearchWrapper>
        )}
        <LeaderboardInfoWrapper>
          {!!(rankOfVoter) && (
            <YourRankOutOf rankOfVoter={rankOfVoter} participantsCount={participantsCount} />
          )}
        </LeaderboardInfoWrapper>
        <LeaderboardTableHeader>
          <HeaderGroup gap="70px">
            <HeaderItem>RANK</HeaderItem>
            <HeaderItem>NAME</HeaderItem>
          </HeaderGroup>
          <HeaderGroup gap="75px">
            <HeaderItem>POINTS</HeaderItem>
            <HeaderItem>FRIENDS JOINED</HeaderItem>
          </HeaderGroup>
        </LeaderboardTableHeader>
      </TopSection>
      <ChallengeParticipantList
        challengeWeVoteId={challengeWeVoteId}
        participantList={participantList}
        // participantList={participantListDummyData}
        uniqueExternalId={uniqueExternalId}
      />
      <Suspense fallback={<></>}>
        <FirstChallengeParticipantListController challengeWeVoteId={challengeWeVoteId} searchText="SEARCH TEXT HERE" />
      </Suspense>
    </ChallengeParticipantListRootContainer>
  );
}
ChallengeParticipantListRoot.propTypes = {
  classes: PropTypes.object.isRequired,
  // clearSearchFunction: PropTypes.func.isRequired,
  // searchFunction: PropTypes.func.isRequired,
  challengeWeVoteId: PropTypes.string,
  uniqueExternalId: PropTypes.string,
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

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0px 6px 6px -2px rgba(0, 0, 0, 0.1);
  // z-index: 1;
  position: sticky;
  top: 0;
  padding: 10px;
`;

const ButtonAndSearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const LeaderboardInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const SearchBarWrapper = styled('div')`
  // margin-top: 14px;
  // margin-bottom: 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const LeaderboardTableHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: bold;
  font-size: 12px;
  color: #333;
`;

const HeaderGroup = styled.div`
  display: flex;
  gap: ${(props) => props.gap || '32px'}; /* Default gap of 32px, adjustable via props */
`;

const HeaderItem = styled.p`
  margin: 0;  /* Reset default margins */
`;

export default withStyles(styles)(ChallengeParticipantListRoot);
