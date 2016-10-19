import React, { Component, PropTypes } from "react";
import { $ajax } from "../../utils/service";
// import TwitterActions from "../../actions/TwitterActions";
const web_app_config = require("../../config");

export default class TwitterSignIn extends Component {
  static propTypes = {
    params: PropTypes.object
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

  twitterSignInStart () {
    let return_url = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/twitter_sign_in";
    $ajax({
      endpoint: "twitterSignInStart",
      data: { return_url: return_url },
      success: res => {
        console.log("twitterSignInStart success, res:", res);
        if (res.twitter_redirect_url) {
          window.location.assign(res.twitter_redirect_url);
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

    return <a className="btn btn-social btn-lg btn-twitter" onClick={this.twitterSignInStart} >
      <i className="fa fa-twitter" />Sign in with Twitter
    </a>;
  }
}
