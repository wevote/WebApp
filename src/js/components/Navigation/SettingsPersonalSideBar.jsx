import React, { PropTypes, Component } from "react";
import { Link } from "react-router";


export default class SettingsPersonalSideBar extends Component {
  static propTypes = {
    editMode: PropTypes.string,
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
    return <div className="container-fluid card">
      <div className="SettingsItem__summary__title" >Personal Settings</div>

      <div className={this.props.editMode === "profile" ?
           "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
           "SettingsItem__summary__item-container "} >
        <div>
          <Link to="/settings/profile" className="SettingsItem__summary__item" >
            <span className={this.props.editMode === "profile" ?
                  "SettingsItem__summary__display-name SettingsItem__summary__display-name--selected" :
                  "SettingsItem__summary__display-name"}>
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
                  "SettingsItem__summary__display-name SettingsItem__summary__display-name--selected" :
                  "SettingsItem__summary__display-name"}>
              Your Account</span>
          </Link>
        </div>
      </div>

      <div className={this.props.editMode === "address" ?
           "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
           "SettingsItem__summary__item-container "} >
        <div>
          <Link to="/settings/address" className="SettingsItem__summary__item" >
            <span className={this.props.editMode === "address" ?
                  "SettingsItem__summary__display-name SettingsItem__summary__display-name--selected" :
                  "SettingsItem__summary__display-name"}>
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
                  "SettingsItem__summary__display-name SettingsItem__summary__display-name--selected" :
                  "SettingsItem__summary__display-name"}>
              Change Election</span>
          </Link>
        </div>
      </div>

      <div className={this.props.editMode === "notifications" ?
           "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
           "SettingsItem__summary__item-container"} >
        <div>
          <Link to="/settings/notifications" className="SettingsItem__summary__item" >
            <span className={this.props.editMode === "notifications" ?
                  "SettingsItem__summary__display-name SettingsItem__summary__display-name--selected" :
                  "SettingsItem__summary__display-name"}>
              Notifications</span>
          </Link>
        </div>
      </div>

      <h4 className="text-left" />
      <span className="terms-and-privacy">
        <Link to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link to="/more/privacy">Privacy Policy</Link>
      </span>
    </div>;
  }
}
