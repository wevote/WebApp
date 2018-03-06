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
      <div className="SettingsItem__summary__title" >Voter Guide Settings</div>

      <div className={this.props.editMode === "profile" ?
           "SettingsItem__summary__item-container SettingsItem__summary__item-container--selected" :
           "SettingsItem__summary__item-container "} >
        <div>
          <Link to="/settings/profile" className="SettingsItem__summary__item" >
            <span className={this.props.editMode === "profile" ?
                  "SettingsItem__summary__display-name SettingsItem__summary__display-name--selected" :
                  "SettingsItem__summary__display-name"}>
              General Settings</span>
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
              Candidates</span>
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
              Measures</span>
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
              Partner Organizations</span>
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
              Issues</span>
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
              Activity Reports</span>
          </Link>
        </div>
      </div>

    </div>;
  }
}
