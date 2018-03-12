import React, { Component } from "react";
import { Link } from "react-router";
import AnalyticsActions from "../../actions/AnalyticsActions";
import LoadingWheel from "../../components/LoadingWheel";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";

const delay_before_api_update_call = 1200;
const delay_before_removing_saved_status = 4000;

export default class SettingsWidgetFirstLastName extends Component {

  constructor (props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      initial_name_loaded: false,
      name_saved_status: "",
      show_twitter_disconnect: false,
      notifications_saved_status: ""
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateVoterName = this.updateVoterName.bind(this);
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("SettingsProfile componentDidMount");
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
  }

  componentWillUnmount () {
    // console.log("SettingsProfile ---- UN mount");
    this.voterStoreListener.remove();
    this.timer = null;
    this.clear_status_timer = null;
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
      this.setState({voter: VoterStore.getVoter()});
    }
  }

  handleKeyPress () {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      VoterActions.voterNameSave(this.state.first_name, this.state.last_name);
      this.setState({name_saved_status: "Saved"});
    }, delay_before_api_update_call);
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
    // After some time, clear saved message
    clearTimeout(this.clear_status_timer);
    this.clear_status_timer = setTimeout(() => {
      this.setState({name_saved_status: ""});
    }, delay_before_removing_saved_status);
  }

  render () {
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return <div className="">
      {this.state.voter.is_signed_in ?
        <div>
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
        </div> :
        <div><Link to="/settings/account">Please Sign In</Link></div>
      }
    </div>;
  }
}
