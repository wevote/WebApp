import React, {Component} from "react";
import Helmet from "react-helmet";
import DonationForm from "../../components/DonationForm";


export default class Donate extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <Helmet title="Donate - We Vote"/>
      <div className="container-fluid card">
        <h1 className="h4">Your donations keep us going. Thank you!</h1>

        <div className="Donate">
          If you like We Vote, please give what you can to help us reach more voters.<br />
          <br />
          Select an Amount<br />
          <DonationForm donationAmount={500} donateButtonText="$5" />&nbsp;
          <DonationForm donationAmount={1500} donateButtonText="$15" />&nbsp;
          <DonationForm donationAmount={2700} donateButtonText="$27" />&nbsp;
          <DonationForm donationAmount={5000} donateButtonText="$50" />&nbsp;
          <DonationForm donationAmount={10000} donateButtonText="$100" /><br />
          <br />
          <br />
          Contributions or gifts are not tax deductible. We Vote is a 501(c)(4) nonprofit.
        </div>
      </div>
    </div>;
  }
}
