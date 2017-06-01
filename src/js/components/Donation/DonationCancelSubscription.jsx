import React, { Component, PropTypes } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import DonateActions from "../../actions/DonateActions";
import moment from "moment";


export default class DonationCancelSubscription extends Component {
  static propTypes = {
    item: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      showModal: false,
      cancelling: false,
    };
  }

  close () {
    this.setState({ showModal: false });
  }

  open () {
    this.setState({ showModal: true });
  }

  cancel (subscription_id) {
    this.setState({ cancelling: true });
    console.log("CANCEL");
    DonateActions.donationCancelSubscriptionAction(subscription_id);
    this.setState({ showModal: false });
  }

  render () {
    const {item} = this.props;
      return <div>
        <Button bsSize="small" onClick={this.open.bind(this)} >
          Cancel Subscription
        </Button>

        <Modal show={this.state.showModal} onHide={this.close.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Subscription</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped condensed hover responsive>
               <tbody>
                  <tr>
                    <td>Created:</td><td>{moment.utc(item.created).local().format("MMM D, h:mm a")}</td>
                  </tr>
                  <tr>
                    <td>Monthly payment:</td><td>{item.amount}</td>
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
            <Button onClick={this.cancel.bind(this, item.subscription_id)}>Cancel this subscription</Button>
          </Modal.Footer>
        </Modal>
      </div>;
  }
}
//item.subscription_id
