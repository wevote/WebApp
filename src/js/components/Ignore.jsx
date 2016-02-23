import React, { Component, PropTypes } from "react";

export default class Ignore extends Component {

  static propTypes = {
    id: PropTypes.string
  };

  render () {
    return <div className="ignore"/>;
  }
}
