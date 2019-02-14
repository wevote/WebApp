import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImageHandler from '../ImageHandler';
import { renderLog } from '../../utils/logging';

// OrganizationTinyDisplay is used by ItemTinyOpinionsToFollow for viewing the logos/icons for voter guides
//  you can follow on the Ballot page
export default class OrganizationTinyDisplay extends Component {
  static propTypes = {
    showPlaceholderImage: PropTypes.bool,
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
    // console.log("OrganizationTinyDisplay render");
    renderLog(__filename);
    let displayName;
    if (this.props.voter_guide_display_name) {
      displayName = this.props.voter_guide_display_name;
    } else if (this.props.organization_name) {
      displayName = this.props.organization_name;
    } else {
      displayName = '';
    }

    let imageUrlTiny;
    if (this.props.voter_guide_image_url_tiny) {
      imageUrlTiny = this.props.voter_guide_image_url_tiny;
    } else if (this.props.organization_photo_url_tiny) {
      imageUrlTiny = this.props.organization_photo_url_tiny;
    } else if (this.props.voter_image_url_tiny) {
      imageUrlTiny = this.props.voter_image_url_tiny;
    } else {
      imageUrlTiny = '';
    }

    let supportOrOpposeClass = '';
    if (this.props.showSupport) {
      supportOrOpposeClass = 'network-positions__show-support-underline ';
    } else if (this.props.showOppose) {
      supportOrOpposeClass = 'network-positions__show-oppose-underline ';
    }

    let toFollowClass = '';
    if (this.props.toFollow) {
      toFollowClass = 'network-positions__to-follow-fade ';
    }

    const hidePlaceholder = !this.props.showPlaceholderImage;
    return (
      <ImageHandler
        className={supportOrOpposeClass + toFollowClass}
        sizeClassName="organization__image--tiny"
        hidePlaceholder={hidePlaceholder}
        imageUrl={imageUrlTiny}
        alt={displayName}
      />
    );
  }
}
