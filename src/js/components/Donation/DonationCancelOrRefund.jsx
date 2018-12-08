import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table, Modal, Button } from "react-bootstrap";
import moment from "moment";
import DonateActions from "../../actions/DonateActions";
import { renderLog } from "../../utils/logging";

export default class DonationCancelOrRefund extends Component {
  static propTypes = {
    item: PropTypes.object,
    refundDonation: PropTypes.bool, // true for refund donation, false for cancel subscription
    active: PropTypes.bool,
    cancelText: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  close () {
    this.setState({ showModal: false });
  }

  open () {
    this.setState({ showModal: true });
  }

  cancel (item) {
    console.log(`cancel Subscription${item}`);
    if (this.props.refundDonation) {
      DonateActions.donationRefund(item.charge_id);
    } else {
      DonateActions.donationCancelSubscriptionAction(item.subscription_id);
    }

    this.setState({ showModal: false });
  }

  render () {
    renderLog(__filename);
    const { item, refundDonation, active, cancelText } = this.props;
    const label = refundDonation ? "Refund Donation" : "Cancel Subscription";

    if (!active) {
      return cancelText.length > 0 ? "canceled" : null;
    }

    return (
      <div>
        <Button size="small" onClick={this.open.bind(this)}>{label}</Button>

        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
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
                  <td>{moment.utc(item.created).local().format("MMM D, YYYY,  h:mm a")}</td>
                </tr>
                <tr>
                  <td>{refundDonation ? "Amount" : "Monthly payment"}</td>
                  <td>{item.amount}</td>
                </tr>
                <tr>
                  <td>Funding:</td>
                  <td>{item.funding}</td>
                </tr>
                <tr>
                  <td>Card brand:</td>
                  <td>{item.brand}</td>
                </tr>
                <tr>
                  <td>&nbsp;&nbsp;Card ends with:</td>
                  <td>{item.last4}</td>
                </tr>
                <tr>
                  <td>&nbsp;&nbsp;Card expires:</td>
                  <td>{`${item.exp_month}/${item.exp_year}`}</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>I changed my mind</Button>
            <Button onClick={this.cancel.bind(this, item)}>
              {refundDonation ? "Refund this donation" : "Cancel this subscription"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

