import React, { Component } from "react";
import PropTypes from "prop-types";

export default class BallotIndex extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  render () {
    return <div className="ballot">
            { this.props.children }
          </div>;
  }
}
