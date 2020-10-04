import React from 'react';
import FacebookStore from '../../stores/FacebookStore';
import FacebookDownloadPicture from './FacebookDownloadPicture';
import FacebookPicture from './FacebookPicture';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.getFacebookState();
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onChange.bind(this));
    this.voterListener = VoterStore.addListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterListener.remove();
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

  _onChange () {
    this.setState(this.getFacebookState());
  }

  //  userId={this.state.userId} not used in FacebookDownloadPicture component
  render () {
    renderLog('Main');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        {this.state.userId ?
          <FacebookDownloadPicture /> :
          <div />}
        <FacebookPicture
          facebookPictureStatus={this.state.facebookPictureStatus}
          facebookPictureUrl={this.state.facebookPictureUrl}
        />
      </div>
    );
  }
}

export default Main;
