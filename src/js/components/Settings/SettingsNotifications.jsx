import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import SettingsAccount from './SettingsAccount';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import VoterStore from '../../stores/VoterStore';


export default class SettingsNotifications extends Component {
  constructor (props) {
    super(props);
    this.state = {
      newsletterOptIn: VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN),
      notificationsSavedStatus: '',
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
        newsletterOptIn: VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN),
      });
    }
    const voter = VoterStore.getVoter();
    const voterIsSignedIn = voter.is_signed_in;
    this.setState({
      voter,
      voterIsSignedIn,
    });
  }

  updateNewsletterOptIn (event) {
    if (event.target.name === 'newsletterOptIn') {
      if (event.target.checked) {
        VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
        this.setState({ newsletterOptIn: true });
      } else {
        VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_ZERO, VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
        this.setState({ newsletterOptIn: false });
      }

      this.setState({ notificationsSavedStatus: 'Saved' });
    }
  }

  render () {
    renderLog('SettingsNotifications');  // Set LOG_RENDER_EVENTS to log all renders
    const { newsletterOptIn, notificationsSavedStatus, voter, voterIsSignedIn } = this.state;
    if (!voterIsSignedIn) {
      // console.log('voterIsSignedIn is false');
      return <SettingsAccount />;
    } else if (!voter) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <Helmet title="Notifications - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card">
          <div className="card-main">
            <div>
              <h1 className="h2">Notification Settings</h1>
              <label htmlFor="newsletterOptIn">
                <input
                  id="newsletterOptIn"
                  type="checkbox"
                  name="newsletterOptIn"
                  onChange={this.updateNewsletterOptIn}
                  checked={newsletterOptIn}
                />
                { ' ' }
                I would like to receive the We Vote newsletter
              </label>
              <span className="pull-right u-gray-mid">{notificationsSavedStatus}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
