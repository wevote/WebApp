import React, { Component } from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import BookmarkActions from "./actions/BookmarkActions";
import cookies from "./utils/cookies";
import { historyPush, isCordova, cordovaOpenSafariView, isWebApp } from "./utils/cordovaUtils";
import ElectionActions from "./actions/ElectionActions";
import FooterBarCordova from "./components/Navigation/FooterBarCordova";
import FriendActions from "./actions/FriendActions";
import HeaderBackToBar from "./components/Navigation/HeaderBackToBar";
import HeaderBar from "./components/Navigation/HeaderBar";
import HeaderGettingStartedBar from "./components/Navigation/HeaderGettingStartedBar";
import Headroom from "headroom.js";
import IssueActions from "./actions/IssueActions";
import IssueStore from "././stores/IssueStore";
import { renderLog, routingLog } from "./utils/logging";
import OrganizationActions from "./actions/OrganizationActions";
import { stringContains } from "./utils/textFormat";
import TwitterActions from "./actions/TwitterActions";
import VoterActions from "./actions/VoterActions";
import VoterStore from "./stores/VoterStore";
import webAppConfig from "./config";

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
    this.initCordova();
    this.preloadIssueImages = this.preloadIssueImages.bind(this);
  }

  initCordova () {
    console.log("Application initCordova ------------ " + __filename);
    if (isCordova()) {
      window.handleOpenURL = function (url) {
        console.log("Application handleOpenUrl: " + url);
        if (url.startsWith("wevotetwitterscheme://")) {
          console.log("window.handleOpenURL received wevotetwitterscheme: " + url);
          let search = url.replace(new RegExp("&amp;", "g"), "&");
          let urlParams = new URLSearchParams(search);
          if (urlParams.has("twitter_redirect_url")) {
            let redirectURL = urlParams.get("twitter_redirect_url");
            console.log("twitterSignIn cordova, redirecting to: " + redirectURL);

            // eslint-disable-next-line no-undef
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
            console.log("twitterSignIn cordova, twitter_handle_found -- push /twitter_sign_in -- received handle = " + urlParams.get("twitter_handle"));

            // eslint-disable-next-line no-undef
            SafariViewController.hide();  // Hide the previous WKWebView
            historyPush("/twitter_sign_in");
          } else {
            console.log("ERROR in window.handleOpenURL, NO MATCH");
          }
        } else {
          console.log("ERROR: window.handleOpenURL received invalid url: " + url);
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
      if (d.getElementById(id)) {
        return;
      }

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
        initial: "headroom--animated",
        pinned: "headroom--slide-down",
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
      let atLeastOneQueryVariableFound = false;
      let oneDayExpires = 86400;
      let weVoteBrandingOffFromUrl = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
      let weVoteBrandingOffFromCookie = cookies.getItem("we_vote_branding_off") || 0;
      if (weVoteBrandingOffFromUrl && !weVoteBrandingOffFromCookie) {
        cookies.setItem("we_vote_branding_off", weVoteBrandingOffFromUrl, oneDayExpires, "/");
      }

      if (weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie) {
        cookies.setItem("show_full_navigation", "1", Infinity, "/");
      }

      this.setState({ we_vote_branding_off: weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie });

      let hideIntroModalFromUrl = this.props.location.query ? this.props.location.query.hide_intro_modal : 0;
      let hideIntroModalFromUrlTrue = hideIntroModalFromUrl === 1 || hideIntroModalFromUrl === "1" || hideIntroModalFromUrl === "true";
      if (hideIntroModalFromUrl) {
        // console.log("hideIntroModalFromUrl: ", hideIntroModalFromUrl);
        atLeastOneQueryVariableFound = true;
      }

      let hideIntroModalFromCookie = cookies.getItem("hide_intro_modal");
      let hideIntroModalFromCookieTrue = hideIntroModalFromCookie === 1 || hideIntroModalFromCookie === "1" || hideIntroModalFromCookie === "true";
      if (hideIntroModalFromUrlTrue && !hideIntroModalFromCookieTrue) {
        cookies.setItem("hide_intro_modal", hideIntroModalFromUrl, oneDayExpires, "/");
      }

      let autoFollowListFromUrl = "";
      if (this.props.location.query) {
        // console.log("this.props.location.query: ", this.props.location.query);
        if (this.props.location.query.af) {
          autoFollowListFromUrl = this.props.location.query.af;
          atLeastOneQueryVariableFound = true;
        } else if (this.props.location.query.auto_follow) {
          atLeastOneQueryVariableFound = true;
          autoFollowListFromUrl = this.props.location.query.auto_follow;
        }

        let autoFollowList = autoFollowListFromUrl ? autoFollowListFromUrl.split(",") : [];
        autoFollowList.forEach((organizationTwitterHandle) => {
          OrganizationActions.organizationFollow("", organizationTwitterHandle);
        });

        if (this.props.location.query.voter_address) {
          // console.log("this.props.location.query.voter_address: ", this.props.location.query.voter_address);
          atLeastOneQueryVariableFound = true;
          let voterAddress = this.props.location.query.voter_address;
          if (voterAddress && voterAddress !== "") {

            // Do not save a blank voterAddress -- we don't want to over-ride an existing address with a blank
            VoterActions.voterAddressSave(voterAddress);
          }
        }

        if (atLeastOneQueryVariableFound && this.props.location.pathname) {
          // console.log("atLeastOneQueryVariableFound push: ", AtLeastOneQueryVariableFound);
          // console.log("this.props.location.pathname: ", this.props.location.pathname);
          historyPush(this.props.location.pathname);
        }
      }
    }
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
    renderLog(__filename);
    let { location: { pathname } } = this.props;

    if (this.state.voter === undefined || location === undefined) {
      return <div style={loadingScreenStyles} >
                <div>
                  <h1 className="h1">Loading We Vote...</h1>
                  { isCordova() &&
                    <h2 className="h1">Does your phone have access to the internet?</h2>
                  }
                  <div className="u-loading-spinner u-loading-spinner--light" />
                </div>
              </div>;
    }

    routingLog(pathname);

    // If looking at these paths, we want to enter theater mode
    let inTheaterMode = false;
    let contentFullWidthMode = false;
    let settingsMode = false;
    let voterGuideMode = false;
    let voterGuideShowGettingStartedNavigation = false;
    if (pathname === "/intro/story" ||
        pathname === "/intro/sample_ballot" ||
        pathname === "/intro/get_started" ||
        pathname === "/voterguidechooseelection" ||
        pathname === "/voterguidegetstarted" ||
        pathname === "/voterguideorgtype" ||
        pathname === "/voterguideorginfo" ||
        pathname === "/wevoteintro/network") {
      inTheaterMode = true;
    } else if (pathname.startsWith("/candidate/") ||
        pathname === "/facebook_invitable_friends" ||
        pathname === "/friends" ||
        pathname === "/friends/invitebyemail" ||
        pathname === "/intro" ||
        pathname === "/issues_followed" ||
        pathname === "/issues_to_follow" ||
        pathname.startsWith("/measure/") ||
        pathname === "/more/about" ||
        pathname === "/more/absentee" ||
        pathname === "/more/alerts" ||
        pathname === "/more/connect" ||
        pathname === "/more/credits" ||
        pathname === "/more/donate" ||
        pathname === "/more/donate_thank_you" ||
        pathname === "/more/elections" ||
        pathname === "/more/howtouse" ||
        pathname.startsWith("/office/") ||
        pathname === "/more/network" ||
        pathname === "/more/network/friends" ||
        pathname === "/more/network/issues" ||
        pathname === "/more/network/organizations" ||
        pathname === "/more/organization" ||
        pathname === "/more/privacy" ||
        pathname === "/more/register" ||
        pathname === "/more/sign_in" ||
        pathname === "/more/team" ||
        pathname === "/more/terms" ||
        pathname === "/more/tools" ||
        pathname === "/more/verify" ||
        pathname === "/more/vision" ||
        pathname === "/opinions" ||
        pathname === "/opinions_followed" ||
        pathname === "/opinions_ignored" ||
        pathname.startsWith("/verifythisisme/") ||
        pathname === "/welcome") {
      contentFullWidthMode = true;
    } else if (pathname.startsWith("/ballot") || pathname === "/bookmarks") {
      contentFullWidthMode = false;
    } else if (stringContains("/settings", pathname) ||
        pathname === "/more/hamburger") {
      contentFullWidthMode = true;
      settingsMode = true;
    } else {
      voterGuideMode = true;

      // Consider limiting "HeaderGettingStartedBar" to ballot tab only
      voterGuideShowGettingStartedNavigation = true;
    }

    let showBackToHeader = false;
    if (stringContains("/btdb/", pathname) || stringContains("/btdo/", pathname) || stringContains("/bto/", pathname) || stringContains("/btvg/", pathname)) {

      // If here, we want the top header to be "Back To..."
      // "/btdb/" stands for "Back To Default Ballot Page"
      // "/btdo/" stands for "Back To Default Office Page"
      // "/btvg/" stands for "Back To Voter Guide Page"
      // "/bto/" stands for "Back To Voter Guide Office Page"
      showBackToHeader = true;
    }

    const headRoomSize = voterGuideShowGettingStartedNavigation || stringContains("/ballot", pathname) || pathname === "/bookmarks" ?
      "headroom-getting-started__margin" : isWebApp() ? "headroom-wrapper" : "headroom-wrapper__cordova";

    let pageHeaderStyle = this.state.we_vote_branding_off ? "page-header__container_branding_off headroom" : "page-header__container headroom";
    if (isCordova()) {
      pageHeaderStyle += " page-header-cordova";
    }

    if (inTheaterMode) {
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
    } else if (voterGuideMode) {
      // console.log("voterGuideMode", voterGuideMode);
      let hideGettingStartedButtons = voterGuideShowGettingStartedNavigation;

      return <div className="app-base" id="app-base-id">
        <ToastContainer closeButton={false} />
        { isCordova() && <div className={"ios7plus-spacer"} /> }
        <div className={headRoomSize}>
          <div ref="pageHeader" className={pageHeaderStyle}>
            { showBackToHeader ?
              <HeaderBackToBar location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
              <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/> }
            { voterGuideShowGettingStartedNavigation || stringContains("/ballot", pathname) ?
              <HeaderGettingStartedBar hideGettingStartedOrganizationsButton={hideGettingStartedButtons}
                                       hideGettingStartedIssuesButton={hideGettingStartedButtons}
                                       pathname={pathname}
                                       voter={this.state.voter}/> :
              null }
          </div>
        </div>
        <div className="page-content-container">
          <div className="container-voter-guide">
            { this.props.children }
          </div>
        </div>
        { isCordova() &&
          <div className={"footroom-wrapper"}>
            <FooterBarCordova location={this.props.location} pathname={pathname} voter={this.state.voter}/>
          </div>
        }
      </div>;
    } else if (settingsMode) {
      return <div className="app-base" id="app-base-id">
        <ToastContainer closeButton={false} />
        { isCordova() && <div className={"ios7plus-spacer"} /> }
        <div className={headRoomSize}>
          <div ref="pageHeader" className={pageHeaderStyle}>
            {/* March 2018: One of HeaderBackToBar OR HeaderBar is displayed, AND under some circumstances HeaderGettingStartedBar is
             displayed on top.  As long as they are in the same location it works, but ideally we would get this sorted out someday */}
            { showBackToHeader ?
              <HeaderBackToBar location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
              <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/>
            }
          </div>
        </div>
        <div className="page-content-container">
          <div className="container-settings">
            { this.props.children }
          </div>
        </div>
        { isCordova() &&
          <div className={"footroom-wrapper"}>
            <FooterBarCordova location={this.props.location} pathname={pathname} voter={this.state.voter}/>
          </div>
        }
      </div>;
    }

    // This handles other pages, like Welcome and the Ballot display
    return <div className="app-base" id="app-base-id">
      <ToastContainer closeButton={false} />
      { isCordova() && <div className={"ios7plus-spacer"} /> }
      <div className={headRoomSize}>
        <div ref="pageHeader" className={pageHeaderStyle}>
          {/* March 2018: One of HeaderBackToBar OR HeaderBar is displayed, AND under some circumstances HeaderGettingStartedBar is
           displayed on top.  As long as they are in the same location it works, but ideally we would get this sorted out someday */}
          { showBackToHeader ?
            <HeaderBackToBar location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
            <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/>
          }
          { stringContains("/ballot", pathname) || pathname === "/bookmarks" ?
            <HeaderGettingStartedBar pathname={pathname} voter={this.state.voter}/> :
            null }
        </div>
      </div>
      { pathname === "/welcome" || !contentFullWidthMode ?
        <div>{ this.props.children }</div> :
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="container-main">
              { this.props.children }
            </div>
          </div>
        </div>
      }
      { isCordova() &&
        <div className={"footroom-wrapper"}>
          <FooterBarCordova location={this.props.location} pathname={pathname} voter={this.state.voter}/>
        </div>
      }
    </div>;
  }
}
