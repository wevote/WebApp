import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BookmarkStore from "../../stores/BookmarkStore";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import cookies from "../../utils/cookies";
import FriendStore from "../../stores/FriendStore";
import OrganizationActions from "../../actions/OrganizationActions";
import { isSpeakerTypeOrganization } from "../../utils/organization-functions";
import SearchAllBox from "../SearchAllBox";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterSessionActions from "../../actions/VoterSessionActions";
const Icon = require("react-svg-icons");


const links = {
  ballot: function (active) {
    let icon = "glyphicon glyphicon-list-alt glyphicon-line-adjustment nav-icon";

    let jsx =
      <Link to="/ballot" className={ "header-nav__item--ballot header-nav__item header-nav__item--has-icon" + (active ? " active-icon" : "")}>
        <span className={icon} title="Ballot" />
        <span className="header-nav__label">
          Ballot
          </span>
      </Link>;

    return jsx;
  },

  network: function (active, number_of_incoming_friend_requests) {
    let jsx =
      <Link to="/more/network" className={ "header-nav__item--network header-nav__item header-nav__item--has-icon" + (active ? " active-icon" : "")}>
        <span title="Network">
          <img className="glyphicon" src={cordovaDot("/img/global/svg-icons/network-icon.svg")} />
          {number_of_incoming_friend_requests ?
            <span className="badge-total badge">{number_of_incoming_friend_requests}</span> :
            null }
        </span>
        <span className="header-nav__label">
          Network
          </span>
      </Link>;

    return jsx;
  },

  donate: function (active) {

    let jsx =
      <Link to="/more/donate" className={ "header-nav__item--donate header-nav__item header-nav__item--has-icon hidden-xs" + (active ? " active-icon" : "")}>
        <img className="glyphicon" src={cordovaDot("/img/global/svg-icons/glyphicons-20-heart-empty.svg")} />
        <span className="header-nav__label">
          Donate
          </span>
      </Link>;

    return jsx;
  }
};

