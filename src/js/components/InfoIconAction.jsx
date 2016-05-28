"use strict";

import React, { Component, PropTypes } from "react";

export default class InfoIconAction extends Component {
  static propTypes = {
      we_vote_id: PropTypes.string
  };

  constructor (props) {
    super(props);
  }

	render () {
		return <span>
        <span className="bs-glyphicon bs-glyphicon-small bs-glyphicon-info-sign"></span>
      </span>;
	}
}
