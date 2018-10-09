import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { isWebApp, isCordova } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";

export default class HeaderBarProfilePopUp extends Component {
  static propTypes = {
    profilePopUpOpen: PropTypes.bool,
    bookmarks: PropTypes.array,
    weVoteBrandingOff: PropTypes.bool,
    location: PropTypes.object,
    voter: PropTypes.object,
    pathname: PropTypes.string,
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
    let isSignedIn = this.props.voter.is_signed_in;

    /* eslint-disable no-extra-parens */
    let profilePopUpOpen = this.props.profilePopUpOpen ? (isWebApp() ? "profile-menu--open" : "profile-foot-menu--open") : "";

    return (
      <div className={profilePopUpOpen}>
        <div className="page-overlay" onClick={this.hideProfilePopUp} />
        <div className={isWebApp() ? "profile-menu" : "profile-foot-menu"} >
          <ul className="nav nav-stacked">
            <li>
              <div><span className="we-vote-promise">Our Promise: We'll never sell your email.</span></div>
            </li>
          </ul>
          <h4 className="text-left"/>
          <ul className="nav nav-stacked">
            {/* Desktop only */}
            <li className="d-none d-sm-block">
              <Link onClick={this.hideProfilePopUp} to="/settings/profile">
                <div>
                  <span className="header-slide-out-menu-text-left">Your Settings</span>
                </div>
              </Link>
            </li>
            {/* Mobile only */}
            <li className="d-block d-sm-none">
              <Link onClick={this.hideProfilePopUp} to="/settings/menu">
                <div>
                  <span className="header-slide-out-menu-text-left">Your Settings</span>
                </div>
              </Link>
            </li>
            {/* Desktop only */}
            <li className="d-none d-sm-block">
              <Link onClick={this.hideProfilePopUp} to="/settings/voterguidelist">
                <div>
                  <span className="header-slide-out-menu-text-left">Your Voter Guides</span>
                </div>
              </Link>
            </li>
            {/* Mobile only */}
            <li className="d-block d-sm-none">
              <Link onClick={this.hideProfilePopUp} to="/settings/voterguidesmenu">
                <div>
                  <span className="header-slide-out-menu-text-left">Your Voter Guides</span>
                </div>
              </Link>
            </li>
            {/* Desktop or Mobile */}
            {this.props.voter && isSignedIn ?
              null :
              <li>
                <Link onClick={this.hideProfilePopUp} to="/settings/account">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign In</span>
                  </div>
                </Link>
              </li>
            }
            {this.props.bookmarks && this.props.bookmarks.length ?
              <li>
                <Link onClick={this.hideProfilePopUp} to="/bookmarks">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Bookmarked Items</span>
                  </div>
                </Link>
              </li> :
              null
            }
            {this.props.weVoteBrandingOff || isWebApp() &&
              <li className="d-block d-sm-none-block">
                <Link onClick={this.hideProfilePopUp} to="/more/howtouse">
                  <div>
                    <span className="header-slide-out-menu-text-left">Getting Started</span>
                  </div>
                </Link>
              </li>
            }
            {this.props.weVoteBrandingOff || isCordova() ? null :
              <li className="d-block d-sm-none-block">
                <Link onClick={this.hideProfilePopUp} to="/more/about">
                  <div>
                    <span className="header-slide-out-menu-text-left">About We Vote</span>
                  </div>
                </Link>
              </li>
            }
            {this.props.weVoteBrandingOff || isCordova() ? null :
              <li className="d-block d-sm-none-block">
                <Link onClick={this.hideProfilePopUp} to="/more/donate">
                  <div>
                    <span className="header-slide-out-menu-text-left">Donate</span>
                  </div>
                </Link>
              </li>
            }
            {/* Desktop or Mobile */}
            {this.props.voter && isSignedIn ?
              <li>
                <Link onClick={this.signOutAndHideProfilePopUp} to="/settings/account">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign Out</span>
                  </div>
                </Link>
              </li> :
              null
            }
          </ul>
          <span className="terms-and-privacy">
            <br/>
            <Link onClick={this.hideProfilePopUp} to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;
            <Link onClick={this.hideProfilePopUp} to="/more/privacy">Privacy Policy</Link>
          </span>
        </div>
      </div>
    );
  }
}
