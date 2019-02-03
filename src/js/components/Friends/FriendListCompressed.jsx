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
      friendList: nextProps.friendList,
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.friendList === undefined) {
      return null;
    }

    const friendListForDisplay = this.state.friendList.map(friend => (
      <FriendDisplayForListCompressed
        key={friend.voter_we_vote_id}
        {...friend}
      />
    ));

    return (
      <div className="guidelist card-child__list-group">
        {friendListForDisplay}
      </div>
    );
  }
}
