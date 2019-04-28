import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { renderLog } from '../../utils/logging';


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
    const { toggleAboutMenu } = this.props;
    renderLog(__filename);
    const aboutMenuOpen = this.props.aboutMenuOpen ? 'about-menu--open' : '';

    return (
      <div className={aboutMenuOpen}>
        <div className="page-overlay" onClick={toggleAboutMenu} />
        <div className="about-menu">
          <ul className="nav flex-column text-left">
            <li>
              <Link onClick={toggleAboutMenu} to="/more/about">
                <span className="header-slide-out-menu-text-left">About</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
