import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";


export default class HeaderBarAboutMenu extends Component {
  static propTypes = {
    toggleAboutMenu: PropTypes.func.isRequired,
    aboutMenuOpen: PropTypes.bool.isRequired,
  };

  constructor (props) {
    super(props);
    this.toggleAboutMenu = this.props.toggleAboutMenu;
  }

  render () {
    let aboutMenuOpen = this.props.aboutMenuOpen ? "about-menu--open" : "";

    return (
      <div className={aboutMenuOpen}>
      <div className="page-overlay" onClick={this.toggleAboutMenu} />
      <div className="about-menu">
          <ul className="nav nav-stacked">
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/howtouse"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Getting Started</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/organization"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Organization</span>
                  </div>
                </Link>
              </li>
            <li>
              <Link onClick={this.toggleAboutMenu} to={"/more/team"}>
                <div>
                  <span className="header-slide-out-menu-text-left">Our Team</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
