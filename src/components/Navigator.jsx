import React, { Component } from 'react';
import { Router, Link } from 'react-router';

import 'stylesheets/main.scss';

export default class Navigator extends Component {
  render() {
    return (
        <div className="row">
            <div className="container-fluid">
                <div className="navbar navbar-default navbar-fixed-bottom">
                    <div className="container-fluid fluff-loose--top separate-top">
                      <div className="row">
                        <Link to="/ballot">
                            <div className="col-xs-2 center-block text-center">
                              <span className="glyphicon glyphicon-list-alt glyphicon-line-adjustment font-footer_icon"></span><br />
                              <span className="text-center small">Ballot</span>
                            </div>
                        </Link>
                        <Link to="/requests">
                            <div className="col-xs-2 center-block text-center">
                              <span className="glyphicon glyphicon-inbox glyphicon-line-adjustment font-footer_icon">
                              <span className="badgeTotal badge">10</span></span><br />
                              <span className="text-center small">Requests</span>
                            </div>
                        </Link>
                        <Link to="/connect">
                            <div className="col-xs-2 center-block text-center">
                              <span className="glyphicon icon-icon-connect-1-3 font-footer_icon"></span><br />
                              <span className="text-center small">Connect</span>
                            </div>
                        </Link>
                        <Link to="/activity">
                            <div className="col-xs-3 center-block text-center">
                              <span className="glyphicon icon-icon-activity-1-4 font-footer_icon"></span><br />
                              <span className="text-center small">Activity</span>
                            </div>
                        </Link>
                        <Link to="/more">
                            <div className="col-xs-2 center-block text-center">
                              <span className="glyphicon glyphicon-menu-hamburger glyphicon-line-adjustment font-footer_icon"></span><br />
                              <span className="text-center small">More</span>
                            </div>
                        </Link>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}
