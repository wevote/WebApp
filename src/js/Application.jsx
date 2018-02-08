import React, { Component, PropTypes } from "react";
import { ToastContainer } from "react-toastify";
import BookmarkActions from "./actions/BookmarkActions";
import cookies from "./utils/cookies";
import ElectionActions from "./actions/ElectionActions";
import FriendActions from "./actions/FriendActions";
import HeaderBackToBar from "./components/Navigation/HeaderBackToBar";
import HeaderBar from "./components/Navigation/HeaderBar";
import HeaderGettingStartedBar from "./components/Navigation/HeaderGettingStartedBar";
import Headroom from "headroom.js";
import { historyPush, isCordova, cordovaOpenSafariView } from "./utils/cordovaUtils";
import IssueActions from "./actions/IssueActions";
import IssueStore from "././stores/IssueStore";
import OrganizationActions from "./actions/OrganizationActions";
import SearchAllActions from "./actions/SearchAllActions";
import TwitterActions from "./actions/TwitterActions";
import VoterActions from "./actions/VoterActions";
import VoterStore from "./stores/VoterStore";
import { stringContains } from "./utils/textFormat";

const webAppConfig = require("./config");

const loadingScreenStyles = {
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
  flexDirection: "column",
};

export default class Application extends Component {
  static propTypes = {
    children: PropTypes.element,
    location: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      // Do not define voter here. We rely on it being undefined
      voter_initial_retrieve_needed: true,
    };
    this.loadedHeader = false;
    this.initFacebook();
    this.preloadIssueImages = this.preloadIssueImages.bind(this);

