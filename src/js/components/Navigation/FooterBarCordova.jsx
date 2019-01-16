import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import { hasIPhoneNotch, isCordova, isWebApp } from "../../utils/cordovaUtils";
import cookies from "../../utils/cookies";
import FriendStore from "../../stores/FriendStore";
import HeaderBar from "./HeaderBar";
import HeaderBarAboutMenu from "./HeaderBarAboutMenu";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterSessionActions from "../../actions/VoterSessionActions";

export default class FooterBarCordova extends Component {
  static propTypes = {
    location: PropTypes.object,
    voter: PropTypes.object,
    pathname: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.toggleAboutMenu = this.toggleAboutMenu.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.state = {
      aboutMenuOpen: false,
      profilePopUpOpen: false,
      friendInvitationsSentToMe: [],
    };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.onBallotStoreChange();

    // this.props.location &&
    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
    console.log("FooterBarCordova:  end of componentDidMount");
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.friendStoreListener.remove();
  }

  onBallotStoreChange () {
    // this.setState({ bookmarks: BallotStore.bookmarks });
  }

  _onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  toggleAboutMenu () {
    const { aboutMenuOpen } = this.state;
    this.setState({ aboutMenuOpen: !aboutMenuOpen });
  }

  toggleProfilePopUp () {
    const { profilePopUpOpen } = this.state;
    this.setState({ profilePopUpOpen: !profilePopUpOpen });
  }

  hideProfilePopUp () {
    this.setState({ profilePopUpOpen: false });
  }

  signOutAndHideProfilePopUp () {
    VoterSessionActions.voterSignOut();
    this.setState({ profilePopUpOpen: false });
  }

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter/election
    OrganizationActions.positionListForOpinionMaker(this.props.voter.linked_organization_we_vote_id, true);

    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.props.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.props.voter.linked_organization_we_vote_id);
    this.setState({ profilePopUpOpen: false });
  }

  render () {
    renderLog(__filename);
    const { pathname } = this.props;
    const numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length;
    let voterIsSignedIn = this.props.voter && this.props.voter.is_signed_in;
    voterIsSignedIn = voterIsSignedIn === undefined ? false : voterIsSignedIn;
    const showFullNavigation = cookies.getItem("show_full_navigation") || voterIsSignedIn;
    const weVoteBrandingOff = this.state.we_vote_branding_off === null ? false : this.state.we_vote_branding_off;
    const inNetworkSection = pathname === "/more/network" || pathname === "/more/network/organizations" || pathname === "/more/network/issues" || pathname === "/more/network/friends";

    return (
      <div className={`pageFooter ${hasIPhoneNotch() && "pageFooter__iosNotch"}`}>
        <div className="innerFooterContainer">
          <div className="footerNav">
            {(showFullNavigation || isCordova()) && <span>{HeaderBar.ballot(pathname === "/ballot")}</span>}

            {(showFullNavigation || isCordova()) && <span>{HeaderBar.network(inNetworkSection, numberOfIncomingFriendRequests)}</span>}

            {!weVoteBrandingOff && isWebApp() && (
            <span>
              {showFullNavigation ? (
                <span
                  onClick={this.toggleAboutMenu}
                  className={`header-nav__item header-nav__item--about header-nav__item--has-icon d-none d-sm-block${pathname === "/more/about" ? " active-icon" : ""}`}
                >
                  <span className="header-nav__icon--about">About</span>
                  <span className="header-nav__label">We Vote</span>
                  <HeaderBarAboutMenu toggleAboutMenu={this.toggleAboutMenu} aboutMenuOpen={this.state.aboutMenuOpen} />
                </span>
              ) : (
                <div>
                  <Link
                    to="/more/about"
                    className={`header-nav__item header-nav__item--about${pathname === "/more/about" ? " active-icon" : ""}`}
                  >
                    <span className="header-nav__icon--about">About</span>
                    <span className="header-nav__label">We Vote</span>
                  </Link>
                </div>
              )}
            </span>
            )}

            {!showFullNavigation && isWebApp() && (
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={this.goToGetStarted}
            >
              Sample Ballot
            </button>
            )}

            {!showFullNavigation && isWebApp() && (
            <Link to="/settings/account" className="sign_in header-nav__item">
              Sign In
            </Link>
            )}

            {isCordova() && (
              <Link to="/more/hamburger" className={`hamburger${pathname === "/more/hamburger" ? " active-icon" : ""}`}>
                <span className="fa fa-bars" />
              </Link>
            )}

          </div>
        </div>
      </div>
    );
  }
}
