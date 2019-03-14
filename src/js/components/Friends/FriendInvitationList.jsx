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

  constructor (props) {
    super(props);
    this.state = {
      friendInvitationList: this.props.friendList || [],
    };
  }

  componentDidMount () {
    this.setState({
      friendInvitationList: this.props.friendList || [],
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      friendInvitationList: nextProps.friendList || [],
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.friendInvitationList === undefined) {
      return null;
    }

    const { invitationsSentByMe } = this.props;
    let simpleKeyCounter = 0;

    return (
      <div className="guidelist card-child__list-group">
        {this.state.friendInvitationList.map((friend) => {
          if (friend.voter_we_vote_id && friend.voter_we_vote_id !== '') {
            return (
              <FriendInvitationDisplayForList key={`invite-key-${friend.voter_we_vote_id}`}
                                              id={`invite-id-${friend.voter_we_vote_id}`}
                                              {...friend}
                                              invitationsSentByMe={invitationsSentByMe}
                                              previewMode={this.props.previewMode}
              />
            );
          } else {
            simpleKeyCounter++;
            return (
              <FriendInvitationEmailForList key={`invite-key-${simpleKeyCounter}`}
                                            id={`invite-id-${simpleKeyCounter}`}
                                            {...friend}
                                            invitationsSentByMe={invitationsSentByMe}
                                            previewMode={this.props.previewMode}
              />
            );
          }
        })}
      </div>
    );
  }
}
