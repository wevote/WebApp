import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { renderLog } from '../../common/utils/logging';
import BallotSharedMeasureItem from './BallotSharedMeasureItem';
import BallotSharedOfficeItem from './BallotSharedOfficeItem';

export default class BallotSharedBallotItem extends PureComponent {
  render () {
    renderLog('BallotSharedBallotItem');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      ballotItemDisplayName, candidateList, candidatesToShowForSearchResults,
      isFirstBallotItem, isMeasure, isOpposeOrNegativeRating, isSupportOrPositiveRating,
      statementText, totalNumberOfBallotItems, weVoteId,
    } = this.props;
    return (
      <div id={weVoteId}>
        { isMeasure ? (
          <BallotSharedMeasureItem
            isFirstBallotItem={isFirstBallotItem}
            isOpposeOrNegativeRating={isOpposeOrNegativeRating}
            isSupportOrPositiveRating={isSupportOrPositiveRating}
            measureWeVoteId={weVoteId}
            statementText={statementText}
          />
        ) : (
          <BallotSharedOfficeItem
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
BallotSharedBallotItem.propTypes = {
  ballotItemDisplayName: PropTypes.string.isRequired,
  candidateList: PropTypes.array,
  candidatesToShowForSearchResults: PropTypes.array,
  isFirstBallotItem: PropTypes.bool,
  isMeasure: PropTypes.bool,
  isOpposeOrNegativeRating: PropTypes.bool,
  isSupportOrPositiveRating: PropTypes.bool,
  statementText: PropTypes.string,
  totalNumberOfBallotItems: PropTypes.number,
  weVoteId: PropTypes.string.isRequired,
};
