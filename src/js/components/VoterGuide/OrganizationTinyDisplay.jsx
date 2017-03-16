import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";

// OrganizationTinyDisplay is used by ItemTinyOpinionsToFollow for viewing the logos/icons for voter guides
//  you can follow on the Ballot page
export default class OrganizationTinyDisplay extends Component {
  static propTypes = {
    showPlaceholderImage: PropTypes.bool,
    voter_guide_image_url_tiny: PropTypes.string,
    organization_photo_url_tiny: PropTypes.string,
    voter_guide_display_name: PropTypes.string,
    organization_name: PropTypes.string,
  };

  render () {
    // TODO DALE NOTE: We need to generate a popover here
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
    } else {
      image_url_tiny = "";
    }
    let hide_placeholder = !this.props.showPlaceholderImage;
    return <span>
          <ImageHandler className=""
                        sizeClassName="organization-image-tiny"
                        hidePlaceholder={hide_placeholder}
                        imageUrl={image_url_tiny}
                        alt={display_name} />
    </span>;
  }
}
