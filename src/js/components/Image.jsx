import React, { Component, PropTypes } from "react";

export default class Organization extends Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    class: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = { error: false };
  }

  brokenLink (){
    this.setState({error: true});
  }

  render () {
    let this_class = this.props.class || "utils-img-contain";

    const image = this.state.error ?
      <i className="icon-org-lg icon-icon-org-placeholder-6-2 icon-org-resting-color utils-img-contain-glyph" /> :
      <img className={this_class} src={this.props.imageUrl} onError={this.brokenLink.bind(this)} alt={this.props.imageUrl + ".jpg"} />;

    return image;
  }

}
