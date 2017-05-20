import React, { Component } from "react";
import VoterGuidesFollowers from "../../routes/VoterGuidesFollowers";
import VoterGuidesFollowing from "../../routes/VoterGuidesFollowing";
import VoterGuidesPositions from "../../routes/VoterGuidesPositions";
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
          <VoterGuidesPositions />
        </Tab>

        <Tab eventKey={2} title="FOLLOWING">
          <VoterGuidesFollowing />
        </Tab>

        <Tab eventKey={3} title="FOLLOWERS">
          <VoterGuidesFollowers />
        </Tab>
      </Tabs>
    );
  }
}
