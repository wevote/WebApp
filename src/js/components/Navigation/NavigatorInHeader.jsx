import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FriendStore from "../../stores/FriendStore";

const links = {
  ballot: function (active) {
    var icon = "glyphicon glyphicon-list-alt glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/ballot" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Ballot" />
        <span className="header-nav__label">
          Ballot
          </span>
      </Link>;

    return jsx;
  },

  requests: function (active, number_of_incoming_friend_requests) {
    var icon = "glyphicon glyphicon-inbox glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/requests" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Requests">
          {number_of_incoming_friend_requests ?
            <span className="badgeTotal badge">{number_of_incoming_friend_requests}</span> :
            null }
        </span>
        <span className="header-nav__label">
          Requests
          </span>
      </Link>;

    return jsx;
  },

  connect: function (active) {
    var icon = "glyphicon icon-icon-connect-1-3 glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/more/connect" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Connect" />
        <span className="header-nav__label">
          Connect
          </span>
      </Link>;

    return jsx;
  },

  activity: function (active) {
    var icon = "glyphicon icon-icon-activity-1-4 glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/activity" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Activity" />
        <span className="header-nav__label">
          Activity
          </span>
      </Link>;

    return jsx;
  }
};

export default class NavigatorInHeader extends Component {
  static propTypes = {
    pathname: PropTypes.string
  };

  constructor (props) {
      super(props);
      this.state = {
        friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe()
      };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
  }

  _onFriendStoreChange () {
    this.setState({
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe()
    });
  }

  render () {
    var { props: { pathname } } = this;
    var { ballot, requests, connect, activity } = links;
    let number_of_incoming_friend_requests = this.state.friend_invitations_sent_to_me.length;
    const navigator =
      <div className="header-nav">
        {ballot(pathname === "/ballot")}
        {requests(pathname === "/requests", number_of_incoming_friend_requests)}
        {connect(pathname === "/more/connect")}
        {activity(pathname === "/activity")}
      </div>;

      return navigator;
  }
}
