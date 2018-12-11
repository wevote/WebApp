import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../../utils/logging";

export default class FollowingFilter extends Component {
  static propTypes = {
    params: PropTypes.object,
    following_type: PropTypes.string,
  };

  getFollowingTitle (following_type) {
    switch (following_type) {
      case "WHO_YOU_FOLLOW":
        return "Who You're Listening To";
      case "YOUR_FRIENDS":
        return "Your Friends";
      case "WHO_YOU_CAN_FOLLOW":
      default:
        return "Who You Can Listen To";
    }
  }

  render () {
    renderLog(__filename);
    const { following_type } = this.props;

    return (
      <div className="btn-group u-stack--md">
        <Link to="/opinions" className={following_type === "WHO_YOU_CAN_FOLLOW" ? "active btn btn-default" : "btn btn-default"}>
          Listen To
        </Link>
        <Link to="/opinions_followed" className={following_type === "WHO_YOU_FOLLOW" ? "active btn btn-default" : "btn btn-default"}>
          Listening
        </Link>
        <Link to="/more/connect" className={following_type === "YOUR_FRIENDS" ? "active btn btn-default" : "btn btn-default"}>
          Friends
        </Link>
      </div>
    );
  }
}
