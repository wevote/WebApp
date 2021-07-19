import { AppBar, Tab, Tabs } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import { renderLog } from '../../../utils/logging';
import { stringContains } from '../../../utils/textFormat';
import { campaignTheme } from '../../../components/Style/campaignTheme';
import TabPanel from '../../../components/Widgets/TabPanel';
import DonationList from './DonationList';

/*
July 2021 TODO: Same named file in the WebApp and Campaigns -- PLEASE KEEP THEM IDENTICAL -- make symmetrical changes and test on both sides
*/

class DonationListForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeKey: 1,
      value: 0,
    };
  }

  componentDidMount () {
    DonateActions.donationRefreshDonationList();  // kick off an initial refresh
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  onDonateStoreChange = () => {
    const { refreshCount } = this.state;
    this.setState({ refreshCount: refreshCount + 1 });
  };

  render () {
    renderLog('DonationListForm');  // Set LOG_RENDER_EVENTS to log all renders
    const { leftTabIsMembership } = this.props;
    const { value } = this.state;
    // console.log('this.value =========', value);
    const { pathname } = window.location;
    const isMembership = pathname.startsWith('/membership');
    const isPayToPromote = (stringContains('/pay-to-promote', pathname));
    const isCampaign = isMembership || isPayToPromote;
    const donationSubscriptionHistory = DonateStore.getVoterSubscriptionHistory();
    const donationPaymentHistory = DonateStore.getVoterPaymentHistory();
    if ((donationSubscriptionHistory === undefined || donationSubscriptionHistory.length === 0) &&
      (donationPaymentHistory === undefined || donationPaymentHistory.length === 0))  {
      console.log('donationPaymentHistory had no rows, so returned null');
      return null;
    }

    let h4Txt = 'Existing memberships and prior payments:';
    if (isMembership) {
      h4Txt = 'Existing memberships and prior "Chip In" payments:';
    } else if (isPayToPromote) {
      h4Txt = 'Prior "Chip In" payments, and any existing memberships';
    } else {
      h4Txt = 'Existing memberships and prior payments:';
    }

    const firstTabLabel = leftTabIsMembership ? 'Memberships' :  'Payment history';
    const secondTabLabel = leftTabIsMembership ? 'Payment history' : 'Memberships';
    if (donationPaymentHistory && donationPaymentHistory.length > 0) {
      return (
        <div style={{ padding: '32px  0' }}>
          <h4>{h4Txt}</h4>
          <input type="hidden" value={this.state.activeKey} />
          <ThemeProvider theme={campaignTheme(false, 40)}>
            <AppBar position="relative" color="default" elevation={0}>
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                aria-label="payments or subscription choice bar"
              >
                <Tab label={firstTabLabel}
                     id={`scrollable-auto-tab-${0}`}
                     aria-controls={`scrollable-auto-tabpanel-${0}`}
                />
                <Tab label={secondTabLabel}
                     id={`scrollable-auto-tab-${1}`}
                     aria-controls={`scrollable-auto-tabpanel-${1}`}
                />
              </Tabs>
            </AppBar>
            <div style={{ paddingBottom: 16 }}>
              <TabPanel value={value} index={0}>
                <DonationList isCampaign={isCampaign} displayMembershipTab={leftTabIsMembership} showPremiumPlan={false} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <DonationList isCampaign={isCampaign} displayMembershipTab={!leftTabIsMembership} showPremiumPlan={false} />
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
DonationListForm.propTypes = {
  leftTabIsMembership: PropTypes.bool,
};
export default DonationListForm;
