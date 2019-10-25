import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';

export default class BallotIndex extends Component {
  static propTypes = {
    children: PropTypes.object,
  };

  render () {
    renderLog('BallotIndex');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div className="ballot_index">
        { this.props.children }
      </div>
    );
  }
}
