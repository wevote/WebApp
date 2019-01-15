import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { cordovaDot } from "../../utils/cordovaUtils";
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
    let { isFriendsOnly } = this.props;
    if (isFriendsOnly === undefined) {
      isFriendsOnly = true;
    }

    let labelText = "";
    let visibilityIcon = "";
    if (isFriendsOnly) {
      labelText = "This position is only visible to We Vote friends.";
      visibilityIcon = <img src={cordovaDot("/img/global/svg-icons/group-icon.svg")} width="18" height="18" color="#999" alt="Visible to Friends Only" />;
    } else {
      labelText = "This position is visible to the public.";
      visibilityIcon = <img src={cordovaDot("/img/global/svg-icons/public-icon.svg")} width="18" height="18" color="#999" alt="Visible to Public" />;
    }

    const tooltip = <Tooltip id="tooltip">{labelText}</Tooltip>;

    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <span className="public-friends-indicator">{visibilityIcon}</span>
      </OverlayTrigger>
    );
  }
}
