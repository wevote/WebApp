import React from 'react';
import styled from 'styled-components';
import ChallengeFriendInvite from './ChallengeFriendInvite';

const friendsDetailsList = [
  { name: 'Jane', messageStatus: '' },
  { name: 'Unnamed friend1', messageStatus: 'Message Sent' },
  { name: 'John', messageStatus: 'Message Viewed' },
  { name: 'Melina H.', messageStatus: 'Challenge Joined' },
  { name: 'Melina H.', messageStatus: 'Challenge Joined' },
  { name: 'Melina H.', messageStatus: 'Challenge Joined' },
  { name: 'Melina H.', messageStatus: '' },
  { name: 'Melina H.', messageStatus: 'Message Viewed' },  
  { name: 'Melina H.', messageStatus: 'Challenge Joined' },
  { name: 'Melina H.', messageStatus: 'Challenge Joined' },
  { name: 'Melina H.', messageStatus: 'Message Sent' },
  { name: 'Melina H.', messageStatus: 'Message Sent' },  
];

const FriendsInviteListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100vh - 270px);
`;

const ChallengeFriendInviteList = () => (
  <FriendsInviteListContainer>
    {friendsDetailsList.map((friendDetails, index) => (
      <ChallengeFriendInvite
          key={index}
          friendDetails={friendDetails}
      />
    ))}
  </FriendsInviteListContainer>
);

export default ChallengeFriendInviteList;
