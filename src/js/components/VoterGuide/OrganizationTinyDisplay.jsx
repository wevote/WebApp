import React, { Component } from "react";
import PropTypes from "prop-types";
import ImageHandler from "../../components/ImageHandler";

// OrganizationTinyDisplay is used by ItemTinyOpinionsToFollow for viewing the logos/icons for voter guides
//  you can follow on the Ballot page
export default class OrganizationTinyDisplay extends Component {
  static propTypes = {
    showPlaceholderImage: PropTypes.bool,
    showInfoOnly: PropTypes.bool,
    showOppose: PropTypes.bool,
    showSupport: PropTypes.bool,
    toFollow: PropTypes.bool,
    voter_guide_image_url_tiny: PropTypes.string,
    voter_image_url_tiny: PropTypes.string,
    organization_photo_url_tiny: PropTypes.string,
    voter_guide_display_name: PropTypes.string,
    organization_name: PropTypes.string,
  };

  render () {
    let display_name;
    if (this.props.voter_guide_display_name) {
      display_name = this.props.voter_guide_display_name;
    } else if (this.props.organization_name) {
      display_name = this.props.organization_name;
    } else {
      display_name = "";
    }

    let image_url_tiny;
    if (this.props.voter_guide_image_url_tiny) {
      image_url_tiny = this.props.voter_guide_image_url_tiny;
    } else if (this.props.organization_photo_url_tiny) {
      image_url_tiny = this.props.organization_photo_url_tiny;
    } else if (this.props.voter_image_url_tiny) {
      image_url_tiny = this.props.voter_image_url_tiny;
    } else {
      image_url_tiny = "";
    }

    let supportOrOpposeClass = "";
    if (this.props.showSupport) {
      supportOrOpposeClass = "network-positions__show-support-underline ";
    } else if (this.props.showOppose) {
      supportOrOpposeClass = "network-positions__show-oppose-underline ";
    }

    let toFollowClass = "";
    if (this.props.toFollow) {
      toFollowClass = "network-positions__to-follow-fade ";
    }

    let hide_placeholder = !this.props.showPlaceholderImage;
    return <ImageHandler className={supportOrOpposeClass + toFollowClass}
                         sizeClassName="organization__image--tiny"
                         hidePlaceholder={hide_placeholder}
                         imageUrl={image_url_tiny}
                         alt={display_name} />;
  }
}
