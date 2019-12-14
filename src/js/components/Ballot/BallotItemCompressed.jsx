import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import MeasureItemCompressed from './MeasureItemCompressed';
import OfficeItemCompressed from './OfficeItemCompressed';

export default class BallotItemCompressed extends Component {
  static propTypes = {
    ballotItemDisplayName: PropTypes.string.isRequired,
    candidateList: PropTypes.array,
    weVoteId: PropTypes.string.isRequired,
    isMeasure: PropTypes.bool,
  };

  render () {
    renderLog('BallotItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    const { isMeasure, weVoteId, ballotItemDisplayName, candidateList } = this.props;
    return (
      <div className="BallotItem card" id={weVoteId}>
        { isMeasure ? (
          <MeasureItemCompressed
            measureWeVoteId={weVoteId}
          />
        ) : (
          <OfficeItemCompressed
            officeWeVoteId={weVoteId}
            ballotItemDisplayName={ballotItemDisplayName}
            candidateList={candidateList}
          />
        )}
      </div>
    );
  }
}
