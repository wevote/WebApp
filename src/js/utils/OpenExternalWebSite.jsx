import React, { Component } from "react";
import PropTypes from "prop-types";
import { cordovaOpenSafariView, isWebApp } from "./cordovaUtils";

export default class OpenExternalWebSite extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    className: PropTypes.string,
    target: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    delay: PropTypes.number,
  };

  constructor (props) {
    super(props);
  }

  render () {
    let integerDelay = this.props.delay && this.props.delay >= 0 ? this.props.delay : 50;
    let classNameString = this.props.className ? this.props.className : "open-web-site";

    if (isWebApp()) {
      return (
        <a href={this.props.url}
           className={classNameString}
           target={this.props.target ? this.props.target : ""}
           title={this.props.title ? this.props.title : ""} >
          {this.props.body ? this.props.body : ""}
        </a>
      );
    } else {
      return (
        <span className={classNameString}
              title={this.props.title ? this.props.title : ""}
              onClick={() => cordovaOpenSafariView(this.props.url, integerDelay)} >
          {this.props.body ? this.props.body : ""}
        </span>
      );
    }
  }
}
