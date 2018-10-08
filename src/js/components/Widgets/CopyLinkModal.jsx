import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { renderLog } from "../../utils/logging";
import CopyToClipboard from "react-copy-to-clipboard";

export default class CopyLinkModal extends Component {
  static propTypes = {
    urlBeingShared: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      value: "",
      was_copied: false,
    };
  }

  componentWillMount () {
    this.setState({
      was_copied: false,
    });
  }

  componentWillReceiveProps () {
    this.setState({
      was_copied: false,
    });
  }

  updateWasCopied () {
    this.setState({
      was_copied: true,
    });
  }

  render () {
    renderLog(__filename);
    let urlBeingShared = this.props.urlBeingShared;
    let browser_supports_CopyToClipboard = false; //latest iOS update supports CopyToClipboard, check for users version and let them copy if latest, perhaps with npm pckg "mobile-detect"
    let copy_btn_className;
    if (browser_supports_CopyToClipboard) {
      copy_btn_className = "copy-btn"; // display copy button at all times
    } else {
      copy_btn_className = "copy-btn hidden-xs"; // display: none; in mobile view
    }

    return <Modal {...this.props} size="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-lg">Copy link to clipboard</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="input-group">
          <input readOnly="true"
                    value={urlBeingShared}
                    className="form-control" />
            <span className="input-group-btn">
              <CopyToClipboard text={urlBeingShared} onCopy={this.updateWasCopied.bind(this)}>
                <button className={"btn btn-default " + copy_btn_className}>Copy</button>
              </CopyToClipboard>
            </span>
        </div>
      {this.state.was_copied ? <span style={{color: "red"}}>
        Link copied to your clipboard! You can now paste into an email or social media.
      </span> : null}
      </Modal.Body>
    </Modal>;
  }
}
