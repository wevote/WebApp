import React from "react";
import FacebookActions from "../../actions/FacebookActions";

class FacebookSignIn extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return <a className="bs-btn btn-social bs-btn-lg btn-facebook" onClick={this.didClickFacebookSignInButton}>
      <i className="fa fa-facebook"></i>Sign in with Facebook
    </a>;
  }

  didClickFacebookSignInButton () {
    FacebookActions.login();
  }
}

export default FacebookSignIn;
