import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

import moment from 'moment';
import { renderLog } from '../../utils/logging';
import DonateStore from '../../stores/DonateStore';
import DonationCancelOrRefund from './DonationCancelOrRefund';
import LoadingWheel from '../LoadingWheel';
import DonateActions from '../../actions/DonateActions';

/* global $ */

const styles = {
  table: {
    //  verticalAlign: "middle",
    // textAlign: "center",
  },
  td: {
    // verticalAlign: "middle",
    // textAlign: "center",
  },
  th: {
    // textAlign: "center",
  },
  Card: {
    borderTopColor: 'transparent',
    minHeight: '135px',
    overflowY: 'auto',
  },
};

export default class DonationList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      donationJournalList: null,
    };
    this.isMobile = this.isMobile.bind(this);
  }

  componentDidMount () {
    this.onDonateStoreChange();
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
    this.setState({ donationJournalList: DonateStore.getVoterDonationHistory() });
    if (this.props.showOrganizationPlan) {
      DonateActions.donationRefreshDonationList();
    }
  }

  componentWillUnmount () {
    this.donateStoreListener.remove();
  }

  onDonateStoreChange = () => {
    this.setState({ donationJournalList: DonateStore.getVoterDonationHistory() });
  };

  isMobile = () => $(window).width() < 1280;

  render () {
    renderLog('DonationList');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.donationJournalList) {
      console.log('donationJournalList not yet received in DonationList render');
      return LoadingWheel;
    }

    if (this.state.donationJournalList && this.state.donationJournalList.length > 0) {
      const { displayDonations, showOrganizationPlan } = this.props;
      const isMobile = this.isMobile();

      if (displayDonations) {
        return (
          <Card style={styles.Card}>
            <Card.Body>
              <Table striped hover size="sm">
                { /* Donations */ }
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th hidden={isMobile}>Payment</th>
                    <th hidden={isMobile}>Card</th>
                    <th hidden={isMobile}>Ends with</th>
                    <th hidden={isMobile}>Expires</th>
                    <th hidden={isMobile}>Status</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.donationJournalList.map((item) => {
                    const { record_enum: recordEnum, refund_days_limit: refundDaysLimit, charge_id: chargeId,
                      subscription_id: subscriptionId, created, amount, brand, last4,
                      exp_month: expMonth, exp_year: expYear, stripe_status: stripeStatus, is_organization_plan: isOrgPlan } = item;
                    if ((recordEnum === 'PAYMENT_FROM_UI' || recordEnum === 'PAYMENT_AUTO_SUBSCRIPTION') &&
                        ((!showOrganizationPlan && !isOrgPlan) || (showOrganizationPlan && isOrgPlan))) {
                      const refundDays = parseInt(refundDaysLimit, 10);
                      const active =
                        moment.utc(created).local().isAfter(moment(new Date()).subtract(refundDays, 'days')) &&
                        !stripeStatus.includes('refund');
                      return (
                        <tr key={`${chargeId}-${subscriptionId}-donations`}>
                          <td>{moment.utc(created).format('MMM D, YYYY')}</td>
                          <td>{amount}</td>
                          <td hidden={isMobile}>
                            {recordEnum === 'PAYMENT_FROM_UI' ? 'One time' :
                              'Subscription'}
                          </td>
                          <td hidden={isMobile}>{brand}</td>
                          <td hidden={isMobile}>{`... ${last4}`}</td>
                          <td hidden={isMobile}>{`${expMonth}/${expYear}`}</td>
                          <td hidden={isMobile}>
                            {stripeStatus === 'succeeded' ? 'Paid' : stripeStatus}
                          </td>
                          <td>
                            <DonationCancelOrRefund item={item} refundDonation={displayDonations} active={active} cancelText="" showOrganizationPlan={showOrganizationPlan} />
                          </td>
                        </tr>
                      );
                    } else {
                      console.log("no records of the type 'PAYMENT_FROM_UI' or 'PAYMENT_AUTO_SUBSCRIPTION' were found.");
                      return null;
                    }
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        );
      } else {
        return (
          <Card style={styles.Card}>
            <Card.Body>
              <Table striped hover size="sm">
                { /* Subscriptions */ }
                <thead>
                  <tr>
                    <th hidden={isMobile}>Active</th>
                    <th>Started</th>
                    <th>Monthly</th>
                    <th hidden={isMobile}>Last Charged</th>
                    <th hidden={isMobile}>Card</th>
                    <th hidden={isMobile}>Ends with</th>
                    <th hidden={isMobile}>Expires</th>
                    <th hidden={isMobile}>Canceled</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.donationJournalList.map((item) => {
                    const { record_enum: recordEnum, subscription_canceled_at: subscriptionCanceledAt,
                      charge_id: chargeId, subscription_id: subscriptionId, last_charged: lastCharged, created, amount, brand, last4,
                      exp_month: expMonth, exp_year: expYear, subscription_ended_at: subscriptionEndedAt, is_organization_plan: isOrgPlan } = item;
                    if (recordEnum === 'SUBSCRIPTION_SETUP_AND_INITIAL' &&
                      ((!showOrganizationPlan && !isOrgPlan) || (showOrganizationPlan && isOrgPlan))) {
                      const active = subscriptionCanceledAt === 'None' && subscriptionEndedAt === 'None';
                      const cancel = subscriptionCanceledAt !== 'None' ?
                        moment.utc(subscriptionCanceledAt).format('MMM D, YYYY') : '';
                      const lastcharged = lastCharged === 'None' ? '' :
                        moment.utc(lastCharged).format('MMM D, YYYY');
                      const waiting = amount === '0.00';

                      return (
                        <tr key={`${chargeId}-${subscriptionId}-donationJournalList`}>
                          <td hidden={isMobile}>{active ? 'Active' : '----'}</td>
                          <td>{moment.utc(created).format('MMM D, YYYY')}</td>
                          <td>{!waiting ? amount : 'waiting'}</td>
                          <td hidden={isMobile}>{!waiting ? lastcharged : 'waiting'}</td>
                          <td hidden={isMobile}>{!waiting ? brand : 'waiting'}</td>
                          <td hidden={isMobile}>{!waiting ? `... ${last4}` : 'waiting'}</td>
                          <td>
                            {!waiting > 0 ? `${expMonth}/${expYear}` : 'waiting'}
                          </td>
                          <td hidden={isMobile}>{cancel}</td>
                          <td>
                            <DonationCancelOrRefund item={item} refundDonation={displayDonations} active={active} cancelText={cancel} showOrganizationPlan={showOrganizationPlan} />
                          </td>
                        </tr>
                      );
                    } else {
                      console.log("no records of the type 'SUBSCRIPTION_SETUP_AND_INITIAL' found.");
                      return null;
                    }
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        );
      }
    } else {
      return null;
    }
  }
}
DonationList.propTypes = {
  displayDonations: PropTypes.bool,
  showOrganizationPlan: PropTypes.bool,
};
