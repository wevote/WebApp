import React, { Component } from "react";
import PropTypes from "prop-types";
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
      labelText = "This position is visible to friends only.";
      visibilityIcon = <Icon name="group-icon" color="#999" width={18} height={18} />;
    } else {
      labelText = "This position is visible to the public.";
      visibilityIcon = <Icon name="public-icon" color="#ccc" width={18} height={18} />;
    }

    const tooltip = <Tooltip id="tooltip">{labelText}</Tooltip>;

    const visibilityIndicator = <OverlayTrigger placement="top" overlay={tooltip}>
        <div className="public-friends-indicator">{visibilityIcon}</div>
      </OverlayTrigger>;

    return visibilityIndicator;
	}
}
