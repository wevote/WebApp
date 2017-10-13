import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import cookies from "./utils/cookies";
import ElectionActions from "./actions/ElectionActions";
import FriendActions from "./actions/FriendActions";
import HeaderBar from "./components/Navigation/HeaderBar";
import HeaderGettingStartedBar from "./components/Navigation/HeaderGettingStartedBar";
import Headroom from "headroom.js";
import BookmarkActions from "./actions/BookmarkActions";
import OrganizationActions from "./actions/OrganizationActions";
import VoterActions from "./actions/VoterActions";
import SearchAllActions from "./actions/SearchAllActions";
import VoterStore from "./stores/VoterStore";
const web_app_config = require("./config");

var loadingScreenStyles = {
  position: "fixed",
  height: "100vh",
  width: "100vw",
  display: "flex",
  top: 0,
  left: 0,
  backgroundColor: "#337ec9",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
  color: "#fff",
  flexDirection: "column"
};

export default class Application extends Component {
  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object,
    location: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      // Do not define voter here. We rely on it being undefined
      voter_initial_retrieve_needed: true,
    };
    this.loadedHeader = false;
    this.initFacebook();
  }

  initFacebook (){
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: web_app_config.FACEBOOK_APP_ID,
        xfbml: true,
        version: "v2.8",
        status: true    // set this status to true, this will fixed popup blocker issue
      });
    };

    (function (d, s, id){
       var js;
       var fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, "script", "facebook-jssdk"));
  }

  componentDidMount () {
    let voter_device_id = VoterStore.voterDeviceId();
    VoterActions.voterRetrieve();
    console.log("Application, componentDidMount, voter_device_id:", voter_device_id);
    if (voter_device_id) {
      this._onVoterStoreChange();
    }

    ElectionActions.electionsRetrieve();

    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.loadedHeader = false;
  }

  componentDidUpdate () {
    let voter_device_id = VoterStore.voterDeviceId();
    console.log("Application, componentDidUpdate, voter_device_id:", voter_device_id);
    if (this.loadedHeader) return;
    if (!this.refs.pageHeader) return;

    // Initialize headroom element
    new Headroom(this.refs.pageHeader, {
      "offset": 20,
      "tolerance": 1,
      "classes": {
        "initial": "headroom--animated",
        "pinned": "headroom--slide-down",
        "unpinned": "headroom--slide-up"
      }
    }).init();

    this.loadedHeader = true;
  }

  _onVoterStoreChange () {
    console.log("Application, _onVoterStoreChange");
    let voter_device_id = VoterStore.voterDeviceId();
    if (voter_device_id && voter_device_id !== "" && this.state.voter_initial_retrieve_needed) {
      VoterActions.voterEmailAddressRetrieve();
      BookmarkActions.voterAllBookmarksStatusRetrieve();
      FriendActions.friendInvitationsSentToMe();
      this.incomingVariableManagement();
      this.setState({
        voter: VoterStore.getVoter(),
        voter_initial_retrieve_needed: false,
      });
    }
  }

  incomingVariableManagement () {
    // console.log("Application, incomingVariableManagement, this.props.location.query: ", this.props.location.query);
    if (this.props.location.query) {
      // Cookie needs to expire in One day i.e. 24*60*60 = 86400
      let one_day_expires = 86400;
      let we_vote_branding_off_from_url = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
      let we_vote_branding_off_from_cookie = cookies.getItem("we_vote_branding_off") || 0;
      if (we_vote_branding_off_from_url && !we_vote_branding_off_from_cookie) {
        cookies.setItem("we_vote_branding_off", we_vote_branding_off_from_url, one_day_expires, "/");
      }
      if (we_vote_branding_off_from_url || we_vote_branding_off_from_cookie) {
        cookies.setItem("show_full_navigation", "1", Infinity, "/");
      }
      this.setState({we_vote_branding_off: we_vote_branding_off_from_url || we_vote_branding_off_from_cookie});

      let hide_intro_modal_from_url = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
      let hide_intro_modal_from_cookie = cookies.getItem("hide_intro_modal") || 0;
      if (hide_intro_modal_from_url && !hide_intro_modal_from_cookie) {
        cookies.setItem("hide_intro_modal", hide_intro_modal_from_url, one_day_expires, "/");
      }

      let auto_follow_list_from_url = "";
      let at_least_one_query_variable_found = false;
      if (this.props.location.query) {
        // console.log("this.props.location.query: ", this.props.location.query);
        if (this.props.location.query.af) {
          auto_follow_list_from_url = this.props.location.query.af;
          at_least_one_query_variable_found = true;
        } else if (this.props.location.query.auto_follow) {
          at_least_one_query_variable_found = true;
          auto_follow_list_from_url = this.props.location.query.auto_follow;
        }
        let auto_follow_list = auto_follow_list_from_url ? auto_follow_list_from_url.split(",") : [];
        auto_follow_list.forEach((organization_twitter_handle) => {
          OrganizationActions.organizationFollow("", organization_twitter_handle);
        });

        if (this.props.location.query.voter_address) {
          at_least_one_query_variable_found = true;
          let voter_address = this.props.location.query.voter_address;
          VoterActions.voterAddressSave(voter_address);
        }
        if (at_least_one_query_variable_found) {
          // console.log("at_least_one_query_variable_found push: ", at_least_one_query_variable_found);
          browserHistory.push(this.props.location.pathname);
        }
      }
    }
  }

  hideSearchContainer () {
    SearchAllActions.exitSearch();
  }

  render () {
    var { location: { pathname }} = this.props;
    const headRoomSize = pathname.startsWith("/ballot") || pathname === "/bookmarks" ?
      "headroom-getting-started__margin" :
      "headroom-wrapper";

    if (this.state.voter === undefined || location === undefined ) {
      return <div style={loadingScreenStyles}>
                <div>
                  <h1 className="h1">Loading We Vote...</h1>
                  <div className="u-loading-spinner u-loading-spinner--light" />
                </div>
              </div>;
    }
    // If looking at these paths, we want to enter theater mode
    var in_theater_mode = false;
    var content_full_width_mode = false;
    var voter_guide_mode = false;
    if (pathname === "/intro/story" || pathname === "/intro/sample_ballot" || pathname === "/intro/get_started" ||
      pathname === "/voterguidegetstarted") {
      in_theater_mode = true;
    } else if (pathname.startsWith("/candidate/") ||
      pathname === "/facebook_invitable_friends" || pathname === "/friends" || pathname === "/friends/invitebyemail" ||
      pathname === "/intro" || pathname === "/issues_followed" || pathname === "/issues_to_follow" ||
      pathname.startsWith("/measure/") ||
      pathname === "/more/about" || pathname === "/more/connect" || pathname === "/more/credits" ||
      pathname === "/more/donate" || pathname === "/more/donate_thank_you" || pathname === "/more/elections" ||
      pathname === "/more/howtouse" || pathname.startsWith("/office/") ||
      pathname === "/more/network" ||
      pathname === "/more/network/friends" || pathname === "/more/network/issues" || pathname === "/more/network/organizations" ||
      pathname === "/more/organization" ||
      pathname === "/more/privacy" || pathname === "/more/sign_in" || pathname === "/more/team" ||
      pathname === "/more/terms" || pathname === "/more/tools" || pathname === "/more/vision" ||
      pathname === "/opinions" || pathname === "/opinions_followed" || pathname === "/opinions_ignored" ||
      pathname === "/settings/location" || pathname.startsWith("/verifythisisme/") || pathname === "/welcome") {
      content_full_width_mode = true;
    } else if (pathname.startsWith("/ballot") || pathname === "/bookmarks") {
      content_full_width_mode = false;
    } else {
      voter_guide_mode = true;
    }

    if (in_theater_mode) {
      return <div className="app-base" id="app-base-id">
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 container-main">
                { this.props.children }
              </div>
            </div>
          </div>
        </div>
      </div>;
    } else if (voter_guide_mode) {
      // console.log("voter_guide_mode", voter_guide_mode);
      return <div className="app-base" id="app-base-id">
        <div className="headroom-wrapper">
          <div ref="pageHeader" className={ this.state.we_vote_branding_off ? "page-header__container_branding_off headroom" : "page-header__container headroom" }>
            <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/>
          </div>
        </div>
        { this.props.children }
      </div>;
    }

    return <div className="app-base" id="app-base-id">
      <div className={headRoomSize}>
        <div ref="pageHeader" className={ this.state.we_vote_branding_off ? "page-header__container_branding_off headroom" : "page-header__container headroom" }>
          <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/>
          { pathname.startsWith("/ballot") || pathname === "/bookmarks" ?
            <HeaderGettingStartedBar pathname={pathname} voter={this.state.voter}/> :
            null }
        </div>
      </div>
      { pathname === "/welcome" || !content_full_width_mode ? <div>{ this.props.children }</div> :
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="container-main">
              { this.props.children }
            </div>
          </div>
        </div>
      }
    </div>;
  }
}
