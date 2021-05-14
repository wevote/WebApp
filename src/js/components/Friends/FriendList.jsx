import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
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
      <div className="guidelist card-child__list-group">
        {friendList.map((friend) => (
          <FriendDisplayForList
            key={friend.voter_we_vote_id}
            previewMode={this.props.previewMode}
            {...friend}
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
