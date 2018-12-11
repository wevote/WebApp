import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../utils/logging";

export default class InfoIconAction extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string,
  };

  render () {
    renderLog(__filename);
    return (
      <span>
        {/* October 2018:  The bootstrap glyphicon has been eliminated in bootstrap 4, this line won't work */}
        <span className="glyphicon glyphicon-small glyphicon-info-sign" />
      </span>
    );
  }
}
