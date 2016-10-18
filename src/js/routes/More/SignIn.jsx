import React, { Component } from "react";
import { browserHistory } from "react-router";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import Helmet from "react-helmet";
// import Main from "../../components/Facebook/Main";
import LoadingWheel from "../../components/LoadingWheel";
import TwitterActions from "../../actions/TwitterActions";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";
import VoterEmailAddressEntry from "../../components/VoterEmailAddressEntry";
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
    if (this.state.facebook_auth_response && this.state.facebook_auth_response.facebook_retrieve_attempted) {
      // console.log("SignIn.jsx facebook_retrieve_attempted");
      browserHistory.push("/facebook_sign_in");
      // return <span>SignIn.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    }

    let facebook_sign_in_option = "";
    // if (voter.signed_in_twitter) {
    //   facebook_sign_in_option = <span>To sign in with Facebook, Sign out of Twitter</span>;
    // } else {
      facebook_sign_in_option = <FacebookSignIn />;
    // }

    let twitter_sign_in_option = "";
    // if (voter.signed_in_facebook) {
    //   twitter_sign_in_option = <span>To sign in with Twitter, Sign out of Facebook</span>;
    // } else {
      twitter_sign_in_option = <TwitterSignIn />;
    // }

    return <div className="">
      <Helmet title="Sign In - We Vote" />
      <BrowserPushMessage incomingProps={this.props} />
      <div className="card">
        <div className="card-main text-center">
          <h1 className="h3">{voter.signed_in_personal ? <span>My Account</span> : <span>Sign In</span>}</h1>
          <div>
            {voter.signed_in_facebook ?
              <span><a className="btn btn-social btn-lg btn-facebook" onClick={FacebookActions.appLogout}>
              <i className="fa fa-facebook" />Sign Out</a></span> : facebook_sign_in_option
            }
            <br />
            <br />
            {/* appLogout signs out the voter, regardless of how they are signed in */}
            {voter.signed_in_twitter ?
              <span><a className="btn btn-social btn-lg btn-twitter" onClick={TwitterActions.appLogout}>
              <i className="fa fa-twitter" />Sign Out</a></span> : twitter_sign_in_option
            }
            {/*
            <div>
              <Link to="add_friends_confirmed" className="btn btn-social btn-lg btn-google">
                <i className="fa fa-google"></i>Sign in with Google
              </Link>
            </div>
            */}
            <br />
            <br />
            <br />
            <br />
            <VoterEmailAddressEntry />
          </div>
          <br />
          <br />
          {/*
          <div className="text-center">
            {voter.signed_in_facebook ? <FacebookDisconnect /> : null}
          </div>
          */}

          {debug_mode &&
          <div className="text-center">
            signed_in_personal: {voter.signed_in_personal ? <span>True</span> : null}<br />
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
