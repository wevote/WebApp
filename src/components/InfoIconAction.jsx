"use strict";

import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { Link } from 'react-router';

export default class InfoIconAction extends Component {
  static propTypes = {
      we_vote_id: PropTypes.string
  };
  
  constructor(props) {
    super(props);
  }

	render() {
		return (
      <span>
        <span className="glyphicon glyphicon-small glyphicon-info-sign"></span>
      </span>
    );
	}
}
