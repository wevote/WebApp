import React, { Component, PropTypes } from "react";

export default class ImageHandler extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    className: PropTypes.string,
    alt: PropTypes.string,
    kind_of_ballot_item: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = { error: false };
  }

  brokenLink (){
    this.setState({error: true});
  }

  render () {
    let this_class = this.props.className || "utils-img-contain";
    let alt = this.props.alt || "icon";
    let replacementClass = "";
    if (this.props.kind_of_ballot_item === "CANDIDATE") {
      replacementClass = "icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light position-item__avatar";
    } else {
      replacementClass = "icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color position-item__avatar";
    }


    const image = this.state.error ?
      <i className={replacementClass} /> :
      <img className={this_class} src={this.props.imageUrl} alt={alt}
           onError={this.brokenLink.bind(this)} />;

    return image;
  }

}
