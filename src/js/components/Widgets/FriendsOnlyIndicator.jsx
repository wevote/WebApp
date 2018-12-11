import React, { Component } from "react";
import PropTypes from "prop-types";
import Icon from "react-svg-icons";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { renderLog } from "../../utils/logging";

export default class FriendsOnlyIndicator extends Component {
  static propTypes = {
    isFriendsOnly: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    let isFriendsOnly = this.props.isFriendsOnly;
    if (isFriendsOnly === undefined) {
      isFriendsOnly = true;
    }

    let labelText = "";
    let visibilityIcon = "";
    if (isFriendsOnly) {
      labelText = "This position is only visible to We Vote friends.";
      visibilityIcon = <Icon name="group-icon" color="#999" width={18} height={18} />;
    } else {
      labelText = "This position is visible to the public.";
      visibilityIcon = <Icon name="public-icon" color="#999" width={18} height={18} />;
    }

    const tooltip = <Tooltip id="tooltip">{labelText}</Tooltip>;

    const visibilityIndicator = (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <span className="public-friends-indicator">{visibilityIcon}</span>
      </OverlayTrigger>
    );

    return visibilityIndicator;
  }
}
