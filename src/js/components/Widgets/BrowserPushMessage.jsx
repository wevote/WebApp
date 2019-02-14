import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { isCordova } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

export default class BrowserPushMessage extends Component {
  static propTypes = {
    incomingProps: PropTypes.object, // needs more specificity
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    if (nextProps.incomingProps && nextProps.incomingProps.location && nextProps.incomingProps.location.state) {
      this.setState({
        message: nextProps.incomingProps.location.state.message,
        name: nextProps.incomingProps.location.state.message_name,
        type: nextProps.incomingProps.location.state.message_type,
      });
    }
  }

  render () {
    renderLog(__filename);
    let { message, type } = this.state;
    const { name } = this.state;

    if (name === 'test') {
      type = 'danger';
      message = 'Test message';
    }

    if (!type) {
      type = 'info';
    }

    return (
      <span>
        {message ? (
          <div className={isCordova() ? 'ballot__cordova-shim' : ''}>
            <Alert variant={type}>
              {message}
            </Alert>
          </div>
        ) :
          null }
      </span>
    );
  }
}
