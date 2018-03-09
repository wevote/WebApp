import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Icon from "react-svg-icons";
import { Panel, Table } from "react-bootstrap";
import { isWebApp, enclosingRectangle, isCordova } from "../../utils/cordovaUtils";
import { isSpeakerTypeOrganization } from "../../utils/organization-functions";
// import Slider from "react-slide-out";


export default class HeaderBarProfileSlideIn extends Component {
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
    enclosingRectangle("HeaderBarProfileSlideIn, ", this.instance);
  }

  imagePlaceholder (speakerType) {
    let imagePlaceholderString = "";
    if (isSpeakerTypeOrganization(speakerType)) {
      imagePlaceholderString = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    } else {
      imagePlaceholderString = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    }

    return imagePlaceholderString;
  }

  render () {
    console.log("STEVE STEVE HeaderBarProfileSlideIn render");
    let isSignedIn = this.props.voter.is_signed_in;
    let voter = this.props.voter;
    let voterPhotoUrlMedium = voter.voter_photo_url_medium;

    let linkedOrganizationWeVoteId = this.props.voter.linked_organization_we_vote_id;
    let signedInFacebook = this.props.voter.signed_in_facebook;
    let signedInTwitter = this.props.voter.signed_in_twitter;
    let twitterScreenName = this.props.voter.twitter_screen_name;
    let showYourPageFromTwitter = signedInTwitter && twitterScreenName;
    let showYourPageFromFacebook = signedInFacebook && linkedOrganizationWeVoteId && !showYourPageFromTwitter;
    let speakerType = "V";  // TODO DALE make this dynamic
    let yourVoterGuideTo = null;
    if (showYourPageFromTwitter) {
      yourVoterGuideTo = "/" + twitterScreenName;
    } else if (showYourPageFromTwitter) {
      yourVoterGuideTo = "/voterguide/" + linkedOrganizationWeVoteId;
    } else if (!showYourPageFromTwitter && !showYourPageFromFacebook && isSignedIn) {
      yourVoterGuideTo = "/yourpage";
    }

    /* eslint-disable no-extra-parens */
    let profilePopUpOpen = this.props.profilePopUpOpen ? (isWebApp() ? "profile-menu--open" : "profile-foot-menu--open") : "";

    return (
      <div className={profilePopUpOpen}>
        {/*<div className="page-overlay" onClick={this.hideProfilePopUp} />*/}
        {/*<td className={isWebApp() ? "profile-menu" : "profile-foot-menu"} ref={ (el) => (this.instance = el) }*/}
            {/*style={{ marginBottom: 113, maxWidth: 1000, padding: 0, width: "100%" }}>*/}
          {/*/!* https://www.npmjs.com/package/react-slide-out *!/*/}
          {/*<Slider*/}
            {/*verticalOffset={{ bottom: 170, top: 0 }}*/}
            {/*isOpen*/}
            {/*onOutsideClick={this.hideProfilePopUp}*/}
            {/*ref={ (el) => (this.instance = el) }>*/}
            {/*<Panel className={"just-outside-table"} style={{ backgroundColor: "white", height: "500px", overflowY: "auto", color: "black" }} >*/}

            <div className={"profile-foot-menu"} ref={ (el) => (this.instance = el)} onClick={this.hideProfilePopUp}>

            <Table striped bordered condensed hover responsive style={{ borderTop: 40, borderTopColor: "white" }}>

              <tr className={"slide-in-tr"}>
                <td colSpan={3} style={{ padding: 15, color: "DarkGrey" }}>
                  <span className="we-vote-promise" style={{ fontSize: 15 }}>Our Promise: We'll never sell your email.</span>
                </td>
              </tr>

              {yourVoterGuideTo &&
              <tr className={"slide-in-tr"}>
                <td className={"slide-in-td-left"}>
                  <span className="fa fa-list" style={{ fontSize: 20, color: "#1c2f4b" }}/>
                </td>
                <td style={{ padding: 15, width: "75%", fontSize: 20 }}>
                  <Link onClick={this.transitionToYourVoterGuide} to={yourVoterGuideTo}>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </Link>
                </td>
              </tr>
              }

              {this.props.voter && isSignedIn &&
              <tr className={"slide-in-tr"}>
                <td className={"slide-in-td-left"}>
                  <span className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none"
                        onClick={this.toggleProfilePopUp}>
                    {voterPhotoUrlMedium ?
                      <div id="js-header-avatar" className="header-nav__avatar-container">
                        <img className="header-nav__avatar"
                             src={voterPhotoUrlMedium}
                             height={34}
                             width={34}
                        />
                      </div> : this.imagePlaceholder(speakerType)
                    }
                  </span>
                </td>
                <td className={"slide-in-td-mid"}>
                  <Link onClick={this.hideProfilePopUp} to="/more/sign_in">Your Account</Link>
                </td>
              </tr>
              }

              {this.props.voter &&
              <tr className={"slide-in-tr"}>
                <td className={"slide-in-td-left"}>
                  <span className={isSignedIn ? "fa fa-sign-out" : "fa fa-sign-in"} style={isSignedIn ? { fontSize: 28, color: "red" } : { fontSize: 28, color: "#ff4921" } }/>
                </td>
                <td className={"slide-in-td-mid"}>
                  <Link onClick={this.signOutAndHideProfilePopUp} to="/more/sign_in">{isSignedIn ? "Sign Out" : "Sign In"}</Link>
                </td>
              </tr>
              }

              {this.props.bookmarks && this.props.bookmarks.length ?
                <tr className={"slide-in-tr"}>
                  <td className={"slide-in-td-left"}>
                    <span className="fa fa-arrow-circle-right" style={{ fontSize: 28, color: "green" }}/>
                  </td>
                  <td className={"slide-in-td-mid"}>
                    <Link onClick={this.signOutAndHideProfilePopUp} to="/bookmarks">Your Bookmarked Items</Link>
                  </td>
                </tr> :
                null
              }

              <tr className={"slide-in-tr"}>
                <td className={"slide-in-td-left"}>
                  <span className="fa fa-arrow-circle-right" style={{ fontSize: 28, color: "green" }}/>
                </td>
                <td className={"slide-in-td-mid"}>
                  <Link onClick={this.signOutAndHideProfilePopUp} to="/more/howtouse">Getting Started</Link>
                </td>
                {/*<td style={{ padding: 15, width: "10%" }}> > </td>*/}
              </tr>

              <tr className={"slide-in-tr"}>
                <td className={"slide-in-td-left"}>
                  <span className="fa fa-users" style={{ fontSize: 20, color: "#1c2f4b" }}/>
                </td>
                <td className={"slide-in-td-mid"}>
                  <Link onClick={this.signOutAndHideProfilePopUp} to="/more/about">About We Vote</Link>
                </td>
              </tr>

              {this.props.weVoteBrandingOff || isCordova() ? null :
                <tr className={"slide-in-tr"}>
                  <td className={"slide-in-td-left"}>
                    <span className="fa fa-money" style={{ fontSize: 20, color: "green" }}/>
                  </td>
                  <td className={"slide-in-td-mid"}>
                    <Link onClick={this.signOutAndHideProfilePopUp} to="/more/donate">Donate</Link>
                  </td>
                </tr>
              }

              <tr style={{ height: 50 }}>
                <td colSpan={3} style={{ padding: 15, paddingBottom: 7, paddingTop: 23 }}>
                <span className="terms-and-privacy-slide" style={{ fontWeight: 400, fontSize: 14, color: "blue" }}>
                  <Link onClick={this.hideProfilePopUp} to="/more/terms">Terms of Service</Link>
                  <span style={{ paddingLeft: 20 }} />
                  <Link onClick={this.hideProfilePopUp} to="/more/privacy">Privacy Policy</Link>
                </span>
                </td>
              </tr>
            </Table>
          {/*</Panel>*/}
        {/*</Slider>*/}
        </div>
      </div>

    );
  }
}

