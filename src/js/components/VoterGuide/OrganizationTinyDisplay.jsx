import React, { Component, PropTypes } from "react";
import ImageHandler from "../../components/ImageHandler";

// OrganizationTinyDisplay is used by ItemTinyOpinionsToFollow for viewing the logos/icons for voter guides
//  you can follow on the Ballot page
export default class OrganizationTinyDisplay extends Component {
  static propTypes = {
    voter_guide_image_url: PropTypes.string,
    voter_guide_display_name: PropTypes.string,
  };

  render () {
    // TODO DALE NOTE: We need to generate a popover here
    let voter_guide_display_name = this.props.voter_guide_display_name ? this.props.voter_guide_display_name : "";

    return <span>
          <ImageHandler className=""
                        sizeClassName="organization-image-tiny"
                        hidePlaceholder
                        imageUrl={this.props.voter_guide_image_url}
                        alt={voter_guide_display_name} />
    </span>;
  }
}
