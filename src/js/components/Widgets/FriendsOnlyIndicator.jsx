import React, { Component, PropTypes } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
const Icon = require("react-svg-icons");

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
    let visibilityIcon = "";
    if (is_friends_only) {
      labelText = "Friends";
      visibilityIcon = <Icon name="group-icon" color="#999" width={18} height={18} />;
    } else {
      labelText = "Public";
      visibilityIcon = <Icon name="public-icon" color="#999" width={18} height={18} />;
    }

    const tooltip = <Tooltip id="tooltip">{labelText}</Tooltip>;

    const visibilityIndicator = (<OverlayTrigger placement="top" overlay={tooltip}>
        <div className="visibility-indicator">{visibilityIcon}</div>
      </OverlayTrigger>);

    return visibilityIndicator;
	}
}
