import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import DesignTokenColors from '../Style/DesignTokenColors';
import speakerDisplayNameToInitials from '../../utils/speakerDisplayNameToInitials';
import formatParticipantNameForSimpleList from '../../utils/formatParticipantNameForSimpleList';
import { getChallengeValuesFromIdentifiers } from '../../utils/challengeUtils';

const ChallengeParticipantListItem = ({ challengeWeVoteId, participant, isCurrentUser, showSimpleList }) => {
  let avatarJsx;
  if (participant && participant.we_vote_hosted_profile_image_url_medium) {
    avatarJsx = <AvatarStyled src={participant.we_vote_hosted_profile_image_url_medium} alt={participant.participant_name} />;
  } else {
    const { sx, children } = speakerDisplayNameToInitials(participant.participant_name);
    avatarJsx = <AvatarStyled sx={sx}>{children}</AvatarStyled>;
  }

  const formattedName = React.useMemo(() => formatParticipantNameForSimpleList(participant.participant_name), [participant.participant_name]);
  function getChallengeBasePath () {
    const {
      challengeSEOFriendlyPath,
    } = getChallengeValuesFromIdentifiers('', challengeWeVoteId);
    let challengeBasePath;
    if (challengeSEOFriendlyPath) {
      challengeBasePath = `/${challengeSEOFriendlyPath}/+/`;
    } else {
      challengeBasePath = `/++/${challengeWeVoteId}/`;
    }
    return challengeBasePath;
  }

  return (
    <ParticipantItem showSimpleList={showSimpleList} isCurrentUser={isCurrentUser}>
      <ParticipantRow showSimpleList={showSimpleList}>
        <Rank showSimpleList={showSimpleList} isCurrentUser={isCurrentUser}>{`#${participant.rank}`}</Rank>
        <Name showSimpleList={showSimpleList} isCurrentUser={isCurrentUser}>
          {avatarJsx}
          {formattedName}
        </Name>
        <Points showSimpleList={showSimpleList} isCurrentUser={isCurrentUser}>
          <span>{participant.points}</span>
          {showSimpleList && <span>Points</span>}
        </Points>
        {!showSimpleList && <FriendsJoined makeBold={participant.invitees_who_joined > 0}>{participant.invitees_who_joined}</FriendsJoined>}
      </ParticipantRow>
      {!showSimpleList && (
      <Details>
        {participant.invitees_count > 0 && `${participant.invitees_count} invited`}
        {(participant.invitees_count > 0 && participant.invitees_who_viewed > 0) ? ', ' : ''}
        {participant.invitees_who_viewed > 0 && `${participant.invitees_who_viewed} viewed challenge`}
        {(participant.invitees_who_viewed_plus > 0 && participant.invitees_who_viewed !== participant.invitees_who_viewed_plus) && (
          <>
            {' '}
            {`- ${participant.invitees_who_viewed_plus} total views`}
          </>
        )}
        {(isCurrentUser && challengeWeVoteId) && (
          <>
            {' '}
            <Link
              className="u-link-color u-link-underline"
              id="boostYourScore"
              to={`${getChallengeBasePath()}invite-friends`}
            >
              boost your score
            </Link>
          </>
        )}
      </Details>
      )}
    </ParticipantItem>
  );
};
ChallengeParticipantListItem.propTypes = {
  challengeWeVoteId: PropTypes.string,
  isCurrentUser: PropTypes.bool,
  participant: PropTypes.object,
  showSimpleList: PropTypes.bool,
};

const AvatarStyled = styled(Avatar)`
`;

const Rank = styled('div', {
  shouldForwardProp: (prop) => !['showSimpleList, isCurrentUser'].includes(prop),
})(({ showSimpleList, isCurrentUser }) => `
  font-weight: ${isCurrentUser ? 'bold' : 'normal'};
  width: ${showSimpleList ? 'fit-content' : '35px'};
`);

const Name = styled('div', {
  shouldForwardProp: (prop) => !['isCurrentUser'].includes(prop),
})(({ isCurrentUser }) => `
  align-items: center;
  display: flex;
  width: 200px;
  font-weight: ${isCurrentUser ? 'bold' : 'normal'};
  gap: 10px;
`);

const Points = styled('div', {
  shouldForwardProp: (prop) => !['showSimpleList, isCurrentUser'].includes(prop),
})(({ showSimpleList, isCurrentUser }) => `
  font-size: ${showSimpleList ? '18px' : '14px'};
  font-weight: ${isCurrentUser ? 'bold' : 'normal'};
  text-align: center;
  width: 80px;
  display: ${showSimpleList && 'flex'};
  justify-content: ${showSimpleList && 'space-around;'};
`);

const Details = styled('div')`
  color: ${DesignTokenColors.neutral900};
  font-size: 14px;
  margin-top: 8px;
  text-align: left;
`;

const FriendsJoined = styled('div', {
  shouldForwardProp: (prop) => !['makeBold'].includes(prop),
})(({ makeBold }) => (`
  color: ${DesignTokenColors.neutral900};
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  width: 76px;
`));

const ParticipantItem = styled('div', {
  shouldForwardProp: (prop) => !['isCurrentUser, showSimpleList'].includes(prop),
})(({ isCurrentUser, showSimpleList }) => (`
  background-color: ${isCurrentUser ? '#f9e79f' : '#fff'};
  padding: 15px 0 15px 7px;
  width: 100%;
  ${!showSimpleList && `border-bottom: 1px solid ${DesignTokenColors.neutral100};`}
`));

const ParticipantRow = styled('div', {
  shouldForwardProp: (prop) => !['showSimpleList'].includes(prop),
})(({ showSimpleList }) => (`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${showSimpleList ? '25px;' : ''}
`));
export default ChallengeParticipantListItem;
