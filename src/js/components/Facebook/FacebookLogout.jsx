import React from 'react';
import { renderLog } from '../../utils/logging';
import FacebookActions from '../../actions/FacebookActions';

class FacebookLogout extends React.Component {
  didClickFacebookLogoutButton () {
    FacebookActions.logout();
  }

  render () {
    renderLog('FacebookLogout');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <button
        ref="logoutButton" // eslint-disable-line
        onClick={this.didClickFacebookLogoutButton}
        type="button"
      >
        Sign Out of Facebook
      </button>
    );
  }
}

export default FacebookLogout;
