import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import VoterStore from '../../../stores/VoterStore';
import { renderLog } from '../../../utils/logging';
import DonationCancelOrRefund from './DonationCancelOrRefund';

/* global $ */

/*
July 2021 TODO: Same named file in the WebApp and Campaigns -- PLEASE KEEP THEM IDENTICAL -- make symmetrical changes and test on both sides
*/

class DonationList extends Component {
  constructor (props) {
    super(props);
    this.isMobile = this.isMobile.bind(this);
    this.refreshRequired = this.refreshRequired.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    DonateActions.donationRefreshDonationList();
  }

  componentWillUnmount () {
    if (this.cancelMembershipTimer) clearTimeout(this.cancelMembershipTimer);
    this.voterStoreListener.remove();
  }

  onVoterStoreChange = () => {
    // In case you sign-in while viewing the Membership page
    DonateActions.donationRefreshDonationList();
  };

  refreshRequired = () => {
    this.cancelMembershipTimer = setTimeout(() => {
      DonateActions.donationRefreshDonationList();
    }, 1000);
  }

  isMobile = () => $(window).width() < 1280;

  paymentRows = () => {
    const donationPaymentHistory = DonateStore.getVoterPaymentHistory();
    const rows = [];
    let id = 0;
    donationPaymentHistory.forEach((item) => {
      // console.log('paymentRows item:', item);
      const { refund_days_limit: refundDaysLimit,
        created, amount, brand, last4, funding, last_charged: lastCharged,
        exp_month: expMonth, exp_year: expYear, stripe_status: stripeStatus,
        stripe_subscription_id: subscriptionId, is_chip_in: isChipIn,
        is_monthly_donation: isMonthlyDonation, is_premium_plan: isPremiumPlan,
        campaign_title: campaignTitle,
        campaignx_we_vote_id: campaignxWeVoteId,
      } = item;
      const refundDays = parseInt(refundDaysLimit, 10);
      const isActive = moment.utc(created).local().isAfter(moment(new Date()).subtract(refundDays, 'days')) &&
          !stripeStatus.includes('refund');
      const active = isActive ? 'Active' : 'No';
      const waiting = amount === '0.00';
      const cancelText = '';
      const stripeStatusCap = stripeStatus.charAt(0).toUpperCase() + stripeStatus.slice(1);
      const status = stripeStatusCap === 'Succeeded' ? 'Paid' : stripeStatusCap;
      // "One Time" donation to WeVote via WebApp
      // "Chip in" is a one time donation for Campaigns and the net proceeds goes to that campaign for ads
      // "Membership" is a monthly payment of a donation subscription to WeVote from either the Campaigns or WebApp apps
      // "Premium Plan" is our premium plan that provides customization for Organizations.

      const payment = (subscriptionId.length || campaignxWeVoteId.length) ? 'Subscription' : 'One time';
      let type = 'Donation';
      if (isMonthlyDonation && !isPremiumPlan) {
        type = 'Membership';
      } else if (isMonthlyDonation && isPremiumPlan) {
        type = 'Premium Plan';
      } else if (isChipIn) {
        type = 'Chip In';
      }

      rows.push({
        id: id++,
        active,
        amount,
        campaignTitle,
        cancelText,
        card: brand,
        date: moment.utc(created).format('MMM D, YYYY'),
        ends: last4,
        expires: `${expMonth}/${expYear}`,
        funding,
        isActive,
        isChipIn,
        lastCharged,
        monthly: !waiting ? amount : 'waiting',
        payment,
        status,
        subscriptionId,
        type,
      });
    });
    return rows;
  }

  subscriptionRows = () => {
    const { displayMembershipTab, showPremiumPlan } = this.props;
    const subscriptions = DonateStore.getVoterSubscriptionHistory();
    const rows = [];
    let id = 0;
    subscriptions.forEach((item) => {
      // console.log('donationPaymentHistory item:', item);
      const { record_enum: recordEnum,
        subscription_canceled_at: subscriptionCanceledAt, subscription_ended_at: subscriptionEndedAt,
        subscription_created_at: created, amount, brand, last4, last_charged: lastCharged,
        exp_month: expMonth, exp_year: expYear, stripe_status: stripeStatus,
        stripe_subscription_id: subscriptionId, is_chip_in: isChipIn } = item;
      // const refundDays = parseInt(refundDaysLimit, 10); No refunds in campaigns
      const isActive = subscriptionCanceledAt === 'None' && subscriptionEndedAt === 'None';
      const active = isActive ? 'Active' : 'No';
      const waiting = amount === '0.00';
      const cancelText = '';
      const stripeStatusCap = stripeStatus.charAt(0).toUpperCase() + stripeStatus.slice(1);
      const status = stripeStatusCap === 'Succeeded' ? 'Paid' : stripeStatusCap;
      rows.push({
        id: id++,
        date: created.length > 5 ? moment.utc(created).format('MMM D, YYYY') : 'waiting',
        amount,
        monthly: !waiting ? amount : 'waiting',
        isChipIn,
        payment: recordEnum === 'PAYMENT_FROM_UI' ? 'One time' : 'Subscription',
        brand: brand.length ? brand : 'waiting',
        last4: last4.length ? last4 : 'waiting',
        expires: expMonth > 0 ? `${expMonth}/${expYear}` : '/',
        status,
        lastCharged: lastCharged.length  > 5 ? moment.utc(lastCharged).format('MMM D, YYYY') : 'waiting',
        displayMembershipTab,
        active,
        isActive,
        cancelText,
        showPremiumPlan,
        subscriptionId,
      });
    });
    return rows;
  }

