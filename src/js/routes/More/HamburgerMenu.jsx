import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
import Icon from "react-svg-icons";
import { Table } from "react-bootstrap";

import VoterStore from "../../stores/VoterStore";
import BallotStore from "../../stores/BallotStore";
import HamburgerMenuRow from "../../components/Navigation/HamburgerMenuRow";
import VoterSessionActions from "../../actions/VoterSessionActions";
import { renderLog } from "../../utils/logging";

export default class HamburgerMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      bookmarks: [],
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
    this.setState({voter: VoterStore.getVoter()});
  }

  yourAccountIcon (voterPhotoUrlMedium) {
    return (
      <span className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none"
            onClick={this.toggleProfilePopUp} >
        {voterPhotoUrlMedium ?
          <div id="js-header-avatar" className="header-nav__avatar-container">
            <img className="header-nav__avatar"
                 src={voterPhotoUrlMedium}
                 height={34}
                 width={34}
            />
          </div> :
          <div id= "anonIcon" className="header-nav__avatar">
            <Icon name="avatar-generic" width={34} height={34} />
          </div>
        }
      </span>
    );
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return null;
    }

    let bookmarks = BallotStore.bookmarks;
    let isSignedIn = this.state.voter && this.state.voter.is_signed_in;
    isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;

    return <div>
      <Helmet title="Settings Menu"/>
      <Table condensed hover responsive className={"hamburger-menu__table"}>
        <tbody>
          <tr className={"hamburger-menu__tr"}>
            <td colSpan={3} style={{ padding: 15, color: "DarkGrey" }}>
              <span className="we-vote-promise" style={{ fontSize: 15 }}>Our Promise: We'll never sell your email.</span>
            </td>
          </tr>

          <HamburgerMenuRow onClickAction={null}
                            to={"/settings/profile"}
                            fullIcon={this.yourAccountIcon(this.state.voter.voter_photo_url_medium)}
                            linkText={"Your Profile"} />

          {isSignedIn ?
            <HamburgerMenuRow onClickAction={null}
                              to={"/settings/account"}
                              fullIcon={this.yourAccountIcon(this.state.voter.voter_photo_url_medium)}
                              linkText={"Your Account"}/> :
            <HamburgerMenuRow onClickAction={null}
                              to={"/more/sign_in"}
                              fullIcon={this.yourAccountIcon(this.state.voter.voter_photo_url_medium)}
                              linkText={"Sign In"}/>
          }

          <HamburgerMenuRow onClickAction={null}
                            to={"/settings/address"}
                            icon={"fa fa-address-card"}
                            iconStyle={{ fontSize: 24, color: "#1c2f4b" }}
                            linkText={"Your Address"} />

          <HamburgerMenuRow onClickAction={null}
                            to={"/settings/election"}
                            icon={"fa fa-adjust"}
                            iconStyle={{ fontSize: 28, color: "teal" }}
                            linkText={"Change Election"} />

          { bookmarks && bookmarks.length ?
            <HamburgerMenuRow onClickAction={null}
                              to={"/bookmarks"}
                              icon={"fa fa-bookmark"}
                              iconStyle={{ fontSize: 28, color: "green" }}
                              linkText={"Your Bookmarked Items"} /> : null
          }

          <HamburgerMenuRow onClickAction={null}
                            to={"/settings/voterguidesmenu"}
                            icon={"fa fa-list"}
                            iconStyle={{ fontSize: 20, color: "#1c2f4b" }}
                            linkText={"Your Voter Guides"} />

          {isSignedIn ?
            <HamburgerMenuRow onClickAction={null}
                              to={"/settings/notifications"}
                              icon={"fa fa-arrow-circle-right"}
                              iconStyle={{ fontSize: 28, color: "green" }}
                              linkText={"Notification Settings"}/> :
            null
          }

          <HamburgerMenuRow onClickAction={null}
                            to={"/more/about"}
                            icon={"fa fa-users"}
                            iconStyle={{ fontSize: 20, color: "#1c2f4b" }}
                            linkText={"About We Vote"} />

          {isSignedIn ?
            <HamburgerMenuRow onClickAction={() => VoterSessionActions.voterSignOut()}
                              to={"/more/sign_in"}
                              icon={isSignedIn ? "fa fa-sign-out" : "fa fa-sign-in"}
                              iconStyle={isSignedIn ? { fontSize: 28, color: "red" } : { fontSize: 28, color: "green" }}
                              linkText={"Sign Out"}/> :
            null
          }

          <tr className={"hamburger-terms__tr"}>
            <td className={"hamburger-terms__td"} colSpan={3} >
                <span className={"hamburger-terms__text"} >
                  <Link to="/more/terms">Terms of Service</Link>
                  <span style={{ paddingLeft: 20 }} />
                  <Link to="/more/privacy">Privacy Policy</Link>
                </span>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>;
  }
}
