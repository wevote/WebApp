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
      foundInSearchWords,
      isFirstBallotItem, isMeasure, primaryParty,
      useHelpDefeatOrHelpWin, weVoteId,
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
            ballotItemDisplayName={ballotItemDisplayName}
            candidateList={candidateList}
            candidatesToShowForSearchResults={candidatesToShowForSearchResults}
            disableAutoRollUp
            foundInSearchWords={foundInSearchWords}
            isFirstBallotItem={isFirstBallotItem}
            officeWeVoteId={weVoteId}
            primaryParty={primaryParty}
            useHelpDefeatOrHelpWin={useHelpDefeatOrHelpWin}
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
  foundInSearchWords: PropTypes.bool,
  isFirstBallotItem: PropTypes.bool,
  isMeasure: PropTypes.bool,
  primaryParty: PropTypes.string,
  useHelpDefeatOrHelpWin: PropTypes.bool,
  weVoteId: PropTypes.string.isRequired,
};
