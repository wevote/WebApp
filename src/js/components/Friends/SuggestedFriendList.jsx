import React, { Component } from "react";
import PropTypes from "prop-types";
import SuggestedFriendDisplayForList from "./SuggestedFriendDisplayForList";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class SuggestedFriendList extends Component {

  static propTypes = {
    friendList: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = {
      suggested_friend_list: this.props.friendList
    };
  }

  componentDidMount () {
    this.setState({
      suggested_friend_list: this.props.friendList
    });
  }

  componentWillReceiveProps (nextProps){
    this.setState({
      suggested_friend_list: nextProps.friendList
    });
  }

  render () {
    if (this.state.suggested_friend_list === undefined) {
      return null;
    }

    const friend_list = this.state.suggested_friend_list.map( (friend) => {
        return <SuggestedFriendDisplayForList key={friend.voter_we_vote_id} {...friend} />;
    });

    return <div className="guidelist card-child__list-group">
        <ReactCSSTransitionGroup transitionName="org-ignore" transitionEnterTimeout={2000} transitionLeaveTimeout={2000}>
          {friend_list}
        </ReactCSSTransitionGroup>
      </div>;
  }
}
