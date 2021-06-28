import React, { Component } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';
import DonateActions from '../../actions/DonateActions';
import DonateStore from '../../stores/DonateStore';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';
import DonationCancelOrRefund from './DonationCancelOrRefund';

/* global $ */

class DonationList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      enablePolling: false,
    };
    this.isMobile = this.isMobile.bind(this);
    this.refreshRequired = this.refreshRequired.bind(this);
  }

  componentDidMount () {
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      refreshCount: 0,
      activeSubscriptionCount: DonateStore.getNumberOfActiveSubscriptions(),
    });
    DonateActions.donationRefreshDonationList();
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
    if (this.timer) clearTimeout(this.timer);
  }

  onDonateStoreChange = () => {
    const { refreshCount, activeSubscriptionCount, enablePolling } = this.state;
    const stripeSuccess = DonateStore.donationError().length === 0;
    if (enablePolling && stripeSuccess &&
        activeSubscriptionCount === DonateStore.getNumberOfActiveSubscriptions()) {
      this.pollForWebhookCompletionAtList(60);
    }
    this.setState({
      refreshCount: refreshCount + 1,
    });
  };

  onVoterStoreChange = () => {
    // In case you sign-in while viewing the Membership page
    DonateActions.donationRefreshDonationList();
  };

  refreshRequired = () => {
    DonateActions.donationRefreshDonationList();
    this.setState({ enablePolling: true });
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
        stripe_subscription_id: subscriptionId } = item;
      const refundDays = parseInt(refundDaysLimit, 10);
      const isActive = moment.utc(created).local().isAfter(moment(new Date()).subtract(refundDays, 'days')) &&
          !stripeStatus.includes('refund');
      const active = isActive ? 'Active' : 'No';
      const waiting = amount === '0.00';
      const cancelText = '';
      const stripeStatusCap = stripeStatus.charAt(0).toUpperCase() + stripeStatus.slice(1);
      const status = stripeStatusCap === 'Succeeded' ? 'Paid' : stripeStatusCap;
      const isChip = subscriptionId.length === 0;  // is "Chip in" for Campaigns which means one time donation for WebApp
      rows.push({
        id: id++,
        date: moment.utc(created).format('MMM D, YYYY'),
        amount,
        monthly: !waiting ? amount : 'waiting',
        isChip,
        payment: isChip ? 'One time' : 'Subscription',
        card: brand,
        ends: last4,
        expires: `${expMonth}/${expYear}`,
        status,
        funding,
        lastCharged,
        active,
        isActive,
        cancelText,
        subscriptionId,
      });
    });
    return rows;
  }

  subscriptionRows = () => {
    const { membershipTabShown, showOrganizationPlan } = this.props;
    const subscriptions = DonateStore.getVoterSubscriptionHistory();
    const rows = [];
    let id = 0;
    subscriptions.forEach((item) => {
      // console.log('donationPaymentHistory item:', item);
      const { record_enum: recordEnum,
        subscription_canceled_at: subscriptionCanceledAt, subscription_ended_at: subscriptionEndedAt,
        subscription_created_at: created, amount, brand, last4, last_charged: lastCharged,
        exp_month: expMonth, exp_year: expYear, stripe_status: stripeStatus,
        stripe_subscription_id: subscriptionId } = item;
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
        isChip: false,
        payment: recordEnum === 'PAYMENT_FROM_UI' ? 'One time' : 'Subscription',
        brand: brand.length ? brand : 'waiting',
        last4: last4.length ? last4 : 'waiting',
        expires: expMonth > 0 ? `${expMonth}/${expYear}` : '/',
        status,
        lastCharged: lastCharged.length ? moment.utc(lastCharged).format('MMM D, YYYY') : 'waiting',
        membershipTabShown,
        active,
        isActive,
        cancelText,
        showOrganizationPlan,
        subscriptionId,
      });
    });
    return rows;
  }

  pollForWebhookCompletionAtList (pollCount) {
    const { enablePolling } = this.state;
    const { activeSubscriptionCount } = this.state;
    const latestCount = DonateStore.getNumberOfActiveSubscriptions();
    console.log(`pollForWebhookCompletionAtList polling -- start: ${activeSubscriptionCount} ? ${latestCount}`);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (pollCount === 0 || (activeSubscriptionCount > latestCount)) {
        // console.log(`pollForWebhookCompletionAtList polling -- pollCount: ${pollCount}`);
        if (this.timer) clearTimeout(this.timer);
        this.setState({ activeSubscriptionCount, enablePolling: false });
        return;
      }
      // console.log(`pollForWebhookCompletion polling ----- ${pollCount}`);
      DonateActions.donationRefreshDonationList();

      if (enablePolling) {
        this.pollForWebhookCompletionAtList(pollCount - 1);  // recursive call
      }
    }, 500);
  }


  render () {
    renderLog('DonationList');  // Set LOG_RENDER_EVENTS to log all renders
    const { membershipTabShown, showOrganizationPlan } = this.props;
    const isDeskTop = !this.isMobile();

    if (membershipTabShown) {
      const subscriptionRows = this.subscriptionRows();
      return (
        <TableContainer component={Paper}>
          <Table aria-label="Subscription table">
            <TableHead>
              <TableRow>
                {isDeskTop && <StyledTableHeaderCell align="center">Active</StyledTableHeaderCell>}
                <StyledTableHeaderCell align="center">Started</StyledTableHeaderCell>
                <StyledTableHeaderCell align="right">Monthly</StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">Last Charged</StyledTableHeaderCell>
                {isDeskTop && (
                  <>
                    <StyledTableHeaderCell align="center">Card</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">Ends With</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">Expires</StyledTableHeaderCell>
                  </>
                )}
                <StyledTableHeaderCell align="center">Info</StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionRows.map((row) => (
                <TableRow key={row.id}>
                  {isDeskTop && (
                    <StyledTableCell align="center">{row.active}</StyledTableCell>
                  )}
                  <StyledTableCell align="center">{row.date}</StyledTableCell>
                  <StyledTableCell align="right">{`$${row.amount}`}</StyledTableCell>
                  <StyledTableCell align="center">{row.lastCharged}</StyledTableCell>
                  {isDeskTop && (
                    <>
                      <StyledTableCell align="center">
                        <Tooltip title={row.subscriptionId || 'Toolman Taylor'} placement="right"><span>{row.brand}</span></Tooltip>
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.last4}</StyledTableCell>
                      <StyledTableCell align="center">{row.expires}</StyledTableCell>
                    </>
                  )}
                  <StyledTableCell align="center">
                    <DonationCancelOrRefund item={row}
                                            refundDonation={!membershipTabShown}
                                            active={row.isActive}
                                            cancelText=""
                                            showOrganizationPlan={showOrganizationPlan}
                                            refreshRequired={this.refreshRequired}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    } else {
      const paymentRows = this.paymentRows();
      return (
        <TableContainer component={Paper}>
          <Table aria-label="Donation table">
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell align="left">Date Paid</StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">Donation Type</StyledTableHeaderCell>
                <StyledTableHeaderCell align="right">Amount</StyledTableHeaderCell>
                {isDeskTop && (
                  <>
                    <StyledTableHeaderCell align="center">Payment</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">Card</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">Ends</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">Exp</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">Status</StyledTableHeaderCell>
                    <StyledTableHeaderCell align="center">Funding</StyledTableHeaderCell>
                  </>
                )}
                {/* <StyledTableHeaderCell align="center">Info</StyledTableHeaderCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentRows.map((row) => (
                <TableRow key={row.id}>
                  <StyledTableCell align="left">{row.date}</StyledTableCell>
                  <StyledTableCell align="center">{row.isChip ? 'Chip In' : 'Membership Payment'}</StyledTableCell>
                  <StyledTableCell align="right">{`$${row.amount}`}</StyledTableCell>
                  {isDeskTop && (
                    <>
                      <StyledTableCell align="center">
                        <Tooltip title={row.subscriptionId || 'Toolman Taylor'} placement="right"><span>{row.payment}</span></Tooltip>
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.card}</StyledTableCell>
                      <StyledTableCell align="center">{row.ends}</StyledTableCell>
                      <StyledTableCell align="center">{row.expires}</StyledTableCell>
                      <StyledTableCell align="center">{row.status}</StyledTableCell>
                      <StyledTableCell align="center">{row.funding}</StyledTableCell>
                    </>
                  )}
                  {/* <StyledTableCell align="center"> */}
                  {/*  <DonationCancelOrRefund item={row} */}
                  {/*                          refundDonation={membershipTabShown} */}
                  {/*                          active={row.isActive} */}
                  {/*                          cancelText="" */}
                  {/*                          showOrganizationPlan={showOrganizationPlan} */}
                  {/*  /> */}
                  {/* </StyledTableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }
}
DonationList.propTypes = {
  membershipTabShown: PropTypes.bool,
  showOrganizationPlan: PropTypes.bool,
};

const StyledTableCell = styled(TableCell)`
  padding: 8px;
`;
const StyledTableHeaderCell = styled(TableCell)`
  padding: 8px;
  color: black;
`;

export default DonationList;
