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
    renderLog(__filename);
    if (this.state.suggestedFriendList === undefined) {
      return null;
    }

    return (
      <div className="guidelist card-child__list-group">
        {this.state.suggestedFriendList.map(friend => (
          <SuggestedFriendDisplayForList
            key={friend.voter_we_vote_id}
            {...friend}
            previewMode={this.props.previewMode}
          />
        ))
        }
      </div>
    );
  }
}
