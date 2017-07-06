import React, { Component } from "react";
import {Button} from "react-bootstrap";
import Helmet from "react-helmet";
import { browserHistory } from "react-router";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import FacebookSignIn from "../../components/Facebook/FacebookSignIn";
import LoadingWheel from "../../components/LoadingWheel";
import TwitterActions from "../../actions/TwitterActions";
import TwitterSignIn from "../../components/Twitter/TwitterSignIn";
import VoterActions from "../../actions/VoterActions";
import VoterEmailAddressEntry from "../../components/VoterEmailAddressEntry";
import VoterSessionActions from "../../actions/VoterSessionActions";
import VoterStore from "../../stores/VoterStore";
import VoterConstants from "../../constants/VoterConstants";

const debug_mode = false;
const delay_before_user_name_update_api_call = 1200;
export default class SignIn extends Component {

  constructor (props) {
    super(props);
    this.state = {
      facebook_auth_response: {},
      first_name: "",
      last_name: "",
      initial_name_loaded: false,
      name_saved_status: "",
      show_twitter_disconnect: false,
      newsletter_opt_in: VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN),
      notifications_saved_status: ""
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateVoterName = this.updateVoterName.bind(this);
    this.updateNewsletterOptIn = this.updateNewsletterOptIn.bind(this);
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
    this.timer = null;
  }

  _onVoterStoreChange () {
    if (VoterStore.isVoterFound() && !this.state.initial_name_loaded) {
      this.setState({
        first_name: VoterStore.getFirstName(),
        last_name: VoterStore.getLastName(),
        initial_name_loaded: true,
        voter: VoterStore.getVoter()
      });
    } else {
      this.setState({voter: VoterStore.getVoter()});
    }
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

  toggleTwitterDisconnectOpen () {
    this.setState({show_twitter_disconnect: true});
  }

  toggleTwitterDisconnectClose () {
    this.setState({show_twitter_disconnect: false});
  }

  voterSplitIntoTwoAccounts () {
    VoterActions.voterSplitIntoTwoAccounts();
    this.setState({show_twitter_disconnect: false});
  }

  handleKeyPress () {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      VoterActions.voterNameSave(this.state.first_name, this.state.last_name);
      this.setState({name_saved_status: "Saved"});
    }, delay_before_user_name_update_api_call);
  }

  updateVoterName (event) {
    if (event.target.name === "first_name") {
      this.setState({
        first_name: event.target.value,
        name_saved_status: "Saving First Name..."
      });
    } else if (event.target.name === "last_name") {
      this.setState({
        last_name: event.target.value,
        name_saved_status: "Saving Last Name..."
      });
    }
  }

  updateNewsletterOptIn (event) {
    if (event.target.name === "newsletter_opt_in") {
      if (event.target.checked) {
        VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
        this.setState({ newsletter_opt_in: true });
      } else {
        VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_ZERO, VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
        this.setState({ newsletter_opt_in: false });
      }

      this.setState({ notifications_saved_status: "Saved" });
    }
  }

  render () {
    var {voter} = this.state;
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

    let page_title = "Sign In - We Vote";
    let your_account_title = "Your Account";
    let your_account_explanation = "";
    if (voter.is_signed_in) {
      page_title = "Your Account - We Vote";
      if (voter.signed_in_facebook && !voter.signed_in_twitter) {
        your_account_title = "Have Twitter Too?";
        your_account_explanation = "By adding your Twitter account to your We Vote profile, you get access to the voter guides of everyone you follow.";
      } else if (voter.signed_in_twitter && !voter.signed_in_facebook) {
        your_account_title = "Have Facebook Too?";
        your_account_explanation = "By adding Facebook to your We Vote profile, it is easier to invite friends.";
      }
    }

    return <div className="">
      <Helmet title={page_title} />
      <BrowserPushMessage incomingProps={this.props} />
      <div className="card">
        <div className="card-main">
          {voter.signed_in_twitter && voter.signed_in_facebook ?
            null :
            <h1 className="h3">{voter.is_signed_in ? <span>{your_account_title}</span> : null}</h1>
          }
          {voter.is_signed_in ?
            <span>{your_account_explanation}</span> :
            <div>Before you can share, either publicly or with friends, please sign in. Don't worry, we won't post anything automatically.<br />
            <br />
            </div>
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
            null
          }
          {voter.is_signed_in ?
            <div>
              <div className="card">
                <span className="h3">Your Account</span>
                <br />
                <label htmlFor="last-name">First Name
                <input type="text"
                       className="form-control"
                       name="first_name"
                       placeholder="First Name"
                       onKeyDown={this.handleKeyPress}
                       onChange={this.updateVoterName}
                       value={this.state.first_name}
                /> </label>
                <br />
                <label htmlFor="last-name">Last Name
                <input type="text"
                       className="form-control"
                       name="last_name"
                       placeholder="Last Name"
                       onKeyDown={this.handleKeyPress}
                       onChange={this.updateVoterName}
                       value={this.state.last_name}
                /> </label>
                <br />
                <span className="pull-right u-gray-mid">{this.state.name_saved_status}</span>
              </div>

              <div className="card">
                <span className="h3">Notification Settings</span>
                <br />
                <input id="newsletter_opt_in"
                       type="checkbox"
                       name="newsletter_opt_in"
                       onChange={this.updateNewsletterOptIn}
                       checked={this.state.newsletter_opt_in}
                />
                { " " }
                <label htmlFor="newsletter_opt_in">I would like to receive the We Vote newsletter</label>
                <span className="pull-right u-gray-mid">{this.state.notifications_saved_status}</span>
              </div>
            </div> :
            null
          }
          {/*voter.signed_in_twitter && voter.signed_in_facebook ?
            null :
            <h1 className="h3">{voter.is_signed_in ? <span>{your_account_title}</span> : <span>Your Account</span>}</h1>
          */}
          {/*voter.is_signed_in ?
            <span>{your_account_explanation}</span> :
            <div>Before you can share, either publicly or with friends, please sign in. Don't worry, we won't post anything automatically.<br />
            <br />
            </div>
          */}
          <div>
            {voter.is_signed_in ?
              <div>
                <span className="h3">Currently Signed In</span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span className="account-edit-action" tabIndex="0" onKeyDown={this.twitterLogOutOnKeyDown.bind(this)}>
                  <a className="pull-right" onClick={VoterSessionActions.voterSignOut}>Sign Out</a>
                </span>

                <br />
                <div>
                  {voter.signed_in_twitter ?
                    <span>
                      <span className="btn btn-social btn-lg btn-twitter" href="#">
                        <i className="fa fa-twitter"/>@{voter.twitter_screen_name}</span><span>&nbsp;</span>
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
                </div>
                {voter.signed_in_twitter && (voter.signed_in_facebook || voter.signed_in_with_email) ?
                  <span>{this.state.show_twitter_disconnect ?
                    <div>
                      <Button bsStyle="danger"
                          type="submit"
                          onClick={this.voterSplitIntoTwoAccounts.bind(this)}
                          >Disconnect @{voter.twitter_screen_name} from this account</Button>
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
