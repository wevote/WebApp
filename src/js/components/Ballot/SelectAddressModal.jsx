import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import AddressBox from "../../components/AddressBox";
import { calculateBallotBaseUrl } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";

export default class SelectAddressModal extends Component {
  // This modal will allow users to change their addresses

  static propTypes = {
    ballotBaseUrl: PropTypes.string,
    pathname: PropTypes.string,
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    let ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, this.props.pathname);

    return <Modal className="select-address select-address__modal select-address__modal-mobile"
                  show={this.props.show}
                  onHide={this.props.toggleFunction} >
      <Modal.Header closeButton onHide={this.props.toggleFunction}>
        <Modal.Title className="select-address__h1">Enter address where you are registered to vote</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddressBox saveUrl={ballotBaseUrl} toggleSelectAddressModal={this.props.toggleFunction} />
        <br/>
        <br/>
      </Modal.Body>
    </Modal>;
  }
}
