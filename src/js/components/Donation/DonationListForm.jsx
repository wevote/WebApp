import React, { Component } from "react";
import DonationList from "./DonationList";
import { Tabs, Tab } from "react-bootstrap";


export default class DonationListForm extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    return (
      <Tabs defaultActiveKey={1} id="tabbed_donation_history">
        <Tab eventKey={1} title="Donations"><DonationList displayDonations={!false}/></Tab>
        <Tab eventKey={2} disabled title="Subscriptions"><DonationList displayDonations={false}/></Tab>
      </Tabs>
    );
  }
}
