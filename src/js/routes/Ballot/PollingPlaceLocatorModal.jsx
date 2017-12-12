import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Modal } from "react-bootstrap";
import PollingPlaceLocator from "../../components/Ballot/PollingPlaceLocator";

export default class PollingPlaceLocatorModal extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      showPollingLocatorModal: true,
    };
    this._openPollingLocatorModal = this._openPollingLocatorModal.bind(this);
  }

  _openPollingLocatorModal () {
    this.setState({ showPollingLocatorModal: !this.state.showPollingLocatorModal });
    browserHistory.push("/ballot");
  }

  render () {
    return (
      <Modal bsClass="background-brand-blue modal"
             show={this.state.showPollingLocatorModal}
             onHide={() => this._openPollingLocatorModal(this)}>
        <Modal.Body>
          <div className="intro-modal__close">
            <a onClick={this._openPollingLocatorModal} className="intro-modal__close-anchor">
              <img src="/img/global/icons/x-close.png" alt="close" />
            </a>
          </div>
          <div key={1}><PollingPlaceLocator /></div>
        </Modal.Body>
      </Modal>
    );
  }
}
