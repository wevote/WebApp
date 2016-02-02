import React from 'react';
import FacebookActionCreators from '../../actions/FacebookActionCreators';

class FacebookDisconnect extends React.Component {
    constructor(props) {
        super(props);
    }
    // TODO ROB: Please install stylesheets from: https://lipis.github.io/bootstrap-social/
    render() {
        return (
            <span>
                <a className="btn btn-block btn-social btn-facebook" onClick={this.didClickFacebookLogoutButton}>
                    <span className="fa fa-facebook"></span>Disconnect from Facebook
                </a>
            </span>
        );
    }

    didClickFacebookLogoutButton(e) {
        FacebookActionCreators.logout()
    }
}

export default FacebookDisconnect;
