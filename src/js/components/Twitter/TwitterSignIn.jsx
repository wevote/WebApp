import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { oAuthLog, renderLog } from "../../utils/logging";
import { $ajax } from "../../utils/service";
import cookies from "../../utils/cookies";
import { isWebApp, cordovaOpenSafariView, isIOS, isAndroid, historyPush } from "../../utils/cordovaUtils";
import webAppConfig from "../../config";
import TwitterActions from "../../actions/TwitterActions";

const returnURL = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + "/twitter_sign_in";

export default class TwitterSignIn extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    className: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  twitterSignInWebApp () {
    let brandingOff = cookies.getItem("we_vote_branding_off") || 0;
    console.log("twitterSignInWebApp isWebApp(): " + isWebApp());
    $ajax({
      endpoint: "twitterSignInStart",
      data: { return_url: returnURL },
      success: res => {
        console.log("twitterSignInWebApp success, res:", res);
        if (res.twitter_redirect_url) {
          if (brandingOff) {
            window.open(res.twitter_redirect_url);
          } else {
            window.location.assign(res.twitter_redirect_url);
          }
        } else {
          // There is a problem signing in
          console.log("twitterSignInWebApp ERROR res: ", res);

          // When we visit this page and delete the voter_device_id cookie, we can get an error that requires
          // reloading the browser page. This is how we do it:
          window.location.assign("");
        }
      },

      error: res => {
        console.log("twitterSignInWebApp error: ", res);

        // Try reloading the page
        window.location.assign("");
      },
    });
  }

  twitterSignInWebAppCordova () {
    const requestURL = webAppConfig.WE_VOTE_SERVER_API_ROOT_URL + "twitterSignInStart" +
      "?cordova=true&voter_device_id=" + cookies.getItem("voter_device_id") + "&return_url=http://nonsense.com";
    oAuthLog("twitterSignInWebAppCordova requestURL: " + requestURL);
    if (isIOS()) {
      cordovaOpenSafariView(requestURL, 50);
    } else if (isAndroid()) {
      // April 6, 2018: Needs Steve's PR to handle customscheme
      // https://github.com/apache/cordova-plugin-inappbrowser/pull/263
      let inAppBrowserRef = cordova.InAppBrowser.open(requestURL, "_blank", "toolbar=no,location=yes,hardwareback=no");
      inAppBrowserRef.addEventListener("exit", function () {
        oAuthLog("inAppBrowserRef on exit: ", requestURL);
      });

      inAppBrowserRef.addEventListener("customscheme", function (event) {
        oAuthLog("customscheme: ", event.url);
        TwitterSignIn.handleTwitterOpenURL(event.url);

        //inAppBrowserRef.close();
      });
    }
  }

  // TODO: April 17, 2018, this is used by Twitter and SignIn by Email, and should be refactored out of here.  It is really the handleOpenURL function.
  static handleTwitterOpenURL (url) {
    oAuthLog("---------------xxxxxx-------- Application handleTwitterOpenUrl: " + url);
    if (url.startsWith("wevotetwitterscheme://")) {
      oAuthLog("handleTwitterOpenURL received wevotetwitterscheme: " + url);
      let search = url.replace(new RegExp("&amp;", "g"), "&");
      let urlParams = new URLSearchParams(search);

      if (urlParams.has("twitter_redirect_url")) {
        let redirectURL = urlParams.get("twitter_redirect_url");
        oAuthLog("twitterSignIn cordova, redirecting to: " + redirectURL);

        if (isIOS()) {
          // eslint-disable-next-line no-undef
          SafariViewController.hide();  // Hide the previous WKWebView
          cordovaOpenSafariView(redirectURL, 500);
        } else {
          oAuthLog("redirectURL: ", redirectURL);
          let inAppBrowserRef = cordova.InAppBrowser.open(redirectURL, "_blank", "toolbar=no,location=yes,hardwareback=no");
          inAppBrowserRef.addEventListener("exit", function () {
            oAuthLog("inAppBrowserRef on exit: ", redirectURL);
          });

          inAppBrowserRef.addEventListener("customscheme", function (event) {
            oAuthLog("customscheme: ", event.url);
            TwitterSignIn.handleTwitterOpenURL(event.url);
            inAppBrowserRef.close();
          });
        }
      } else if (urlParams.has("access_token_and_secret_returned")) {
        if (urlParams.get("success") === "True") {
          oAuthLog("twitterSignIn cordova, received secret -- push /ballot");
          TwitterActions.twitterSignInRetrieve();
          historyPush("/ballot");
        } else {
          oAuthLog("twitterSignIn cordova, FAILED to receive secret -- push /twitter_sign_in");
          historyPush("/twitter_sign_in");
        }
      } else if (urlParams.has("twitter_handle_found") && urlParams.get("twitter_handle_found") === "True") {
        oAuthLog("twitterSignIn cordova, twitter_handle_found -- push /twitter_sign_in -- received handle = " + urlParams.get("twitter_handle"));

        if (isIOS()) {
          // eslint-disable-next-line no-undef
          SafariViewController.hide();  // Hide the previous WKWebView
        }

        historyPush("/twitter_sign_in");
      } else if (url.startsWith("wevotetwitterscheme://sign_in_email")) {
        oAuthLog("twitterSignIn by email cordova, (not really twitter) -- received url = " + url);

        // Example url: wevotetwitterscheme://sign_in_email/1278821
        let n = url.indexOf("/");
        let payload = url.substring(n + 1);
        historyPush(payload);               // Example payload: "/sign_in_email/1278821"
      } else {
        console.log("ERROR in window.handleOpenURL, NO MATCH");
      }
    } else {
      console.log("ERROR: window.handleOpenURL received invalid url: " + url);
    }
  }

  render () {
    renderLog(__filename);
    return <Button className={this.props.className ? this.props.className : "btn btn-social btn-twitter"}
            onClick={isWebApp() ? this.twitterSignInWebApp : this.twitterSignInWebAppCordova }>
      <span className="fa fa-twitter"/> {this.props.buttonText ? this.props.buttonText : "Sign In"}
    </Button>;
  }
}
