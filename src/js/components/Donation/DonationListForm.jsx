import { AppBar, Tab, Tabs } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React, { Component } from 'react';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import { renderLog } from '../../utils/logging';
import { campaignTheme } from '../Style/campaignTheme';
import TabPanel from '../Widgets/TabPanel';
import DonationList from './DonationList';

export default class DonationListForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeKey: 1,
      value: 0,
    };
  }

  componentDidMount () {
    DonateActions.donationRefreshDonationList();  // kick off an initial refresh
  }


  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };


  render () {
    renderLog('DonationListForm');  // Set LOG_RENDER_EVENTS to log all renders
    const { value } = this.state;
    // console.log('this.value =========', value);

    const donationSubscriptionHistory = DonateStore.getVoterSubscriptionHistory();
    const donationPaymentHistory = DonateStore.getVoterPaymentHistory();
    if ((donationSubscriptionHistory === undefined || donationSubscriptionHistory.length === 0) &&
      (donationPaymentHistory === undefined || donationPaymentHistory.length === 0))  {
      console.log('donationPaymentHistory had no rows, so returned null');
      return null;
    }


    if (donationPaymentHistory && donationPaymentHistory.length > 0) {
      return (
        <div style={{ padding: '16px  0 32px 0' }}>
          <h4>Existing memberships and prior payments:</h4>
          <input type="hidden" value={this.state.activeKey} />
          <ThemeProvider theme={campaignTheme(false, 40)}>
            <AppBar position="relative" color="default">
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                aria-label="payments or subscription choice bar"
              >
                <Tab label="Payment history"
                     id={`scrollable-auto-tab-${0}`}
                     aria-controls={`scrollable-auto-tabpanel-${0}`}
                />
                <Tab label="Memberships"
                     id={`scrollable-auto-tab-${1}`}
                     aria-controls={`scrollable-auto-tabpanel-${1}`}
                />
              </Tabs>
            </AppBar>
            <div style={{ paddingBottom: 16 }}>
              <TabPanel value={value} index={0}>
                <DonationList membershipTabShown={false} showOrganizationPlan={false} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DonationList membershipTabShown showOrganizationPlan={false} />
              </TabPanel>
            </div>
          </ThemeProvider>
        </div>
      );
    } else {
      return <span />;
    }
  }
}
// DonationListForm.propTypes = {
//   // waitForWebhook: PropTypes.bool.isRequired,
// };
