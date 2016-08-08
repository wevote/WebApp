import React, { Component } from "react";

export default class FriendsOnlyIndicator extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

	render () {
    return <span className="friends-only-indicator bs-glyphicon bs-glyphicon-user"
                 title="This position only displayed to friends" />;
	}
}
