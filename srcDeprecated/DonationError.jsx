import React, { Component } from 'react';
import { Badge } from '@material-ui/core';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';

export default class DonationError extends Component {
  render () {
    renderLog('DonationError');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Badge variant="warning">{this.props.errorMessage}</Badge>
      </div>
    );
  }
}
DonationError.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};
