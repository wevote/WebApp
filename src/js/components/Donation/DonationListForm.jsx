import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';
import DonateActions from '../../actions/DonateActions';
import DonationList from './DonationList';
import DonateStore from '../../stores/DonateStore';
import { renderLog } from '../../utils/logging';


export default class DonationListForm extends Component {
  static propTypes = {
    waitForWebhook: PropTypes.bool.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeKey: 1,
      initialDonationCount: -1,
    };
  }

  componentDidMount () {
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    DonateActions.donationRefreshDonationList();  // kick off an initial refresh
    if (this.props.waitForWebhook) {
      this.pollForWebhookCompletion(60);
    }
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  onDonateStoreChange () {
    if (this.state.initialDonationCount < 0) {
      const count = DonateStore.getVoterDonationHistory() ? DonateStore.getVoterDonationHistory().length : -1;
      this.setState({ donationHistory: DonateStore.getVoterDonationHistory(), initialDonationCount: count });
    } else {
      this.setState({ donationHistory: DonateStore.getVoterDonationHistory() });
    }
  }

  handleSelect = (selectedKey) => {
    this.setState({
      activeKey: selectedKey,
    });
    if (selectedKey === '2') {
      // It takes a 2 to 30 seconds for the charge to come back from the first charge on a subscription,
      DonateActions.donationRefreshDonationList();
    }
  };

  pollForWebhookCompletion (pollCount) {
    // console.log(`pollForWebhookCompletion polling -- start: ${this.state.donationHistory ? this.state.donationHistory.length : -1}`);
    // console.log(`pollForWebhookCompletion polling -- start pollCount: ${pollCount}`);
    this.polling = setTimeout(() => {
      if (pollCount < 0 || (this.state.donationHistory && (this.state.initialDonationCount !== this.state.donationHistory.length))) {
        // console.log(`pollForWebhookCompletion polling -- clearTimeout: ${this.state.donationHistory.length}`);
        // console.log(`pollForWebhookCompletion polling -- pollCount: ${pollCount}`);
        clearTimeout(this.polling);
        return;
      }
      // console.log(`pollForWebhookCompletion polling ----- ${pollCount}`);
      DonateActions.donationRefreshDonationList();
      this.pollForWebhookCompletion(pollCount - 1);
    }, 500);
  }

  render () {
    renderLog(__filename);
    if (this.state && this.state.donationHistory && this.state.donationHistory.length > 0) {
      return (
        <div>
          <input type="hidden" value={this.state.activeKey} />
          <Tabs defaultActiveKey={1} activeKey={this.state.activeKey} onSelect={this.handleSelect} id="tabbed_donation_history">
            <Tab eventKey={1} title="Donations"><DonationList displayDonations /></Tab>
            <Tab eventKey={2} title="Subscriptions"><DonationList displayDonations={false} /></Tab>
          </Tabs>
        </div>
      );
    } else {
      return <span />;
    }
  }
}
