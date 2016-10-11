import React, { Component, PropTypes } from "react";
import { Alert } from "react-bootstrap";

export default class BrowserPushMessage extends Component {
  static propTypes = {
    type: PropTypes.string
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
    let { browser_history_message, browser_history_message_name, browser_history_message_type } = this.state;

    if (browser_history_message_name == "test") {
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
