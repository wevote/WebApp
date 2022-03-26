import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { renderLog } from '../../common/utils/logging';
import MeasureItemCompressed from './MeasureItemCompressed';
import OfficeItemCompressed from './OfficeItemCompressed';

export default class BallotItemCompressed extends PureComponent {
  render () {
    renderLog('BallotItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      isMeasure, weVoteId, ballotItemDisplayName, candidateList, candidatesToShowForSearchResults,
      totalNumberOfBallotItems,
    } = this.props;
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
            candidatesToShowForSearchResults={candidatesToShowForSearchResults}
            totalNumberOfBallotItems={totalNumberOfBallotItems}
          />
        )}
      </div>
    );
  }
}
BallotItemCompressed.propTypes = {
  ballotItemDisplayName: PropTypes.string.isRequired,
  candidateList: PropTypes.array,
  candidatesToShowForSearchResults: PropTypes.array,
  isMeasure: PropTypes.bool,
  totalNumberOfBallotItems: PropTypes.number,
  weVoteId: PropTypes.string.isRequired,
};