export default class HeaderBar extends Component {
  static propTypes = {
    location: PropTypes.object,
    voter: PropTypes.object,
    pathname: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.aboutMenu = this.aboutMenu.bind(this);
    this.toggleAboutMenu = this.toggleAboutMenu.bind(this);
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this);
    this.hideAccountMenu = this.hideAccountMenu.bind(this);
    this.state = {
      about_menu_open: false,
      accountMenuOpen: false,
      bookmarks: [],
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe()
    };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    this.bookmarkStoreListener = BookmarkStore.addListener(this.onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this.onBallotStoreChange();

    // this.props.location &&
    let we_vote_branding_off_from_url = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    let we_vote_branding_off_from_cookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      we_vote_branding_off: we_vote_branding_off_from_url || we_vote_branding_off_from_cookie,
    });
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
    this.bookmarkStoreListener.remove();
    this.friendStoreListener.remove();
  }

  onBallotStoreChange (){
    this.setState({bookmarks: BallotStore.bookmarks });
  }

  _onFriendStoreChange () {
    this.setState({
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe()
    });
  }

  aboutMenu () {
    let aboutMenuOpen = this.state.about_menu_open ? "about-menu--open" : "";

    return (
      <div className={aboutMenuOpen}>
      <div className="page-overlay" onClick={this.toggleAboutMenu} />
      <div className="about-menu">
          <ul className="nav nav-stacked">
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/howtouse"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Getting Started</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/vision"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Our Vision</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/organization"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Organization</span>
                  </div>
                </Link>
              </li>
            <li>
              <Link onClick={this.toggleAboutMenu} to={"/more/team"}>
                <div>
                  <span className="header-slide-out-menu-text-left">Our Team</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  accountMenu () {
    let { is_signed_in, linked_organization_we_vote_id, signed_in_facebook, signed_in_twitter, twitter_screen_name } = this.props.voter;

    let show_your_page_from_twitter = signed_in_twitter && twitter_screen_name;
    let show_your_page_from_facebook = signed_in_facebook && linked_organization_we_vote_id && !show_your_page_from_twitter;

    let accountMenuOpen = this.state.accountMenuOpen ? "account-menu--open" : "";

    return (
      <div className={accountMenuOpen}>
      <div className="page-overlay" onClick={this.hideAccountMenu} />
      <div className="account-menu">
          <ul className="nav nav-stacked">
            <li>
              <div><span className="we-vote-promise">Our Promise: We'll never sell your email.</span></div>
            </li>
          </ul>
          <h4 className="text-left" />
          <ul className="nav nav-stacked">
            { show_your_page_from_twitter ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide.bind(this)} to={"/" + twitter_screen_name}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { show_your_page_from_facebook ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide.bind(this)} to={"/voterguide/" + linked_organization_we_vote_id}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { !show_your_page_from_twitter && !show_your_page_from_facebook && is_signed_in ?
              <li>
                <Link onClick={this.transitionToYourVoterGuide.bind(this)} to="/yourpage">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { this.props.voter && this.props.voter.is_signed_in ?
              <li>
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/sign_in">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Account</span>
                  </div>
                </Link>
              </li> :
              <li>
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/sign_in">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign In</span>
                  </div>
                </Link>
              </li> }
            { this.props.voter && this.props.voter.is_signed_in ?
              <li>
                <Link onClick={this.signOutAndHideAccountMenu.bind(this)} to="/more/sign_in">
                  <div>
                    <span className="header-slide-out-menu-text-left">Sign Out</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { this.state.bookmarks && this.state.bookmarks.length ?
              <li>
                <Link onClick={this.hideAccountMenu.bind(this)} to="/bookmarks">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Bookmarked Items</span>
                  </div>
                </Link>
              </li> :
              null }
            { this.state.we_vote_branding_off ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/howtouse">
                  <div>
                    <span className="header-slide-out-menu-text-left">Getting Started</span>
                  </div>
                </Link>
              </li>
            }
            { this.state.we_vote_branding_off ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/about">
                  <div>
                    <span className="header-slide-out-menu-text-left">About We Vote</span>
                  </div>
                </Link>
              </li>
            }
            { this.state.we_vote_branding_off ? null :
              <li className="visible-xs-block">
                <Link onClick={this.hideAccountMenu.bind(this)} to="/more/donate">
                  <div>
                    <span className="header-slide-out-menu-text-left">Donate</span>
                  </div>
                </Link>
              </li>
            }
          </ul>
          <span className="terms-and-privacy">
            <br />
            <Link onClick={this.hideAccountMenu.bind(this)} to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link onClick={this.hideAccountMenu.bind(this)} to="/more/privacy">Privacy Policy</Link>
          </span>
        </div>
      </div>
    );
  }

  toggleAboutMenu () {
    this.setState({about_menu_open: !this.state.about_menu_open});
  }

  toggleAccountMenu () {
    this.setState({accountMenuOpen: !this.state.accountMenuOpen});
  }

  hideAccountMenu () {
    this.setState({accountMenuOpen: false});
  }

  signOutAndHideAccountMenu () {
    VoterSessionActions.voterSignOut();
    this.setState({accountMenuOpen: false});
  }

  transitionToYourVoterGuide () {
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.voter.linked_organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.voter.linked_organization_we_vote_id, false, true);
    OrganizationActions.organizationsFollowedRetrieve();
    VoterGuideActions.voterGuideFollowersRetrieve(this.props.voter.linked_organization_we_vote_id);
    VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(this.props.voter.linked_organization_we_vote_id);
    this.setState({accountMenuOpen: false});
  }

  imagePlaceholder (speaker_type) {
    let image_placeholder = "";
    if (isSpeakerTypeOrganization(speaker_type)) {
        image_placeholder = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    } else {
        image_placeholder = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    }
    return image_placeholder;
  }

  goToGetStarted () {
    let getStartedNow = "/ballot";
    historyPush(getStartedNow);
  }

  render () {
    let { pathname } = this.props;
    let { voter_photo_url_medium } = this.props.voter;
    let speaker_type = "V";  // TODO DALE make this dynamic
    let { ballot, network, donate } = links;
    let number_of_incoming_friend_requests = this.state.friend_invitations_sent_to_me.length;
    let voter_is_signed_in = this.props.voter && this.props.voter.is_signed_in;
    let show_full_navigation = cookies.getItem("show_full_navigation") || voter_is_signed_in;
    let we_vote_branding_off = this.state.we_vote_branding_off;
    let in_network_section = pathname === "/more/network" || pathname === "/more/network/organizations" || pathname === "/more/network/issues" || pathname === "/more/network/friends";

    return (
      <header className="page-header">
        { we_vote_branding_off ? null :
          <Link to="/welcome" className="page-logo page-logo-full-size h4 hidden-xs">
            We Vote
            <span className="page-logo__version"> alpha</span>
          </Link>
        }
        { we_vote_branding_off ?
          null :
          <span>
            { show_full_navigation ?
              <Link to="/welcome" className="page-logo page-logo-short h4 visible-xs">
                WV
              </Link> :
              <Link to="/welcome" className="page-logo page-logo-short h4 visible-xs">
                We Vote
                <span className="page-logo__version"> alpha</span>
              </Link>
            }
          </span>
        }
        <div className="header-nav">
          { show_full_navigation ? ballot(pathname === "/ballot") : null }

          { show_full_navigation ? network(in_network_section, number_of_incoming_friend_requests) : null }
          { we_vote_branding_off ? null :
            <span>
              { show_full_navigation ?
                <span onClick={this.toggleAboutMenu} className={ "header-nav__item header-nav__item--about header-nav__item--has-icon hidden-xs" + (pathname === "/more/about" ? " active-icon" : "")}>
                  <span className="header-nav__icon--about">About</span>
                  <span className="header-nav__label">We Vote</span>
                  <div>{this.aboutMenu()}</div>
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
          { show_full_navigation && !we_vote_branding_off ? donate(pathname === "/more/donate") : null }

          { show_full_navigation ?
            null :
            <button type="button" className="btn btn-sm btn-success"
                onClick={this.goToGetStarted}>Sample Ballot</button> }

          { show_full_navigation ?
            null :
            <Link to="/more/sign_in" className="sign_in header-nav__item">
              Sign In
            </Link>
          }
        </div>

        { show_full_navigation ? <SearchAllBox /> : null }

        { show_full_navigation ? <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none" onClick={this.toggleAccountMenu}>
          {voter_photo_url_medium ?
            <div id="js-header-avatar" className="header-nav__avatar-container">
                <img className="header-nav__avatar"
                      src={voter_photo_url_medium}
                      height={34}
                      width={34}
                 />
            </div> : this.imagePlaceholder(speaker_type)}
         </div> :
          null }
        {this.accountMenu()}
      </header>
    );
  }
}
