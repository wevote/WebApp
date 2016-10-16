import React from "react";
import FacebookActions from "../../actions/FacebookActions";

class FacebookSignIn extends React.Component {
  constructor (props) {
    super(props);
  }

  didClickFacebookSignInButton () {
    FacebookActions.login();
  }

  render () {
    return <a className="btn btn-social btn-lg btn-facebook" onClick={this.didClickFacebookSignInButton}>
      <i className="fa fa-facebook"></i>Sign in with Facebook
    </a>;
  }
}

export default FacebookSignIn;
