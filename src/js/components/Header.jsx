import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import HeaderIcons from "./Navigation/HeaderIcons";
import FacebookActions from "../actions/FacebookActions";

const Menu = require("react-burger-menu").slide;

export default class Header extends Component {
  static propTypes = {
    location: PropTypes.string,
    voter: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {}

  componentWillUnmount () {}

  hide () {
    const menuButton = document.querySelector(".bm-burger-button > button");
    menuButton.click();
  }

  render () {
    let location = this.props.location;
    var { signed_in_personal } = this.props.voter;
    const logOut = FacebookActions.appLogout;

    const header =
      <header className="header">
          <section className="separate-bottom bs-container-fluid">
            <h4 className="bs-pull-left gutter-left--window bold">
              <span className="bs-glyphicon bs-glyphicon-menu-hamburger bs-glyphicon-line-adjustment device-icon--large">
              </span>
              <Link to="/ballot">
                My Voter Guide
              </Link>
              <span className="header-version"> demo</span>
            </h4>
            <div className="header-address bs-pull-right gutter-right--window u-gutter-top--small">
              <Link to="/settings/location" className="font-lightest">
                {location}
              </Link>
            </div>
            <HeaderIcons />
          </section>
      {/* The components/MoreMenu code has to be reproduced here for mobile */}
        <Menu noOverlay>
          <div className="device-menu--mobile bs-container-fluid bs-well well-90">
            <ul className="bs-list-group">
              <li className="bs-list-group-item">
                <div><span className="we-vote-promise">We Vote's Promise: We will never sell your email.</span></div>
              </li>
              <li className="bs-list-group-item">
                <Link onClick={this.hide.bind(this)} to={{ pathname: "/ballot", query: { type: "filterRemaining" } }}>
                  <div>
                  Choices Remaining on My Ballot
                  </div>
                </Link>
              </li>
              <li className="bs-list-group-item">
                <Link onClick={this.hide.bind(this)} to={{ pathname: "/ballot", query: { type: "filterSupport" } }}>
                  <div>
                    What I Support on My Ballot
                  </div>
                </Link>
              </li>
              <li className="bs-list-group-item">
                <Link onClick={this.hide.bind(this)} to="/ballot">
                  <div>
                  All Ballot Items
                  </div>
                </Link>
              </li>
              <li className="bs-list-group-item">
                <Link onClick={this.hide.bind(this)} to="/bookmarks">
                  <div>
                  What I Have Bookmarked
                  </div>
                </Link>
              </li>
            </ul>
            <h4 className="bs-text-left"></h4>
            <ul className="bs-list-group">
              <li className="bs-list-group-item">
                <Link onClick={this.hide.bind(this)} to="/more/opinions/followed">
                  <div>
                  Who I'm Following
                  </div>
                </Link>
              </li>
              <li className="bs-list-group-item">
                <Link onClick={this.hide.bind(this)} to="/settings/location">
                  <div>
                  My Address
                  </div>
                </Link>
              </li>
              { signed_in_personal ?
                <li className="bs-list-group-item">
                  <div onClick={logOut}>
                    <a>
                    Sign Out
                    </a>
                  </div>
                </li> :
                <li className="bs-list-group-item">
                  <Link onClick={this.hide.bind(this)} to="/more/sign_in">
                    <div>
                    Sign In
                    </div>
                  </Link>
                </li> }
            </ul>
            <h4 className="bs-text-left"></h4>
            <ul className="bs-list-group">
              <li className="bs-list-group-item">
                <Link onClick={this.hide.bind(this)} to="/more/about">
                  <div>
                  About <strong>We Vote</strong>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </Menu>
      </header>;

    return header;
  }
}
