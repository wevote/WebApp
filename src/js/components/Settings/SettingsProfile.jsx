import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import SettingsWidgetAccountType from './SettingsWidgetAccountType';
import SettingsWidgetFirstLastName from './SettingsWidgetFirstLastName';
import SettingsWidgetOrganizationDescription from './SettingsWidgetOrganizationDescription';
import SettingsWidgetOrganizationWebsite from './SettingsWidgetOrganizationWebsite';
import VoterStore from '../../stores/VoterStore';


export default class SettingsProfile extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange = () => {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <Helmet title="General Settings - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card u-padding-bottom--lg">
          <div className="card-main">
            <h1 className="h3">General Settings</h1>
            <div>
              <SettingsWidgetFirstLastName />
              <SettingsWidgetOrganizationWebsite />
              <SettingsWidgetOrganizationDescription />
              <SettingsWidgetAccountType
                closeEditFormOnChoice
                showEditToggleOption
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
