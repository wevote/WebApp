import React, { Component, PropTypes } from "react";

export default class ImageHandler extends Component {
  static propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    hidePlaceholder: PropTypes.bool,
    imageUrl: PropTypes.string,
    kind_of_ballot_item: PropTypes.string,
    sizeClassName: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = { error: false };
  }

  brokenLink (){
    this.setState({error: true});
  }

  render () {
    let this_class = this.props.className || "";
    let alt = this.props.alt || "icon";
    let replacementClass = "";
    let sizeClassName = this.props.sizeClassName || "";
    let show_placeholder_if_image_missing = !this.props.hidePlaceholder;
    let place_holder_image_url = "";
    if (this.props.kind_of_ballot_item === "CANDIDATE") {
      replacementClass = "icon-main image-person-placeholder";
      place_holder_image_url = "/img/global/svg-icons/avatar-generic.svg";
    } else if (this.props.kind_of_ballot_item === "MEASURE" || this.props.kind_of_ballot_item === "OFFICE"){
      return <i className="search-image__filler" />;
    } else {
      replacementClass = "icon-main image-organization-placeholder";
      place_holder_image_url = "/img/global/svg-icons/organization-icon.svg";
    }

    if (show_placeholder_if_image_missing) {
      // This branch is for situations where we want to show a placeholder image in case the image is broken or missing
      const image_or_placeholder = this.state.error || !this.props.imageUrl || this.props.imageUrl === "" ?
        <img className={sizeClassName + " " + replacementClass} src={place_holder_image_url}/> :
        <img className={sizeClassName + " " + this_class} src={this.props.imageUrl} alt={alt}
             onError={this.brokenLink.bind(this)}/>;
      return image_or_placeholder;
    } else {
      // Only show an image if one exists
      const image = this.state.error || this.props.imageUrl === "" ?
        null :
        <img className={sizeClassName + " " + this_class}
             src={this.props.imageUrl}
             alt={alt}
             onError={this.brokenLink.bind(this)}/>;
      return image;
    }
  }

}
