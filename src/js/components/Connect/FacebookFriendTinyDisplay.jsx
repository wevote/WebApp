import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';

export default class FacebookFriendTinyDisplay extends Component {
  static propTypes = {
    name: PropTypes.string,
    picture: PropTypes.object,
  };

  render () {
    renderLog(__filename);
    let displayName = '';
    let facebookProfileImage = '';
    if (this.props.name) {
      displayName = this.props.name;
    }
    if (this.props.picture.data.url) {
      facebookProfileImage = this.props.picture.data.url;
    }

    return (
      <span>
        <ImageHandler
          imageUrl={facebookProfileImage}
          className=""
          sizeClassName="facebook-friend-image-tiny"
          alt={displayName}
        />
      &nbsp;
      </span>
    );
  }
}
