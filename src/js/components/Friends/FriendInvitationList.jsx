import React, { Component, PropTypes } from "react";
import FriendInvitationDisplayForList from "./FriendInvitationDisplayForList";
import FriendInvitationEmailForList from "./FriendInvitationEmailForList";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class FriendInvitationList extends Component {

  static propTypes = {
    friendList: PropTypes.array,
    invitationsSentByMe: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      friend_invitations_list: this.props.friendList
    };
  }

  componentDidMount () {
    this.setState({
      friend_invitations_list: this.props.friendList
    });
  }

  componentWillReceiveProps (nextProps){
    this.setState({
      friend_invitations_list: nextProps.friendList
    });
  }

  render () {
    if (this.state.friend_invitations_list === undefined) {
      return null;
    }

    let invitations_sent_by_me = this.props.invitationsSentByMe;

    const friend_list = this.state.friend_invitations_list.map( (friend) => {
      if (friend.voter_we_vote_id === "") {
        return <FriendInvitationEmailForList key={friend.voter_email_address} {...friend}
                                             invitationsSentByMe={invitations_sent_by_me} />;
      } else {
        return <FriendInvitationDisplayForList key={friend.voter_we_vote_id} {...friend}
                                               invitationsSentByMe={invitations_sent_by_me} />;
      }
    });

    return <div className="guidelist card-child__list-group">
        <ReactCSSTransitionGroup transitionName="org-ignore" transitionEnterTimeout={2000} transitionLeaveTimeout={2000}>
          {friend_list}
        </ReactCSSTransitionGroup>
      </div>;
  }
}
