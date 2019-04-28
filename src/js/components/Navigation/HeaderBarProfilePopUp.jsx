import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isWebApp, isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

export default class HeaderBarProfilePopUp extends Component {
  static propTypes = {
    profilePopUpOpen: PropTypes.bool,
    weVoteBrandingOff: PropTypes.bool,
    voter: PropTypes.object,
    toggleProfilePopUp: PropTypes.func.isRequired,
    hideProfilePopUp: PropTypes.func.isRequired,
    transitionToYourVoterGuide: PropTypes.func.isRequired,
    signOutAndHideProfilePopUp: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.toggleProfilePopUp = this.props.toggleProfilePopUp.bind(this);
    this.hideProfilePopUp = this.props.hideProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.props.transitionToYourVoterGuide.bind(this);
    this.signOutAndHideProfilePopUp = this.props.signOutAndHideProfilePopUp.bind(this);
  }

  render () {
    renderLog(__filename);
    const { voter, profilePopUpOpen, weVoteBrandingOff } = this.props;
    const isSignedIn = voter.is_signed_in;

    /* eslint-disable no-extra-parens */
    const popUpOpen = (function opener () {
      if (profilePopUpOpen) {
        return (isWebApp() ? 'profile-menu--open' : 'profile-foot-menu--open');
      }
      return '';
    }());

    return (
      <div className={popUpOpen}>
        <div className="page-overlay" onClick={this.hideProfilePopUp} />
        <div className={isWebApp() ? 'profile-menu' : 'profile-foot-menu'}>
          <span className="we-vote-promise">Our Promise: We&apos;ll never sell your email.</span>
          <ul className="nav flex-column">
            {/* Desktop only */}
            <li className="d-none d-sm-block">
              <Link onClick={this.hideProfilePopUp} to="/settings/profile">
                <div>
                  <span className="header-slide-out-menu-text-left">Your Settings</span>
                </div>
              </Link>
            </li>
            {/* Mobile only */}
            <li className="navli d-block d-sm-none">
              <Link onClick={this.hideProfilePopUp} to="/settings/menu">
                <div>
                  <span className="header-slide-out-menu-text-left">Your Settings</span>
                </div>
              </Link>
            </li>
            {/* Desktop or Mobile */}
            {voter && isSignedIn ?
              null : (
                <li>
                  <Link onClick={this.hideProfilePopUp} to="/settings/account">
                    <div>
                      <span className="header-slide-out-menu-text-left">Sign In</span>
                    </div>
                  </Link>
                </li>
              )}
            {weVoteBrandingOff || isCordova() ? null : (
              <li className="d-block d-sm-none">
                <Link onClick={this.hideProfilePopUp} to="/more/about">
                  <div>
                    <span className="header-slide-out-menu-text-left">About We Vote</span>
                  </div>
                </Link>
              </li>
            )}
            {weVoteBrandingOff || isCordova() ? null : (
              <li className="d-block d-sm-none">
                <Link onClick={this.hideProfilePopUp} to="/more/donate">
                  <div>
                    <span className="header-slide-out-menu-text-left">Donate</span>
                  </div>
                </Link>
              </li>
            )}
            {/* Desktop or Mobile */}
            {voter && isSignedIn ? (
              <li>
                <Link onClick={this.signOutAndHideProfilePopUp} to="/settings/account">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign Out</span>
                  </div>
                </Link>
              </li>
            ) : null
            }
          </ul>
          <div>
            <span className="terms-and-privacy">
              <Link onClick={this.hideProfilePopUp} to="/more/terms">
                <span className="u-no-break">Terms of Service</span>
              </Link>
              <span style={{ paddingLeft: 20 }} />
              <Link onClick={this.hideProfilePopUp} to="/more/privacy">
                <span className="u-no-break">Privacy Policy</span>
              </Link>
            </span>
          </div>
          <div>
            <span className="terms-and-privacy">
              <Link onClick={this.hideProfilePopUp} to="/more/attributions">Attributions</Link>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
