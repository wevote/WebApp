import React, { Suspense } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DesignTokenColors from '../Style/DesignTokenColors';
import ChallengeLeaderboardList from './ChallengeLeaderboardList';
import SearchBar2024 from '../../../components/Search/SearchBar2024';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import FirstChallengeParticipantListController from './FirstChallengeParticipantListController';

// const FirstChallengeParticipantListController = React.lazy(() => import(/* webpackChunkName: 'FirstChallengeParticipantListController' */ './FirstChallengeParticipantListController'));

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

const LeaderboardContainer = styled.div`
  max-width: 100vw;
  margin: 0 auto;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0px 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 1;
  position: sticky;
  top: 0;
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

function clearSearchFunction () {
  // This is just a stub
  return true;
}

function searchFunction () {
  // This is just a stub
  return true;
}


const ChallengeLeaderboard = ({ classes, challengeWeVoteId }) => {
  // eslint-disable-next-line no-unused-vars
  const [latestParticipants, setLatestParticipants] = React.useState([]);

  const onChallengeParticipantStoreChange = () => {
    setLatestParticipants(ChallengeParticipantStore.getChallengeParticipantList(challengeWeVoteId));
  };

  React.useEffect(() => {
    // console.log('Fetching participants for:', challengeWeVoteId);
    const storeListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();

    return () => {
      storeListener.remove();
    };
  }, [challengeWeVoteId]);
  return (
    <LeaderboardContainer>
      <TopSection>
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
              Top 50
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
        <LeaderboardInfoWrapper>
          <p>
            <span style={{ color: DesignTokenColors.neutral900, fontWeight: 'bold' }}>You&apos;re</span>
            {' '}
            <span style={{ color: DesignTokenColors.accent500, fontWeight: 'bold' }}>#5341</span>
            {' '}
            (of 6441)
          </p>

        </LeaderboardInfoWrapper>
        <LeaderboardTableHeader>
          <div style={{ display: 'flex', gap: '32px' }}>
            <p>RANK</p>
            <p>NAME</p>
          </div>
          <div style={{ display: 'flex', gap: '25px'  }}>
            <p>POINTS</p>
            <p>FRIENDS JOINED</p>
          </div>
        </LeaderboardTableHeader>
      </TopSection>
      <ChallengeLeaderboardList
        // participantList={latestParticipants}
        participantList={participants}
        currentVoterWeVoteId={'wv02voter123'}
      />
      <Suspense fallback={<></>}>
        <FirstChallengeParticipantListController challengeWeVoteId={challengeWeVoteId} searchText="SEARCH TEXT HERE" />
      </Suspense>
    </LeaderboardContainer>
  );
};

ChallengeLeaderboard.propTypes = {
  classes: PropTypes.object.isRequired,
  // clearSearchFunction: PropTypes.func.isRequired,
  // searchFunction: PropTypes.func.isRequired,
  challengeWeVoteId: PropTypes.string,
};

const styles = () => ({
  buttonDesktop: {
    padding: '2px 16px',
    borderRadius: 5,
  },
  searchButton: {
    borderRadius: 50,
  },
});

export default withStyles(styles)(ChallengeLeaderboard);
