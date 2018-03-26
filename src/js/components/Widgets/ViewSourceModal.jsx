import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import { $ajax } from "../../utils/service";
import $ from "jquery";
import { renderLog } from "../../utils/logging";

export default class ViewSourceModal extends Component {
  static propTypes = {
    url: PropTypes.string
  };

  componentDidMount () {
//seems to be querying local server rather than external page.  we would like
//this function to make GET request to external server and return the content of the page.
    // let jquerytest = $(function () {$("#external-webpage-content").load("http://www.theleaguesf.org/#d14");});
    // console.log("jquerytest", jquerytest);
    this.renderExternalPage();
  }

  renderExternalPage () {
    let url = this.props.url;
    //not functioning as expected, we would like to see the text of the url
    //inserted into the span with the id external-webpage-content, as a test to prepare
    //for actual webpage content being inserted
    $("#external-webpage-content").text(url);
    // console.log("url:", url);
  }

  render () {
    renderLog(__filename);
    let content = "";
    // might be easier to store content in local variable instead of inserting via jquery method
    return <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-lg">Source of position</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span id="external-webpage-content">{content}</span>
      </Modal.Body>
    </Modal>;
  }
}
