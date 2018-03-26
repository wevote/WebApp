import React from "react";
import { renderLog } from "../../utils/logging";
import FacebookActions from "../../actions/FacebookActions";

class FacebookLogout extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    renderLog(__filename);
    return <button ref="logoutButton" onClick={this.didClickFacebookLogoutButton}>Sign Out of Facebook</button>;
  }

  didClickFacebookLogoutButton () {
    FacebookActions.logout();
  }
}

export default FacebookLogout;
