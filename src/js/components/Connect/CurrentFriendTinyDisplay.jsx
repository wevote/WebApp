import React, { Component } from "react";
import PropTypes from "prop-types";
import ImageHandler from "../../components/ImageHandler";

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
    // TODO DALE NOTE: We need to generate a popover here
    let display_name;
    if (this.props.voter_display_name) {
      display_name = this.props.voter_display_name;
    } else if (this.props.facebook_user_name) {
      display_name = this.props.facebook_user_name;
    } else {
      display_name = "";
    }

    let image_url_tiny;
    if (this.props.voter_photo_url_tiny) {
      image_url_tiny = this.props.voter_photo_url_tiny;
    } else if (this.props.facebook_user_profile_url_https) {
      image_url_tiny = this.props.facebook_user_profile_url_https;
    } else {
      image_url_tiny = "";
    }
    let hide_placeholder = !this.props.showPlaceholderImage;
    return <span>
          <ImageHandler className=""
                        sizeClassName="current-friend-image-tiny"
                        hidePlaceholder={hide_placeholder}
                        imageUrl={image_url_tiny}
                        alt={display_name} />
    </span>;
  }
}
