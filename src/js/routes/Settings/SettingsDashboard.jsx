import React, { Component, PropTypes } from "react";
import SettingsAccount from "../../components/Settings/SettingsAccount";
import SettingsAddress from "../../components/Settings/SettingsAddress";
import SettingsElection from "../../components/Settings/SettingsElection";
import SettingsNotifications from "../../components/Settings/SettingsNotifications";
import SettingsProfile from "../../components/Settings/SettingsProfile";
import SettingsPersonalSideBar from "../../components/Navigation/SettingsPersonalSideBar";
import SettingsVoterGuidesSideBar from "../../components/Navigation/SettingsVoterGuidesSideBar";

export default class SettingsDashboard extends Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      editMode: "",
    };
  }

  componentDidMount () {
    if (this.props.params.edit_mode) {
      this.setState({ editMode: this.props.params.edit_mode });
    } else {
      this.setState({ editMode: "address" });
    }
    this.setState({ pathname: this.props.location.pathname });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.edit_mode) {
      this.setState({ editMode: nextProps.params.edit_mode });
    }
  }

  render () {
    let settingsComponentToDisplay = null;
    switch (this.state.editMode) {
      case "account":
        settingsComponentToDisplay = <SettingsAccount />;
        break;
      case "address":
        settingsComponentToDisplay = <SettingsAddress />;
        break;
      case "election":
        settingsComponentToDisplay = <SettingsElection />;
        break;
      case "notifications":
        settingsComponentToDisplay = <SettingsNotifications />;
        break;
      default:
      case "profile":
        settingsComponentToDisplay = <SettingsProfile />;
        break;
    }

    return <div className="settings-dashboard">
      <div className="page-content-container">
        <div className="container-fluid">
          <div className="row ballot__body">

            <div className="col-md-4 hidden-xs sidebar-menu">
              <SettingsPersonalSideBar editMode={this.state.editMode} />

              <SettingsVoterGuidesSideBar />
            </div>

            <div className="col-xs-12 col-md-8">
              {settingsComponentToDisplay}
            </div>

          </div>
        </div>
      </div>
    </div>;
  }
}
