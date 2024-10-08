import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { withStyles } from '@mui/styles';
import { RemoveRedEye, CheckCircle, Check, MoreHoriz } from '@mui/icons-material';
import DesignTokenColors from '../Style/DesignTokenColors';
import ConfirmYouSentInviteButton from './ConfirmYouSentInviteButton';
import InviteAgainButton from './InviteAgainButton';
import speakerDisplayNameToInitials from '../../utils/speakerDisplayNameToInitials';

const ChallengeInviteeListItem = ({ invitee, classes }) => {
  // console.log('ChallengeInviteeListItem:', invitee);
  const { sx, children } = speakerDisplayNameToInitials(invitee.invitee_name);
  let challengeStatusIconJsx = <></>;
  let challengeStatusMessage = ''
  if (invitee.challenge_joined) {
    challengeStatusIconJsx = <CheckCircle />;
    challengeStatusMessage = 'Challenge joined';
  } else if (invitee.invite_viewed) {
    challengeStatusIconJsx = <RemoveRedEye />;
    challengeStatusMessage = 'Challenge viewed';
  } else if (invitee.invite_sent) {
    challengeStatusIconJsx = <Check />;
    challengeStatusMessage = 'Invite sent';
  }
  return (
    <InvitedFriendDetails>
      <PrimaryDetails>
        <FriendName>
          <AvatarDetails sx={sx}>{children}</AvatarDetails>
          {' '}
          <Name>{invitee.invitee_name}</Name>
        </FriendName>
        <VerticalLine />
        <ActivityCommentEditWrapper>
          <MoreHoriz />
        </ActivityCommentEditWrapper>
      </PrimaryDetails>
      <Options>
        <div>
          {invitee.invite_sent === false ? (
            <ConfirmYouSentInviteButton
              challengeInviteeId={invitee.invitee_id}
              challengeWeVoteId={invitee.challenge_we_vote_id}
            />
          ) : (
            <MessageContainer>
              <MessageStatus>
                {challengeStatusIconJsx}
              </MessageStatus>
              {challengeStatusMessage}
            </MessageContainer>
          )}
        </div>
        {invitee.messageStatus !== 'Challenge Joined' && (
          <InviteAgainButton
            challengeInviteeId={invitee.invitee_id}
            challengeWeVoteId={invitee.challenge_we_vote_id}
          />
        )}
      </Options>
    </InvitedFriendDetails>
  );
};

ChallengeInviteeListItem.propTypes = {
  invitee: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  searchButton: {
    borderRadius: 50,
  },
});


const InvitedFriendDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 15px 2px;
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
`;

const PrimaryDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FriendName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`;

const AvatarDetails = styled(Avatar)`
  width: 35px;
  height: 35px;
  font-size: 1rem;
`;

const Name = styled.div`
  font-weight: bold;
  color: ${DesignTokenColors.neutral900};
`;

const MessageContainer = styled.div`
  display: flex;
`;

const MessageStatus = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${DesignTokenColors.confirmation800};
  margin-right: 10px;
`;

const VerticalLine = styled.div`
  border-left: 1px solid ${DesignTokenColors.neutral200};
  height: 30px;
  margin: 0 10px;
`;

const ActivityCommentEditWrapper = styled('div')`
  margin-right: 10px;
  color: ${DesignTokenColors.neutral900};
  :hover {
    color: ${DesignTokenColors.neutral400};
    cursor: pointer;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
`;

const Invite = styled.a`
  padding: 5px;
  color: #4371cc;
`;

export default withStyles(styles)(ChallengeInviteeListItem);
