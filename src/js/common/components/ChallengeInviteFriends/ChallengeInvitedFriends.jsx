import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChallengeFriendInviteList from './ChallengeFriendInviteList';
import FirstChallengeInviteeListController from '../Challenge/FirstChallengeInviteeListController';

const ChallengeInvitedFriends = ({ challengeWeVoteId, classes }) => {
  return (
    <ChallengeInvitedFriendsContainer>
      <Heading>
        <p style={{ fontWeight: 'bold', padding: '10px' }}>Invited Friends</p>
      </Heading>
      <ChallengeFriendInviteList />
      <Suspense fallback={<></>}>
        <FirstChallengeInviteeListController challengeWeVoteId={challengeWeVoteId} searchText="SEARCH TEXT HERE" />
      </Suspense>
    </ChallengeInvitedFriendsContainer>
  );
};
ChallengeInvitedFriends.propTypes = {
  classes: PropTypes.object.isRequired,
  challengeWeVoteId: PropTypes.string,
};

const ChallengeInvitedFriendsContainer = styled.div`
  max-width: 110vw;
  margin: 0 auto;
`;

const Heading = styled.div`
  padding: 0 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export default ChallengeInvitedFriends;
