import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { renderLog } from '../../utils/logging';
import AppStore from '../../stores/AppStore';

// https://stackoverflow.com/questions/32647215/declaring-static-constants-in-es6-classes
const CORPORATION = 'C';
const GROUP = 'G';
const NONPROFIT = 'NP';
const NONPROFIT_501C3 = 'C3';
const NONPROFIT_501C4 = 'C4';
const NEWS_ORGANIZATION = 'NW';
const POLITICAL_ACTION_COMMITTEE = 'P';
const PUBLIC_FIGURE = 'PF';
export default class SettingsPersonalSideBar extends Component {
  static propTypes = {
    editMode: PropTypes.string,
    isSignedIn: PropTypes.bool,
    organizationType: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      isOnPartnerUrl: false,
      isOrganization: false,
      isSignedIn: false,
      voterIsAdminForThisUrl: false,
    };
  }

  componentDidMount () {
    if (this.props.organizationType) {
      this.setState({ isOrganization: this.isOrganization(this.props.organizationType) });
    }
    const { isSignedIn } = this.props;
    this.setState({
      isOnPartnerUrl: AppStore.isOnPartnerUrl(),
      voterIsAdminForThisUrl: AppStore.voterIsAdminForThisUrl(),
      isSignedIn,
    });
  }

  componentWillReceiveProps (nextProps) {
    const { isSignedIn } = nextProps;
    this.setState({
      isOnPartnerUrl: AppStore.isOnPartnerUrl(),
      voterIsAdminForThisUrl: AppStore.voterIsAdminForThisUrl(),
      isSignedIn,
    });
  }

  componentDidUpdate (prevProps) {
    if (prevProps.organizationType !== this.props.organizationType) {
      this.setState({ isOrganization: this.isOrganization(this.props.organizationType) });
    }
  }

  isOrganization (organizationType) {
    return organizationType === NONPROFIT_501C3 || organizationType === NONPROFIT_501C4 ||
        organizationType === POLITICAL_ACTION_COMMITTEE || organizationType === NONPROFIT ||
        organizationType === GROUP || organizationType === PUBLIC_FIGURE ||
        organizationType === NEWS_ORGANIZATION || organizationType === CORPORATION;
  }

  render () {
    renderLog(__filename);
    // console.log("SettingsPersonalSideBar, isOrganization: ", this.state.isOrganization);
    const { editMode } = this.props;
    const { isOnPartnerUrl, isSignedIn, isOrganization, voterIsAdminForThisUrl } = this.state;
    const showSettingsInDevelopment = false; // If developing any of the new settings, change this to true
    const isOnPartnerUrlAndNotAdmin = isOnPartnerUrl && !voterIsAdminForThisUrl;

    return (
      <div className="card">
        <div className="card-main">
          <div className="SettingsItem__summary__title">Your Settings</div>

          {isSignedIn && (
            <div className={String(editMode) === 'profile' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/profile" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'profile' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  General
                  </span>
                </Link>
              </div>
            </div>
          )}

          <div className={String(editMode) === 'account' ?
            'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
            'SettingsItem__summary__item-container'}
          >
            <div>
              <Link to="/settings/account" className="SettingsItem__summary__item">
                <span className={String(editMode) === 'account' ?
                  'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                  'SettingsItem__summary__item__display-name'}
                >
                  {isSignedIn ?
                    <span>Security & Sign In</span> :
                    <span>Sign In</span> }
                </span>
              </Link>
            </div>
          </div>

          {isSignedIn && !isOnPartnerUrl && (
            <div className={String(editMode) === 'notifications' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container'}
            >
              <div>
                <Link to="/settings/notifications" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'notifications' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Notifications
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && !isOnPartnerUrlAndNotAdmin && (
            <div className={String(editMode) === 'domain' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/domain" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'domain' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Domain
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && !isOnPartnerUrlAndNotAdmin && (
            <div className={String(editMode) === 'sharing' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/sharing" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'sharing' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Sharing
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && !isOnPartnerUrlAndNotAdmin && (
            <div className={String(editMode) === 'subscription' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/subscription" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'subscription' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Subscription Plan
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && !isOnPartnerUrlAndNotAdmin && (
            <div className={String(editMode) === 'analytics' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/analytics" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'analytics' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Analytics
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && isOrganization && !isOnPartnerUrlAndNotAdmin && (
            <div className={String(editMode) === 'issues' || String(editMode) === 'issues_to_link' || String(editMode) === 'issues_linked' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/issues" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'issues' || String(editMode) === 'issues_to_link' || String(editMode) === 'issues_linked' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Organizational Values
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && showSettingsInDevelopment && !isOnPartnerUrlAndNotAdmin && (
            <div className={String(editMode) === 'promoted' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/promoted" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'promoted' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Promoted Organizations
                  </span>
                </Link>
              </div>
            </div>
          )}

          { !isOnPartnerUrlAndNotAdmin && (
            <div className={String(editMode) === 'tools' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/tools" className="SettingsItem__summary__item">
                  <span className={String(editMode) === 'tools' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Tools for Your Website
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
