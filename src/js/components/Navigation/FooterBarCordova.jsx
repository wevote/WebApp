import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BookmarkStore from "../../stores/BookmarkStore";
import { isCordova, isWebApp } from "../../utils/cordovaUtils";
import cookies from "../../utils/cookies";
import FriendStore from "../../stores/FriendStore";
import HeaderBar from "./HeaderBar";
import HeaderBarAboutMenu from "./HeaderBarAboutMenu";
import OrganizationActions from "../../actions/OrganizationActions";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterSessionActions from "../../actions/VoterSessionActions";

const footStyle = {
  backgroundColor: "#1c2f4b",
  borderTop: "1px solid #E7E7E7",
  color: "#fff",
  position: "fixed",
  left: 0,
  bottom: 0,
  height: 54,
  width: "100%",
};

// TODO: 2/24/18, replace this with sass Steve
const footContainer = {
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 12,
  paddingTop: 10,
  display: "flex",
  alignItems: "flex-start",
  position: "relative",
  flexDirection: "row",
  justifyContent: "space-between",
};

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
      bookmarks: [],
      friendInvitationsSentToMe: [],
    };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.bookmarkStoreListener = BookmarkStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.onBallotStoreChange();

    // this.props.location &&
    let weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    let weVoteBrandingOffFromCookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie,
    });
    console.log("FooterBarCordova:  end of componentDidMount");
  }

  componentWillUnmount () {
    this.ballotStoreListener.remove();
    this.bookmarkStoreListener.remove();
    this.friendStoreListener.remove();
  }

  onBallotStoreChange () {
    this.setState({ bookmarks: BallotStore.bookmarks });
  }

  _onFriendStoreChange () {
    this.setState({
      friendInvitationsSentToMe: FriendStore.friendInvitationsSentToMe(),
    });
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

  render () {
    let { pathname } = this.props;
    let numberOfIncomingFriendRequests = this.state.friendInvitationsSentToMe.length;
    let voterIsSignedIn = this.props.voter && this.props.voter.is_signed_in;
    voterIsSignedIn = voterIsSignedIn === undefined ? false : voterIsSignedIn;
    let showFullNavigation = cookies.getItem("show_full_navigation") || voterIsSignedIn;
    let weVoteBrandingOff = this.state.we_vote_branding_off === null ? false : this.state.we_vote_branding_off;
    let inNetworkSection = pathname === "/more/network" || pathname === "/more/network/organizations" || pathname === "/more/network/issues" || pathname === "/more/network/friends";

    return <div className= "footer-bar-cordova" style={footStyle}>
      <div className= "inner-footer-container" >
        <div className= "footer-container" style={footContainer} >
          {(showFullNavigation || isCordova()) && <span>{HeaderBar.ballot(pathname === "/ballot")}</span>}

          {(showFullNavigation || isCordova()) && <span>{HeaderBar.network(inNetworkSection, numberOfIncomingFriendRequests)}</span>}

          {(!weVoteBrandingOff && isWebApp()) &&
            <span>
              {showFullNavigation ?
                <span onClick={this.toggleAboutMenu}
                     className={"header-nav__item header-nav__item--about header-nav__item--has-icon hidden-xs" + (pathname === "/more/about" ? " active-icon" : "")}>
                 <span className="header-nav__icon--about">About</span>
                 <span className="header-nav__label">We Vote</span>
                 <HeaderBarAboutMenu toggleAboutMenu={this.toggleAboutMenu} aboutMenuOpen={this.state.aboutMenuOpen}/>
                </span> :
                <div>
                 <Link to="/more/about"
                       className={"header-nav__item header-nav__item--about" + (pathname === "/more/about" ? " active-icon" : "")}>
                   <span className="header-nav__icon--about">About</span>
                   <span className="header-nav__label">We Vote</span>
                 </Link>
                </div>
              }
            </span>
          }

          {(!showFullNavigation && isWebApp()) &&
            <button type="button" className="btn btn-sm btn-success"
                    onClick={this.goToGetStarted}>Sample Ballot</button>
          }

          {(!showFullNavigation && isWebApp()) &&
            <Link to="/more/sign_in" className="sign_in header-nav__item">
              Sign In
            </Link>
          }

          {(isCordova()) &&
            <Link to="/more/hamburger" className={"hamburger" + (pathname === "/more/hamburger" ? " active-icon" : "")}>
              <span className="fa fa-bars" />
            </Link>
          }

        </div>
      </div>
    </div>;
  }
}
