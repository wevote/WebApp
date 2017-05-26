import React, { Component } from "react";
import DonationList from "./DonationList";
import { Tabs, Tab } from "react-bootstrap";
import VoterStore from "../../stores/VoterStore";
import VoterActions from "../../actions/VoterActions";


export default class DonationListForm extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    VoterActions.voterRefreshDonations();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({journal: VoterStore.getVoterDonationHistory()});
  }


  render () {
    if (this.state.journal && this.state.journal.length > 0) {
      return (
        <Tabs defaultActiveKey={1} id="tabbed_donation_history">
          <Tab eventKey={1} title="Donations"><DonationList displayDonations/></Tab>
          <Tab eventKey={2} title="Subscriptions"><DonationList displayDonations={false}/></Tab>
        </Tabs>
      );
    } else {
      return <span />;
    }
  }
}
