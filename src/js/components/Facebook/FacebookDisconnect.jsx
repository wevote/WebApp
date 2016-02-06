import React from 'react';
import FacebookActionCreators from '../../actions/FacebookActionCreators';

class FacebookDisconnect extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <span>
                <a className="btn btn-block btn-social btn-lg btn-facebook" onClick={this.didClickFacebookLogoutButton}>
                    <i className="fa fa-facebook"></i>Disconnect from Facebook
                </a>
            </span>
        );
    }

    didClickFacebookLogoutButton(e) {
        FacebookActionCreators.logout()
    }
}

export default FacebookDisconnect;
