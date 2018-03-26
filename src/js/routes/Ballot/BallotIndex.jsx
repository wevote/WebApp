import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";

export default class BallotIndex extends Component {
  static propTypes = {
    children: PropTypes.object,
  };

  render () {
    renderLog(__filename);
    return <div className="ballot">
            { this.props.children }
          </div>;
  }
}
