import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";

export default class CopyLinkModal extends Component {
  static propTypes = {
    urlBeingShared: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      value: "",
      copied: false
    };
  }

  componentWillMount () {
    this.setState({
      copied: false
    });
  }

  componentWillReceiveProps () {
    this.setState({
      copied: false
    });
  }

render () {
  let urlBeingShared = this.props.urlBeingShared;
  return <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-lg">Copy link to clipboard</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="input-group">
        <input value={urlBeingShared} className="form-control" style={{marginTop: "17px"}} onChange={({target: {value}}) => this.setState({value, copied: false})} />&nbsp;
          <span className="input-group-btn">
        <CopyToClipboard text={urlBeingShared} onCopy={() => this.setState({copied: true})}>
          <button className="copy-btn btn btn-default">Copy</button>
        </CopyToClipboard>
        </span>
      </div>
        {this.state.copied ? <span style={{color: "red"}}>Copied.  Can now paste into an email or social media!</span> : null}
    </Modal.Body>
  </Modal>;
  }
}
