import React, { Component, PropTypes } from "react";

export default class FriendsOnlyIndicator extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

	render () {
    return <span className="friends-only-indicator bs-glyphicon bs-glyphicon-user"
                 title="This position only displayed to friends" />;
	}
}
