import React, { Component, PropTypes } from "react";

export default class AddFriendsFilter extends Component {
  static propTypes = {
    params: PropTypes.object,
    changeAddFriendsTypeFunction: PropTypes.func.isRequired,
    add_friends_type: PropTypes.string
  };

  render () {
    const {add_friends_type, changeAddFriendsTypeFunction} = this.props;

    return <div className="btn-group t-mb3">
      <span id="ADD_FRIENDS_BY_EMAIL"
            className={ add_friends_type === "ADD_FRIENDS_BY_EMAIL" ? "active btn btn-default" : "btn btn-default"}
            onClick={changeAddFriendsTypeFunction}>
        By Email
      </span>

      <span onClick={changeAddFriendsTypeFunction}
         id="ADD_FRIENDS_BY_TWITTER"
         className={ add_friends_type === "ADD_FRIENDS_BY_TWITTER" ? "active btn btn-default" : "btn btn-default"}>
        Twitter
      </span>

      <span onClick={changeAddFriendsTypeFunction}
         id="ADD_FRIENDS_BY_FACEBOOK"
         className={ add_friends_type === "ADD_FRIENDS_BY_FACEBOOK" ? "active btn btn-default" : "btn btn-default"}>
        Facebook
      </span>
    </div>;
  }
}
