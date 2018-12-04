import React from "react";
import FacebookStore from "../../stores/FacebookStore";
import FacebookDownloadPicture from "./FacebookDownloadPicture";
import FacebookPicture from "./FacebookPicture";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

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
      facebookPictureUrl: VoterStore.getFacebookPhoto(),
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onChange.bind(this));
    this.voterListener = VoterStore.addListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterListener.remove();
  }

  _onChange () {
    this.setState(this.getFacebookState());
  }

  render () {
    renderLog(__filename);
    return (
      <div>
        {this.state.userId ?
          <FacebookDownloadPicture userId={this.state.userId} /> :
          <div />
        }
        <FacebookPicture
          facebookPictureStatus={this.state.facebookPictureStatus}
          facebookPictureUrl={this.state.facebookPictureUrl}
        />
      </div>
    );
  }
}

export default Main;
