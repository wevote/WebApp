import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import TwitterActions from "../../actions/TwitterActions";
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
    TwitterActions.twitterSignInStart(return_url);
  }

  render () {

    return <a className="btn btn-social btn-lg btn-twitter" onClick={this.didClickTwitterSignInButton} >
      <i className="fa fa-twitter" />Sign in with Twitter
    </a>;
  }
}
