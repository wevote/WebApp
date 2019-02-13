import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import ElectionStore from "../../stores/ElectionStore";
import { renderLog } from "../../utils/logging";


// DALE 2019-02-12 I would like to get rid of this page. (We can add the list of voter guide settings to the "Settings" page.)
export default class VoterGuideSettingsSideBar extends Component {
  static propTypes = {
    editMode: PropTypes.string,
    voterGuide: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    // console.log("VoterGuideSettingsSideBar componentDidMount");
    this.setState({
      editMode: this.props.editMode,
    });
    if (this.props.voterGuide && this.props.voterGuide.we_vote_id) {
      this.setState({
        voterGuide: this.props.voterGuide,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("VoterGuideSettingsSideBar componentWillReceiveProps");
    this.setState({
      editMode: nextProps.editMode,
    });
    if (nextProps.voterGuide) {
      this.setState({
        voterGuide: nextProps.voterGuide,
      });
    }
  }

  render () {
    renderLog(__filename);
    if (!this.state.voterGuide) {
      return null;
    }
    let electionName;
    let electionDayText;
    // console.log("***VoterGuideSettingsSideBar this.state.voterGuide:", this.state.voterGuide);
    if (this.state.voterGuide && this.state.voterGuide.google_civic_election_id) {
      electionName = ElectionStore.getElectionName(this.state.voterGuide.google_civic_election_id);
      electionDayText = ElectionStore.getElectionDayText(this.state.voterGuide.google_civic_election_id);
    }
    return (
      <div className="container-fluid card">
        <div className="SettingsItem__summary__election-title">{electionName}</div>
        <div className="SettingsItem__summary__election-date">{electionDayText}</div>

        <div className="SettingsItem__summary__item-container ">
          <div>
            <Link to={`/voterguide/${this.state.voterGuide.organization_we_vote_id}/ballot/election/${this.state.voterGuide.google_civic_election_id}/positions`} className="SettingsItem__summary__item">
              <span className="SettingsItem__summary__item__display-name">
              Jump to this Voter Guide
              </span>
            </Link>
          </div>
        </div>

        <div className={this.state.editMode === "general" ?
          "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
          "SettingsItem__summary__item-container "}
        >
          <div>
            <Link to={`/vg/${this.state.voterGuide.we_vote_id}/settings/general`} className="SettingsItem__summary__item">
              <span className={this.state.editMode === "general" ?
                "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                "SettingsItem__summary__item__display-name"}
              >
              Voter Guide Settings
              </span>
            </Link>
          </div>
        </div>
        <div className={this.state.editMode === "positions" ?
          "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
          "SettingsItem__summary__item-container"}
        >
          <div>
            <Link to={`/vg/${this.state.voterGuide.we_vote_id}/settings/positions`} className="SettingsItem__summary__item">
              <span className={this.state.editMode === "positions" ?
                "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                "SettingsItem__summary__item__display-name"}
              >
              Your Positions
              </span>
            </Link>
          </div>
        </div>
        {/*
      <div className={this.state.editMode === "notifications" ?
           "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
           "SettingsItem__summary__item-container"} >
        <div>
          <Link to="/settings/notifications" className="SettingsItem__summary__item" >
            <span className={this.state.editMode === "notifications" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}>
              Measures</span>
          </Link>
        </div>
      </div>

      <div className={this.state.editMode === "notifications" ?
           "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
           "SettingsItem__summary__item-container"} >
        <div>
          <Link to="/settings/notifications" className="SettingsItem__summary__item" >
            <span className={this.state.editMode === "notifications" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}>
              Partner Organizations</span>
          </Link>
        </div>
      </div>

      <div className={this.state.editMode === "notifications" ?
           "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
           "SettingsItem__summary__item-container"} >
        <div>
          <Link to="/settings/notifications" className="SettingsItem__summary__item" >
            <span className={this.state.editMode === "notifications" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}>
              Issues</span>
          </Link>
        </div>
      </div>

      <div className={this.state.editMode === "notifications" ?
           "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
           "SettingsItem__summary__item-container"} >
        <div>
          <Link to="/settings/notifications" className="SettingsItem__summary__item" >
            <span className={this.state.editMode === "notifications" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}>
              Activity Reports</span>
          </Link>
        </div>
      </div>
      */}
      </div>
    );
  }
}
