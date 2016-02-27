import React from "react";

import FacebookActionCreators from "../../actions/FacebookActionCreators";
import FacebookStore from "../../stores/FacebookStore";
import FacebookLogin from "../../components/Facebook/FacebookLogin";
import FacebookLogout from "../../components/Facebook/FacebookLogout";
import FacebookDownloadPicture from "../../components/Facebook/FacebookDownloadPicture";
import FacebookPicture from "../../components/Facebook/FacebookPicture";

class Main extends React.Component {
    constructor (props) {
        super();
        this.state = this.getFacebookState();
    }

    getFacebookState () {
        return {
            accessToken: FacebookStore.accessToken,
            loggedIn: FacebookStore.loggedIn,
            userId: FacebookStore.userId,
            facebookPictureStatus: FacebookStore.facebookPictureStatus,
            facebookPictureUrl: FacebookStore.facebookPictureUrl
        };
    }

    componentDidMount () {
        FacebookActionCreators.initFacebook();
        this.changeListener = this._onFacebookChange.bind(this);
        FacebookStore.addChangeListener(this.changeListener);
    }

    componentWillUnmount () {
        FacebookStore.removeChangeListener(this.changeListener)
      }

    _onFacebookChange () {
        this.setState(this.getFacebookState());
    }


    render () {
        return (
            <div>
                {!this.state.loggedIn ? <FacebookLogin /> : null}
                {this.state.loggedIn ? <FacebookLogout /> : null}
                <p>Facebook logged in: {this.state.loggedIn ? "true" : "false"}</p>
                <p>Facebook access token: {this.state.accessToken}</p>
                <p>User ID is: {this.state.userId}</p>
                {this.state.userId ? <FacebookDownloadPicture userId={this.state.userId} /> : null}
                <FacebookPicture
                    facebookPictureStatus={this.state.facebookPictureStatus}
                    facebookPictureUrl={this.state.facebookPictureUrl} />
            </div>

        );
    }
}

export default Main;
