import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { renderLog } from '../../common/utils/logging';
import MeasureItemCompressed from './MeasureItemCompressed';
import OfficeItemCompressed from './OfficeItemCompressed';

export default class BallotItemCompressed extends PureComponent {
  render () {
    renderLog('BallotItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemDisplayName, candidateList, candidatesToShowForSearchResults,
      isFirstBallotItem, isMeasure,
      totalNumberOfBallotItems, weVoteId,
    } = this.props;
    return (
      <div id={weVoteId}>
        { isMeasure ? (
          <MeasureItemCompressed
            isFirstBallotItem={isFirstBallotItem}
            measureWeVoteId={weVoteId}
          />
        ) : (
          <OfficeItemCompressed
            officeWeVoteId={weVoteId}
            ballotItemDisplayName={ballotItemDisplayName}
            candidateList={candidateList}
            candidatesToShowForSearchResults={candidatesToShowForSearchResults}
            isFirstBallotItem={isFirstBallotItem}
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
  isFirstBallotItem: PropTypes.bool,
  isMeasure: PropTypes.bool,
  totalNumberOfBallotItems: PropTypes.number,
  weVoteId: PropTypes.string.isRequired,
};
