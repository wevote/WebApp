import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import BookmarkStore from "../../stores/BookmarkStore";
import NavigatorInHeader from "./NavigatorInHeader";
import SearchAllBox from "../SearchAllBox";
import VoterSessionActions from "../../actions/VoterSessionActions";
var Icon = require("react-svg-icons");

export default class HeaderBar extends Component {
  static propTypes = {
    voter: PropTypes.object,
    pathname: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = { bookmarks: [], accountMenuOpen: false };
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this);
    this.hideAccountMenu = this.hideAccountMenu.bind(this);
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
    this.bookmarkStoreListener = BookmarkStore.addListener(this._onBallotStoreChange.bind(this));
    this._onBallotStoreChange();
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
    this.bookmarkStoreListener.remove();
  }

  _onBallotStoreChange (){
    this.setState({bookmarks: BallotStore.bookmarks });
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
                  <span className="header-slide-out-menu-text-left">Using We Vote</span>
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

  imagePlaceholder (speaker_type) {
    let image_placeholder = "";
    if (speaker_type === "O") {
        image_placeholder = <span id= "anonIcon" className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    } else {
        image_placeholder = <span id= "anonIcon" className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    }
    return image_placeholder;
  }

  render () {
    var { pathname } = this.props;
    var { voter_photo_url_medium } = this.props.voter;
    let speaker_type = "V";  // TODO DALE make this dynamic

    return (
      <header className="page-header">
        <div className="page-header__content">
          <Link to="/ballot" className="page-logo h4 fullscreen">
            We Vote
            <span className="page-logo__version"> alpha</span>
          </Link>

          <Link to="/ballot" className="page-logo h4 mobile">
            WV
          </Link>
          <NavigatorInHeader pathname={pathname} />
          <SearchAllBox />

          <div id="avatar" onClick={this.toggleAccountMenu}>
            {voter_photo_url_medium ?
              <div id="avatarContainer">
                  <img className="position-statement__avatar"
                        src={voter_photo_url_medium}
                        id="navIcon"
                   />
              </div> : this.imagePlaceholder(speaker_type)}
           </div>
        </div>
        {this.accountMenu()}
      </header>
    );
  }
}
