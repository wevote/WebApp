import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SuggestedFriendDisplayForList from './SuggestedFriendDisplayForList';
import { renderLog } from '../../utils/logging';

export default class SuggestedFriendList extends Component {
  static propTypes = {
    friendList: PropTypes.array,
    previewMode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      suggestedFriendList: this.props.friendList,
    };
  }

  componentDidMount () {
    this.setState({
      suggestedFriendList: this.props.friendList,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      suggestedFriendList: nextProps.friendList,
    });
  }

  render () {
    renderLog('SuggestedFriendList');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.suggestedFriendList === undefined) {
      return null;
    }

    return (
      <div className={!this.props.previewMode ? 'card' : null}>
        <div className={!this.props.previewMode ? 'card-main' : null}>
          {this.state.suggestedFriendList.map((friend, index) => (
            <div key={friend.voter_we_vote_id}>
              <SuggestedFriendDisplayForList
                {...friend}
                previewMode={this.props.previewMode}
              />
              {index !== this.state.suggestedFriendList.length - 1 ? (
                <hr />
              ) : null}
            </div>
          ))
          }
        </div>
      </div>
    );
  }
}
