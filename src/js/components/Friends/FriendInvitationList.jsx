import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import FriendInvitationEmailLinkDisplayForList from './FriendInvitationEmailLinkDisplayForList';
import FriendInvitationVoterLinkDisplayForList from './FriendInvitationVoterLinkDisplayForList';

export default class FriendInvitationList extends Component {
  render () {
    renderLog('FriendInvitationList');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendList, invitationsSentByMe, previewMode } = this.props;
    if (friendList === undefined) {
      return null;
    }

    return (
      <FriendInvitationListWrapper>
        {friendList.map((friend, index) => {
          // console.log('friend invitation: ', friend);
          if (friend.invitation_table && friend.invitation_table === 'VOTER') {
            // console.log('Index: ', index);
            // console.log('Length: ', friendList.length - 1);
            return (
              <div key={`invite-key-${friend.voter_we_vote_id}`}>
                <FriendInvitationVoterLinkDisplayForList
                  id={`invite-id-${friend.voter_we_vote_id}`}
                  invitationsSentByMe={invitationsSentByMe}
                  stateCodeForDisplay={friend.state_code_for_display}
                  linkedOrganizationWeVoteId={friend.linked_organization_we_vote_id}
                  mutualFriendCount={friend.mutual_friend_count}
                  mutualFriendPreviewList={friend.mutual_friend_preview_list}
                  previewMode={previewMode}
                  voterDisplayName={friend.voter_display_name}
                  voterEmailAddress={friend.voter_email_address}
                  voterPhotoUrlLarge={friend.voter_photo_url_large}
                  voterTwitterDescription={friend.voter_twitter_description}
                  voterTwitterHandle={friend.voter_twitter_handle}
                  voterWeVoteId={friend.voter_we_vote_id}
                />
                {index !== friendList.length - 1 ? (
                  <hr />
                ) : null}
              </div>
            );
          } else if (friend.invitation_table && friend.invitation_table === 'EMAIL') {
            return (
              <div key={`invite-key-${friend.voter_email_address}`}>
                <FriendInvitationEmailLinkDisplayForList
                  id={`invite-id-${friend.voter_email_address}`}
                  invitationState={friend.invitation_status}
                  linkedOrganizationWeVoteId={friend.linked_organization_we_vote_id}
                  mutualFriendCount={friend.mutual_friend_count}
                  mutualFriendPreviewList={friend.mutual_friend_preview_list}
                  previewMode={previewMode}
                  voterDisplayName={friend.voter_display_name}
                  voterEmailAddress={friend.voter_email_address}
                  voterPhotoUrlLarge={friend.voter_photo_url_large}
                  voterTwitterHandle={friend.voter_twitter_handle}
                />
                {index !== friendList.length - 1 ? (
                  <hr />
                ) : null}
              </div>
            );
          } else {
            return null;
          }
        })}
      </FriendInvitationListWrapper>
    );
  }
}
FriendInvitationList.propTypes = {
  friendList: PropTypes.array,
  invitationsSentByMe: PropTypes.bool,
  previewMode: PropTypes.bool,
};

const FriendInvitationListWrapper = styled('div')`
  width: 100%;
`;
