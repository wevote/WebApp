import React, { Component, PropTypes } from "react";
import { $ajax } from "../../utils/service";
import cookies from "../../utils/cookies";
// import TwitterActions from "../../actions/TwitterActions";
const web_app_config = require("../../config");

export default class TwitterSignIn extends Component {
  static propTypes = {
    params: PropTypes.object,
    buttonSizeClass: PropTypes.string,
    buttonText: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  didClickTwitterSignInButton () {
    // We search for ":twitter_secret_key" and replace it with the actual TwitterLinkToVoter twitter_secret_key
    //  at the end of the sign in process.
    let return_url = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/twitter_sign_in";
    this.twitterSignInStart(return_url);
  }

  onKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickTwitterSignInButton();
    }
  }

  twitterSignInStart () {
    let we_vote_branding_off_from_cookie = cookies.getItem("we_vote_branding_off") || 0;
    let return_url = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/twitter_sign_in";
    $ajax({
      endpoint: "twitterSignInStart",
      data: { return_url: return_url },
      success: res => {
        console.log("twitterSignInStart success, res:", res);
        if (res.twitter_redirect_url) {
          if (we_vote_branding_off_from_cookie) {
            window.open(res.twitter_redirect_url);
          } else {
            window.location.assign(res.twitter_redirect_url);
          }
        } else {
          // There is a problem signing in
          console.log("twitterSignInStart ERROR res: ", res);
          // When we visit this page and delete the voter_device_id cookie, we can get an error that requires
          // reloading the browser page. This is how we do it:
          window.location.assign("");
        }
      },
      error: res => {
        console.log("twitterSignInStart error: ", res);
        // Try reloading the page
        window.location.assign("");
      }
    });
  }

  render () {
    let button_text = "Sign In";
    if (this.props.buttonText) {
      button_text = this.props.buttonText;
    }
    let button_size_class = "btn-lg";
    if (this.props.buttonSizeClass) {
      button_size_class = this.props.buttonSizeClass;
    }

    return <a tabIndex="0" onKeyDown={this.onKeyDown.bind(this)}
              className={"btn btn-social btn-twitter " + button_size_class}
              onClick={this.twitterSignInStart} >
      <i className="fa fa-twitter" />{ button_text }
    </a>;
  }
}
