import React from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import DesignTokenColors from '../Style/DesignTokenColors';
import ChallengeLeaderboardList from './ChallengeLeaderboardList';
import SearchBar2024 from '../../../components/Search/SearchBar2024';


const LeaderboardContainer = styled.div`
  max-width: 600px;
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


const ChallengeLeaderboard = ({ classes, clearSearchFunction, searchFunction }) => (
  <LeaderboardContainer>
    <TopSection>
      <ButtonAndSearchWrapper>
        <ButtonWrapper>
          <Button
          classes={{ root: classes.buttonDesktop }}
          color="primary"
          id="challengeLeaderboardYouButton"
          onClick={() => console.log('You button clicked')}
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
    <ChallengeLeaderboardList />
  </LeaderboardContainer>
);

ChallengeLeaderboard.propTypes = {
  classes: PropTypes.object.isRequired,
  clearSearchFunction: PropTypes.func.isRequired,
  searchFunction: PropTypes.func.isRequired,
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
