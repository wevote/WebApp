import React, { Component, PropTypes } from "react";
import SettingsAccount from "../../components/Settings/SettingsAccount";
import SettingsNotifications from "../../components/Settings/SettingsNotifications";
import SettingsProfile from "../../components/Settings/SettingsProfile";
import VoterGuideSettingsSideBar from "../../components/Navigation/VoterGuideSettingsSideBar";

export default class SettingsVoterGuideDashboard extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      editMode: "",
      voterGuideWeVoteId: "",
    };
  }

  componentDidMount () {
    if (this.props.params.edit_mode) {
      this.setState({ editMode: this.props.params.edit_mode });
    } else {
      this.setState({ editMode: "profile" });
    }
    if (this.props.params.voter_guide_we_vote_id) {
      this.setState({ voterGuideWeVoteId: this.props.params.voter_guide_we_vote_id });
    }
    this.setState({ pathname: this.props.location.pathname });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.edit_mode) {
      this.setState({ editMode: nextProps.params.edit_mode });
    }
    if (nextProps.params.voter_guide_we_vote_id) {
      this.setState({ voterGuideWeVoteId: nextProps.params.voter_guide_we_vote_id });
    }
  }

  render () {
    let settingsComponentToDisplay = null;
    switch (this.state.editMode) {
      default:
      case "profile":
        settingsComponentToDisplay = <SettingsProfile />;
        break;
      case "notifications":
        settingsComponentToDisplay = <SettingsNotifications />;
        break;
      case "account":
        settingsComponentToDisplay = <SettingsAccount />;
        break;
    }

    return <div className="settings-dashboard">
      <div className="page-content-container">
        <div className="container-fluid">
          <div className="row ballot__body">

            <div className="col-md-3 hidden-xs sidebar-menu">
              <VoterGuideSettingsSideBar editMode={this.state.editMode} />
            </div>

            <div className="col-xs-12 col-md-9">
              {settingsComponentToDisplay}
            </div>

          </div>
        </div>
      </div>
    </div>;
  }
}
