import React, { Component, PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router';

const floatRight = { float: 'right' };

export default class StarAction extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  toggleSupport (e) {
    console.log(`${this.props.we_vote_id}`);
  }

	render() {
    return (
      <span
        className="star-action"
        onClick={this.toggleSupport.bind(this)}
        style={floatRight}>
        &nbsp;
        <span className="glyphicon glyphicon-small glyphicon-star-empty">
        </span>
      </span>
    );
	}
}
