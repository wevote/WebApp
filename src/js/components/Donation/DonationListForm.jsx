import React, { Component } from "react";
import DonationList from "./DonationList";
import { Tabs, Tab } from "react-bootstrap";
import VoterStore from "../../stores/VoterStore";


export default class DonationListForm extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      data: VoterStore.getVoterDonationHistory(),
    };
  }

  render () {
    if (this.state.data.length > 0) {
      return (
        <Tabs defaultActiveKey={1} id="tabbed_donation_history">
          <Tab eventKey={1} title="Donations"><DonationList displayDonations /></Tab> {/*={true}*/}
          <Tab eventKey={2} title="Subscriptions"><DonationList displayDonations={false}/></Tab>
        </Tabs>
      );
    } else {
      return (<div />);
    }
  }
}
