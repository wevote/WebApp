import React, { Component } from "react";
import Helmet from "react-helmet";
import DonationListForm from "../../components/Donation/DonationListForm";
import { renderLog } from "../../utils/logging";

export default class DonateThankYou extends Component {
  render () {
    renderLog(__filename);
    return (
      <div>
        <Helmet title="Donate - We Vote" />
        <div className="container-fluid card">
          <h1 className="h4">Thank you for your donation!</h1>
          <h1>&nbsp;</h1>
          <h1>&nbsp;</h1>
          <p>
            New subscriptions may take a few minutes to appear in this list.  The first payment for new subscriptions may also be delayed.
          </p>
          <p />
          <p />
          <div>
            <DonationListForm />
          </div>
        </div>
      </div>
    );
  }
}
