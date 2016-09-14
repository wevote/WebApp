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
        Who You Can Follow
      </Link>
      <Link to="/more/opinions/followed" className={ following_type === "WHO_YOU_FOLLOW" ? "active btn btn-default" : "btn btn-default"}>
        Currently Following
      </Link>
    </div>;
  }
  // TODO Coming soon
  //     <Link to="/friends" className={ following_type === "YOUR_FRIENDS" ? "active btn btn-default" : "btn btn-default"}>
  //       Your Friends
  //     </Link>
}
