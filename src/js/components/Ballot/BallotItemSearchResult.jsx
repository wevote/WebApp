import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import MeasureItemCompressed from './MeasureItemCompressed';
import CandidateItemCompressed from './CandidateItemCompressed';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

export default class BallotItemSearchResult extends Component {
  isMeasure () {
    const { kindOfBallotItem } = this.props;
    return kindOfBallotItem === TYPES.MEASURE;
  }

  render () {
    renderLog('BallotItemSearchResult');  // Set LOG_RENDER_EVENTS to log all renders
    const { ballotItemWeVoteId, organization } = this.props;
    return (
      <div className="BallotItem card" id={ballotItemWeVoteId}>
        { this.isMeasure() ? (
          <MeasureItemCompressed
            measureWeVoteId={ballotItemWeVoteId}
            organization={organization}
          />
        ) : (
          <CandidateItemCompressed
            candidateWeVoteId={ballotItemWeVoteId}
            organization={organization}
          />
        )}
      </div>
    );
  }
}
BallotItemSearchResult.propTypes = {
  // allBallotItemsCount: PropTypes.number,
  kindOfBallotItem: PropTypes.string.isRequired,
  organization: PropTypes.object,
  ballotItemWeVoteId: PropTypes.string.isRequired,
  // updateOfficeDisplayUnfurledTracker: PropTypes.func,
};
