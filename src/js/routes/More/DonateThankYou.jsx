import React, {Component} from "react";
import Helmet from "react-helmet";
import DonationListForm from "../../components/Donation/DonationListForm";

export default class DonateThankYou extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return <div >
      <Helmet title="Donate - We Vote"/>
      <div className="container-fluid card" >
        <h1 className="h4">Thank you for your donation!</h1>
        <h1>&nbsp;</h1>
        <h1>&nbsp;</h1>
        <div>
          <DonationListForm />
        </div>
      </div>
    </div>;
  }
}
