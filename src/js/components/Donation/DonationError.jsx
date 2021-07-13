import React, { Component } from 'react';
import { Badge } from '@material-ui/core';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';

/*
July 2021 TODO: Same named file in the WebApp and Campaigns -- PLEASE KEEP THEM IDENTICAL -- make symmetrical changes and test on both sides
*/

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
