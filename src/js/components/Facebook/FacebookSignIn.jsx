import React from 'react';
import FacebookActionCreators from '../../actions/FacebookActionCreators';
import VoterStore from '../../stores/VoterStore';

const VoterActions = require('../../actions/VoterActions');

class FacebookSignIn extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <a className="btn btn-social btn-lg btn-facebook" onClick={this.didClickFacebookLoginButton}>
                <i className="fa fa-facebook"></i>Sign in with Facebook
            </a>
        );
    }

    didClickFacebookLoginButton(e) {
        console.log("didClickFacebookLoginButton");
        FacebookActionCreators.login();
    }
}

export default FacebookSignIn;
