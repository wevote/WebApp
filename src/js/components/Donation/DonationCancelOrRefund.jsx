import React, { Component, PropTypes } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import DonateActions from "../../actions/DonateActions";
import moment from "moment";


export default class DonationCancelOrRefund extends Component {
  static propTypes = {
    item: PropTypes.object,
    refundDonation: PropTypes.bool,   // true for refund donation, false for cancel subscription
  };

  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
      cancelling: false,
      refundDonation: true,
    };
  }

  close () {
    this.setState({ showModal: false });
  }

  open () {
    this.setState({ showModal: true });
  }

  cancel (item) {
    this.setState({ cancelling: true });
    console.log("CANCEL");
    if (this.cancelSubscription)
      DonateActions.donationCancelSubscriptionAction(item.subscription_id);
    else
      DonateActions.donationRefund(item.charge_id);
    this.setState({ showModal: false });
  }

  render () {
    const {item, refundDonation} = this.props;
    let label = refundDonation ? "Refund Donation" : "Cancel Subscription";
      return <div>
        <Button bsSize="small" onClick={this.open.bind(this)} >{label}</Button>

        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{label}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              We Vote is a nonprofit and nonpartisan organization that relies the generous support from voters like you. Thank you!
            </p>
            <h1>&nbsp;</h1>
            <Table striped condensed hover responsive>
               <tbody>
                  <tr>
                    <td>Created:</td><td>{moment.utc(item.created).local().format("MMM D, YYYY,  h:mm a")}</td>
                  </tr>
                  <tr>
                    <td>{refundDonation ? "Amount" : "Monthly payment"}</td><td>{item.amount}</td>
                  </tr>
                  <tr>
                    <td>Funding:</td><td>{item.funding}</td>
                  </tr>
                  <tr>
                    <td>Card brand:</td><td>{item.brand}</td>
                  </tr>
                  <tr>
                    <td>&nbsp;&nbsp;Card ends with:</td><td>{item.last4}</td>
                  </tr>
                  <tr>
                    <td>&nbsp;&nbsp;Card expires:</td><td>{item.exp_month + "/" + item.exp_year}</td>
                  </tr>
               </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close.bind(this)}>I changed my mind</Button>
            <Button onClick={this.cancel.bind(this, item)}>
              {refundDonation ? "Cancel this donation" : "Cancel this subscription"}</Button>
          </Modal.Footer>
        </Modal>
      </div>;
  }
}

