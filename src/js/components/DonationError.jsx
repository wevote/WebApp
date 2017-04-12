import React, {Component, PropTypes} from "react";
import { Panel, Label } from "react-bootstrap";
import Helmet from "react-helmet";


export default class DonationError extends Component {
  static getProps = {
    errorMessage: PropTypes.string
  }

  constructor (props) {
    super(props);

  }
  render () {

    return <div>
      <Label bsStyle="warning">{this.props.errorMessage}</Label>
    </div>;
  }
}
