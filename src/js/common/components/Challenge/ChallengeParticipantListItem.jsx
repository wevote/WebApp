import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import DesignTokenColors from '../Style/DesignTokenColors';

const ParticipantItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: ${(props) => (props.isCurrentUser ? '#f9e79f' : '#fff')};
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Rank = styled.div`
  font-weight: bold;
  color: ${DesignTokenColors.neutral900};
  width: 60px;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  margin-left: 10px;
  color: ${DesignTokenColors.neutral900};
`;

const Points = styled.div`
  width: 200px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: ${DesignTokenColors.neutral900};
`;

const FriendsJoined = styled.div`
  width: 30px;
  text-align: center;
  font-size: 14px;
  color: ${DesignTokenColors.neutral900};
`;

const Details = styled.div`
  text-align: left;
  font-size: 14px;
`;

const ChallengeParticipantListItem = ({ participant, isCurrentUser }) => (
  <ParticipantItem isCurrentUser={isCurrentUser}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Rank>{`#${participant.rank}`}</Rank>
      <Name>
        <Avatar>{`${participant.participant_name.split(' ')[0][0]}${participant.participant_name.split(' ')[1][0]}`}</Avatar>
        {' '}
        {participant.participant_name}
      </Name>
      <Points>{participant.points}</Points>
      <FriendsJoined>{participant.friends_who_joined}</FriendsJoined>
    </div>
    <Details>
      {`${participant.friends_invited} invited, ${participant.friends_who_viewed} viewed challenge - ${participant.friends_who_viewed_plus} total views`}
    </Details>
  </ParticipantItem>
);

export default ChallengeParticipantListItem;
