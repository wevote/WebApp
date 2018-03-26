import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../../utils/logging";


export default class SettingsPersonalSideBar extends Component {
  static propTypes = {
    editMode: PropTypes.string,
    isSignedIn: PropTypes.bool,
    onOwnPage: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
  }

  componentWillUnmount () {
  }

  render () {
    renderLog(__filename);
    return <div className="card">
      <div className="card-main">
        <div className="SettingsItem__summary__title" >Your Settings</div>

        <div className={this.props.editMode === "profile" ?
             "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
             "SettingsItem__summary__item-container "} >
          <div>
            <Link to="/settings/profile" className="SettingsItem__summary__item" >
              <span className={this.props.editMode === "profile" ?
                    "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                    "SettingsItem__summary__item__display-name"}>
                Your Profile</span>
            </Link>
          </div>
        </div>

        <div className={this.props.editMode === "account" ?
             "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
             "SettingsItem__summary__item-container"} >
          <div>
            <Link to="/settings/account" className="SettingsItem__summary__item" >
              <span className={this.props.editMode === "account" ?
                    "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                    "SettingsItem__summary__item__display-name"}>
                {this.props.isSignedIn ?
                  <span>Your Account</span> :
                  <span>Sign In</span> }
                </span>
            </Link>
          </div>
        </div>

        <div className={this.props.editMode === "address" ?
             "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
             "SettingsItem__summary__item-container "} >
          <div>
            <Link to="/settings/address" className="SettingsItem__summary__item" >
              <span className={this.props.editMode === "address" ?
                    "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                    "SettingsItem__summary__item__display-name"}>
                Your Address</span>
            </Link>
          </div>
        </div>

        <div className={this.props.editMode === "election" ?
             "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
             "SettingsItem__summary__item-container "} >
          <div>
            <Link to="/settings/election" className="SettingsItem__summary__item" >
              <span className={this.props.editMode === "election" ?
                    "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                    "SettingsItem__summary__item__display-name"}>
                Change Election</span>
            </Link>
          </div>
        </div>

        {this.props.onOwnPage ?
          <div className={this.props.editMode === "voterguides" ?
               "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
               "SettingsItem__summary__item-container"} >
            <div>
              <Link to="/settings/voterguidesmenu" className="SettingsItem__summary__item" >
                <span className={this.props.editMode === "voterguides" ?
                      "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                      "SettingsItem__summary__item__display-name"}>
                  Your Voter Guides</span>
              </Link>
            </div>
          </div> :
          null }

        {this.props.isSignedIn ?
          <div className={this.props.editMode === "notifications" ?
               "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
               "SettingsItem__summary__item-container"} >
            <div>
              <Link to="/settings/notifications" className="SettingsItem__summary__item" >
                <span className={this.props.editMode === "notifications" ?
                      "SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected" :
                      "SettingsItem__summary__item__display-name"}>
                  Notification Settings</span>
              </Link>
            </div>
          </div> :
          null }
      </div>
    </div>;
  }
}
