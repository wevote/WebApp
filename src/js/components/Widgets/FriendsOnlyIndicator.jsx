import React, { Component, PropTypes } from "react";

export default class FriendsOnlyIndicator extends Component {
  static propTypes = {
    isFriendsOnly: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

	render () {
    let is_friends_only = this.props.isFriendsOnly;
    if (is_friends_only === undefined){
      is_friends_only = true;
    }
    let labelText = "";
    if (is_friends_only) {
      labelText = "Friends";
    } else {
      labelText = "Public";
    }

    const friendsOnlyIndicator = <span className="friends-only-indicator">{labelText}</span>;

    return friendsOnlyIndicator;
	}
}
