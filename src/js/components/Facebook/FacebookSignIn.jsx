import React from "react";
import FacebookActionCreators from "../../actions/FacebookActionCreators";

class FacebookSignIn extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return <a className="btn btn-social btn-lg btn-facebook" onClick={this.didClickFacebookLoginButton}>
      <i className="fa fa-facebook"></i>Sign in with Facebook
    </a>;
  }

  didClickFacebookLoginButton () {
    FacebookActionCreators.login();
  }
}

export default FacebookSignIn;
