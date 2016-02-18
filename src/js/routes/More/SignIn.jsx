import React, { Component } from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";
import { Link } from "react-router";
import FacebookActionCreators from '../../actions/FacebookActionCreators';
import FacebookStore from '../../stores/FacebookStore';
import FacebookDisconnect from '../../components/Facebook/FacebookDisconnect';
import FacebookLogin from '../../components/Facebook/FacebookLogin';
import FacebookLogout from '../../components/Facebook/FacebookLogout';
import FacebookDownloadPicture from '../../components/Facebook/FacebookDownloadPicture';
import FacebookPicture from '../../components/Facebook/FacebookPicture';
import FacebookSignIn from '../../components/Facebook/FacebookSignIn';
import Main from '../../components/Facebook/Main';
import VoterStore from '../../stores/VoterStore';

{/* VISUAL DESIGN: tbd */}

export default class SignIn extends Component {
  constructor(props) {
	super(props);

    this.state = {
        voter_object: {
        }
    };
  }

  componentDidMount() {
    this.setState(this.getFacebookState());
    //console.log("SignIn, About to initialize VoterStore");
    VoterStore.initialize((voter_object) => {
      //console.log('SignIn: ', voter_object, 'voter_object is your object')
      this.setState({voter_object});
    });
    FacebookActionCreators.initFacebook();
    FacebookStore.addChangeListener(() => this._onFacebookChange());

    console.log('SignIn componentDidMount VoterStore.addChangeListener');
    VoterStore.addChangeListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount() {
    FacebookStore.removeChangeListener(this._onFacebookChange);

    console.log('SignIn componentWillUnmount VoterStore.removeChangeListener');
    VoterStore.removeChangeListener(this._onVoterStoreChange.bind(this));
  }

  _onVoterStoreChange () {
    this.setState({
      voter_object: VoterStore.getVoterObject()
    });
  }

  _onFacebookChange() {
    this.setState(this.getFacebookState());
  }

  getFacebookState() {
    return {
      accessToken: FacebookStore.accessToken,
      facebookIsLoggedIn: FacebookStore.loggedIn,
      userId: FacebookStore.userId,
      facebookPictureStatus: FacebookStore.facebookPictureStatus,
      facebookPictureUrl: FacebookStore.facebookPictureUrl
    }
  }

  static getProps() {
	return {};
  }

  render() {
    var { voter_object } = this.state;

    return (
    <div className="">
      <div className="container-fluid well container-fluid--paddingxl gutter-top--small">
        <h2 className="text-center">{voter_object.signed_in_personal ? <span>My Account</span> : <span>Sign In</span>}</h2>
        <div className="text-center">
          {voter_object.signed_in_facebook ? <span></span> : <FacebookSignIn />}
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
        <div className="text-center">
          {voter_object.signed_in_facebook ? <FacebookDisconnect /> : null}
        </div>
        <div className="text-center">
          signed_in_personal: {voter_object.signed_in_personal ? <span>True</span> : null}<br />
          signed_in_facebook: {voter_object.signed_in_facebook ? <span>True</span> : null}<br />
          signed_in_twitter: {voter_object.signed_in_twitter ? <span>True</span> : null}<br />
          we_vote_id: {voter_object.we_vote_id ? <span>{voter_object.we_vote_id}</span> : null}<br />
          email: {voter_object.email ? <span>{voter_object.email}</span> : null}<br />
          facebook_email: {voter_object.facebook_email ? <span>{voter_object.facebook_email}</span> : null}<br />
          first_name: {voter_object.first_name ? <span>{voter_object.first_name}</span> : null}<br />
          facebook_id: {voter_object.facebook_id ? <span>{voter_object.facebook_id}</span> : null}<br />
        </div>
      </div>
      <Main />
    </div>
    );
  }
}
