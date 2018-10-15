import React, { Component } from "react";
import PropTypes from "prop-types";
import SuggestedFriendDisplayForList from "./SuggestedFriendDisplayForList";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { renderLog } from "../../utils/logging";

export default class SuggestedFriendList extends Component {

  static propTypes = {
    friendList: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
      suggested_friend_list: this.props.friendList,
    };
  }

  componentDidMount () {
    this.setState({
      suggested_friend_list: this.props.friendList,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      suggested_friend_list: nextProps.friendList,
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.suggested_friend_list === undefined) {
      return null;
    }

    return <div className="guidelist card-child__list-group">
        <TransitionGroup className="org-ignore">
          {this.state.suggested_friend_list.map((friend) =>
            <CSSTransition key={friend.voter_we_vote_id} timeout={500} classNames="fade">
              <SuggestedFriendDisplayForList key={friend.voter_we_vote_id} {...friend} />
            </CSSTransition>)
          }
        </TransitionGroup>
      </div>;
  }
}
