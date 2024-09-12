// ChallengeLeaderboard.jsx
import React from 'react';
import styled from 'styled-components';
import ChallengeLeaderboardList from './ChallengeLeaderboardList';

const LeaderboardContainer = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
  &:hover {
    background-color: #e0e0e0;
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 14px;
  width: 200px;
  border-radius: 5px;
  border: 1px solid #ddd;
`;

const ChallengeLeaderboard = () => (
  <LeaderboardContainer>
    <TopSection>
      <div>
        <Button>You</Button>
        <Button>Top 50</Button>
      </div>
      <SearchInput type="text" placeholder="Search by rank or name" />
    </TopSection>
    <ChallengeLeaderboardList />
  </LeaderboardContainer>
);

export default ChallengeLeaderboard;
