import React, { Component } from "react";
import VoterGuidesFollowing from "../../routes/VoterGuidesFollowing";
import { Tabs, Tab } from "react-bootstrap";


export default class OrganizationVoterGuideTabs extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    return (
      <Tabs defaultActiveKey={1} id="tabbed_donation_history">
        <Tab eventKey={1} title="POSITIONS">
          <VoterGuidesFollowing />
        </Tab>

        <Tab eventKey={2} title="FOLLOWING">
          <VoterGuidesFollowing />
        </Tab>

        <Tab eventKey={3} title="FOLLOWERS">
          <VoterGuidesFollowing />
        </Tab>
      </Tabs>
    );
  }
}
