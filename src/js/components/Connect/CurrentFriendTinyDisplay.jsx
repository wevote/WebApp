import React, { Component } from "react";
import PropTypes from "prop-types";
import ImageHandler from "../ImageHandler";
import { renderLog } from "../../utils/logging";

// CurrentFriendTinyDisplay is used by ItemTinyOpinionsToFollow for viewing the logos/icons for voter guides
//  you can follow on the Ballot page
export default class CurrentFriendTinyDisplay extends Component {
  static propTypes = {
    showPlaceholderImage: PropTypes.bool,
    voter_photo_url_tiny: PropTypes.string,
    voter_display_name: PropTypes.string,
    facebook_user_profile_url_https: PropTypes.string,
    facebook_user_name: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    // TODO DALE NOTE: We need to generate a popover here
    let displayName;
    if (this.props.voter_display_name) {
      displayName = this.props.voter_display_name;
    } else if (this.props.facebook_user_name) {
      displayName = this.props.facebook_user_name;
    } else {
      displayName = "";
    }

    let imageUrlTiny;
    if (this.props.voter_photo_url_tiny) {
      imageUrlTiny = this.props.voter_photo_url_tiny;
    } else if (this.props.facebook_user_profile_url_https) {
      imageUrlTiny = this.props.facebook_user_profile_url_https;
    } else {
      imageUrlTiny = "";
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
