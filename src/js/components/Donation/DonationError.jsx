import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import { renderLog } from '../../utils/logging';

export default class DonationError extends Component {
  static propTypes = {
    errorMessage: PropTypes.string.isRequired,
  };

  render () {
    renderLog(__filename);
    return (
      <div>
        <Badge variant="warning">{this.props.errorMessage}</Badge>
      </div>
    );
  }
}
