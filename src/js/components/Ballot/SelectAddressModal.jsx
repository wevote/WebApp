import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import AddressBox from "../../components/AddressBox";

export default class SelectAddressModal extends Component {
  // This modal will allow users to change their addresses

  static propTypes = {
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <Modal className="select-address select-address__modal select-address__modal-mobile"
                  show={this.props.show}
                  onHide={this.props.toggleFunction} >
      <Modal.Header closeButton onHide={this.props.toggleFunction}>
        <Modal.Title className="select-address__h1">Enter address where you are registered to vote</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddressBox saveUrl={"/ballot"} toggleSelectAddressModal={this.props.toggleFunction} />
        <br/>
        <br/>
      </Modal.Body>
    </Modal>;
  }
}
