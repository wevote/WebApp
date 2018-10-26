import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import Icon from "react-svg-icons";
import BallotStore from "../../stores/BallotStore";
import BookmarkStore from "../../stores/BookmarkStore";
import { cordovaDot, historyPush, isCordova, isWebApp } from "../../utils/cordovaUtils";
import cookies from "../../utils/cookies";
import FriendStore from "../../stores/FriendStore";
import HeaderBarProfilePopUp from "./HeaderBarProfilePopUp";
import HeaderBarAboutMenu from "./HeaderBarAboutMenu";
import HeaderBarLogo from "./HeaderBarLogo";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import { isSpeakerTypeOrganization } from "../../utils/organization-functions";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterSessionActions from "../../actions/VoterSessionActions";
// import SearchAllBox from "../../components/Search/SearchAllBox";

export default class HeaderBar extends Component {
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
      bookmarks: [],
      componentDidMountFinished: false,
      profilePopUpOpen: false,
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    };
  }

  componentDidMount () {
    // this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.bookmarkStoreListener = BookmarkStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    //this.onBallotStoreChange();

    // this.props.location &&
    let weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    let weVoteBrandingOffFromCookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      componentDidMountFinished: true,
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
  }

  componentWillUnmount () {
    // this.ballotStoreListener.remove();
    this.bookmarkStoreListener.remove();
    this.friendStoreListener.remove();
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
    let currentPathnameExists = this.props.location && this.props.location.pathname;
    let nextPathnameExists = nextProps.location && nextProps.location.pathname;
    // One exists, and the other doesn't
    if (currentPathnameExists && !nextPathnameExists || !currentPathnameExists && nextPathnameExists) {
      // console.log("shouldComponentUpdate: PathnameExistsDifference");
      return true;
    }
    if (currentPathnameExists && nextPathnameExists && this.props.location.pathname !== nextProps.location.pathname) {
      // console.log("shouldComponentUpdate: this.props.location.pathname", this.props.location.pathname, ", nextProps.location.pathname", nextProps.location.pathname);
      return true;
    }
    return false;
  }

  onBallotStoreChange () {
    this.setState({ bookmarks: BallotStore.bookmarks });
  }

  _onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
  }

  static ballot (active) {
    return <Link to="/ballot" className={ "header-nav__item--ballot header-nav__item header-nav__item--has-icon" + (active ? " active-icon" : "")}>
      <Icon name="glyphicons-pro-halflings/glyphicons-halflings-32-list-alt" color="#e6e6e6" className={"header-nav__icon--ballot"} />
      <span className="header-nav__label">
        Ballot
      </span>
    </Link>;
  }

  static network (active, numberOfIncomingFriendRequests) {
    return <Link to="/more/network" className={ "header-nav__item--network header-nav__item header-nav__item--has-icon" + (active ? " active-icon" : "")}>
      <span title="Network">
        <img className="glyphicon" src={cordovaDot("/img/global/svg-icons/network-icon.svg")} />
        {numberOfIncomingFriendRequests ?
          numberOfIncomingFriendRequests < 9 ?
            <span className="badge-total badge footerNav.badge-total">{numberOfIncomingFriendRequests}</span> :
            <span className="badge-total badge-total--overLimit badge">9+</span> :
          null }
      </span>
      <span className="header-nav__label">
        Network
        </span>
    </Link>;
  }

  static donate (active) {
    return <Link to="/more/donate" className={ "header-nav__item--donate header-nav__item header-nav__item--has-icon d-none d-sm-block" + (active ? " active-icon" : "")}>
      <img className="glyphicon" src={cordovaDot("/img/global/svg-icons/glyphicons-20-heart-empty.svg")} />
      <span className="header-nav__label">
        Donate
      </span>
    </Link>;
  }

  toggleAboutMenu () {
    this.setState({ aboutMenuOpen: !this.state.aboutMenuOpen });
  }

  toggleProfilePopUp () {
    this.setState({ profilePopUpOpen: !this.state.profilePopUpOpen });
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

  imagePlaceholder (speakerType) {
    let imagePlaceholderString = "";
    if (isSpeakerTypeOrganization(speakerType)) {
      imagePlaceholderString = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} color="#c0c0c0" /></div>;
    } else {
      imagePlaceholderString = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} color="#c0c0c0" /></div>;
    }

    return imagePlaceholderString;
  }

  goToGetStarted () {
    let getStartedNow = "/ballot";
    historyPush(getStartedNow);
  }

  render () {
    renderLog(__filename);
    let { pathname } = this.props;
    let voter = this.props.voter;
    let voterPhotoUrlMedium = voter.voter_photo_url_medium;
    let speakerType = "V";  // TODO DALE make this dynamic
    let numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length;
    let voterIsSignedIn = this.props.voter && this.props.voter.is_signed_in;
    let showFullNavigation = cookies.getItem("show_full_navigation") || voterIsSignedIn;
    let weVoteBrandingOff = this.state.we_vote_branding_off;
    let inNetworkSection = pathname === "/more/network" || pathname === "/more/network/organizations" || pathname === "/more/network/issues" || pathname === "/more/network/friends";

    return (
      <header className={ isWebApp() ? "page-header" : "page-header page-header__cordova" }>
        {!weVoteBrandingOff && isWebApp() && <HeaderBarLogo showFullNavigation={!!showFullNavigation} isBeta />
        }
        <div className="header-nav">
          { showFullNavigation && isWebApp() && HeaderBar.ballot(pathname === "/ballot") }

          { showFullNavigation && isWebApp() && HeaderBar.network(inNetworkSection, numberOfIncomingFriendRequests) }

          { weVoteBrandingOff || isCordova() ? null :
            <span>
              { showFullNavigation ?
                <span onClick={this.toggleAboutMenu} className={ "header-nav__item header-nav__item--about header-nav__item--has-icon d-none d-sm-block" + (pathname === "/more/about" ? " active-icon" : "")}>
                  <span className="header-nav__icon--about">About</span>
                  <span className="header-nav__label">We Vote</span>
                  <HeaderBarAboutMenu toggleAboutMenu={this.toggleAboutMenu} aboutMenuOpen={this.state.aboutMenuOpen} />
                </span> :
                <div>
                  <Link to="/more/about" className={ "header-nav__item header-nav__item--about" + (pathname === "/more/about" ? " active-icon" : "")}>
                    <span className="header-nav__icon--about">About</span>
                    <span className="header-nav__label">We Vote</span>
                  </Link>
                 </div>
              }
            </span>
          }

          { showFullNavigation && !weVoteBrandingOff && isWebApp() ? HeaderBar.donate(pathname === "/more/donate") : null }

          { !showFullNavigation && isWebApp() &&
            <button type="button" className="btn btn-sm btn-success"
                onClick={this.goToGetStarted}>Sample Ballot</button> }

          { !showFullNavigation && isWebApp() &&
            <Link to="/settings/account" className="sign_in header-nav__item">
              Sign In
            </Link>
          }
        </div>

        {/* (showFullNavigation || isCordova()) && <SearchAllBox /> */}

        { showFullNavigation && isWebApp() &&
          <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none" onClick={this.toggleProfilePopUp}>
          {voterPhotoUrlMedium ?
            <div id="js-header-avatar" className="header-nav__avatar-container">
                <img className="header-nav__avatar"
                      src={voterPhotoUrlMedium}
                      height={34}
                      width={34}
                 />
            </div> : this.imagePlaceholder(speakerType)
          }
          {/* Was AccountMenu */}
          {this.state.profilePopUpOpen &&
            <HeaderBarProfilePopUp {...this.props}
                                  onClick={this.toggleProfilePopUp}
                                  profilePopUpOpen={this.state.profilePopUpOpen}
                                  bookmarks={this.state.bookmarks}
                                  weVoteBrandingOff={this.state.we_vote_branding_off}
                                  toggleProfilePopUp={this.toggleProfilePopUp}
                                  hideProfilePopUp={this.hideProfilePopUp}
                                  transitionToYourVoterGuide={this.transitionToYourVoterGuide.bind(this)}
                                  signOutAndHideProfilePopUp={this.signOutAndHideProfilePopUp.bind(this)} />
          }
         </div>
        }
      </header>
    );
  }
}
