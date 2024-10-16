import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import DesignTokenColors from '../Style/DesignTokenColors';
import speakerDisplayNameToInitials from '../../utils/speakerDisplayNameToInitials';

const ChallengeParticipantListItem = ({ participant, isCurrentUser }) => {
  let avatarJsx;
  if (participant && participant.we_vote_hosted_profile_image_url_medium) {
    avatarJsx = <Avatar src={participant.we_vote_hosted_profile_image_url_medium} alt={participant.participant_name} />;
  } else {
    const { sx, children } = speakerDisplayNameToInitials(participant.participant_name);
    avatarJsx = <Avatar sx={sx}>{children}</Avatar>;
  }
  return (
    <ParticipantItem isCurrentUser={isCurrentUser}>
      <ParticipantRow>
        <Rank>{`#${participant.rank}`}</Rank>
        <Name>
          {avatarJsx}
          {participant.participant_name}
        </Name>
        <Points>{participant.points}</Points>
        <FriendsJoined makeBold={participant.invitees_who_joined > 0}>{participant.invitees_who_joined}</FriendsJoined>
      </ParticipantRow>
      <Details>
        {`${participant.invitees_count} invited, `}
        {`${participant.invitees_who_viewed} viewed challenge`}
        {(participant.invitees_who_viewed_plus > 0 && participant.invitees_who_viewed !== participant.invitees_who_viewed_plus) && (
          <>
            {' '}
            {`- ${participant.invitees_who_viewed_plus} total views`}
          </>
        )}
      </Details>
    </ParticipantItem>
  );
};
ChallengeParticipantListItem.propTypes = {
  isCurrentUser: PropTypes.bool,
  participant: PropTypes.object,
};

const ParticipantItem = styled('div', {
  shouldForwardProp: (prop) => !['isCurrentUser'].includes(prop),
})(({ isCurrentUser }) => (`
  background-color: ${isCurrentUser ? '#f9e79f' : '#fff'};
  padding: 15px 0 15px 7px;
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
`));

const ParticipantRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Rank = styled.div`
  font-weight: bold;
  color: ${DesignTokenColors.neutral900};
  width: 35px; /* Adjust width as needed */
`;

const Name = styled.div`
  align-items: center;
  color: ${DesignTokenColors.neutral900};
  display: flex;
  flex: 1;
  font-weight: bold;
  gap: 10px;
  margin-left: 10px;
`;

const Points = styled.div`
  color: ${DesignTokenColors.neutral900};
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  width: 80px;
`;

const FriendsJoined = styled('div', {
  shouldForwardProp: (prop) => !['makeBold'].includes(prop),
})(({ makeBold }) => (`
  color: ${DesignTokenColors.neutral900};
  font-size: 14px;
  ${makeBold ? 'font-weight: bold;' : ''}
  text-align: center;
  width: 76px;
`));

const Details = styled.div`
  color: ${DesignTokenColors.neutral900};
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
`;

export default ChallengeParticipantListItem;
