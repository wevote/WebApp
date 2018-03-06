import React, { Component } from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import LoadingWheel from "../../components/LoadingWheel";
import TwitterActions from "../../actions/TwitterActions";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";

const delay_before_user_name_update_api_call = 1200;


export default class SettingsProfile extends Component {

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
    this.updateNewsletterOptIn = this.updateNewsletterOptIn.bind(this);
    this.updateVoterName = this.updateVoterName.bind(this);
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this._onVoterStoreChange();
    this.facebookListener = FacebookStore.addListener(this._onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
  }

  componentWillUnmount () {
    console.log("SignIn ---- UN mount");
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
        voter: VoterStore.getVoter(),
        newsletter_opt_in: VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN)
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
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return <div className="">
      <Helmet title={"Your Profile - We Vote"} />
      <BrowserPushMessage incomingProps={this.props} />
      <div className="card">
        <div className="card-main">
          {this.state.voter.is_signed_in ?
            <div>
              <div className="card">
                <h3 className="h3">Your Public Profile</h3>
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
            </div> :
            <div><Link to="/settings/account">Please Sign In</Link></div>
          }
        </div>
      </div>
    </div>;
  }
}
