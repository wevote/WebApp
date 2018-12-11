import React from "react";
import { renderLog } from "../../utils/logging";
import FacebookActions from "../../actions/FacebookActions";

class FacebookSignIn extends React.Component {

  didClickFacebookSignInButton () {
    FacebookActions.login();
  }

  onKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickFacebookSignInButton();
    }
  }

  render () {
    renderLog(__filename);
    return (
      <a
        onKeyDown={this.onKeyDown.bind(this)}
        className="btn btn-social btn-lg btn-facebook"
        onClick={this.didClickFacebookSignInButton}
      >
        <i className="fa fa-facebook" />
        Sign In
      </a>
    );
  }
}

export default FacebookSignIn;
