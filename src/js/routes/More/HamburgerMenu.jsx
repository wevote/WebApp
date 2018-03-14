import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
import Icon from "react-svg-icons";
import { Table } from "react-bootstrap";

import VoterStore from "../../stores/VoterStore";
import BallotStore from "../../stores/BallotStore";
import { isCordova } from "../../utils/cordovaUtils";
import cookies from "../../utils/cookies";
import HamburgerMenuRow from "../../components/Navigation/HamburgerMenuRow";
import VoterGuideActions from "../../actions/VoterGuideActions";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterSessionActions from "../../actions/VoterSessionActions";

export default class HamburgerMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      bookmarks: [],
    };
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

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter/election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.state.voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.state.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.state.voter.linked_organization_we_vote_id);
  }

  getYourVoterGuidePath () {
    let voter = VoterStore.getVoter();
    let showYourPageFromTwitter = voter.signed_in_twitter && voter.twitter_screen_name;
    let showYourPageFromFacebook = voter.signed_in_facebook && voter.linked_organization_we_vote_id && !showYourPageFromTwitter;
    let yourVoterGuideTo = null;
    if (showYourPageFromTwitter) {
      yourVoterGuideTo = "/" + voter.twitter_screen_name;
    } else if (showYourPageFromTwitter) {
      yourVoterGuideTo = "/voterguide/" + voter.linked_organization_we_vote_id;
    } else if (!showYourPageFromTwitter && !showYourPageFromFacebook && voter.is_signed_in) {
      yourVoterGuideTo = "/yourpage";
    }

    return yourVoterGuideTo;
  }

  render () {
    let voter = VoterStore.getVoter();
    let bookmarks = BallotStore.bookmarks;
    let isSignedIn = voter && voter.is_signed_in;
    isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;
    let voterPhotoUrlMedium = voter.voter_photo_url_medium;
    let signInColor = isSignedIn ? { fontSize: 28, color: "red" } : { fontSize: 28, color: "green" };
    let signInLabel = isSignedIn ? "Sign Out" : "Sign In";
    let weVoteBrandingOff = cookies.getItem("we_vote_branding_off") === null ? false : cookies.getItem("we_vote_branding_off");
    let yourVoterGuideTo = this.getYourVoterGuidePath();

    return <div>
      <Helmet title="Settings Menu"/>
      <Table condensed hover responsive className={"hamburger-menu__table"}>
        <tbody>
          <tr className={"hamburger-menu__tr"}>
            <td colSpan={3} style={{ padding: 15, color: "DarkGrey" }}>
              <span className="we-vote-promise" style={{ fontSize: 15 }}>Our Promise: We'll never sell your email.</span>
            </td>
          </tr>

          {isSignedIn ?
            <HamburgerMenuRow onClickAction={this.transitionToYourVoterGuide}
                            to={yourVoterGuideTo}
                            icon={"fa fa-list"}
                            iconStyle={{ fontSize: 20, color: "#1c2f4b" }}
                            linkText={"Your Voter Guide"} /> : null
          }

          {isSignedIn ?
            <HamburgerMenuRow onClickAction={null}
                              to={"/more/sign_in"}
                              fullIcon={this.yourAccountIcon(voterPhotoUrlMedium)}
                              linkText={"Your Account"}/> : null
          }

          {voter ?
            <HamburgerMenuRow onClickAction={() => VoterSessionActions.voterSignOut()}
                              to={"/more/sign_in"}
                              icon={isSignedIn ? "fa fa-sign-out" : "fa fa-sign-in"}
                              iconStyle={signInColor}
                              linkText={signInLabel} /> : null
          }

          { bookmarks && bookmarks.length ?
            <HamburgerMenuRow onClickAction={null}
                              to={"/bookmarks"}
                              icon={"fa fa-arrow-circle-right"}
                              iconStyle={{ fontSize: 28, color: "green" }}
                              linkText={"Your Bookmarked Items"} /> : null
          }

          <HamburgerMenuRow onClickAction={null}
                            to={"/more/howtouse"}
                            icon={"fa fa-arrow-circle-right"}
                            iconStyle={{ fontSize: 28, color: "green" }}
                            linkText={"Getting Started"} />

          <HamburgerMenuRow onClickAction={null}
                            to={"/more/about"}
                            icon={"fa fa-users"}
                            iconStyle={{ fontSize: 20, color: "#1c2f4b" }}
                            linkText={"About We Vote"} />

          {weVoteBrandingOff || isCordova() ? null :
            <HamburgerMenuRow onClickAction={null}
                              to={"/more/donate"}
                              icon={"fa fa-money"}
                              iconStyle={{ fontSize: 20, color: "green" }}
                              linkText={"Donate"} />
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
