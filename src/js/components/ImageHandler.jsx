import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cordovaDot } from '../utils/cordovaUtils';
import { renderLog } from '../utils/logging';
import avatarGenericIcon from '../../img/global/svg-icons/avatar-generic.svg';
import issueGenericIcon from '../../img/global/svg-icons/issue-generic.svg';
import issuePhotoGenericIcon from '../../img/global/svg-icons/issue-photo-generic.svg';
import organizationIcon from '../../img/global/svg-icons/organization-icon.svg';

export default class ImageHandler extends Component {
  constructor (props) {
    super(props);
    this.state = { error: false };
  }

  brokenLink () {
    this.setState({ error: true });
  }

  render () {
    renderLog('ImageHandler');  // Set LOG_RENDER_EVENTS to log all renders
    // debugger;
    const incomingClassName = this.props.className || '';
    const alt = this.props.alt || 'icon';
    let replacementClass = '';
    const sizeClassName = this.props.sizeClassName || '';
    const showPlaceholderIfImageMissing = this.props.hidePlaceholder === undefined || !this.props.hidePlaceholder;
    let placeHolderImageUrl = '';
    const { kind_of_ballot_item: kindOfBallotItem } = this.props;
    const kindOfImage = this.props.kind_of_image ? this.props.kind_of_image : kindOfBallotItem;
    const imagePlaceholderIcon = null;

    // handles setting the placeholder image by "kind_of_image" or "ballot item" type.
    switch (kindOfImage) {
      case 'CANDIDATE':
        replacementClass = 'icon-main image-person-placeholder card-main__avatar-border';
        placeHolderImageUrl = cordovaDot(avatarGenericIcon);
        break;
      case 'MEASURE' || 'OFFICE':
        // TODO: Refactor to remove font icons
        return <i className="search-image__filler" />;
      case 'ISSUE':
        replacementClass = 'icon-main image-issue-placeholder';
        placeHolderImageUrl = cordovaDot(issueGenericIcon);
        break;
      case 'ISSUE-PHOTO':
        replacementClass = 'image-issue-photo-placeholder';
        placeHolderImageUrl = cordovaDot(issuePhotoGenericIcon);
        break;
      default:
        replacementClass = 'icon-main image-organization-placeholder';
        placeHolderImageUrl = cordovaDot(organizationIcon);
        break;
    }

    if (showPlaceholderIfImageMissing) {
      // This branch is for situations where we want to show a placeholder image in case the image is broken or missing
      return this.state.error || !this.props.imageUrl || this.props.imageUrl === '' ?
        imagePlaceholderIcon || (
          <img
            alt={alt}
            className={`${sizeClassName} ${incomingClassName} ${replacementClass}`}
            src={placeHolderImageUrl}
          />
        ) : (
          <img
            alt={alt}
            className={`${sizeClassName} ${incomingClassName}`}
            src={this.props.imageUrl}
            onError={this.brokenLink.bind(this)}
          />
        );
    } else {
      // Only show an image if one exists
      return this.state.error || !this.props.imageUrl || this.props.imageUrl === '' ?
        null : (
          <img
            alt={alt}
            className={`${sizeClassName} ${incomingClassName}`}
            src={this.props.imageUrl}
            onError={this.brokenLink.bind(this)}
          />
        );
    }
  }
}
ImageHandler.propTypes = {
  alt: PropTypes.string,
  className: PropTypes.string,
  hidePlaceholder: PropTypes.bool,
  imageUrl: PropTypes.string,
  kind_of_ballot_item: PropTypes.string,
  kind_of_image: PropTypes.string,
  sizeClassName: PropTypes.string,
};
