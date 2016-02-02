import React from 'react';
import FacebookActionCreators from '../../actions/FacebookActionCreators';

class FacebookSignIn extends React.Component {
    constructor(props) {
        super(props);
    }
    // TODO ROB: Please install stylesheets from: https://lipis.github.io/bootstrap-social/
    render() {
        return (
            <a className="btn btn-block btn-social btn-facebook" onClick={this.didClickFacebookLoginButton}>
                <span className="fa fa-facebook"></span>Sign in with Facebook
            </a>
        );
    }

    didClickFacebookLoginButton(e) {
        FacebookActionCreators.login()
    }
}

export default FacebookSignIn;
