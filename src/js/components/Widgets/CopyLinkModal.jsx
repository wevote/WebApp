import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import { renderLog } from '../../utils/logging';

export default class CopyLinkModal extends Component {
  static propTypes = {
    urlBeingShared: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      wasCopied: false,
    };
  }

  componentWillMount () {
    this.setState({
      wasCopied: false,
    });
  }

  componentWillReceiveProps () {
    this.setState({
      wasCopied: false,
    });
  }

  updateWasCopied = () => {
    this.setState({
      wasCopied: true,
    });
  }

  render () {
    renderLog(__filename);
    const { urlBeingShared } = this.props;
    const browserSupportsCopyToClipboard = false; // latest iOS update supports CopyToClipboard, check for users version and let them copy if latest, perhaps with npm pckg "mobile-detect"
    let copyBtnClassName;
    if (browserSupportsCopyToClipboard) {
      copyBtnClassName = 'copy-btn'; // display copy button at all times
    } else {
      copyBtnClassName = 'copy-btn d-none d-sm-block'; // display: none; in mobile view
    }

    return (
      <Modal {...this.props} size="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Copy link to clipboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group">
            <input
              readOnly="true"
              value={urlBeingShared}
              className="form-control"
            />
            <span className="input-group-btn">
              <CopyToClipboard text={urlBeingShared} onCopy={this.updateWasCopied}>
                <button className={`btn btn-default ${copyBtnClassName}`} type="button">Copy</button>
              </CopyToClipboard>
            </span>
          </div>
          {this.state.wasCopied ? (
            <span style={{ color: 'red' }}>
              Link copied to your clipboard! You can now paste into an email or social media.
            </span>
          ) : null
          }
        </Modal.Body>
      </Modal>
    );
  }
}
