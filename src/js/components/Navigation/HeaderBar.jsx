import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import { cordovaDot, historyPush, isCordova, isWebApp } from "../../utils/cordovaUtils";
import cookies from "../../utils/cookies";
import FriendStore from "../../stores/FriendStore";
import HeaderBarProfilePopUp from "./HeaderBarProfilePopUp";
import HeaderBarAboutMenu from "./HeaderBarAboutMenu";
import HeaderBarLogo from "./HeaderBarLogo";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterSessionActions from "../../actions/VoterSessionActions";

export default class HeaderBar extends Component {
  static propTypes = {
    location: PropTypes.object,
    voter: PropTypes.object,
    pathname: PropTypes.string,
  };

  static ballot (active) {
    return (
      <Link to="/ballot" className={`header-nav__item${active ? " active-icon" : ""}`}>
        <img className="header-nav__icon--ballot"
             src={cordovaDot("/img/global/svg-icons/nav/ballot-icon-24.svg")}
             color="#ffffff"
             alt="Ballot"
        />
        <span className="header-nav__label">
          Ballot
        </span>
      </Link>
    );
  }

  static network (active, numberOfIncomingFriendRequests) {
    return (
      <Link to="/more/network" className={`header-nav__item${active ? " active-icon" : ""}`}>
        <div title="Network">
          <img className="header-nav__icon"
               src={cordovaDot("/img/global/svg-icons/nav/network-icon-24.svg")}
               color="#ffffff"
               alt="Network"
          />
          {numberOfIncomingFriendRequests ?         // eslint-disable-line no-nested-ternary
            numberOfIncomingFriendRequests < 9 ?
              <span className="badge-total badge footerNav.badge-total">{numberOfIncomingFriendRequests}</span> :
              <span className="badge-total badge-total--overLimit badge">9+</span> :
            null }
        </div>
        <span className="header-nav__label">
          Network
        </span>
      </Link>
    );
  }

  static donate (active) {
    return (
      <Link to="/more/donate" className={`header-nav__item--donate header-nav__item d-none d-sm-block${active ? " active-icon" : ""}`}>
        <img className="header-nav__icon"
             src={cordovaDot("/img/global/svg-icons/nav/donate-icon-24.svg")}
             color="#ffffff"
             alt="Donate"
        />
        <span className="header-nav__label">
        Donate
        </span>
      </Link>
    );
  }

  static goToGetStarted () {
    const getStartedNow = "/ballot";
    historyPush(getStartedNow);
  }

