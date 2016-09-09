import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

// import "stylesheets/main.scss";

const links = {
  ballot: function (active) {
    var icon = "glyphicon glyphicon-list-alt glyphicon-line-adjustment font-footer_icon";

    var jsx =
      <Link to="/ballot" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Ballot" />
        <span className="header-nav__label">
          Ballot
          </span>
      </Link>;

    return jsx;
  },

  /* className="badgeTotal badge">0</span> TODO badge should only show if positive number */
  requests: function (active) {
    var icon = "glyphicon glyphicon-inbox glyphicon-line-adjustment font-footer_icon";

    var jsx =
      <Link to="/requests" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Requests" />
        <span className="header-nav__label">
          Requests
          </span>
      </Link>;

    return jsx;
  },

  connect: function (active) {
    var icon = "glyphicon icon-icon-connect-1-3 glyphicon-line-adjustment font-footer_icon";

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
    var icon = "glyphicon icon-icon-activity-1-4 glyphicon-line-adjustment font-footer_icon";

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

  render () {
    var { props: { pathname } } = this;
    var { ballot, requests, connect, activity } = links;
    const navigator =
      <div className="header-nav">
        {ballot(pathname === "/ballot")}
        {requests(pathname === "/requests")}
        {connect(pathname === "/more/connect")}
        {activity(pathname === "/activity")}
      </div>;

      return navigator;
  }
}
