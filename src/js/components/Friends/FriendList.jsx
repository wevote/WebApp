import React, { Component } from "react";
import PropTypes from "prop-types";
import FriendDisplayForList from "./FriendDisplayForList";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

export default class FriendList extends Component {

  static propTypes = {
    friendList: PropTypes.array,
    editMode: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      friend_list: this.props.friendList
    };
  }

  componentDidMount () {
    this.setState({
      friend_list: this.props.friendList
    });
  }

  componentWillReceiveProps (nextProps){
    this.setState({
      friend_list: nextProps.friendList
    });
  }

  render () {
    if (this.state.friend_list === undefined) {
      return null;
    }

    const friend_list_for_display = this.state.friend_list.map( (friend) => {
      return <FriendDisplayForList editMode={this.props.editMode}
                                   key={friend.voter_we_vote_id} {...friend} />;
    });

    return <div className="guidelist card-child__list-group">
        <ReactCSSTransitionGroup transitionName="org-ignore" transitionEnterTimeout={4000} transitionLeaveTimeout={2000}>
          {friend_list_for_display}
        </ReactCSSTransitionGroup>
      </div>;
  }

}
