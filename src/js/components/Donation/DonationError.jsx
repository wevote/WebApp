import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';

const Badge = React.lazy(() => import('react-bootstrap/Badge'));

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
