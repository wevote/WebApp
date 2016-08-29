import React, { Component, PropTypes } from "react";

export default class FriendsOnlyIndicator extends Component {
  static propTypes = {
    isPublicPosition: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

	render () {
    let is_public_position = this.props.isPublicPosition;
    let labelText = "";
    if (is_public_position) {
      labelText = "Public";
    } else {
      labelText = "Friends";
    }

    const friendsOnlyIndicator = <span className="friends-only-indicator">{labelText}</span>;

    return friendsOnlyIndicator;
	}
}
