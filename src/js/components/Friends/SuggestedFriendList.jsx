import React, { Component } from "react";
import PropTypes from "prop-types";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import SuggestedFriendDisplayForList from "./SuggestedFriendDisplayForList";
import { renderLog } from "../../utils/logging";

export default class SuggestedFriendList extends Component {
  static propTypes = {
    friendList: PropTypes.array,
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
        <TransitionGroup className="org-ignore">
          {this.state.suggestedFriendList.map(friend => (
            <CSSTransition key={friend.voter_we_vote_id} timeout={500} classNames="fade">
              <SuggestedFriendDisplayForList key={friend.voter_we_vote_id} {...friend} />
            </CSSTransition>
          ))
          }
        </TransitionGroup>
      </div>
    );
  }
}
