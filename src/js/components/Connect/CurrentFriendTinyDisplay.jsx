import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';

const ImageHandler = React.lazy(() => import(/* webpackChunkName: 'ImageHandler' */ '../ImageHandler'));

export default class CurrentFriendTinyDisplay extends Component {
  render () {
    renderLog('CurrentFriendTinyDisplay');  // Set LOG_RENDER_EVENTS to log all renders
    // TODO DALE NOTE: We need to generate a popover here
    let displayName;
    if (this.props.voter_display_name) {
      displayName = this.props.voter_display_name;
    } else if (this.props.facebook_user_name) {
      displayName = this.props.facebook_user_name;
    } else {
      displayName = '';
    }

    let imageUrlTiny;
    if (this.props.voter_photo_url_tiny) {
      imageUrlTiny = this.props.voter_photo_url_tiny;
    } else if (this.props.facebook_user_profile_url_https) {
      imageUrlTiny = this.props.facebook_user_profile_url_https;
    } else {
      imageUrlTiny = '';
    }
    const hidePlaceholder = !this.props.showPlaceholderImage;
    return (
      <span>
        <ImageHandler
          className=""
          sizeClassName="current-friend-image-tiny"
          hidePlaceholder={hidePlaceholder}
          imageUrl={imageUrlTiny}
          alt={displayName}
        />
      </span>
    );
  }
}
CurrentFriendTinyDisplay.propTypes = {
  showPlaceholderImage: PropTypes.bool,
  voter_photo_url_tiny: PropTypes.string,
  voter_display_name: PropTypes.string,
  facebook_user_profile_url_https: PropTypes.string,
  facebook_user_name: PropTypes.string,
};
