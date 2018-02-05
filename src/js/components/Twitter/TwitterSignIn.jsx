import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { $ajax } from "../../utils/service";
import cookies from "../../utils/cookies";
import { isWebApp, cordovaOpenSafariView } from "../../utils/cordovaUtils";
import webAppConfig from "../../config";

const returnURL = webAppConfig.WE_VOTE_URL_PROTOCOL + webAppConfig.WE_VOTE_HOSTNAME + "/twitter_sign_in";

export default class TwitterSignIn extends Component {
  static propTypes = {
    params: PropTypes.object,
    buttonSizeClass: PropTypes.string,
    buttonText: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  twitterSignInWebApp () {
    let brandingOff = cookies.getItem("we_vote_branding_off") || 0;
    console.log("twitterSignInWebApp isWebApp(): " + isWebApp());
    console.log("STEVE STEVE GGGGGGG returnURL: " + returnURL);
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
    console.log("twitterSignInWebAppCordova requestURL: " + requestURL);
    cordovaOpenSafariView(requestURL, 50);
  }

  render () {
    let buttonText = "Sign In";
    if (this.props.buttonText) {
      buttonText = this.props.buttonText;
    }

    let buttonSizeClass = "btn-lg";
    if (this.props.buttonSizeClass) {
      buttonSizeClass = this.props.buttonSizeClass;
    }

    return <Button bsSize="large" className="btn btn-social btn-twitter u-push--lg"
            onClick={isWebApp() ? this.twitterSignInWebApp : this.twitterSignInWebAppCordova }>
      <span className="fa fa-twitter"/> {buttonText}
    </Button>;
  }
}
