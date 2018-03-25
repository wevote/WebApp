import React, { Component } from "react";
import DonationList from "./DonationList";
import { Tabs, Tab } from "react-bootstrap";
import { renderLog } from "../../utils/logging";
import VoterStore from "../../stores/VoterStore";
import VoterActions from "../../actions/VoterActions";


export default class DonationListForm extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    // VoterActions.voterRefreshDonations();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ journal: VoterStore.getVoterDonationHistory() });
  }

  handleSelect (selectedKey) {
    this.setState({
      activeKey: selectedKey,
    });
    if (selectedKey === 2) {
      // It takes a 2 to 30 seconds for the charge to come back from the first charge on a subscription,
      VoterActions.voterRefreshDonations();
    }
  }

  render () {
    renderLog(__filename);
    if (this.state.journal && this.state.journal.length > 0) {
      return (
        <div>
          <input type="hidden" value={this.state.activeKey} />
          <Tabs defaultActiveKey={1} activeKey={this.state.activeKey} onSelect={this.handleSelect} id="tabbed_donation_history">
              <Tab eventKey={1} title="Donations"><DonationList displayDonations/></Tab>
              <Tab eventKey={2} title="Subscriptions"><DonationList displayDonations={false}/></Tab>
          </Tabs>
        </div>
      );
    } else {
      return <span />;
    }
  }
}
