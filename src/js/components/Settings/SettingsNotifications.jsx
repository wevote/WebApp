import React, { Component } from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BrowserPushMessage from "../Widgets/BrowserPushMessage";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import VoterActions from "../../actions/VoterActions";
import VoterConstants from "../../constants/VoterConstants";
import VoterStore from "../../stores/VoterStore";


export default class SettingsNotifications extends Component {
  constructor (props) {
    super(props);
    this.state = {
      newsletterOptIn: VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN),
      notificationsSavedStatus: "",
    };

    this.updateNewsletterOptIn = this.updateNewsletterOptIn.bind(this);
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.timer = null;
  }

  onVoterStoreChange () {
    if (VoterStore.isVoterFound()) {
      this.setState({
        voter: VoterStore.getVoter(),
        newsletterOptIn: VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN),
      });
    } else {
      this.setState({ voter: VoterStore.getVoter() });
    }
  }

  updateNewsletterOptIn (event) {
    if (event.target.name === "newsletterOptIn") {
      if (event.target.checked) {
        VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
        this.setState({ newsletterOptIn: true });
      } else {
        VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_ZERO, VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
        this.setState({ newsletterOptIn: false });
      }

      this.setState({ notificationsSavedStatus: "Saved" });
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <Helmet title="Notifications - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card">
          <div className="card-main">
            {this.state.voter.is_signed_in ? (
              <div>
                <span className="h3">Notification Settings</span>
                <br />
                <label htmlFor="newsletterOptIn">
                  <input
                    id="newsletterOptIn"
                    type="checkbox"
                    name="newsletterOptIn"
                    onChange={this.updateNewsletterOptIn}
                    checked={this.state.newsletterOptIn}
                  />
                  { " " }
                  I would like to receive the We Vote newsletter
                </label>
                <span className="pull-right u-gray-mid">{this.state.notificationsSavedStatus}</span>
              </div>
            ) :
              <div><Link to="/settings/account">Please Sign In</Link></div>
          }
          </div>
        </div>
      </div>
    );
  }
}
