import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
import Icon from "react-svg-icons";
import { Table } from "react-bootstrap";
import { isWebApp } from "../../utils/cordovaUtils";
import VoterStore from "../../stores/VoterStore";
import BallotStore from "../../stores/BallotStore";
import HamburgerMenuRow from "../../components/Navigation/HamburgerMenuRow";
import LoadingWheel from "../../components/LoadingWheel";
import VoterSessionActions from "../../actions/VoterSessionActions";
import { renderLog } from "../../utils/logging";

export default class HamburgerMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voter: undefined,
    };
  }

  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.timer = null;
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  yourAccountIcon (voterPhotoUrlMedium) {
    return (
      <span
        className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none"
        onClick={this.toggleProfilePopUp}
      >
        {voterPhotoUrlMedium ? (
          <div id="js-header-avatar" className={isWebApp() ? "header-nav__avatar" : "header-nav__avatar-cordova header-nav__cordova"}>
            <img
              alt="Signed in voter"
              src={voterPhotoUrlMedium}
              height={34}
              width={34}
            />
          </div>
        ) : (
          <div id="anonIcon" className={isWebApp() ? "header-nav__avatar" : "header-nav__avatar-cordova header-nav__cordova"}>
            <Icon name="avatar-generic" width={34} height={34} color="#c0c0c0" />
          </div>
        )}
      </span>
    );
  }

  render () {
    renderLog(__filename);
    const { voter } = this.state;
    if (voter === undefined) {
      return LoadingWheel;
    }

    const hasBookmarks = BallotStore.bookmarks && BallotStore.bookmarks.length;
    let { is_signed_in: isSignedIn } = voter;
    const { voter_photo_url_medium: photoUrl } = voter;
    isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;

    return (
      <div>
        <Helmet title="Settings Menu" />
        <Table responsive className="hamburger-menu__table">
          <tbody>
            <tr className="hamburger-menu__tr">
              <td colSpan={3} style={{ padding: 15 }}>
                <span className="we-vote-promise" style={{ fontSize: 15 }}>Our Promise: We&apos;ll never sell your email.</span>
              </td>
            </tr>

            {!isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/account"
                fullIcon={this.yourAccountIcon(photoUrl)}
                linkText="Sign In"
              />
            )}

            <tr className="hamburger-menu__tr">
              <td colSpan={3} style={{ padding: 15 }}>
                <span className="we-vote-promise" style={{ fontSize: 18, color: "black", opacity: 0.7 }}>Settings:</span>
              </td>
            </tr>

            <HamburgerMenuRow
              onClickAction={null}
              to="/settings/profile"
              icon="fa fa-address-card"
              iconStyle={{ fontSize: 28, color: "#1c2f4b" }}
              linkText="Profile"
              indented
            />

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/account"
                fullIcon={this.yourAccountIcon(photoUrl)}
                linkText="Account"
                indented
              />
            )}

            <HamburgerMenuRow
              onClickAction={null}
              to="/settings/address"
              icon="fa fa-home"
              iconStyle={{ fontSize: 30, color: "#1c2f4b" }}
              linkText="Address"
              indented
            />

            <HamburgerMenuRow
              onClickAction={null}
              to="/settings/election"
              icon="fa fa-cog"
              iconStyle={{ fontSize: 28, color: "#1c2f4b" }}
              linkText="Election Choice"
              indented
            />


            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/notifications"
                icon="fa fa-bell"
                iconStyle={{ fontSize: 26, color: "#1c2f4b" }}
                linkText="Notifications"
                indented
              />
            )}

            <HamburgerMenuRow
              onClickAction={null}
              to="/settings/voterguidesmenu"
              icon="fa fa-list"
              iconStyle={{ fontSize: 24, color: "#1c2f4b" }}
              linkText="Your Voter Guides"
            />

            { hasBookmarks ? (
              <HamburgerMenuRow
                onClickAction={null}
                to="/bookmarks"
                icon="fa fa-bookmark"
                iconStyle={{ fontSize: 28, color: "#1c2f4b" }}
                linkText="Bookmarks"
              />
            ) : null
          }

            <HamburgerMenuRow
              onClickAction={null}
              to="/more/about"
              icon="fa fa-users"
              iconStyle={{ fontSize: 22, color: "#1c2f4b" }}
              linkText="About We Vote"
            />

            {isSignedIn && (
            <HamburgerMenuRow
              onClickAction={() => VoterSessionActions.voterSignOut()}
              to="/settings/account"
              icon={isSignedIn ? "fa fa-sign-out" : "fa fa-sign-in"}
              iconStyle={{ fontSize: 28, color: "#1c2f4b" }}
              linkText="Sign Out"
            />
            )}

            <tr className="hamburger-terms__tr">
              <td className="hamburger-terms__td" colSpan={3}>
                <span className="hamburger-terms__text">
                  <Link to="/more/terms">Terms of Service</Link>
                  <span style={{ paddingLeft: 20 }} />
                  <Link to="/more/privacy">Privacy Policy</Link>
                </span>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}
