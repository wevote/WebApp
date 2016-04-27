import React, { Component } from "react";
import FacebookActionCreators from "../../actions/FacebookActionCreators";
import FacebookStore from "../../stores/FacebookStore";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import Main from "../../components/Facebook/Main";
import LoadingWheel from "../../components/LoadingWheel";
import VoterStore from "../../stores/VoterStore";

export default class SignIn extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this._onVoterStoreChange();
    FacebookActionCreators.initFacebook();
    this.facebookListener = FacebookStore.addListener(this._onFacebookChange.bind(this));
    this.listener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.listener.remove();
    this.facebookListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.voter() });
  }

  _onFacebookChange () {
    this.setState({ fb_state: this.getFacebookState() });
  }

  getFacebookState () {
    return {
      accessToken: FacebookStore.accessToken,
      facebookIsLoggedIn: FacebookStore.loggedIn,
      userId: FacebookStore.userId,
      facebookPictureStatus: FacebookStore.facebookPictureStatus,
      facebookPictureUrl: FacebookStore.facebookPictureUrl
    };
  }

  render () {
    console.log(this.state);
    var { voter} = this.state;
    if (!voter){
      return LoadingWheel;
    }

    return <div className="">
      <div className="container-fluid well gutter-top--small fluff-full1">
        <h3 className="text-center">{voter.signed_in_personal ? <span>My Account</span> : <span>Sign In</span>}</h3>
        <div className="text-center">
          {voter.signed_in_facebook ?
            <span><a className="btn btn-social btn-lg btn-facebook" onClick={FacebookActionCreators.appLogout}>
            <i className="fa fa-facebook"></i>Sign Out</a></span> : <FacebookSignIn />
          }
          {/*
          <div>
            <Link to="add_friends_confirmed" className="btn btn-social btn-lg btn-twitter">
              <i className="fa fa-twitter"></i>Sign in with Twitter
            </Link>
          </div>
          <div>
            <Link to="add_friends_confirmed" className="btn btn-social btn-lg btn-google">
              <i className="fa fa-google"></i>Sign in with Google
            </Link>
          </div>
          */}
        </div>
        <br />
        <br />
        {/*
        <div className="text-center">
          {voter.signed_in_facebook ? <FacebookDisconnect /> : null}
        </div>
        */}

        {/* FOR DEBUGGING */}
        <div className="text-center">
          signed_in_personal: {voter.signed_in_personal ? <span>True</span> : null}<br />
          signed_in_facebook: {voter.signed_in_facebook ? <span>True</span> : null}<br />
          signed_in_twitter: {voter.signed_in_twitter ? <span>True</span> : null}<br />
          we_vote_id: {voter.we_vote_id ? <span>{voter.we_vote_id}</span> : null}<br />
          email: {voter.email ? <span>{voter.email}</span> : null}<br />
          facebook_email: {voter.facebook_email ? <span>{voter.facebook_email}</span> : null}<br />
          first_name: {voter.first_name ? <span>{voter.first_name}</span> : null}<br />
          facebook_id: {voter.facebook_id ? <span>{voter.facebook_id}</span> : null}<br />
        </div>

      </div>
      {/* FOR DEBUGGING */}
      <Main />

    </div>;
  }
}
