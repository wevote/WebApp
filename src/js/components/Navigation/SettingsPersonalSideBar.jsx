import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../../utils/logging";

// https://stackoverflow.com/questions/32647215/declaring-static-constants-in-es6-classes
const CORPORATION = "C";
const GROUP = "G";
const NONPROFIT = "NP";
const NONPROFIT_501C3 = "C3";
const NONPROFIT_501C4 = "C4";
const NEWS_ORGANIZATION = "NW";
const POLITICAL_ACTION_COMMITTEE = "P";
const PUBLIC_FIGURE = "PF";
export default class SettingsPersonalSideBar extends Component {
  static propTypes = {
    editMode: PropTypes.string,
    isSignedIn: PropTypes.bool,
    onOwnPage: PropTypes.bool,
    organizationType: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      isOrganization: false,
    };
  }

  componentDidMount () {
    if (this.props.organizationType) {
      const isOrganization = this.props.organizationType === NONPROFIT_501C3 || this.props.organizationType === NONPROFIT_501C4 ||
                           this.props.organizationType === POLITICAL_ACTION_COMMITTEE || this.props.organizationType === NONPROFIT ||
                           this.props.organizationType === GROUP || this.props.organizationType === PUBLIC_FIGURE ||
                           this.props.organizationType === NEWS_ORGANIZATION || this.props.organizationType === CORPORATION;

      this.setState({ isOrganization });
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.organizationType !== this.props.organizationType) {
      const isOrganization = this.props.organizationType === NONPROFIT_501C3 || this.props.organizationType === NONPROFIT_501C4 ||
                           this.props.organizationType === POLITICAL_ACTION_COMMITTEE || this.props.organizationType === NONPROFIT ||
                           this.props.organizationType === GROUP || this.props.organizationType === PUBLIC_FIGURE ||
                           this.props.organizationType === NEWS_ORGANIZATION || this.props.organizationType === CORPORATION;

      this.setState({ isOrganization });
    }
  }

  render () {
    renderLog(__filename);
    // console.log("SettingsPersonalSideBar, isOrganization: ", this.state.isOrganization);

    return (
      <div className="card">
        <div className="card-main">
          <div className="SettingsItem__summary__title">Your Settings</div>

          <div className={this.props.editMode === "profile" ?
            "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
            "SettingsItem__summary__item-container "}
          >
            <div>
              <Link to="/settings/profile" className="SettingsItem__summary__item">
                <span className={this.props.editMode === "profile" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}
                >
                Your Profile
                </span>
              </Link>
            </div>
          </div>

          <div className={this.props.editMode === "account" ?
            "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
            "SettingsItem__summary__item-container"}
          >
            <div>
              <Link to="/settings/account" className="SettingsItem__summary__item">
                <span className={this.props.editMode === "account" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}
                >
                  {this.props.isSignedIn ?
                    <span>Your Account</span> :
                    <span>Sign In</span> }
                </span>
              </Link>
            </div>
          </div>

          <div className={this.props.editMode === "address" ?
            "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
            "SettingsItem__summary__item-container "}
          >
            <div>
              <Link to="/settings/address" className="SettingsItem__summary__item">
                <span className={this.props.editMode === "address" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}
                >
                Your Address
                </span>
              </Link>
            </div>
          </div>

          <div className={this.props.editMode === "election" ?
            "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
            "SettingsItem__summary__item-container "}
          >
            <div>
              <Link to="/settings/election" className="SettingsItem__summary__item">
                <span className={this.props.editMode === "election" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}
                >
                Change Election
                </span>
              </Link>
            </div>
          </div>

          {this.state.isOrganization && (
          <div className={this.props.editMode === "issues" || this.props.editMode === "issues_to_link" || this.props.editMode === "issues_linked" ?
            "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
            "SettingsItem__summary__item-container "}
          >
            <div>
              <Link to="/settings/issues" className="SettingsItem__summary__item">
                <span className={this.props.editMode === "issues" || this.props.editMode === "issues_to_link" || this.props.editMode === "issues_linked" ?
                  "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                  "SettingsItem__summary__item__display-name"}
                >
                  Organizational Values
                </span>
              </Link>
            </div>
          </div>
          )}

          {this.props.isSignedIn ? (
            <div className={this.props.editMode === "notifications" ?
              "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
              "SettingsItem__summary__item-container"}
            >
              <div>
                <Link to="/settings/notifications" className="SettingsItem__summary__item">
                  <span className={this.props.editMode === "notifications" ?
                    "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                    "SettingsItem__summary__item__display-name"}
                  >
                  Notification Settings
                  </span>
                </Link>
              </div>
            </div>
          ) : null
          }
        </div>
      </div>
    );
  }
}
