import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import { $ajax } from "../../utils/service";
import FacebookActions from "../../actions/FacebookActions";
import VoterStore from "../../stores/VoterStore";
const web_app_config = require("../../config");

// Flow chart here: https://docs.google.com/drawings/d/1WdVFsPZl3aLM9wxGuPTW3veqP-5EmZKv36KWjTz5pbU/edit

export default class TwitterSignInProcess extends Component {
  static propTypes = {
    params: PropTypes.object,
    sign_in_step: PropTypes.string,
    incoming_twitter_handle: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      "twitter_redirect_url": ""
    };
  }

  componentWillMount () {
    if (this.props.params.sign_in_step === undefined || this.props.params.sign_in_step === "signinstart") {
      this._onVoterStoreChange();
    } else if (this.props.params.sign_in_step === "signinswitchstart") {
      // Get the voter before we render
      this._onVoterStoreChange();
    }
  }

  componentDidMount () {
    this.listener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    var {voter} = this.state;
    var return_url;
    if (this.props.params.sign_in_step === undefined || this.props.params.sign_in_step === "signinstart") {
      if (voter !== undefined && (voter.signed_in_twitter || voter.signed_in_facebook)) {
        // We don't want to start the sign in process again if they are already signed in, so we redirect to the
        // sign in status page
        browserHistory.push("/more/sign_in");
      } else {
        return_url = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/more/sign_in/";
        this.twitterSignInStart(return_url);
      }
    } else if (this.props.params.sign_in_step === "signinswitchstart") {
      if (voter !== undefined && (voter.signed_in_twitter || voter.signed_in_facebook)) {
        FacebookActions.appLogout();
      } else {
        // We call twitterSignInStart from here for the case where the person is already signed out
        return_url = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/twittersigninprocess/signinswitchend";
        this.twitterSignInStart(return_url);
      }
    } else if (this.props.params.sign_in_step === "signinswitchend") {
      // Redirect to the TwitterHandle page for the screen name added at the end of the return_url in the URL
      if (this.props.params.incoming_twitter_handle !== undefined) {
        browserHistory.push("/" + this.props.params.incoming_twitter_handle);
      } else {
        browserHistory.push("/more/sign_in");
      }
    }
  }

  componentDidUpdate () {
    var {voter} = this.state;
    if (this.props.params.sign_in_step === "signinswitchstart") {
      if (voter !== undefined && (voter.signed_in_twitter || voter.signed_in_facebook)) {
        // We are waiting for logout to take hold
      } else {
        let return_url = web_app_config.WE_VOTE_URL_PROTOCOL + web_app_config.WE_VOTE_HOSTNAME + "/twittersigninprocess/signinswitchend";
        this.twitterSignInStart(return_url);
      }
    }
  }

  componentWillUnmount () {
    this.listener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.voter() });
  }

  twitterSignInStart (return_url) {
    $ajax({
      endpoint: "twitterSignInStart",
      data: { return_url: return_url },
      success: res => {
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
    if (this.props.params.sign_in_step === undefined || this.props.params.sign_in_step === "signinstart") {
      return <div>
        Please wait...
      </div>;
    } else if (this.props.params.sign_in_step === "signinswitchstart"){
      return <div>
          Please wait...
        </div>;
    } else if (this.props.params.sign_in_step === "signinswitchend"){
      return <div>
          Please wait...
        </div>;
    } else {
      return <div className="container-fluid well u-gutter-top--small fluff-full1">
              <h3>Page Not Found</h3>
                <div className="small">We were not able to find that page. Please try again!</div>
            </div>;
    }
  }
}
