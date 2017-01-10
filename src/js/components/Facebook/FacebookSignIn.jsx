import React from "react";
import FacebookActions from "../../actions/FacebookActions";

class FacebookSignIn extends React.Component {
  constructor (props) {
    super(props);
  }

  didClickFacebookSignInButton () {
    FacebookActions.login();
  }

  onKeyDown (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      this.didClickFacebookSignInButton();
    }
  }

  render () {
    return <a tabIndex="0" onKeyDown={this.onKeyDown.bind(this)}
              className="btn btn-social btn-lg btn-facebook"
              onClick={this.didClickFacebookSignInButton}>
      <i className="fa fa-facebook" />Sign in with Facebook
    </a>;
  }
}

export default FacebookSignIn;
