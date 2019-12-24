import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/esm/Button';
import Table from 'react-bootstrap/esm/Table';
import Modal from 'react-bootstrap/esm/Modal';
import moment from 'moment';
import DonateActions from '../../actions/DonateActions';
import { renderLog } from '../../utils/logging';

export default class DonationCancelOrRefund extends Component {
  static propTypes = {
    item: PropTypes.object,
    refundDonation: PropTypes.bool, // true to enable refunding of donations, false to enable cancellation of subscriptions
    active: PropTypes.bool,
    cancelText: PropTypes.string,
    showOrganizationPlan: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.cancelOrRefund = this.cancelOrRefund.bind(this);
  }

  closeModal = () => {
    this.setState({ showModal: false });
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  cancelOrRefund = (item) => {
    console.log(`cancel subscription or refund charge ${item}`);
    const { charge_id: chargeId, subscription_id: subscriptionId } = item;
    if (this.props.refundDonation) {
      DonateActions.donationRefund(chargeId);
    } else {
      DonateActions.donationCancelSubscriptionAction(subscriptionId);
    }

    this.setState({ showModal: false });
  };

  render () {
    renderLog('DonationCancelOrRefund');  // Set LOG_RENDER_EVENTS to log all renders
    const { item, refundDonation, active, cancelText, showOrganizationPlan } = this.props;
    const { amount, funding, brand, last4, exp_month: expMonth, exp_year: expYear } = item;
    let label = refundDonation ? 'Refund Donation' : 'Cancel Subscription';
    if (showOrganizationPlan) {
      label = refundDonation ? 'Refund Plan Payment' : 'Cancel Paid Plan';
    }

    if (!active) {
      return cancelText.length > 0 ? 'canceled' : null;
    }

    return (
      <div>
        <Button size="small" onClick={this.openModal}>{label}</Button>

        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              We Vote is a nonprofit and nonpartisan organization that relies the generous support from voters like you. Thank you!
            </p>
            <h1>&nbsp;</h1>
            <Table striped hover responsive>
              <tbody>
                <tr>
                  <td>Created:</td>
                  <td>{moment.utc(item.created).local().format('MMM D, YYYY,  h:mm a')}</td>
                </tr>
                <tr>
                  <td>{refundDonation ? 'Amount' : 'Monthly payment'}</td>
                  <td>{amount}</td>
                </tr>
                <tr>
                  <td>Funding:</td>
                  <td>{funding}</td>
                </tr>
                <tr>
                  <td>Card brand:</td>
                  <td>{brand}</td>
                </tr>
                <tr>
                  <td>&nbsp;&nbsp;Card ends with:</td>
                  <td>{last4}</td>
                </tr>
                <tr>
                  <td>&nbsp;&nbsp;Card expires:</td>
                  <td>{`${expMonth}/${expYear}`}</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeModal}>I changed my mind</Button>
            <Button onClick={() => this.cancelOrRefund(item)}>
              {refundDonation ? 'Refund this donation' : 'Cancel this subscription'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


