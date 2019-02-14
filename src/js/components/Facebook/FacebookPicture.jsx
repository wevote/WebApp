import React from 'react';
import PropTypes from 'prop-types';

import FacebookConstants from '../../constants/FacebookConstants';
import { renderLog } from '../../utils/logging';

export default class FacebookPicture extends React.Component {
  static propTypes = {
    facebookPictureStatus: PropTypes.string,
    facebookPictureUrl: PropTypes.string,
  };

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
    renderLog(__filename);
    return (
      <div>
        {this.facebookStatus}
        {this.facebookPicture}
      </div>
    );
  }
}
