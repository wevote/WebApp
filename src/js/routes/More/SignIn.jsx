import React, { Component, PropTypes } from "react";
import { Button, ButtonToolbar, Input } from "react-bootstrap";
import { Link } from "react-router";
import FacebookActionCreators from "../../actions/FacebookActionCreators";
import FacebookStore from "../../stores/FacebookStore";
import FacebookDisconnect from "../../components/Facebook/FacebookDisconnect";
import FacebookLogin from "../../components/Facebook/FacebookLogin";
import FacebookLogout from "../../components/Facebook/FacebookLogout";
import FacebookDownloadPicture from "../../components/Facebook/FacebookDownloadPicture";
import FacebookPicture from "../../components/Facebook/FacebookPicture";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import Main from "../../components/Facebook/Main";
import VoterStore from "../../stores/VoterStore";

export default class SignIn extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor(props) {
	super(props);

    this.state = {
        voter: {
        }
    };
  }

  componentDidMount () {
    this.setState(this.getFacebookState());
    //console.log("SignIn, About to initialize VoterStore");
    VoterStore.getLocation( (err) => {
      if (err) console.error("FacebookStore.js, Error initializing voter object", err);

      VoterStore.getVoterObject( (_err, voter) => {
        if (_err) console.error("FacebookStore.js, Error initializing voter object", err);

        this.setState({voter});
        // console.log("SignIn: ", voter, "voter is your object")
      });
    });

    FacebookActionCreators.initFacebook();
    this.changeListener = this._onFacebookChange.bind(this);
    FacebookStore.addChangeListener(this.changeListener);
    this.voterListener = this._onVoterStoreChange.bind(this);
    // console.log("SignIn componentDidMount VoterStore.addChangeListener");
    VoterStore.addChangeListener(this.voterListener);
  }

  componentWillUnmount () {
    FacebookStore.removeChangeListener(this.changeListener);

    // console.log("SignIn componentWillUnmount VoterStore.removeChangeListener");
    VoterStore.removeChangeListener(this.voterListener);
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getCachedVoterObject()
    });
  }

  _onFacebookChange () {
    this.setState(this.getFacebookState());
  }

  getFacebookState () {
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
    var { voter } = this.state;

    return (
    <div className="">
      <div className="container-fluid well gutter-top--small fluff-full1">
        <h3 className="text-center">{voter.signed_in_personal ? <span>My Account</span> : <span>Sign In</span>}</h3>
        <div className="text-center">
          {voter.signed_in_facebook ? <span></span> : <FacebookSignIn />}
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
          {voter.signed_in_facebook ? <FacebookDisconnect /> : null}
        </div>
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

    </div>
    );
  }
}
