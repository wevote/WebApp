import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FriendInvitationDisplayForList from './FriendInvitationDisplayForList';
import FriendInvitationEmailForList from './FriendInvitationEmailForList';
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
              if (friend.voter_we_vote_id && friend.voter_we_vote_id !== '') {
                // console.log('Index: ', index);
                // console.log('Length: ', friendList.length - 1);
                return (
                  <div key={`invite-key-${friend.voter_we_vote_id}`}>
                    <FriendInvitationDisplayForList
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
              } else {
                simpleKeyCounter++;
                return (
                  <div key={`invite-key-${simpleKeyCounter}`}>
                    <FriendInvitationEmailForList
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
              }
            })}
          </div>
        </div>
      </>
    );
  }
}
