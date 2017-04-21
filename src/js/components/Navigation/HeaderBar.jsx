import React, { Component, PropTypes } from "react";
import { browserHistory, Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BookmarkStore from "../../stores/BookmarkStore";
import cookies from "../../utils/cookies";
import FriendStore from "../../stores/FriendStore";
import SearchAllBox from "../SearchAllBox";
import VoterSessionActions from "../../actions/VoterSessionActions";
var Icon = require("react-svg-icons");

const links = {
  ballot: function (active) {
    var icon = "glyphicon glyphicon-list-alt glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/ballot" className={ "header-nav__item--ballot header-nav__item header-nav__item--has-icon" + (active ? " active-icon" : "")}>
        <span className={icon} title="Ballot" />
        <span className="header-nav__label">
          Ballot
          </span>
      </Link>;

    return jsx;
  },

  network: function (active, number_of_incoming_friend_requests) {
    var icon = "glyphicon icon-icon-connect-1-3 glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/more/network" className={ "header-nav__item--network header-nav__item header-nav__item--has-icon" + (active ? " active-icon" : "")}>
        <span className={icon} title="Network">
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

    var jsx =
      <Link to="/more/donate" className={ "header-nav__item--donate header-nav__item header-nav__item--has-icon hidden-xs" + (active ? " active-icon" : "")}>
        <img className = "glyphicon" src="/img/global/svg-icons/glyphicons-20-heart-empty.svg" />
        <span className="header-nav__label">
          Donate
          </span>
      </Link>;

    return jsx;
  }
};

export default class HeaderBar extends Component {
  static propTypes = {
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
    this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
    this.bookmarkStoreListener = BookmarkStore.addListener(this._onBallotStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
    this._onBallotStoreChange();
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
    this.bookmarkStoreListener.remove();
    this.friendStoreListener.remove();
  }

  _onBallotStoreChange (){
    this.setState({bookmarks: BallotStore.bookmarks });
  }

  _onFriendStoreChange () {
    this.setState({
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe()
    });
  }

  aboutMenu () {
    let aboutMenuOpen = this.state.about_menu_open ? "about-menu-open" : "";

    return (
      <div className={aboutMenuOpen}>
      <div className="page-overlay" onClick={this.toggleAboutMenu} />
      <div className="about-menu">
          <ul className="nav nav-stacked">
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/howtouse"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Using We Vote</span>
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
    var { linked_organization_we_vote_id, signed_in_facebook, signed_in_twitter, twitter_screen_name } = this.props.voter;

    let show_your_page_from_twitter = signed_in_twitter && twitter_screen_name;
    let show_your_page_from_facebook = signed_in_facebook && linked_organization_we_vote_id && !show_your_page_from_twitter;

    let accountMenuOpen = this.state.accountMenuOpen ? "account-menu-open" : "";

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
                <Link onClick={this.hideAccountMenu.bind(this)} to={"/" + twitter_screen_name}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { show_your_page_from_facebook ?
              <li>
                <Link onClick={this.hideAccountMenu.bind(this)} to={"/voterguide/" + linked_organization_we_vote_id}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { !show_your_page_from_twitter && !show_your_page_from_facebook ?
              <li>
                <Link onClick={this.hideAccountMenu.bind(this)} to="/yourpage">
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
            <li className="visible-xs-block">
              <Link onClick={this.hideAccountMenu.bind(this)} to="/more/howtouse">
                <div>
                  <span className="header-slide-out-menu-text-left">How to Use We Vote</span>
                </div>
              </Link>
            </li>
            <li className="visible-xs-block">
              <Link onClick={this.hideAccountMenu.bind(this)} to="/more/about">
                <div>
                  <span className="header-slide-out-menu-text-left">About We Vote</span>
                </div>
              </Link>
            </li>
            <li className="visible-xs-block">
              <Link onClick={this.hideAccountMenu.bind(this)} to="/more/donate">
                <div>
                  <span className="header-slide-out-menu-text-left">Donate</span>
                </div>
              </Link>
            </li>
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

  imagePlaceholder (speaker_type) {
    let image_placeholder = "";
    if (speaker_type === "O") {
        image_placeholder = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    } else {
        image_placeholder = <div id= "anonIcon" className="header-nav__avatar"><Icon name="avatar-generic" width={34} height={34} /></div>;
    }
    return image_placeholder;
  }

  goToGetStarted () {
    var getStartedNow = "/intro/sample_ballot";
    browserHistory.push(getStartedNow);
  }

  render () {
    let { pathname } = this.props;
    let { voter_photo_url_medium } = this.props.voter;
    let speaker_type = "V";  // TODO DALE make this dynamic
    let { ballot, network, donate } = links;
    let number_of_incoming_friend_requests = this.state.friend_invitations_sent_to_me.length;
    let voter_is_signed_in = this.props.voter && this.props.voter.is_signed_in;
    let voter_orientation_complete = cookies.getItem("voter_orientation_complete") || voter_is_signed_in;

    return (
      <header className="page-header">
        <div className="page-header__content">
          <Link to="/welcome" className="page-logo page-logo-full-size h4 hidden-xs">
            We Vote
            <span className="page-logo__version"> alpha</span>
          </Link>

          { voter_orientation_complete ? <Link to="/welcome" className="page-logo page-logo-short h4 visible-xs">
              WV
            </Link> :
            <Link to="/welcome" className="page-logo page-logo-short h4 visible-xs">
              We Vote
              <span className="page-logo__version"> alpha</span>
            </Link> }

          <div className="header-nav">
            { voter_orientation_complete ? ballot(pathname === "/ballot") : null }

            { voter_orientation_complete ? network(pathname === "/more/network", number_of_incoming_friend_requests) : null }

            { voter_orientation_complete ?
              <Link onClick={this.toggleAboutMenu} className={ "header-nav__item header-nav__item--about header-nav__item--has-icon hidden-xs" + (pathname === "/more/about" ? " active-icon" : "")}>
                <span className="header-nav__icon--about">About</span>
                <span className="header-nav__label">
                We Vote
                </span>
                <div>{this.aboutMenu()}</div>
              </Link> :
              <div>
                <Link to="/more/about" className={ "header-nav__item header-nav__item--about" + (pathname === "/more/about" ? " active-icon" : "")}>
                  <span className="header-nav__icon--about">About</span>
                  <span className="header-nav__label">
                  We Vote
                  </span>
                </Link>
              </div> }

            { voter_orientation_complete ? donate(pathname === "/more/donate") : null }

            { voter_orientation_complete ?
              null :
              <button type="button" className="btn btn-sm btn-success"
                  onClick={this.goToGetStarted}>Sample Ballot</button> }

            { voter_orientation_complete ?
              null :
              <Link to="/more/sign_in" className="sign_in header-nav__item">
                Sign In
              </Link>
            }
          </div>

          { voter_orientation_complete ? <SearchAllBox /> : null }

          { voter_orientation_complete ? <div className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none" onClick={this.toggleAccountMenu}>
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
        </div>
        {this.accountMenu()}
      </header>
    );
  }
}
