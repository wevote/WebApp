import React, { Component } from "react";
import PropTypes from "prop-types";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import FriendDisplayForList from "./FriendDisplayForList";
import { renderLog } from "../../utils/logging";

export default class FriendList extends Component {
  static propTypes = {
    friendList: PropTypes.array,
    editMode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      friendList: this.props.friendList,
    };
  }

  componentDidMount () {
    this.setState({
      friendList: this.props.friendList,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      friend_list: nextProps.friendList,
    });
  }

  render () {
    renderLog(__filename);
    let friends = this.props.friendList; // 10/1//18:  This should not be necessary, but was needed after React 16.
    if (!friends) { //    There is some other undiagnosed issue.
      friends = this.state.friend_list;
    }

    if (!friends) {
      return null;
    }

    return (
      <div className="guidelist card-child__list-group">
        <TransitionGroup className="org-ignore">
          {friends.map(friend => (
            <CSSTransition key={friend.voter_we_vote_id} timeout={500} classNames="fade">
              <FriendDisplayForList
                editMode={this.props.editMode}
                key={friend.voter_we_vote_id}
                {...friend}
              />
            </CSSTransition>
          ))
          }
        </TransitionGroup>
      </div>
    );
  }
}
