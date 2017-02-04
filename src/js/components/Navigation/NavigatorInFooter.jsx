import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FriendStore from "../../stores/FriendStore";

const links = {
  ballot: function (active) {
    var icon = "glyphicon glyphicon-list-alt glyphicon-line-adjustment nav-icon";

    var jsx =
      <div className="col-xs-3 center-block text-center">
        <Link to="/ballot" className={ "footer-nav__item" + (active ? " active-icon" : "")}>

          <span className={icon} title="Ballot" />
          <br/>
          <span className="text-center small">
            Ballot
          </span>
        </Link>
      </div>;

    return jsx;
  },

  requests: function (active, number_of_incoming_friend_requests) {
    var icon = "glyphicon glyphicon-inbox glyphicon-line-adjustment nav-icon";

    var jsx =
      <div className="col-xs-3 center-block text-center">
        <Link to="/requests" className={ "footer-nav__item" + (active ? " active-icon" : "")}>
          <span className={icon} title="Requests">
            {number_of_incoming_friend_requests ?
              <span className="badgeTotal badge">{number_of_incoming_friend_requests}</span> :
              null }
          </span>
          <br/>
          <span className="text-center small">
            Requests
          </span>
        </Link>
      </div>;

    return jsx;
  },

  connect: function (active) {
    var icon = "glyphicon icon-icon-connect-1-3 nav-icon";

    var jsx =
      <div className="col-xs-3 center-block text-center">
        <Link to="/more/connect" className={ "footer-nav__item" + (active ? " active-icon" : "")}>
          <span className={icon} title="Connect" />
          <br/>
          <span className="text-center small">
            Connect
          </span>
        </Link>
      </div>;

    return jsx;
  },

  activity: function (active) {
    var icon = "glyphicon icon-icon-activity-1-4 nav-icon";

    var jsx =
      <div className="col-xs-3 center-block text-center">
        <Link to="/activity" className={ "footer-nav__item" + (active ? " active-icon" : "")}>
          <span className={icon} title="Activity" />
          <br/>
          <span className="text-center small">
            Activity
          </span>
        </Link>
      </div>;

    return jsx;
  }
};

export default class NavigatorInFooter extends Component {
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
      <div className="navbar navbar-default navbar-fixed-bottom footer-nav">
        <div className="container-fluid u-inset--sm">
          <div className="row">
            {ballot(pathname === "/ballot")}
            {requests(pathname === "/requests", number_of_incoming_friend_requests)}
            {connect(pathname === "/more/connect")}
            {activity(pathname === "/activity")}
          </div>
        </div>
      </div>;

      return navigator;

  }
}
