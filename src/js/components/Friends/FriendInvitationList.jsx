import React, { Component } from "react";
import PropTypes from "prop-types";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FriendInvitationDisplayForList from "./FriendInvitationDisplayForList";
import FriendInvitationEmailForList from "./FriendInvitationEmailForList";
import { renderLog } from "../../utils/logging";

export default class FriendInvitationList extends Component {
  static propTypes = {
    friendList: PropTypes.array,
    invitationsSentByMe: PropTypes.bool,
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
    const enter = 2000;
    const exit = 2000;

    return (
      <div className="guidelist card-child__list-group">
        <TransitionGroup className="org-ignore" timeout={{ exit, enter }}>
          {this.state.friendInvitationList.map((friend) => {
            if (friend.voter_we_vote_id && friend.voter_we_vote_id !== "") {
              return (
                <CSSTransition key={++simpleKeyCounter} timeout={500} classNames="fade">
                  <FriendInvitationDisplayForList key={friend.voter_we_vote_id}
                                                  id={friend.voter_we_vote_id}
                                                  {...friend}
                                                  invitationsSentByMe={invitationsSentByMe}
                  />
                </CSSTransition>
              );
            } else {
              return (
                <CSSTransition key={++simpleKeyCounter} timeout={500} classNames="fade">
                  <FriendInvitationEmailForList key={simpleKeyCounter}
                                                id={simpleKeyCounter}
                                                {...friend}
                                                invitationsSentByMe={invitationsSentByMe}
                  />
                </CSSTransition>
              );
            }
          })}
        </TransitionGroup>
      </div>
    );
  }
}
