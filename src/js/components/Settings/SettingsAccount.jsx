import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import { historyPush } from "../../utils/cordovaUtils";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import TwitterActions from "../../actions/TwitterActions";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";
import VoterActions from "../../actions/VoterActions";
import VoterEmailAddressEntry from "../../components/VoterEmailAddressEntry";
import VoterSessionActions from "../../actions/VoterSessionActions";
import VoterStore from "../../stores/VoterStore";

const debugMode = false;

export default class SettingsAccount extends Component {

  constructor (props) {
    super(props);
    this.state = {
      facebook_auth_response: {},
      first_name: "",
      last_name: "",
      initial_name_loaded: false,
      show_twitter_disconnect: false,
    };
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this.onVoterStoreChange();
    this.facebookListener = FacebookStore.addListener(this.onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
  }

  componentWillUnmount () {
    // console.log("SignIn ---- UN mount");
    this.facebookListener.remove();
    this.voterStoreListener.remove();
    this.timer = null;
  }

  onVoterStoreChange () {
    if (VoterStore.isVoterFound() && !this.state.initial_name_loaded) {
      this.setState({
        first_name: VoterStore.getFirstName(),
        last_name: VoterStore.getLastName(),
        initial_name_loaded: true,
        voter: VoterStore.getVoter(),
      });
    } else {
      this.setState({ voter: VoterStore.getVoter() });
    }
  }

  onFacebookChange () {
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

  toggleTwitterDisconnectOpen () {
    this.setState({ show_twitter_disconnect: true });
  }

  toggleTwitterDisconnectClose () {
    this.setState({ show_twitter_disconnect: false });
  }

  voterSplitIntoTwoAccounts () {
    VoterActions.voterSplitIntoTwoAccounts();
    this.setState({ show_twitter_disconnect: false });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    // TODO: This class has lots of code (including unaltered console.log lines) that are in common with SignIn.jsx -- can they be refactored back to a single file?

    // console.log("SignIn.jsx this.state.facebook_auth_response:", this.state.facebook_auth_response);
    if (!this.state.voter.signed_in_facebook && this.state.facebook_auth_response && this.state.facebook_auth_response.facebook_retrieve_attempted) {
      console.log("SignIn.jsx facebook_retrieve_attempted");
      historyPush("/facebook_sign_in");

      // return <span>SignIn.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    }

    let pageTitle = "Sign In - We Vote";
    let yourAccountTitle = "Your Account";
    let yourAccountExplanation = "";
    if (this.state.voter.is_signed_in) {
      pageTitle = "Your Account - We Vote";
      if (this.state.voter.signed_in_facebook && !this.state.voter.signed_in_twitter) {
        yourAccountTitle = "Have Twitter Too?";
        yourAccountExplanation = "By adding your Twitter account to your We Vote profile, you get access to the voter guides of everyone you follow.";
      } else if (this.state.voter.signed_in_twitter && !this.state.voter.signed_in_facebook) {
        yourAccountTitle = "Have Facebook Too?";
        yourAccountExplanation = "By adding Facebook to your We Vote profile, it is easier to invite friends.";
      }
    }

    return <div className="">
      <Helmet title={pageTitle} />
      <BrowserPushMessage incomingProps={this.props} />
      <div className="card">
        <div className="card-main">
          {this.state.voter.signed_in_twitter && this.state.voter.signed_in_facebook ?
            null :
            <h1 className="h3">{this.state.voter.is_signed_in ? <span>{yourAccountTitle}</span> : null}</h1>
          }
          {this.state.voter.is_signed_in ?
            <span>{yourAccountExplanation}</span> :
            <div >
              <div className="u-f3">Please sign in so you can share.</div>
              <div className="u-stack--sm">Don't worry, we won't post anything automatically.</div>
            </div>
          }
          {!this.state.voter.signed_in_twitter || !this.state.voter.signed_in_facebook ?
            <div>
              {this.state.voter.signed_in_twitter ?
                null :
                <TwitterSignIn className="btn btn-social btn-lg btn-twitter"/>
              }
              <span>&nbsp;</span>
              { !this.state.voter.signed_in_facebook &&
                <FacebookSignIn />
              }
              <br />
              <br />
            </div> :
            null
          }
          <div>
            {this.state.voter.is_signed_in ?
              <div>
                <span className="h3">Currently Signed In</span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span className="account-edit-action" tabIndex="0" onKeyDown={this.twitterLogOutOnKeyDown.bind(this)}>
                  <a className="pull-right" onClick={VoterSessionActions.voterSignOut}>Sign Out</a>
                </span>

                <br />
                <div>
                  {this.state.voter.signed_in_twitter ?
                    <span>
                      <span className="btn btn-social btn-lg btn-twitter" href="#">
                        <i className="fa fa-twitter"/>@{this.state.voter.twitter_screen_name}</span><span>&nbsp;</span>
                    </span> :
                    null
                  }
                  {this.state.voter.signed_in_facebook &&
                    <span>
                      <span className="btn btn-social-icon btn-lg btn-facebook">
                        <span className="fa fa-facebook" />
                      </span>
                      <span>&nbsp;</span>
                    </span>
                  }
                  {this.state.voter.signed_in_with_email &&
                    <span>
                      <span className="btn btn-warning btn-lg">
                      <span className="glyphicon glyphicon-envelope" /></span>
                    </span>
                  }
                </div>
                {this.state.voter.signed_in_twitter && (this.state.voter.signed_in_facebook || this.state.voter.signed_in_with_email) ?
                  <span>{this.state.show_twitter_disconnect ?
                    <div>
                      <Button variant="danger"
                          type="submit"
                          onClick={this.voterSplitIntoTwoAccounts.bind(this)}
                          >Disconnect @{this.state.voter.twitter_screen_name} from this account</Button>
                    </div> :
                    <div>
                      <span onClick={this.toggleTwitterDisconnectOpen.bind(this)}>un-link twitter</span>
                    </div>
                  }</span> :
                  null
                }
              </div> :
              null
            }
          </div>

          <VoterEmailAddressEntry />

          {debugMode &&
          <div className="text-center">
            is_signed_in: {this.state.voter.is_signed_in ? <span>True</span> : null}<br />
            signed_in_facebook: {this.state.voter.signed_in_facebook ? <span>True</span> : null}<br />
            signed_in_twitter: {this.state.voter.signed_in_twitter ? <span>True</span> : null}<br />
            we_vote_id: {this.state.voter.we_vote_id ? <span>{this.state.voter.we_vote_id}</span> : null}<br />
            email: {this.state.voter.email ? <span>{this.state.voter.email}</span> : null}<br />
            facebook_email: {this.state.voter.facebook_email ? <span>{this.state.voter.facebook_email}</span> : null}<br />
            facebook_profile_image_url_https: {this.state.voter.facebook_profile_image_url_https ? <span>{this.state.voter.facebook_profile_image_url_https}</span> : null}<br />
            first_name: {this.state.voter.first_name ? <span>{this.state.voter.first_name}</span> : null}<br />
            facebook_id: {this.state.voter.facebook_id ? <span>{this.state.voter.facebook_id}</span> : null}<br />
          </div>
        }
        </div>
      </div>
    </div>;
  }
}
