import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FriendInvitationVoterLinkDisplayForList from './FriendInvitationVoterLinkDisplayForList';
import FriendInvitationEmailLinkDisplayForList from './FriendInvitationEmailLinkDisplayForList';
import { renderLog } from '../../utils/logging';

export default class FriendInvitationList extends Component {
  static propTypes = {
    friendList: PropTypes.array,
    invitationsSentByMe: PropTypes.bool,
    previewMode: PropTypes.bool,
  };

  render () {
    renderLog('FriendInvitationList');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendList, invitationsSentByMe, previewMode } = this.props;
    if (friendList === undefined) {
      return null;
    }

    let simpleKeyCounter = 0;

    return (
      <>
        <div className={!previewMode ? 'card' : null}>
          <div className={!previewMode ? 'card-main' : null}>
            {friendList.map((friend, index) => {
              // console.log('friend invitation: ', friend);
              if (friend.invitation_table && friend.invitation_table === 'VOTER') {
                // console.log('Index: ', index);
                // console.log('Length: ', friendList.length - 1);
                return (
                  <div key={`invite-key-${friend.voter_we_vote_id}`}>
                    <FriendInvitationVoterLinkDisplayForList
                      id={`invite-id-${friend.voter_we_vote_id}`}
                      {...friend}
                      invitationsSentByMe={invitationsSentByMe}
                      previewMode={previewMode}
                    />
                    {index !== friendList.length - 1 ? (
                      <hr />
                    ) : null}
                  </div>
                );
              } else if (friend.invitation_table && friend.invitation_table === 'EMAIL') {
                simpleKeyCounter++;
                return (
                  <div key={`invite-key-${simpleKeyCounter}`}>
                    <FriendInvitationEmailLinkDisplayForList
                      id={`invite-id-${simpleKeyCounter}`}
                      {...friend}
                      invitationsSentByMe={invitationsSentByMe}
                      previewMode={previewMode}
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
          </div>
        </div>
      </>
    );
  }
}