    if (isCordova()) {
      window.handleOpenURL = function (url) {
        if (url.startsWith("wevotetwitterscheme://")) {
          console.log("window.handleOpenURL received wevotetwitterscheme: " + url);
          let search = url.replace(new RegExp('&amp;', 'g'), '&');
          let urlParams = new URLSearchParams(search);
          if (urlParams.has("twitter_redirect_url")) {
            let redirectURL = urlParams.get("twitter_redirect_url");
            console.log("twitterSignIn cordova, redirecting to: " + redirectURL);
            SafariViewController.hide();  // Hide the previous WKWebView
            cordovaOpenSafariView(redirectURL, 500);
          } else if (urlParams.has("access_token_and_secret_returned")) {
            // SafariViewController.hide();
            if (urlParams.get("success") === "True") {
              console.log("twitterSignIn cordova, received secret -- push /ballot");
              TwitterActions.twitterSignInRetrieve();
              historyPush("/ballot");
            } else {
              console.log("twitterSignIn cordova, FAILED to receive secret -- push /twitter_sign_in");
              historyPush("/twitter_sign_in");
            }
          } else if (urlParams.has("twitter_handle_found") && urlParams.get("twitter_handle_found") === "True") {
            console.log("twitterSignIn cordova, twitter_handle_found -- push /ballot, twitter_handle: " + urlParams.get("twitter_handle"));
            TwitterActions.twitterSignInRetrieve();
            SafariViewController.hide();  // Hide the previous WKWebView
            // 2/2/18: Needed, but doesnt do the job.  Firing too soon?  VoterActions.voterRetrieve();
            historyPush("/ballot");
          } else {
            console.log("ERROR in window.handleOpenURL, NO MATCH");
          }
        }
      };
    }
  }

  initFacebook () {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: webAppConfig.FACEBOOK_APP_ID,
        xfbml: true,
        version: "v2.8",
        status: true,    // set this status to true, this will fixed popup blocker issue
      });
    };

    (function (d, s, id) {
      let js;
      let fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, "script", "facebook-jssdk"));
  }

  componentDidMount () {
    let voterDeviceId = VoterStore.voterDeviceId();
    VoterActions.voterRetrieve();
    // console.log("Application, componentDidMount, voterDeviceId:", voterDeviceId);
    if (voterDeviceId) {
      this._onVoterStoreChange();
    }

    ElectionActions.electionsRetrieve();

    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    // Preload Issue images. Note that for brand new browsers that don't have a voterDeviceId yet, we retrieve all issues
    IssueActions.retrieveIssuesToFollow();
    this.issueStoreListener = IssueStore.addListener(this.preloadIssueImages);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.loadedHeader = false;
  }

  componentDidUpdate () {
    // let voterDeviceId = VoterStore.voterDeviceId();
    // console.log("Application, componentDidUpdate, voterDeviceId:", voterDeviceId);
    if (this.loadedHeader) return;
    if (!this.refs.pageHeader) return;

    // Initialize headroom element
    new Headroom(this.refs.pageHeader, {
      offset: 20,
      tolerance: 1,
      classes: {
        initial:  "headroom--animated",
        pinned:   "headroom--slide-down",
        unpinned: "headroom--slide-up",
      },
    }).init();

    this.loadedHeader = true;
  }

  _onVoterStoreChange () {
    // console.log("Application, _onVoterStoreChange");
    let voterDeviceId = VoterStore.voterDeviceId();
    if (voterDeviceId && voterDeviceId !== "") {
      if (this.state.voter_initial_retrieve_needed) {
        VoterActions.voterEmailAddressRetrieve();
        BookmarkActions.voterAllBookmarksStatusRetrieve();
        FriendActions.friendInvitationsSentToMe();
        this.incomingVariableManagement();
        this.setState({
          voter: VoterStore.getVoter(),
          voter_initial_retrieve_needed: false,
        });
      } else {
        this.setState({
          voter: VoterStore.getVoter(),
        });
      }
    }
  }

  incomingVariableManagement () {
    // console.log("Application, incomingVariableManagement, this.props.location.query: ", this.props.location.query);
    if (this.props.location.query) {
      // Cookie needs to expire in One day i.e. 24*60*60 = 86400
      let at_least_one_query_variable_found = false;
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
      let hide_intro_modal_from_url_true = hide_intro_modal_from_url === 1 || hide_intro_modal_from_url === "1" || hide_intro_modal_from_url === "true";
      if (hide_intro_modal_from_url) {
        // console.log("hide_intro_modal_from_url: ", hide_intro_modal_from_url);
        at_least_one_query_variable_found = true;
      }
      let hide_intro_modal_from_cookie = cookies.getItem("hide_intro_modal");
      let hide_intro_modal_from_cookie_true = hide_intro_modal_from_cookie === 1 || hide_intro_modal_from_cookie === "1" || hide_intro_modal_from_cookie === "true";
      if (hide_intro_modal_from_url_true && !hide_intro_modal_from_cookie_true) {
        cookies.setItem("hide_intro_modal", hide_intro_modal_from_url, one_day_expires, "/");
      }

      let auto_follow_list_from_url = "";
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
          // console.log("this.props.location.query.voter_address: ", this.props.location.query.voter_address);
          at_least_one_query_variable_found = true;
          let voter_address = this.props.location.query.voter_address;
          if (voter_address && voter_address !== "") {
            // Do not save a blank voter_address -- we don't want to over-ride an existing address with a blank
            VoterActions.voterAddressSave(voter_address);
          }
        }
        if (at_least_one_query_variable_found && this.props.location.pathname) {
          // console.log("at_least_one_query_variable_found push: ", at_least_one_query_variable_found);
          // console.log("this.props.location.pathname: ", this.props.location.pathname);
          historyPush(this.props.location.pathname);
        }
      }
    }
  }

  hideSearchContainer () {
    SearchAllActions.exitSearch();
  }

  preloadIssueImages () {
    // console.log("preloadIssueImages func")
    IssueStore.getIssuesVoterCanFollow().forEach(issue => {
      document.createElement("img").src = issue.issue_image_url;
    });
    //only need to preload once
    this.issueStoreListener.remove();
  }

  render () {
    var { location: { pathname }} = this.props;

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
    let voter_guide_show_getting_started_navigation = false;
    if (pathname === "/intro/story" || pathname === "/intro/sample_ballot" || pathname === "/intro/get_started" ||
      pathname === "/voterguidegetstarted" || pathname === "/wevoteintro/network") {
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
      // Consider limiting "HeaderGettingStartedBar" to ballot tab only
      voter_guide_show_getting_started_navigation = true;
    }

    let show_back_to_header = false;
    if (stringContains("/btdb/", pathname) || stringContains("/btdo/", pathname) || stringContains("/bto/", pathname) || stringContains("/btvg/", pathname)) {
      // If here, we want the top header to be "Back To..."
      // "/btdb/" stands for "Back To Default Ballot Page"
      // "/btdo/" stands for "Back To Default Office Page"
      // "/btvg/" stands for "Back To Voter Guide Page"
      // "/bto/" stands for "Back To Voter Guide Office Page"
      show_back_to_header = true;
    }

    const headRoomSize = voter_guide_show_getting_started_navigation || stringContains("/ballot", pathname) || pathname === "/bookmarks" ?
      "headroom-getting-started__margin" :
      "headroom-wrapper";

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
      let hideGettingStartedIssuesButton = voter_guide_show_getting_started_navigation;
      let hideGettingStartedOrganizationsButton = voter_guide_show_getting_started_navigation;

      return <div className="app-base" id="app-base-id">
        <div className={headRoomSize}>
          <div ref="pageHeader" className={ this.state.we_vote_branding_off ? "page-header__container_branding_off headroom" : "page-header__container headroom" }>
            { show_back_to_header ?
              <HeaderBackToBar location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
              <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/> }
            { voter_guide_show_getting_started_navigation || stringContains("/ballot", pathname) ?
              <HeaderGettingStartedBar hideGettingStartedOrganizationsButton={hideGettingStartedOrganizationsButton}
                                       hideGettingStartedIssuesButton={hideGettingStartedIssuesButton}
                                       pathname={pathname}
                                       voter={this.state.voter}/> :
              null }
          </div>
        </div>
        { this.props.children }
      </div>;
    }

    return <div className="app-base" id="app-base-id">
      <ToastContainer closeButton={false} />
      <div className={headRoomSize}>
        <div ref="pageHeader" className={ this.state.we_vote_branding_off ? "page-header__container_branding_off headroom" : "page-header__container headroom" }>
          { show_back_to_header ?
            <HeaderBackToBar location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
            <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/> }
          { stringContains("/ballot", pathname) || pathname === "/bookmarks" ?
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
