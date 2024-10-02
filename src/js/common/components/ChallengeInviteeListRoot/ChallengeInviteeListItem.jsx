import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { RemoveRedEye, CheckCircle, Check, MoreHoriz } from '@mui/icons-material';
import DesignTokenColors from '../Style/DesignTokenColors';
import speakerDisplayNameToInitials from '../../utils/speakerDisplayNameToInitials';

const ChallengeInviteeListItem = ({ invitee }) => {
  // console.log('ChallengeInviteeListItem:', invitee);
  const { sx, children } = speakerDisplayNameToInitials(invitee.invitee_name);
  return (
    <InvitedFriendDetails>
      <PrimaryDetails>
        <FriendName>
          <AvatarDetails sx={sx}>{children}</AvatarDetails>
          {' '}
          <Name>{invitee.invitee_name}</Name>
        </FriendName>
        <MessageStatus>
          {invitee.messageStatus === 'Message Viewed' && <RemoveRedEye />}
          {invitee.messageStatus === 'Message Sent' && <Check />}
          {invitee.messageStatus === 'Challenge Joined' && <CheckCircle />}
          {'  '}
          {invitee.messageStatus}
        </MessageStatus>
        <VerticalLine />
        <ActivityCommentEditWrapper>
          <MoreHoriz />
        </ActivityCommentEditWrapper>
      </PrimaryDetails>
      <Options>
        <div>
          {invitee.invite_sent === false && (
            <InformationtoWevote>
              Let us know you sent the message
            </InformationtoWevote>
          )}
        </div>
        {invitee.messageStatus !== 'Challenge Joined' && (
          <Invite>
            Invite Again
          </Invite>
        )}
      </Options>
    </InvitedFriendDetails>
  );
};

ChallengeInviteeListItem.propTypes = {
  invitee: PropTypes.object,
};

const InvitedFriendDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 15px 2px;
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

const MessageStatus = styled.div`
  width: 170px;
  text-align: center;
  font-size: 14px;
  color: ${DesignTokenColors.confirmation800};
`;

const VerticalLine = styled.div`
  border-left: 1px solid black;
  height: 30px;
  margin: 0 10px;
`;

const ActivityCommentEditWrapper = styled('div')`
  margin-right: 10px;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
  color: #4371cc;
`;

const InformationtoWevote = styled.div`
  border: 2px solid #4371cc;
  border-radius: 15px;
  padding:5px;
  font-size: 15px;;
`;

const Invite = styled.div`
  padding: 5px;
`;

export default ChallengeInviteeListItem;
