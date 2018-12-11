import React, { Component } from "react";
import PropTypes from "prop-types";
import ImageHandler from "../ImageHandler";
import { renderLog } from "../../utils/logging";

export default class FacebookFriendTinyDisplay extends Component {
  static propTypes = {
    showPlaceholderImage: PropTypes.bool,
    name: PropTypes.string,
    picture: PropTypes.object,
  };

  render () {
    renderLog(__filename);
    let display_name = "";
    let facebook_profile_image = "";
    if (this.props.name) {
      display_name = this.props.name;
    }
    if (this.props.picture.data.url) {
      facebook_profile_image = this.props.picture.data.url;
    }

    return (
      <span>
        <ImageHandler
          imageUrl={facebook_profile_image}
          className=""
          sizeClassName="facebook-friend-image-tiny"
          alt={display_name}
        />
      &nbsp;
      </span>
    );
  }
}
