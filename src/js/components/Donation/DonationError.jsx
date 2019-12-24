import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Badge from 'react-bootstrap/esm/Badge';
import { renderLog } from '../../utils/logging';

export default class DonationError extends Component {
  static propTypes = {
    errorMessage: PropTypes.string.isRequired,
  };

  render () {
    renderLog('DonationError');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Badge variant="warning">{this.props.errorMessage}</Badge>
      </div>
    );
  }
}
