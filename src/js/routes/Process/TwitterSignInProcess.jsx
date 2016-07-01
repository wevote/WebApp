import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import { $ajax } from "../../utils/service";
const web_app_config = require("../../config");

// Flow chart here: https://docs.google.com/drawings/d/1WdVFsPZl3aLM9wxGuPTW3veqP-5EmZKv36KWjTz5pbU/edit

export default class TwitterSignInProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
    sign_in_step: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      "twitter_redirect_url": ""
    };
  }

  componentWillMount () {
    // Where should the Twitter sign in process bring the voter back at the *very* end?
    // TODO DALE Consider making this be the route we are currently on, instead of hard-code to the sign in page?
    let return_url = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/more/sign_in/";

    if (this.props.params.sign_in_step === undefined || this.props.params.sign_in_step === "signinstart") {
      console.log("componentWillMount, sign_in_step: " + this.props.params.sign_in_step);
      this.twitterSignInStart(return_url);
    } else if (this.props.params.sign_in_step === "requestaccesstoken") {
      console.log("componentWillMount, sign_in_step: " + this.props.params.sign_in_step);
      this.twitterSignInRequestAccessToken(return_url);
    } else if (this.props.params.sign_in_step === "requestvoterinfo") {
      console.log("componentWillMount, sign_in_step: " + this.props.params.sign_in_step);
      this.twitterSignInRequestVoterInfo();
    }
  }

  twitterSignInStart (return_url) {
    $ajax({
      endpoint: "twitterSignInStart",
      data: { return_url: return_url },
      success: res => {
        this.setState(res);
        if (this.state.twitter_redirect_url !== undefined) {
          // Redirect browser to the Twitter authentication page
          window.location.assign(this.state.twitter_redirect_url);
        }
      },
      error: res => {
        console.log("twitterSignInStart error");
      }
    });
  }

  twitterSignInRequestAccessToken (return_url) {
    $ajax({
      endpoint: "twitterSignInRequestAccessToken",
      data: { return_url: return_url },
      success: res => {
        this.setState(res);
        console.log("browserHistory.push('/twittersigninprocess/requestvoterinfo')");
        if (this.state.twitter_redirect_url !== undefined) {
          browserHistory.push("/twittersigninprocess/requestvoterinfo");
        }
      },
      error: res => {
      }
    });
  }

  twitterSignInRequestVoterInfo (return_url) {
    $ajax({
      endpoint: "twitterSignInRequestVoterInfo",
      data: { return_url: return_url },
      success: res => {
        this.setState(res);
        console.log("browserHistory.push('/more/sign_in')");
        if (this.state.twitter_redirect_url !== undefined) {
          browserHistory.push("/more/sign_in");
        }
      },
      error: res => {
      }
    });
  }

  render () {
    if (this.props.params.sign_in_step === undefined || this.props.params.sign_in_step === "signinstart"){
      console.log("this.props.params.sign_in_step === undefined) || (this.props.params.sign_in_step === 'signinstart'");
      return <div>
          Please wait...
        </div>;
    } else if (this.props.params.sign_in_step === "requestaccesstoken"){
      console.log("(this.props.params.sign_in_step === 'requestaccesstoken')");
      return <div>
          Please wait...
        </div>;
    } else if (this.props.params.sign_in_step === "requestvoterinfo"){
      console.log("(this.props.params.sign_in_step === 'requestvoterinfo')");
      return <div>
          Please wait...
        </div>;
    } else {
      return <div className="bs-container-fluid bs-well u-gutter-top--small fluff-full1">
              <h3>Page Not Found</h3>
                <div className="small">We were not able to find that page. Please try again!</div>
            </div>;
    }
  }
}
