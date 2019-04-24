import React from 'react';
import { renderLog } from '../../utils/logging';
import FacebookActions from '../../actions/FacebookActions';

class FacebookLogout extends React.Component {
  didClickFacebookLogoutButton () {
    FacebookActions.logout();
  }

  render () {
    renderLog(__filename);
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
