import PropTypes from 'prop-types';
import withTheme from '@mui/styles/withTheme';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { withStyles } from '@mui/styles';
import { RemoveRedEye, CheckCircle, Check, InfoOutlined, EditOutlined, MoreHoriz } from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import DesignTokenColors from '../Style/DesignTokenColors';
import ConfirmYouSentInviteButton from './ConfirmYouSentInviteButton';
import InviteAgainButton from './InviteAgainButton';
import speakerDisplayNameToInitials from '../../utils/speakerDisplayNameToInitials';
import ViewInviteeDetails from '../ChallengeInviteFriends/ViewInviteeDetails';
import EditInviteeDetails from '../ChallengeInviteFriends/EditInviteeDetails';


const ChallengeInviteeListItem = ({ invitee }) => {
//   console.log('ChallengeInviteeListItem:', invitee);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewInviteeDetails, setViewInviteeDetails] = useState(false);
  const [editInviteeDetails, setEditInviteeDetails] = useState(false);

  const { sx, children } = speakerDisplayNameToInitials(invitee.invitee_name);
  let challengeStatusIconJsx = <></>;
  let challengeStatusMessage = '';
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

  const onDotButtonClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openViewInviteeDetails = () => {
    setViewInviteeDetails(true);
  };

  const openEditInviteeDetails = () => {
    setEditInviteeDetails(true);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <InvitedFriendDetails>
      <PrimaryDetails>
        <FriendName>
          <AvatarDetails sx={sx}>{children}</AvatarDetails>
          {' '}
          <Name>{invitee.invitee_name}</Name>
        </FriendName>
        <VerticalLine />
        <EditInviteeTripleDotWrapper>
          <TripleDotButton type="button" aria-label="source" onClick={onDotButtonClick}>
            <MoreHoriz />
          </TripleDotButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <PopoverWrapper>
              <PopoverNameAndMessageText>
                <StyledTypography onClick={openEditInviteeDetails}>
                  <EditOutlined style={{ fontSize: '14px', cursor: 'pointer', marginRight: '4px' }} />
                  Edit name & message
                </StyledTypography>
              </PopoverNameAndMessageText>
              <PopoverViewDetailsText>
                <StyledTypography onClick={openViewInviteeDetails}>
                  <InfoOutlined style={{ fontSize: '14px', cursor: 'pointer', marginRight: '4px' }} />
                  View details
                </StyledTypography>
              </PopoverViewDetailsText>
            </PopoverWrapper>
          </Popover>
          <EditInviteeDetails
            show={editInviteeDetails}
            setShow={setEditInviteeDetails}
            setAnchorEl={setAnchorEl}
            inviteeId={invitee.invitee_id}
          />
          <ViewInviteeDetails
            show={viewInviteeDetails}
            setShow={setViewInviteeDetails}
            setAnchorEl={setAnchorEl}
            inviteeId={invitee.invitee_id}
          />
        </EditInviteeTripleDotWrapper>
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
};

const styles = () => ({
  searchButton: {
    borderRadius: 50,
  },

});

const InvitedFriendDetails = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 15px 2px;
  border-bottom: 1px solid ${DesignTokenColors.neutral100};
`;

const PrimaryDetails = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FriendName = styled('div')`
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

const Name = styled('div')`
  font-weight: bold;
  color: ${DesignTokenColors.neutral900};
`;

const MessageContainer = styled('div')`
  display: flex;
`;

const MessageStatus = styled('div')`
  text-align: center;
  font-size: 14px;
  color: ${DesignTokenColors.confirmation800};
  margin-right: 10px;
`;

const VerticalLine = styled('div')`
  border-left: 1px solid ${DesignTokenColors.neutral200};
  height: 30px;
  margin: 0 10px;
`;

const EditInviteeTripleDotWrapper = styled('div')`
  margin-right: 10px;
  color: ${DesignTokenColors.neutral900};
  :hover {
    color: ${DesignTokenColors.neutral400};
    cursor: pointer;
  }
`;

const Options = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
`;

const PopoverWrapper = styled('div')`
  padding: 5px;
`;

const PopoverNameAndMessageText = styled('div')`
  padding: 6px;
`;

const PopoverViewDetailsText = styled('div')`
  padding: 6px;
  cursor: pointer;
`;

const StyledTypography = styled('div')`
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
`;

const TripleDotButton = styled('button')`
  background: transparent;
  border: 0;
`;

export default withTheme(withStyles(styles)(ChallengeInviteeListItem));
