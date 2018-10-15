import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import BallotSideBar from "../Navigation/BallotSideBar";
import { renderLog } from "../../utils/logging";


export default class BallotSummaryModal extends Component {
  // This modal shows the ballot summary

  static propTypes = {
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    return <Modal bsPrefix="ballot-summary ballot-summary__modal ballot-summary__modal-mobile"
                  show={this.props.show}
                  onHide={this.props.toggleFunction} >
        <Modal.Header closeButton>
          <Modal.Title bsPrefix="ballot-summary__h1">Summary of Ballot Items</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BallotSideBar displayTitle={false} displaySubtitles={false} onClick={this.props.toggleFunction} />
        </Modal.Body>
      </Modal>;
  }
}
