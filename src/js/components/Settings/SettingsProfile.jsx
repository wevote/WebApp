import React, { Component } from "react";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import LoadingWheel from "../../components/LoadingWheel";
import SettingsWidgetAccountType from "../../components/Settings/SettingsWidgetAccountType";
import SettingsWidgetFirstLastName from "../../components/Settings/SettingsWidgetFirstLastName";
import SettingsWidgetOrganizationDescription from "../../components/Settings/SettingsWidgetOrganizationDescription";
import SettingsWidgetOrganizationWebsite from "../../components/Settings/SettingsWidgetOrganizationWebsite";
import VoterStore from "../../stores/VoterStore";


export default class SettingsProfile extends Component {

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({voter: VoterStore.getVoter()});
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
          <h1 className="h3">Your Profile</h1>
          <div>
            <SettingsWidgetFirstLastName />
            <SettingsWidgetOrganizationWebsite />
            <SettingsWidgetOrganizationDescription />
            <SettingsWidgetAccountType closeEditFormOnChoice
                                       showEditToggleOption />
          </div>
        </div>
      </div>
    </div>;
  }
}
