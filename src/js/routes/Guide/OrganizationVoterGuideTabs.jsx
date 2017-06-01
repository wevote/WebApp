import React, { Component, PropTypes } from "react";
import VoterGuidesFollowers from "../../routes/VoterGuidesFollowers";
import VoterGuidesFollowing from "../../routes/VoterGuidesFollowing";
import VoterGuidesPositions from "../../routes/VoterGuidesPositions";
import { Tabs, Tab } from "react-bootstrap";


export default class OrganizationVoterGuideTabs extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Tabs defaultActiveKey={1} id="tabbed_donation_history">
        <Tab eventKey={1} title="POSITIONS">
          <VoterGuidesPositions organization_we_vote_id={this.props.organization.organization_we_vote_id} />
        </Tab>

        <Tab eventKey={2} title="FOLLOWING">
          <VoterGuidesFollowing organization={this.props.organization} />
        </Tab>

        <Tab eventKey={3} title="FOLLOWERS">
          <VoterGuidesFollowers />
        </Tab>
      </Tabs>
    );
  }
}
