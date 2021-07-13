import { Facebook } from '@material-ui/icons';
import React from 'react';
import FacebookActions from '../../actions/FacebookActions';
import { renderLog } from '../../utils/logging';

class FacebookDisconnect extends React.Component {
  didClickDisconnectFromFacebookButton () {
    console.log('didClickDisconnectFromFacebookButton');
    FacebookActions.disconnectFromFacebook();
  }

  render () {
    renderLog('FacebookDisconnect');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <span>
        <a // eslint-disable-line
          className="btn btn-social btn-lg btn-facebook"
          onClick={this.didClickDisconnectFromFacebookButton}
        >
          <Facebook />
          Disconnect from Facebook
        </a>
      </span>
    );
  }
}

export default FacebookDisconnect;
