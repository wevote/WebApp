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
    return <Modal show onHide={this.props.toggleFunction} className="ballot-election-list ballot-election-list__modal" >
      <Modal.Header closeButton onHide={this.props.toggleFunction}>
        <Modal.Title className="ballot-election-list__h1">Enter address where you are registered to vote</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddressBox saveUrl={"/ballot"} _toggleSelectAddressModal={this.props.toggleFunction} />
        <br/>
        <br/>
      </Modal.Body>
    </Modal>;
  }
}
