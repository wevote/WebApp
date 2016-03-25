import React from "react";
import FacebookActionCreators from "../../actions/FacebookActionCreators";

class FacebookLogin extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        return <button ref="loginButton" onClick={this.didClickFacebookLoginButton}>Sign Into Facebook</button>;
    }

    didClickFacebookLoginButton (e) {
        FacebookActionCreators.login();
    }
}

export default FacebookLogin;
