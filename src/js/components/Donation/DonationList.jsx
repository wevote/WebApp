import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Card } from 'react-bootstrap';
import moment from 'moment';
import { isCordovaButNotATablet } from '../../utils/cordovaUtils';
import DonateStore from '../../stores/DonateStore';
import DonationCancelOrRefund from './DonationCancelOrRefund';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import VoterActions from '../../actions/VoterActions';

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
    height: '500px',
    overflowY: 'auto',
  },
};

export default class DonationList extends Component {
  static propTypes = {
    displayDonations: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      journal: null,
    };
    this.hideSomeColsIfMobile = this.hideSomeColsIfMobile.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.donateStoreListener = DonateStore.addListener(this.onDonateStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.donateStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ journal: VoterStore.getVoterDonationHistory() });
  }

  onDonateStoreChange () {
    VoterActions.voterRefreshDonations();
  }

  hideSomeColsIfMobile () {
    const width = window.innerWidth > 0 ? window.innerWidth : window.screen.width;
    return width < 900 || isCordovaButNotATablet();
  }

  render () {
    renderLog(__filename);
    if (this.state.journal && this.state.journal.length > 0) {
      const donations = this.props.displayDonations;
      const hideSomeColsIfMobile = this.hideSomeColsIfMobile();

      if (donations) {
        return (
          <Card style={styles.Card}>
            <Card.Body>
              <Table striped hover size="sm">
                { /* Donations */ }
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th hidden={hideSomeColsIfMobile}>Payment</th>
                    <th hidden={hideSomeColsIfMobile}>Card</th>
                    <th hidden={hideSomeColsIfMobile}>Expires</th>
                    <th hidden={hideSomeColsIfMobile}>Status</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.journal.map((item) => {
                    if (item.record_enum === 'PAYMENT_FROM_UI' || item.record_enum === 'PAYMENT_AUTO_SUBSCRIPTION') {
                      const refundDays = parseInt(item.refund_days_limit, 10);
                      const active =
                    moment.utc(item.created).local().isAfter(moment(new Date()).subtract(refundDays, 'days')) &&
                    !item.stripe_status.includes('refund');
                      return (
                        <tr key={`${item.charge_id}-${item.subscription_id}-donations`}>
                          <td>{moment.utc(item.created).local().format('MMM D, YYYY')}</td>
                          <td>{item.amount}</td>
                          <td hidden={hideSomeColsIfMobile}>
                            {item.record_enum === 'PAYMENT_FROM_UI' ? 'One time' :
                              'Subscription'}
                          </td>
                          <td hidden={hideSomeColsIfMobile}>{item.brand}</td>
                          <td hidden={hideSomeColsIfMobile}>{`... ${item.last4}`}</td>
                          <td hidden={hideSomeColsIfMobile}>{`${item.exp_month}/${item.exp_year}`}</td>
                          <td hidden={hideSomeColsIfMobile}>
                            {item.stripe_status === 'succeeded' ? 'Paid' :
                              item.stripe_status}
                          </td>
                          <td hidden={hideSomeColsIfMobile} />
                          <td>
                            <DonationCancelOrRefund item={item} refundDonation={donations} active={active} cancelText="" />
                          </td>
                        </tr>
                      );
                    } else {
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
                    <th hidden={hideSomeColsIfMobile}>Active</th>
                    <th>Started</th>
                    <th>Monthly</th>
                    <th hidden={hideSomeColsIfMobile}>Last Charged</th>
                    <th hidden={hideSomeColsIfMobile}>Card</th>
                    <th hidden={hideSomeColsIfMobile}>Ends with</th>
                    <th hidden={hideSomeColsIfMobile}>Expires</th>
                    <th hidden={hideSomeColsIfMobile}>Canceled</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.journal.map((item) => {
                    if (item.record_enum === 'SUBSCRIPTION_SETUP_AND_INITIAL') {
                      const active = item.subscription_canceled_at === 'None' && item.subscription_ended_at === 'None';
                      const cancel = item.subscription_canceled_at !== 'None' ?
                        moment.utc(item.subscription_canceled_at).format('MMM D, YYYY') : '';
                      const lastcharged = item.last_charged === 'None' ? '' :
                        moment.utc(item.last_charged).format('MMM D, YYYY');
                      const waiting = item.amount === '0.00';

                      return (
                        <tr key={`${item.charge_id}-${item.subscription_id}-journal`}>
                          <td hidden={hideSomeColsIfMobile}>{active ? 'Active' : '----'}</td>
                          <td>{moment.utc(item.created).format('MMM D, YYYY')}</td>
                          <td>{!waiting ? item.amount : 'waiting'}</td>
                          <td hidden={hideSomeColsIfMobile}>{!waiting ? lastcharged : 'waiting'}</td>
                          <td hidden={hideSomeColsIfMobile}>{!waiting ? item.brand : 'waiting'}</td>
                          <td hidden={hideSomeColsIfMobile}>{!waiting ? `... ${item.last4}` : 'waiting'}</td>
                          <td>
                            {!waiting > 0 ? `${item.exp_month}/${item.exp_year}` : 'waiting'}
                          </td>
                          <td hidden={hideSomeColsIfMobile}>{cancel}</td>
                          <td>
                            <DonationCancelOrRefund item={item} refundDonation={donations} active={active} cancelText={cancel} />
                          </td>
                        </tr>
                      );
                    } else {
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
