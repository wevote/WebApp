"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../utils/logging";

export default class InfoIconAction extends Component {
  static propTypes = {
      we_vote_id: PropTypes.string
  };

  constructor (props) {
    super(props);
  }

	render () {
    renderLog(__filename);
		return <span>
        <span className="glyphicon glyphicon-small glyphicon-info-sign" />
      </span>;
	}
}
