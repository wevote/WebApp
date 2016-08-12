import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import HeaderIcons from "./Navigation/HeaderIcons";
import FacebookActions from "../actions/FacebookActions";
const Menu = require("react-burger-menu").push;
import SearchAllBox from "./SearchAllBox";

var menuStyles = {
  bmMenu: {
    height: "100vh"
  }
};

export default class Header extends Component {
  static propTypes = {
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
    var { signed_in_personal, signed_in_twitter, twitter_screen_name } = this.props.voter;
    const logOut = FacebookActions.appLogout;

    const header =
      <section className="separate-bottom u-gutter-top--small bs-container-fluid">
        {/* The components/MoreMenu code has to be reproduced here for mobile */}
        <Menu styles={ menuStyles }>
          <div className="device-menu--mobile">
            <ul className="bs-nav bs-nav-stacked">
              <li>
                <div><span className="we-vote-promise">We Vote's Promise: We will never sell your email.</span></div>
              </li>
            </ul>
            <h4 className="bs-text-left"></h4>
            <ul className="bs-nav bs-nav-stacked">
              { signed_in_twitter && twitter_screen_name ?
                <li>
                  <Link onClick={this.hide.bind(this)} to={"/" + twitter_screen_name}>
                    <div>
                      My Profile
                    </div>
                  </Link>
                </li> :
                null
              }
              <li>
                <Link onClick={this.hide.bind(this)} to="/settings/location">
                  <div>
                  My Address
                  </div>
                </Link>
              </li>
             <li>
                <Link onClick={this.hide.bind(this)} to="/more/opinions/followed">
                  <div>
                  Who I'm Following
                  </div>
                </Link>
              </li>
              { signed_in_personal ?
                <li>
                  <Link onClick={this.hide.bind(this)} to="/more/sign_in">
                    <div onClick={logOut}>
                      Sign Out
                    </div>
                  </Link>
                </li> :
                <li>
                  <Link onClick={this.hide.bind(this)} to="/more/sign_in">
                    <div>
                    Sign In
                    </div>
                  </Link>
                </li> }
            </ul>
            <h4 className="bs-text-left"></h4>
            <ul className="bs-nav bs-nav-stacked">
              <li>
                <Link onClick={this.hide.bind(this)} to="/more/about">
                  <div>
                  About <strong>We Vote</strong>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </Menu>
        <h4 className="bs-pull-left page-logo">
          <Link to="/ballot">
            My Voter Guide
          </Link>
          <span className="page-header__version"> demo</span>
        </h4>
        <div>
          <SearchAllBox />
        </div>
        <HeaderIcons />
      </section>;

    return header;
  }
}
