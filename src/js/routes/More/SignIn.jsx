import React, { Component } from "react";
import Helmet from "react-helmet";
import { browserHistory } from "react-router";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import LoadingWheel from "../../components/LoadingWheel";
import TwitterActions from "../../actions/TwitterActions";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";
import VoterEmailAddressEntry from "../../components/VoterEmailAddressEntry";
import VoterSessionActions from "../../actions/VoterSessionActions";
import VoterStore from "../../stores/VoterStore";

const debug_mode = false;
export default class SignIn extends Component {

  constructor (props) {
    super(props);
    this.state = {
      facebook_auth_response: {}
    };
  }

  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this._onVoterStoreChange();
    this.facebookListener = FacebookStore.addListener(this._onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.facebookListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onFacebookChange () {
    this.setState({
      facebook_auth_response: FacebookStore.getFacebookAuthResponse(),
    });
  }

  facebookLogOutOnKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      FacebookActions.appLogout();
    }
  }

  twitterLogOutOnKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      TwitterActions.appLogout();
    }
  }

  // getFacebookAuthResponse () {
  //   return {
  //     accessToken: FacebookStore.accessToken,
  //     facebookIsLoggedIn: FacebookStore.loggedIn,
  //     userId: FacebookStore.userId,
  //     facebookPictureStatus: FacebookStore.facebookPictureStatus,
  //     facebookPictureUrl: FacebookStore.facebookPictureUrl
  //   };
  // }

  render () {
    var { voter} = this.state;
    if (!voter){
      return LoadingWheel;
    }

    // console.log("SignIn.jsx this.state.facebook_auth_response:", this.state.facebook_auth_response);
    if (!voter.signed_in_facebook && this.state.facebook_auth_response && this.state.facebook_auth_response.facebook_retrieve_attempted) {
      console.log("SignIn.jsx facebook_retrieve_attempted");
      browserHistory.push("/facebook_sign_in");
      // return <span>SignIn.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    }

    let your_account_title = "Your Account";
    let your_account_explanation = "";
    if (voter.is_signed_in) {
      if (voter.signed_in_facebook && !voter.signed_in_twitter) {
        your_account_title = "Have Twitter Too?";
        your_account_explanation = "By adding your Twitter account to your We Vote profile, you get access to the voter guides of everyone you follow.";
      } else if (voter.signed_in_twitter && !voter.signed_in_facebook) {
        your_account_title = "Have Facebook Too?";
        your_account_explanation = "By adding Facebook to your We Vote profile, it is easier to invite friends.";
      }
    }

    return <div className="">
      <Helmet title="Sign In - We Vote" />
      <BrowserPushMessage incomingProps={this.props} />
      <div className="card">
        <div className="card-main">
          {voter.signed_in_twitter && voter.signed_in_facebook ?
            null :
            <h1 className="h3">{voter.is_signed_in ? <span>{your_account_title}</span> : <span>Your Account</span>}</h1> }
          {voter.is_signed_in ?
            <span>{your_account_explanation}</span> :
            <div>Before you can share, either publicly or with friends, please sign in. Don't worry, we won't post anything automatically.<br />
            <br /></div>
          }
          {!voter.signed_in_twitter || !voter.signed_in_facebook ?
            <div>
              {voter.signed_in_twitter ?
                null :
                <TwitterSignIn />
              }
              <span>&nbsp;</span>
              {voter.signed_in_facebook ?
                null :
                <FacebookSignIn />
              }
              <br />
              <br />
            </div> :
            null }
          <div>
            {voter.is_signed_in ?
              <div>
                <span className="h3">Currently Signed In</span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span className="account-edit-action" tabIndex="0" onKeyDown={this.twitterLogOutOnKeyDown.bind(this)}>
                  <a onClick={VoterSessionActions.voterSignOut}>Sign Out</a>
                </span>

                <br />
                {voter.signed_in_twitter ?
                  <span>
                    <span className="btn btn-social btn-lg btn-twitter" href="#">
                      <i className="fa fa-twitter" />@{voter.twitter_screen_name}</span><span>&nbsp;</span>
                  </span> :
                  null
                }
                {voter.signed_in_facebook ?
                  <span>
                    <span className="btn btn-social-icon btn-lg btn-facebook">
                      <span className="fa fa-facebook" />
                    </span>
                    <span>&nbsp;</span>
                  </span> :
                  null
                }
                {voter.signed_in_with_email ?
                  <span>
                    <span className="btn btn-warning btn-lg">
                    <span className="glyphicon glyphicon-envelope" /></span>
                  </span> :
                  null
                }
              </div> :
              null
            }
          </div>
          <br />
            <br />
            <VoterEmailAddressEntry />

          {debug_mode &&
          <div className="text-center">
            is_signed_in: {voter.is_signed_in ? <span>True</span> : null}<br />
            signed_in_facebook: {voter.signed_in_facebook ? <span>True</span> : null}<br />
            signed_in_twitter: {voter.signed_in_twitter ? <span>True</span> : null}<br />
            we_vote_id: {voter.we_vote_id ? <span>{voter.we_vote_id}</span> : null}<br />
            email: {voter.email ? <span>{voter.email}</span> : null}<br />
            facebook_email: {voter.facebook_email ? <span>{voter.facebook_email}</span> : null}<br />
            facebook_profile_image_url_https: {voter.facebook_profile_image_url_https ? <span>{voter.facebook_profile_image_url_https}</span> : null}<br />
            first_name: {voter.first_name ? <span>{voter.first_name}</span> : null}<br />
            facebook_id: {voter.facebook_id ? <span>{voter.facebook_id}</span> : null}<br />
          </div>
        }
        </div>
      </div>
      {/* FOR DEBUGGING */}
      {/* <Main /> */}

    </div>;
  }
}
