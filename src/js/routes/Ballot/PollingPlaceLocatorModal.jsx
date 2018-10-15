import React, { Component } from "react";
import { cordovaDot, cordovaOpenSafariView, hasIPhoneNotch, historyPush, isWebApp } from "../../utils/cordovaUtils";
import { Modal } from "react-bootstrap";
import { renderLog } from "../../utils/logging";
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
    historyPush("/ballot");
  }

  render () {
    renderLog(__filename);

    if (isWebApp()) {
      return (
        <Modal bsPrefix="background-brand-blue modal"
               show={this.state.showPollingLocatorModal}
               onHide={() => this._openPollingLocatorModal(this)}>
          <Modal.Body>
            <div className="intro-modal__close">
              <a onClick={this._openPollingLocatorModal}
                 className={`intro-modal__close-anchor ${hasIPhoneNotch() ? "intro-modal__close-anchor-iphonex" : ""}`}>
                <img src={cordovaDot("/img/global/icons/x-close.png")} alt="close"/>
              </a>
            </div>
            <div key={1}><PollingPlaceLocator/></div>
          </Modal.Body>
        </Modal>
      );
    } else {
      return (
        <div>
          { cordovaOpenSafariView("https://s3-us-west-1.amazonaws.com/wevote/vip.html", 50) }
        </div>
      );
    }
  }
}
