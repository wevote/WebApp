import React from "react";
import FacebookActions from "../../actions/FacebookActions";

/* THIS VERSION NOT BEING USED -- See FacebookSignIn.jsx */

class FacebookLogin extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return <button ref="loginButton" onClick={this.didClickFacebookLoginButton}>Sign Into Facebook</button>;
  }

  didClickFacebookLoginButton (e) {
    FacebookActions.login();
  }
}

export default FacebookLogin;
