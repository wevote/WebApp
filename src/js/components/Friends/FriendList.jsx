import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import FriendDisplayForList from './FriendDisplayForList';

export default class FriendList extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    renderLog('FriendList');  // Set LOG_RENDER_EVENTS to log all renders
    const { friendList } = this.props;

    if (!friendList) {
      return null;
    }

    return (
      <div>
        {friendList.map((friend) => (
          <FriendDisplayForList
            key={friend.voter_we_vote_id}
            linkedOrganizationWeVoteId={friend.linked_organization_we_vote_id}
            mutualFriends={friend.mutual_friends}
            positionsTaken={friend.positions_taken}
            previewMode={this.props.previewMode}
            voterDisplayName={friend.voter_display_name}
            voterEmailAddress={friend.voter_email_address}
            voterPhotoUrlLarge={friend.voter_photo_url_large}
            voterTwitterHandle={friend.voter_twitter_handle}
            voterWeVoteId={friend.voter_we_vote_id}
          />
        ))}
      </div>
    );
  }
}
FriendList.propTypes = {
  friendList: PropTypes.array,
  previewMode: PropTypes.bool,
};
