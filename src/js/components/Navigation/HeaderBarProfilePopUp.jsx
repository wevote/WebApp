import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { isWebApp, enclosingRectangle, isCordova } from "../../utils/cordovaUtils";

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

  componentDidMount () {
    enclosingRectangle("HeaderBarProfilePopUp, ", this.instance);
  }

  render () {
    let isSignedIn = this.props.voter.is_signed_in;
    let linkedOrganizationWeVoteId = this.props.voter.linked_organization_we_vote_id;
    let signedInFacebook = this.props.voter.signed_in_facebook;
    let signedInTwitter = this.props.voter.signed_in_twitter;
    let twitterScreenName = this.props.voter.twitter_screen_name;
    let showYourPageFromTwitter = signedInTwitter && twitterScreenName;
    let showYourPageFromFacebook = signedInFacebook && linkedOrganizationWeVoteId && !showYourPageFromTwitter;

    /* eslint-disable no-extra-parens */
    let profilePopUpOpen = this.props.profilePopUpOpen ? (isWebApp() ? "profile-menu--open" : "profile-foot-menu--open") : "";

    return (
      <div className={profilePopUpOpen}>
        <div className="page-overlay" onClick={this.hideProfilePopUp} />
        <div className={isWebApp() ? "profile-menu" : "profile-foot-menu"} ref={ (el) => (this.instance = el) }>
          <ul className="nav nav-stacked">
            <li>
              <div><span className="we-vote-promise">Our Promise: We'll never sell your email.</span></div>
            </li>
          </ul>
          <h4 className="text-left"/>
          <ul className="nav nav-stacked">
            {showYourPageFromTwitter ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide} to={"/" + twitterScreenName}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            {showYourPageFromFacebook ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide}
                      to={"/voterguide/" + linkedOrganizationWeVoteId}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            {!showYourPageFromTwitter && !showYourPageFromFacebook && isSignedIn ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide} to="/yourpage">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            {this.props.voter && isSignedIn ?
              <li>
                <Link onClick={this.hideProfilePopUp} to="/settings/profile">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Settings</span>
                  </div>
                </Link>
              </li> :
              <li>
                <Link onClick={this.hideProfilePopUp} to="/more/sign_in">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign In</span>
                  </div>
                </Link>
              </li>}
            {this.props.voter && isSignedIn ?
              <li>
                <Link onClick={this.signOutAndHideProfilePopUp} to="/more/sign_in">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign Out</span>
                  </div>
                </Link>
              </li> :
              null
            }
            {this.props.bookmarks && this.props.bookmarks.length ?
              <li>
                <Link onClick={this.hideProfilePopUp} to="/bookmarks">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Bookmarked Items</span>
                  </div>
                </Link>
              </li> :
              null}
            {this.props.weVoteBrandingOff || isCordova() ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideProfilePopUp} to="/more/howtouse">
                  <div>
                    <span className="header-slide-out-menu-text-left">Getting Started</span>
                  </div>
                </Link>
              </li>
            }
            {this.props.weVoteBrandingOff ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideProfilePopUp} to="/more/about">
                  <div>
                    <span className="header-slide-out-menu-text-left">About We Vote</span>
                  </div>
                </Link>
              </li>
            }
            {this.props.weVoteBrandingOff || isCordova() ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideProfilePopUp} to="/more/donate">
                  <div>
                    <span className="header-slide-out-menu-text-left">Donate</span>
                  </div>
                </Link>
              </li>
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
