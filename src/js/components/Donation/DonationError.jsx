import React, { Component } from "react";
import PropTypes from "prop-types";
import { Label } from "react-bootstrap";
import { renderLog } from "../../utils/logging";

export default class DonationError extends Component {

  static propTypes = {
    errorMessage: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
  }

  render () {
    renderLog(__filename);
    return <div>
      <Label variant="warning">{this.props.errorMessage}</Label>
    </div>;
  }
}