  constructor (props) {
    super(props);
    this.hideProfilePopUp = this.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.signOutAndHideProfilePopUp.bind(this);
    this.toggleAboutMenu = this.toggleAboutMenu.bind(this);
    this.toggleProfilePopUp = this.toggleProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.transitionToYourVoterGuide.bind(this);
    this.state = {
      aboutMenuOpen: false,
      componentDidMountFinished: false,
      profilePopUpOpen: false,
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    // this.onBallotStoreChange();

    // this.props.location &&
    const weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    const weVoteBrandingOffFromCookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      componentDidMountFinished: true,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.profilePopUpOpen === true || nextState.profilePopUpOpen === true) {
      // console.log("shouldComponentUpdate: this.state.profilePopUpOpen", this.state.profilePopUpOpen, ", nextState.profilePopUpOpen", nextState.profilePopUpOpen);
      return true;
    }
    if (this.state.aboutMenuOpen === true || nextState.aboutMenuOpen === true) {
      // console.log("shouldComponentUpdate: this.state.aboutMenuOpen", this.state.aboutMenuOpen, ", nextState.aboutMenuOpen", nextState.aboutMenuOpen);
      return true;
    }
    const currentPathnameExists = this.props.location && this.props.location.pathname;
    const nextPathnameExists = nextProps.location && nextProps.location.pathname;
    // One exists, and the other doesn't
    if ((currentPathnameExists && !nextPathnameExists) || (!currentPathnameExists && nextPathnameExists)) {
      // console.log("shouldComponentUpdate: PathnameExistsDifference");
      return true;
    }
    if (currentPathnameExists && nextPathnameExists && this.props.location.pathname !== nextProps.location.pathname) {
      // console.log("shouldComponentUpdate: this.props.location.pathname", this.props.location.pathname, ", nextProps.location.pathname", nextProps.location.pathname);
      return true;
    }
    const thisVoterExists = this.props.voter !== undefined;
    const nextVoterExists = nextProps.voter !== undefined;
    if (nextVoterExists && !thisVoterExists) {
      // console.log("shouldComponentUpdate: thisVoterExists", thisVoterExists, ", nextVoterExists", nextVoterExists);
      return true;
    }
    if (thisVoterExists && nextVoterExists && this.props.voter.signed_in_twitter !== nextProps.voter.signed_in_twitter) {
      // console.log("shouldComponentUpdate: this.props.voter.signed_in_twitter", this.props.voter.signed_in_twitter, ", nextProps.voter.signed_in_twitter", nextProps.voter.signed_in_twitter);
      return true;
    }
    if (thisVoterExists && nextVoterExists && this.props.voter.signed_in_facebook !== nextProps.voter.signed_in_facebook) {
      // console.log("shouldComponentUpdate: this.props.voter.signed_in_facebook", this.props.voter.signed_in_facebook, ", nextProps.voter.signed_in_facebook", nextProps.voter.signed_in_facebook);
      return true;
    }
    if (thisVoterExists && nextVoterExists && this.props.voter.signed_in_with_email !== nextProps.voter.signed_in_with_email) {
      // console.log("shouldComponentUpdate: this.props.voter.signed_in_with_email", this.props.voter.signed_in_with_email, ", nextProps.voter.signed_in_with_email", nextProps.voter.signed_in_with_email);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.friendStoreListener.remove();
  }

  onBallotStoreChange () {
    // this.setState({ bookmarks: BallotStore.bookmarks });
  }

  onFriendStoreChange () {
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
    const { pathname, voter } = this.props;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;
    const numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length;
    const voterIsSignedIn = this.props.voter && this.props.voter.is_signed_in;
    const showFullNavigation = cookies.getItem("show_full_navigation") || voterIsSignedIn;
    const weVoteBrandingOff = this.state.we_vote_branding_off;
    const inNetworkSection = pathname === "/more/network" || pathname === "/more/network/organizations" || pathname === "/more/network/issues" || pathname === "/more/network/friends";

    return (
      <header className={isWebApp() ? "page-header" : "page-header page-header__cordova"}>
        {!weVoteBrandingOff && isWebApp() && <HeaderBarLogo showFullNavigation={!!showFullNavigation} isBeta />
        }
        <div className="header-nav">
          { showFullNavigation && isWebApp() && HeaderBar.ballot(pathname === "/ballot") }

          { showFullNavigation && isWebApp() && HeaderBar.network(inNetworkSection, numberOfIncomingFriendRequests) }

          { weVoteBrandingOff || isCordova() ? null : (
            <span>
              { showFullNavigation ? (
                <span onClick={this.toggleAboutMenu} className={`header-nav__item header-nav__item--about d-none d-sm-block${pathname === "/more/about" ? " active-icon" : ""}`}>
                  <span className="header-nav__icon--about">About</span>
                  <span className="header-nav__label">We Vote</span>
                  <HeaderBarAboutMenu toggleAboutMenu={this.toggleAboutMenu} aboutMenuOpen={this.state.aboutMenuOpen} />
                </span>
              ) : (
                <div>
                  <Link to="/more/about" className={`header-nav__item header-nav__item--about${pathname === "/more/about" ? " active-icon" : ""}`}>
                    <span className="header-nav__icon--about">About</span>
                    <span className="header-nav__label">We Vote</span>
                  </Link>
                </div>
              )}
            </span>
          )}

          { showFullNavigation && !weVoteBrandingOff && isWebApp() ? HeaderBar.donate(pathname === "/more/donate") : null }

          { !showFullNavigation && isWebApp() && (
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={HeaderBar.goToGetStarted}
          >
            Sample Ballot
          </button>
          )}

          { !showFullNavigation && isWebApp() && (
          <Link to="/settings/account" className="sign_in header-nav__item">
              Sign In
          </Link>
          )}
        </div>

        {/* (showFullNavigation || isCordova()) && <SearchAllBox /> */}

        { showFullNavigation && isWebApp() && (
        <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none" onClick={this.toggleProfilePopUp}>
          {voterPhotoUrlMedium ? (
            <div id="js-header-avatar" className="header-nav__avatar-container">
              <img
                className="header-nav__avatar"
                src={voterPhotoUrlMedium}
                height={34}
                width={34}
                alt="generic avatar"
              />
            </div>
          ) : (
            <div id="anonIcon" className="header-nav__avatar">
              <img src={cordovaDot("/img/global/svg-icons/avatar-generic.svg")} width="34" height="34" color="#c0c0c0" alt="generic voter" />
            </div>
          )
          }
          {/* Was AccountMenu */}
          {this.state.profilePopUpOpen && (
          <HeaderBarProfilePopUp
            {...this.props}
            onClick={this.toggleProfilePopUp}
            profilePopUpOpen={this.state.profilePopUpOpen}
            weVoteBrandingOff={this.state.we_vote_branding_off}
            toggleProfilePopUp={this.toggleProfilePopUp}
            hideProfilePopUp={this.hideProfilePopUp}
            transitionToYourVoterGuide={this.transitionToYourVoterGuide}
            signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp}
          />
          )}
        </div>
        )}
      </header>
    );
  }
}
