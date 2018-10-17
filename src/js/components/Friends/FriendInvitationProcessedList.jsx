import React, { Component } from "react";
import PropTypes from "prop-types";
import FriendInvitationProcessedDisplayForList from "./FriendInvitationProcessedDisplayForList";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { renderLog } from "../../utils/logging";

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

    return <div className="guidelist card-child__list-group">
        <TransitionGroup transitionName="org-ignore" transitionEnterTimeout={2000} transitionLeaveTimeout={2000}>
          {this.state.friendInvitationsList.map((friend) => {
            if (this.props.invitationsSentByMe) {
              return <CSSTransition key={++counter} timeout={500} classNames="fade">
                  <FriendInvitationProcessedDisplayForList key={counter} {...friend}
                                                           invitationsSentByMe={this.props.invitationsSentByMe} />
              </CSSTransition>;
            } else {
              return <CSSTransition key={++counter} timeout={500} classNames="fade">
                  <FriendInvitationProcessedDisplayForList key={++counter} {...friend} />
              </CSSTransition>;
            }
          })}
        </TransitionGroup>
      </div>;
  }
}
