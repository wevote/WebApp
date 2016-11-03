import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class FollowingFilter extends Component {
  static propTypes = {
    params: PropTypes.object,
    following_type: PropTypes.string
  };

  getFollowingTitle (following_type){
    switch (following_type) {
      case "WHO_YOU_FOLLOW":
        return "Who You're Following";
      case "YOUR_FRIENDS":
        return "Your Friends";
      case "WHO_YOU_CAN_FOLLOW":
      default :
        return "Who You Can Follow";
    }
  }

  render () {
    const {following_type} = this.props;

    return <div className="btn-group t-mb3">
      <Link to="/opinions" className={ following_type === "WHO_YOU_CAN_FOLLOW" ? "active btn btn-default" : "btn btn-default"}>
        To Follow
      </Link>
      <Link to="/opinions_followed" className={ following_type === "WHO_YOU_FOLLOW" ? "active btn btn-default" : "btn btn-default"}>
        Following
      </Link>
      <Link to="/more/connect" className={ following_type === "YOUR_FRIENDS" ? "active btn btn-default" : "btn btn-default"}>
        Friends
      </Link>
    </div>;
  }
}
