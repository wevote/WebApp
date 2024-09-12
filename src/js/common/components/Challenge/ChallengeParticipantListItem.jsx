import React from 'react';
import styled from 'styled-components';

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: ${(props) => (props.isCurrentUser ? '#f9e79f' : '#fff')};  /* Highlight background for current user */
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Rank = styled.div`
  font-weight: bold;
  color: #007bff;
  width: 60px;
`;

const Name = styled.div`
  flex: 1;
  margin-left: 10px;
`;

const Points = styled.div`
  width: 50px;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
`;

const FriendsJoined = styled.div`
  width: 30px;
  text-align: center;
  font-size: 14px;
`;

const Details = styled.div`
  flex: 2;
  text-align: left;
  font-size: 14px;
  color: #666;
`;

const ChallengeParticipantListItem = ({ participant, isCurrentUser }) => (
  <ParticipantItem isCurrentUser={isCurrentUser}>
    <Rank>{`#${participant.rank}`}</Rank>
    <Name>{participant.name}</Name>
    <Points>{participant.points}</Points>
    <FriendsJoined>{participant.friendsJoined}</FriendsJoined>
    <Details>
      {`${participant.invited} invited, ${participant.viewed} viewed challenge - ${participant.totalViews} total views`}
    </Details>
  </ParticipantItem>
);

export default ChallengeParticipantListItem;
