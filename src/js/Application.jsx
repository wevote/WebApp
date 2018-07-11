import React, { Component } from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import BookmarkActions from "./actions/BookmarkActions";
import cookies from "./utils/cookies";
import { historyPush, isAndroid, isCordova, isIOS,
  isWebApp } from "./utils/cordovaUtils";
import ElectionActions from "./actions/ElectionActions";
import FooterBarCordova from "./components/Navigation/FooterBarCordova";
import FriendActions from "./actions/FriendActions";
import HeaderBackToBar from "./components/Navigation/HeaderBackToBar";
import HeaderBackToSettings from "./components/Navigation/HeaderBackToSettings";
import HeaderBackToVoterGuides from "./components/Navigation/HeaderBackToVoterGuides";
import HeaderBar from "./components/Navigation/HeaderBar";
import HeaderSecondaryNavBar from "./components/Navigation/HeaderSecondaryNavBar";
import Headroom from "headroom.js";
import IssueActions from "./actions/IssueActions";
import IssueStore from "././stores/IssueStore";
import { renderLog, routingLog } from "./utils/logging";
import OrganizationActions from "./actions/OrganizationActions";
import { stringContains } from "./utils/textFormat";
import TwitterSignIn from "./components/Twitter/TwitterSignIn";
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
  backgroundColor: "#25536D",
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
      showFooter: true,
    };
    this.loadedHeader = false;
    this.initFacebook();
    this.initCordova();
    this.preloadIssueImages = this.preloadIssueImages.bind(this);
  }

  initCordova () {
    if (isCordova()) {
      console.log("Application initCordova ------------ " + __filename);
      window.handleOpenURL = function (url) {
        TwitterSignIn.handleTwitterOpenURL(url);
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
    if (isCordova()) {
      window.addEventListener("keyboardDidShow", this.keyboardDidShow.bind(this));
      window.addEventListener("keyboardDidHide", this.keyboardDidHide.bind(this));
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.loadedHeader = false;
    if (isCordova()) {
      this.keyboardDidShow.removeEventListener();
      this.keyboardDidHide.removeEventListener();
    }
  }

  componentDidUpdate () {
    // let voterDeviceId = VoterStore.voterDeviceId();
    // console.log("Application, componentDidUpdate, voterDeviceId:", voterDeviceId);
    if (this.loadedHeader) return;
    if (!this.refs.pageHeader) return;

    if (isWebApp()) {
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
    }

    this.loadedHeader = true;
  }

  keyboardDidShow () {
    this.setState({
      showFooter: false,
    });

    // March 26, 2018, these might be valuable when we polish scrolling after selecting an entry field on phones
    // document.activeElement.scrollTop -= 60;
    // document.activeElement.scrollIntoView();
  }

  keyboardDidHide () {
    this.setState({
      showFooter: true,
    });
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

    // We have to do all this, because we allow urls like https://wevote.us/aclu
    // where "aclu" is a twitter account.

    // Based on the path, decide if we want theaterMode, contentFullWidthMode, or voterGuideMode
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
        pathname.startsWith("/voterguidepositions") ||
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

      // Consider limiting "HeaderSecondaryNavBar" to ballot tab only
      voterGuideShowGettingStartedNavigation = true;
    }

    let showBackToHeader = false;

    let showBackToSettings = false;
    let showBackToVoterGuides = false;
    if (stringContains("/btdb/", pathname) ||
        stringContains("/btdo/", pathname) ||
        stringContains("/bto/", pathname) ||
        stringContains("/btvg/", pathname)) {
      // If here, we want the top header to be "Back To..."
      // "/btdb/" stands for "Back To Default Ballot Page"
      // "/btdo/" stands for "Back To Default Office Page"
      // "/btvg/" stands for "Back To Voter Guide Page"
      // "/bto/" stands for "Back To Voter Guide Office Page"
      showBackToHeader = true;
    } else if (pathname === "/settings/account" ||
        pathname === "/settings/address" ||
        pathname === "/settings/election" ||
        pathname === "/settings/issues" ||
        pathname === "/settings/notifications" ||
        pathname === "/settings/profile" ||
        pathname === "/settings/voterguidesmenu" ||
        pathname === "/settings/voterguidelist") {
      showBackToSettings = true;
    } else if (stringContains("/vg/", pathname)) {
      showBackToVoterGuides = true;
    }

    if (pathname.startsWith("/measure") && isCordova()) {
      showBackToHeader = true;
    }

    const headRoomSize = voterGuideShowGettingStartedNavigation || stringContains("/ballot", pathname) || pathname === "/bookmarks" ?
      "headroom-secondary-nav__margin" : isWebApp() ? "headroom-wrapper" : isIOS() ? "headroom-wrapper__cordova-ios" : "headroom-wrapper__cordova-android";

    let pageHeaderStyle = this.state.we_vote_branding_off ? "page-header__container_branding_off headroom" : "page-header__container headroom";
    if (isIOS()) {
      pageHeaderStyle = "page-header__container headroom page-header-cordova-ios";   // Note March 2018: no headroom.js for Cordova
    } else if (isAndroid()) {
      pageHeaderStyle = "page-header__container headroom";
    }

    let footerStyle = this.state.showFooter ? "footroom-wrapper" : "footroom-wrapper__hide";

    if (inTheaterMode) {
      // console.log("inTheaterMode", inTheaterMode);
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

      return <div className={`app-base ${isCordova() && "cordova-base"}`} id="app-base-id">
        <ToastContainer closeButton={false} />
        { isCordova() && isIOS() && <div className={"ios7plus-spacer"} /> }
        <div className={headRoomSize}>
          <div ref="pageHeader" className={pageHeaderStyle}>
            { showBackToHeader ?
              <HeaderBackToBar location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
              <span>
                {showBackToVoterGuides ?
                  <HeaderBackToVoterGuides location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
                  <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/>
                }
              </span>
             }
            { voterGuideShowGettingStartedNavigation || stringContains("/ballot", pathname) ?
              <HeaderSecondaryNavBar hideGettingStartedOrganizationsButton={hideGettingStartedButtons}
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
          <div className={footerStyle}>
            <FooterBarCordova location={this.props.location} pathname={pathname} voter={this.state.voter}/>
          </div>
        }
      </div>;
    } else if (settingsMode) {
      // console.log("settingsMode", settingsMode);

      return <div className={`app-base ${isCordova() && "cordova-base"}`} id="app-base-id">
        <ToastContainer closeButton={false} />
        { isCordova() && isIOS() && <div className={"ios7plus-spacer"} /> }
        <div className={headRoomSize}>
          <div ref="pageHeader" className={pageHeaderStyle}>
            { showBackToSettings ?
              <span>
                <span className="visible-xs">
                  <HeaderBackToSettings location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/>
                </span>
                <span className="hidden-xs">
                  <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/>
                </span>
              </span> :
              <span>
                { showBackToVoterGuides ?
                  <HeaderBackToVoterGuides location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
                  <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/>
                }
              </span>
            }
          </div>
        </div>
        <div className="page-content-container">
          <div className="container-settings">
            { this.props.children }
          </div>
        </div>
        { isCordova() &&
          <div className={footerStyle }>
            <FooterBarCordova location={this.props.location} pathname={pathname} voter={this.state.voter}/>
          </div>
        }
      </div>;
    }

    // This handles other pages, like Welcome and the Ballot display
    return <div className={`app-base ${isCordova() && "cordova-base"}`} id="app-base-id">
      <ToastContainer closeButton={false} />
      { isCordova() && isIOS() && <div className={"ios7plus-spacer"} /> }
      <div className={headRoomSize}>
        <div ref="pageHeader" className={pageHeaderStyle}>
          { showBackToHeader ?
            <HeaderBackToBar location={this.props.location} params={this.props.params} pathname={pathname} voter={this.state.voter}/> :
            <HeaderBar location={this.props.location} pathname={pathname} voter={this.state.voter}/>
          }
          { stringContains("/ballot", pathname) || pathname === "/bookmarks" ?
            <HeaderSecondaryNavBar pathname={pathname} voter={this.state.voter}/> :
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
        <div className={footerStyle}>
          <FooterBarCordova location={this.props.location} pathname={pathname} voter={this.state.voter}/>
        </div>
      }
    </div>;
  }
}
