import React, { Component } from "react";
import Helmet from "react-helmet";
import BrowserPushMessage from "../Widgets/BrowserPushMessage";
import LoadingWheel from "../LoadingWheel";
import { renderLog } from "../../utils/logging";
import SettingsWidgetAccountType from "./SettingsWidgetAccountType";
import SettingsWidgetFirstLastName from "./SettingsWidgetFirstLastName";
import SettingsWidgetOrganizationDescription from "./SettingsWidgetOrganizationDescription";
import SettingsWidgetOrganizationWebsite from "./SettingsWidgetOrganizationWebsite";
import VoterStore from "../../stores/VoterStore";


export default class VoterGuideSettingsGeneral extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("VoterGuideSettingsGeneral componentDidMount");
    // Get Voter
    const voter = VoterStore.getVoter();
    if (voter && voter.we_vote_id) {
      this.setState({ voter });
    }

    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // AnalyticsActions.saveActionAccountPage(VoterStore.electionId());
  }

  componentWillReceiveProps () {
    // console.log("VoterGuideSettingsGeneral componentWillReceiveProps");
    // Get Voter
    const voter = VoterStore.getVoter();
    if (voter && voter.we_vote_id) {
      this.setState({ voter });
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <Helmet title="Voter Guide Settings - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card">
          <div className="card-main">
            <h3 className="h3">Voter Guide Settings</h3>
            <SettingsWidgetFirstLastName hideFirstLastName />
            <SettingsWidgetOrganizationWebsite />
            <SettingsWidgetOrganizationDescription />
            <SettingsWidgetAccountType
              closeEditFormOnChoice
              showEditToggleOption
            />
          </div>
        </div>
      </div>
    );
  }
}
