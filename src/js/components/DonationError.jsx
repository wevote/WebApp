import React, {Component} from "react";
import { Button } from "react-bootstrap";
import Helmet from "react-helmet";
import DonationForm from "../../components/DonationForm";


export default class DonationError extends Component {
  static getProps = {
    donationErrorMessage: PropTypes.string
  }

  constructor (props) {
    super(props);

  }
// add bsStyle 'warning' attr 
  render () {

    return <span>
      <p>{this.props.donationErrorMessage}</p>
    </span>;
  }
}
