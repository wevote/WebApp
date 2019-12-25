import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FriendDisplayForList from './FriendDisplayForList';
import { renderLog } from '../../utils/logging';

export default class FriendList extends Component {
  static propTypes = {
    editMode: PropTypes.bool,
    friendList: PropTypes.array,
    previewMode: PropTypes.bool,
  };

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
        {friendList.map(friend => (
          <FriendDisplayForList
            editMode={this.props.editMode}
            key={friend.voter_we_vote_id}
            previewMode={this.props.previewMode}
            {...friend}
          />
        ))
        }
      </div>
    );
  }
}
