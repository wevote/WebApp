import React, { Component } from "react";
import PropTypes from "prop-types";
import { cordovaDot } from "../utils/cordovaUtils";
import { renderLog } from "../utils/logging";

export default class ImageHandler extends Component {
  static propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    hidePlaceholder: PropTypes.bool,
    imageUrl: PropTypes.string,
    kind_of_ballot_item: PropTypes.string,
    kind_of_image: PropTypes.string,
    sizeClassName: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = { error: false };
  }

  brokenLink () {
    this.setState({ error: true });
  }

  render () {
    renderLog(__filename);
    let this_class = this.props.className || "";
    let alt = this.props.alt || "icon";
    let replacementClass = "";
    let sizeClassName = this.props.sizeClassName || "";
    let show_placeholder_if_image_missing = !this.props.hidePlaceholder;
    let place_holder_image_url = "";
    const {kind_of_ballot_item} = this.props;
    const kind_of_image = this.props.kind_of_image ? this.props.kind_of_image : kind_of_ballot_item;

    //handles setting the placeholder image by "kind_of_image" or "ballot item" type.
    switch (kind_of_image) {
      case "CANDIDATE":
        replacementClass = "icon-main image-person-placeholder";
        place_holder_image_url = cordovaDot("/img/global/svg-icons/avatar-generic.svg");
        break;
      case "MEASURE" || "OFFICE":
        // TODO: Refactor to remove font icons
        return <i className="search-image__filler" />;
      case "ISSUE":
        replacementClass = "icon-main image-person-placeholder";
        place_holder_image_url = cordovaDot("/img/global/svg-icons/issue-generic.svg");
        break;
      case "ISSUE-PHOTO":
        replacementClass = "image-issue-photo-placeholder";
        place_holder_image_url = cordovaDot("/img/global/svg-icons/issue-photo-generic.svg");
        break;
      default:
        replacementClass = "icon-main image-organization-placeholder";
        place_holder_image_url = cordovaDot("/img/global/svg-icons/organization-icon.svg");
        break;
    }

    if (show_placeholder_if_image_missing) {
      // This branch is for situations where we want to show a placeholder image in case the image is broken or missing
      const image_or_placeholder = this.state.error || !this.props.imageUrl || this.props.imageUrl === "" ?
        <img className={`${sizeClassName} ${this_class} ${replacementClass}`} src={place_holder_image_url}/> :
        <img className={`${sizeClassName} ${this_class}`} src={this.props.imageUrl} alt={alt}
             onError={this.brokenLink.bind(this)}/>;
      return image_or_placeholder;
    } else {
      // Only show an image if one exists
      const image = this.state.error || this.props.imageUrl === "" ?
        null :
        <img className={`${sizeClassName} ${this_class}`}
             src={this.props.imageUrl}
             alt={alt}
             onError={this.brokenLink.bind(this)}/>;
      return image;
    }
  }

}
