import React, { Component, PropTypes } from "react";

export default class Follow extends Component {

  static propTypes = {
    id: PropTypes.string
  };

  render () {
    return <div className="follow" />;
  }
}
