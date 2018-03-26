import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";
import { renderLog } from "../../utils/logging";

export default class BrowserPushMessage extends Component {
  static propTypes = {
    type: PropTypes.string,
    incomingProps: PropTypes.object //needs more specificity
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    if (nextProps.incomingProps && nextProps.incomingProps.location && nextProps.incomingProps.location.state) {
      this.setState({
        browser_history_message: nextProps.incomingProps.location.state.message,
        browser_history_message_name: nextProps.incomingProps.location.state.message_name,
        browser_history_message_type: nextProps.incomingProps.location.state.message_type
      });
    }
  }

	render () {
    renderLog(__filename);
    let { browser_history_message, browser_history_message_name, browser_history_message_type } = this.state;

    if (browser_history_message_name === "test") {
      browser_history_message_type = "danger";
      browser_history_message = "Test message";
    }

    if (!browser_history_message_type) {
      browser_history_message_type = "info";
    }

    return <span>
      {browser_history_message ?
        <Alert bsStyle={browser_history_message_type}>
          {browser_history_message}
        </Alert> :
        null }
      </span>;
	}
}
