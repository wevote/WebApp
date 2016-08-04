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
        <span className="glyphicon glyphicon-small glyphicon-info-sign"></span>
      </span>;
	}
}
