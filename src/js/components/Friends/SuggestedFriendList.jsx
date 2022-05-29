import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import SuggestedFriendDisplayForList from './SuggestedFriendDisplayForList';

export default class SuggestedFriendList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      suggestedFriendList: [],
    };
  }

  componentDidMount () {
    const { friendList: suggestedFriendList } = this.props;
    this.setState({
      suggestedFriendList,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({
      suggestedFriendList: nextProps.friendList,
    });
  }

  render () {
    renderLog('SuggestedFriendList');  // Set LOG_RENDER_EVENTS to log all renders
    const { inSideColumn, previewMode } = this.props;
    const { suggestedFriendList } = this.state;
    if (suggestedFriendList === undefined) {
      return null;
    }

    return (
      <div>
        <div>
          {suggestedFriendList.map((friend, index) => (
            <div key={friend.voter_we_vote_id}>
              <SuggestedFriendDisplayForList
                inSideColumn={inSideColumn}
                linkedOrganizationWeVoteId={friend.linked_organization_we_vote_id}
                mutualFriends={friend.mutual_friends}
                positionsTaken={friend.positions_taken}
                previewMode={previewMode}
                stateCodeForDisplay={friend.state_code_for_display}
                voterDisplayName={friend.voter_display_name}
                voterEmailAddress={friend.voter_email_address}
                voterPhotoUrlLarge={friend.voter_photo_url_large}
                voterTwitterDescription={friend.voter_twitter_description}
                voterTwitterHandle={friend.voter_twitter_handle}
                voterWeVoteId={friend.voter_we_vote_id}
              />
              {index !== suggestedFriendList.length - 1 ? (
                <hr />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
SuggestedFriendList.propTypes = {
  friendList: PropTypes.array,
  inSideColumn: PropTypes.bool,
  previewMode: PropTypes.bool,
};
