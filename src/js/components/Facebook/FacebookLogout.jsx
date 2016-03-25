import React from "react";
import FacebookActionCreators from "../../actions/FacebookActionCreators";

class FacebookLogout extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        return <button ref="logoutButton" onClick={this.didClickFacebookLogoutButton}>Sign Out of Facebook</button>;
    }

    didClickFacebookLogoutButton (e) {
        FacebookActionCreators.logout();
    }
}

export default FacebookLogout;
