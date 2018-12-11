import React, { Component } from "react";
import PropTypes from "prop-types";
import FriendDisplayForListCompressed from "./FriendDisplayForListCompressed";
import { renderLog } from "../../utils/logging";

export default class FriendListCompressed extends Component {
  static propTypes = {
    friendList: PropTypes.array,
    editMode: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      friend_list: this.props.friendList,
    };
  }

  componentDidMount () {
    this.setState({
      friend_list: this.props.friendList,
    });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      friend_list: nextProps.friendList,
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.friend_list === undefined) {
      return null;
    }

    const friend_list_for_display = this.state.friend_list.map( friend => (
      <FriendDisplayForListCompressed
        editMode={this.props.editMode}
        key={friend.voter_we_vote_id}
        {...friend}
      />
    ));

    return (
      <div className="guidelist card-child__list-group">
        {friend_list_for_display}
      </div>
    );
  }
}
