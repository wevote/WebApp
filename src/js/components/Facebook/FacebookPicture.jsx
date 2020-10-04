import React from 'react';
import PropTypes from 'prop-types';

import FacebookConstants from '../../constants/FacebookConstants';
import { renderLog } from '../../utils/logging';

export default class FacebookPicture extends React.Component {
  get facebookStatus () {
    let msg;

    if (this.props.facebookPictureStatus === FacebookConstants.FACEBOOK_GETTING_PICTURE) {
      msg = 'Downloading picture...';
    }

    if (this.props.facebookPictureStatus === FacebookConstants.FACEBOOK_RECEIVED_PICTURE) {
      msg = 'Received picture!';
    }

    return <h3 className="h3">{msg}</h3>;
  }

  get facebookPicture () {
    if (this.props.facebookPictureUrl) {
      return <img src={this.props.facebookPictureUrl} />;
    }

    return <span />;
  }

  render () {
    renderLog('FacebookPicture');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        {this.facebookStatus}
        {this.facebookPicture}
      </div>
    );
  }
}
FacebookPicture.propTypes = {
  facebookPictureStatus: PropTypes.string,
  facebookPictureUrl: PropTypes.string,
};
