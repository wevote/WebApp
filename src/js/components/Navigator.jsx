import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

// import "stylesheets/main.scss";

const links = {
  ballot: function (active) {
    var icon = "bs-glyphicon bs-glyphicon-list-alt bs-glyphicon-line-adjustment font-footer_icon";

    var jsx =
      <Link to="/ballot" className={ "navicon" + (active ? " active-icon" : "")}>
        <div className="bs-col-xs-3 bs-center-block bs-text-center">
          <span className={icon} title="Ballot"></span>
          <br/>
          <span className="bs-text-center small device-small--hide">
            Ballot
          </span>
        </div>
      </Link>;

    return jsx;
  },

  /* className="badgeTotal badge">0</span> TODO badge should only show if positive number */
  requests: function (active) {
    var icon = "bs-glyphicon bs-glyphicon-inbox bs-glyphicon-line-adjustment font-footer_icon";

    var jsx =
      <Link to="/requests" className={ "navicon" + (active ? " active-icon" : "")}>
        <div className="bs-col-xs-3 bs-center-block bs-text-center">
          <span className={icon} title="Requests">
          </span>
          <br/>
          <span className="bs-text-center small device-small--hide">
            Requests
          </span>
        </div>
      </Link>;

    return jsx;
  },

  connect: function (active) {
    var icon = "bs-glyphicon icon-icon-connect-1-3 font-footer_icon";

    var jsx =
      <Link to="/connect" className={ "navicon" + (active ? " active-icon" : "")}>
        <div className="bs-col-xs-3 bs-center-block bs-text-center">
          <span className={icon} title="Connect"></span>
          <br/>
          <span className="bs-text-center small device-small--hide">
            Connect
          </span>
        </div>
      </Link>;

    return jsx;
  },

  activity: function (active) {
    var icon = "bs-glyphicon icon-icon-activity-1-4 font-footer_icon";

    var jsx =
      <Link to="/activity" className={ "navicon" + (active ? " active-icon" : "")}>
        <div className="bs-col-xs-3 bs-center-block bs-text-center">
          <span className={icon} title="Activity"></span>
          <br/>
          <span className="bs-text-center small device-small--hide">
            Activity
          </span>
        </div>
      </Link>;

    return jsx;
  }
};

export default class Navigator extends Component {
  static propTypes = {
    pathname: PropTypes.string
  };

  render () {
    var { props: { pathname } } = this;
    var { ballot, requests, connect, activity } = links;

    const navigator =
      <div className="navigator bs-row">
        <div className="bs-container-fluid">
          <div className="bs-navbar bs-navbar-default bs-navbar-fixed-bottom">
            <div className="bs-container-fluid fluff-loose--top separate-top">
              <div className="bs-row">
                {ballot(pathname === "/ballot")}
                {requests(pathname === "/requests")}
                {connect(pathname === "/connect")}
                {activity(pathname === "/activity")}
              </div>
            </div>
          </div>
        </div>
      </div>;

      return navigator;

  }
}
