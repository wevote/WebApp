import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FriendInvitationProcessedDisplayForList from './FriendInvitationProcessedDisplayForList';
import { renderLog } from '../../utils/logging';

export default class FriendInvitationProcessedList extends Component {
  static propTypes = {
    friendList: PropTypes.array,
    invitationsSentByMe: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationsList: this.props.friendList,
    };
  }

  componentDidMount () {
    this.setState({
      friendInvitationsList: this.props.friendList,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      friendInvitationsList: nextProps.friendList,
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.friendInvitationsList === undefined) {
      return null;
    }

    let counter = 0;

    return (
      <div className="guidelist card-child__list-group">
        {this.state.friendInvitationsList.map((friend) => {
          if (this.props.invitationsSentByMe) {
            return (
              <FriendInvitationProcessedDisplayForList
                  key={counter}
                  {...friend}
              />
            );
          } else {
            return (
              <FriendInvitationProcessedDisplayForList key={++counter} {...friend} />
            );
          }
        })}
      </div>
    );
  }
}
