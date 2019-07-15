import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { renderLog } from '../../utils/logging';

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
      isOrganization: false,
      isSignedIn: false,
    };
  }

  componentDidMount () {
    if (this.props.organizationType) {
      this.setState({ isOrganization: this.isOrganization(this.props.organizationType) });
    }
    const { isSignedIn } = this.props;
    this.setState({
      isSignedIn,
    });
  }

  componentWillReceiveProps (nextProps) {
    const { isSignedIn } = nextProps;
    this.setState({
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
    const { isSignedIn, isOrganization } = this.state;
    const showSettingsInDevelopment = true; // If developing any of the new settings, change this to true

    return (
      <div className="card">
        <div className="card-main">
          <div className="SettingsItem__summary__title">Your Settings</div>

          {isSignedIn && (
            <div className={editMode === 'profile' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/profile" className="SettingsItem__summary__item">
                  <span className={editMode === 'profile' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  General
                  </span>
                </Link>
              </div>
            </div>
          )}

          <div className={editMode === 'account' ?
            'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
            'SettingsItem__summary__item-container'}
          >
            <div>
              <Link to="/settings/account" className="SettingsItem__summary__item">
                <span className={editMode === 'account' ?
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

          {isSignedIn && (
            <div className={editMode === 'notifications' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container'}
            >
              <div>
                <Link to="/settings/notifications" className="SettingsItem__summary__item">
                  <span className={editMode === 'notifications' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Notifications
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && showSettingsInDevelopment && (
            <div className={editMode === 'domain' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/domain" className="SettingsItem__summary__item">
                  <span className={editMode === 'domain' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Domain
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && showSettingsInDevelopment && (
            <div className={editMode === 'sharing' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/sharing" className="SettingsItem__summary__item">
                  <span className={editMode === 'sharing' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Sharing
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && showSettingsInDevelopment && (
            <div className={editMode === 'subscription' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/subscription" className="SettingsItem__summary__item">
                  <span className={editMode === 'subscription' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Subscription Plan
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && showSettingsInDevelopment && (
            <div className={editMode === 'analytics' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/analytics" className="SettingsItem__summary__item">
                  <span className={editMode === 'analytics' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Analytics
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && isOrganization && (
            <div className={editMode === 'issues' || editMode === 'issues_to_link' || editMode === 'issues_linked' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/issues" className="SettingsItem__summary__item">
                  <span className={editMode === 'issues' || editMode === 'issues_to_link' || editMode === 'issues_linked' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                    Organizational Values
                  </span>
                </Link>
              </div>
            </div>
          )}

          {isSignedIn && showSettingsInDevelopment && (
            <div className={editMode === 'promoted' ?
              'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
              'SettingsItem__summary__item-container '}
            >
              <div>
                <Link to="/settings/promoted" className="SettingsItem__summary__item">
                  <span className={editMode === 'promoted' ?
                    'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                    'SettingsItem__summary__item__display-name'}
                  >
                  Promoted Organizations
                  </span>
                </Link>
              </div>
            </div>
          )}

          <div className={editMode === 'tools' ?
            'SettingsItem__summary__item-container SettingsItem__summary__item-container--selected' :
            'SettingsItem__summary__item-container '}
          >
            <div>
              <Link to="/settings/tools" className="SettingsItem__summary__item">
                <span className={editMode === 'tools' ?
                  'SettingsItem__summary__item__display-name SettingsItem__summary__item__display-name--selected' :
                  'SettingsItem__summary__item__display-name'}
                >
                Tools for Your Website
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
