import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";

// OrganizationTinyDisplay is used by ItemTinyOpinionsToFollow for viewing the logos/icons for voter guides
//  you can follow on the Ballot page
export default class OrganizationTinyDisplay extends Component {
  static propTypes = {
    showPlaceholderImage: PropTypes.bool,
    voter_guide_image_url_tiny: PropTypes.string,
    voter_guide_display_name: PropTypes.string,
  };

  render () {
    // TODO DALE NOTE: We need to generate a popover here
    let voter_guide_display_name = this.props.voter_guide_display_name ? this.props.voter_guide_display_name : "";

    let hide_placeholder = !this.props.showPlaceholderImage;
    return <span>
          <ImageHandler className=""
                        sizeClassName="organization-image-tiny"
                        hidePlaceholder={hide_placeholder}
                        imageUrl={this.props.voter_guide_image_url_tiny}
                        alt={voter_guide_display_name} />
    </span>;
  }
}
