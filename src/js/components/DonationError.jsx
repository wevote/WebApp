import React, { Component, PropTypes } from "react";
import { Label } from "react-bootstrap";

export default class DonationError extends Component {

  static propTypes = {
    errorMessage: PropTypes.string.isRequired
  };

  constructor (props) {
    super(props);
  }

  render () {
    return <div>
      <Label bsStyle="warning">{this.props.errorMessage}</Label>
    </div>;
  }
}
