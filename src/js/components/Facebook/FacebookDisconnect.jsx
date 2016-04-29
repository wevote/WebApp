import React from "react";
import FacebookActions from "../../actions/FacebookActions";

class FacebookDisconnect extends React.Component {
    constructor (props) {
        super(props);
    }

    didClickDisconnectFromFacebookButton (e) {
        console.log("didClickDisconnectFromFacebookButton");
        FacebookActions.disconnectFromFacebook();
    }

    render () {
        return <span>
                <a className="btn btn-social btn-lg btn-facebook" onClick={this.didClickDisconnectFromFacebookButton}>
                    <i className="fa fa-facebook"></i>Disconnect from Facebook
                </a>
            </span>;
    }
}

export default FacebookDisconnect;
