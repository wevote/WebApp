import React from "react";
import FacebookActionCreators from "../../actions/FacebookActionCreators";
import FacebookStore from "../../stores/FacebookStore";
import FacebookDownloadPicture from "../../components/Facebook/FacebookDownloadPicture";
import FacebookPicture from "../../components/Facebook/FacebookPicture";
import VoterStore from "../../stores/VoterStore";

class Main extends React.Component {
    constructor (props) {
        super(props);
        this.state = this.getFacebookState();
    }

    getFacebookState () {
        return {
            accessToken: FacebookStore.accessToken,
            loggedIn: FacebookStore.loggedIn,
            userId: FacebookStore.userId,
            facebookPictureStatus: FacebookStore.facebookPictureStatus,
            facebookPictureUrl: VoterStore.getPhoto()
        };
    }

    componentDidMount () {
        FacebookActionCreators.initFacebook();
        this.listener = FacebookStore.addListener(this._onChange.bind(this));
        this.voterListener = VoterStore.addListener(this._onChange.bind(this));
    }

    componentWillUnmount () {
      this.listener.remove();
      this.voterListener.remove();
    }

    _onChange () {
        this.setState(this.getFacebookState());
    }

    render () {
        return <div>
                <p>Facebook logged in: {this.state.loggedIn ? "true" : "false"}</p>
                <p>Facebook access token: {this.state.accessToken}</p>
                <p>User ID is: {this.state.userId}</p>
                {this.state.userId ?
                  <FacebookDownloadPicture userId={this.state.userId} /> :
                  <div></div>
                }
                <FacebookPicture
                    facebookPictureStatus={this.state.facebookPictureStatus}
                    facebookPictureUrl={this.state.facebookPictureUrl} />
            </div>;
    }
}

export default Main;
