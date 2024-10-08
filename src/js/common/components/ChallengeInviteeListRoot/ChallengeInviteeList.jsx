import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ChallengeInviteeListItem from './ChallengeInviteeListItem';

const ChallengeInviteeList = ({ inviteeList }) => (
  <ChallengeInviteeListContainer>
    {inviteeList.map((invitee) => (
      <ChallengeInviteeListItem
        key={`inviteeKey-${invitee.invitee_id}`}
        invitee={invitee}
      />
    ))}
  </ChallengeInviteeListContainer>
);
ChallengeInviteeList.propTypes = {
  inviteeList: PropTypes.array,
};

const ChallengeInviteeListContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: calc(100vh - 200px);
`;

export default ChallengeInviteeList;