  render () {
    renderLog('DonationList');  // Set LOG_RENDER_EVENTS to log all renders
    const { isCampaign, displayMembershipTab, showPremiumPlan } = this.props;

    if (displayMembershipTab) {
      const subscriptionRows = this.subscriptionRows();
      return (
        <StyledTableContainer component={Paper}>
          <Table stickyHeader aria-label="Subscription table">
            <TableHead>
              <TableRow>
                <StyledTableHeaderCellTablet align="center">Active</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellAll align="center">Started</StyledTableHeaderCellAll>
                <StyledTableHeaderCellAll align="right">Monthly</StyledTableHeaderCellAll>
                <StyledTableHeaderCellTablet align="center">Last Charged</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellTablet align="center">Card</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellDesktop align="center">Ends With</StyledTableHeaderCellDesktop>
                <StyledTableHeaderCellDesktop align="center">Expires</StyledTableHeaderCellDesktop>
                <StyledTableHeaderCellAll align="center">Info</StyledTableHeaderCellAll>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionRows.map((row) => (
                <TableRow key={row.id}>
                  <StyledTableCellTablet align="center">{row.active}</StyledTableCellTablet>
                  <StyledTableCellAll align="center">{row.date}</StyledTableCellAll>
                  <StyledTableCellAll align="right">{`$${row.amount}`}</StyledTableCellAll>
                  <StyledTableCellTablet align="center">{row.lastCharged}</StyledTableCellTablet>
                  <StyledTableCellTablet align="center">
                    <Tooltip title={row.subscriptionId || 'Toolman Taylor'} placement="right"><span>{row.brand}</span></Tooltip>
                  </StyledTableCellTablet>
                  <StyledTableCellDesktop align="center">{row.last4}</StyledTableCellDesktop>
                  <StyledTableCellDesktop align="center">{row.expires}</StyledTableCellDesktop>
                  <StyledTableCellAll align="center">
                    <DonationCancelOrRefund item={row}
                                            refundDonation={!displayMembershipTab}
                                            active={row.isActive}
                                            cancelText=""
                                            showPremiumPlan={showPremiumPlan}
                                            refreshRequired={this.refreshRequired}
                    />
                  </StyledTableCellAll>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      );
    } else {
      const paymentRows = this.paymentRows();
      return (
        <StyledTableContainer component={Paper}>
          <Table stickyHeader aria-label="Donation table">
            <TableHead>
              <TableRow>
                <StyledTableHeaderCellAll align="left">Date Paid</StyledTableHeaderCellAll>
                <StyledTableHeaderCellDesktop align="center">Donation Type</StyledTableHeaderCellDesktop>
                <StyledTableHeaderCellAll align="right">Amount</StyledTableHeaderCellAll>
                <StyledTableHeaderCellAll align="center">{isCampaign ? 'Campaign' : 'Payment'}</StyledTableHeaderCellAll>
                <StyledTableHeaderCellTablet align="center">Card</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellTablet align="center">Ends</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellTablet align="center">Exp</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellTablet align="center">Status</StyledTableHeaderCellTablet>
                <StyledTableHeaderCellDesktop align="center">Funding</StyledTableHeaderCellDesktop>
                {/* <StyledTableHeaderCell align="center">Info</StyledTableHeaderCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentRows.map((row) => (
                <TableRow key={row.id}>
                  <StyledTableCellAll align="left">{row.date}</StyledTableCellAll>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  <StyledTableCellDesktop align="center">{!isCampaign ? row.type : (row.isChipIn ? 'Chip In' : 'Membership Payment')}</StyledTableCellDesktop>
                  <StyledTableCellAll align="right">{`$${row.amount}`}</StyledTableCellAll>
                  <StyledTableCellAll align="center">{!isCampaign ? row.payment : row.campaignTitle}</StyledTableCellAll>
                  <StyledTableCellTablet align="center">{row.card}</StyledTableCellTablet>
                  <StyledTableCellTablet align="center">{row.ends}</StyledTableCellTablet>
                  <StyledTableCellTablet align="center">{row.expires}</StyledTableCellTablet>
                  <StyledTableCellTablet align="center">{row.status}</StyledTableCellTablet>
                  <StyledTableCellDesktop align="center">{row.funding}</StyledTableCellDesktop>
                  {/* <StyledTableCellTablet align="center"> */}
                  {/*  <DonationCancelOrRefund item={row} */}
                  {/*                          refundDonation={membershipTabShown} */}
                  {/*                          active={row.isActive} */}
                  {/*                          cancelText="" */}
                  {/*                          showPremiumPlan={showPremiumPlan} */}
                  {/*  /> */}
                  {/* </StyledTableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      );
    }
  }
}
DonationList.propTypes = {
  isCampaign: PropTypes.bool,
  displayMembershipTab: PropTypes.bool,
  showPremiumPlan: PropTypes.bool,
};

const StyledTableContainer = styled(TableContainer)`
  overflow-y: auto;
  height: 300px;
`;

const StyledTableCellAll = styled(TableCell)`
  padding: 8px;
`;

const StyledTableCellTablet = styled(TableCell)`
  padding: 8px;
  @media (max-width: 700px) {
    display: none;
  }
`;

const StyledTableCellDesktop = styled(TableCell)`
  padding: 8px;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const StyledTableHeaderCellAll = styled(TableCell)`
  padding: 8px;
  color: black;
  min-width: 80px;
`;

const StyledTableHeaderCellTablet = styled(TableCell)`
  padding: 8px;
  color: black;
  @media (max-width: 700px) {
    display: none;
  }
`;

const StyledTableHeaderCellDesktop = styled(TableCell)`
  padding: 8px;
  color: black;
  @media (max-width: 1200px) {
    display: none;
  }
`;

export default DonationList;
