import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import MeasureItemReadyToVote from './MeasureItemReadyToVote';
import OfficeItemReadyToVote from './OfficeItemReadyToVote';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

class BallotItemReadyToVote extends Component {
  isMeasure () {
    return this.props.kindOfBallotItem === TYPES.MEASURE;
  }

  render () {
    renderLog('BallotItemReadyToVote');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <>
        { this.isMeasure() ? (
          <MeasureItemReadyToVote
            ballotItemDisplayName={this.props.ballotItemDisplayName}
            measureWeVoteId={this.props.weVoteId}
          />
        ) : (
          <OfficeItemReadyToVote
            candidateList={this.props.candidateList}
          />
        )}
      </>
    );
  }
}
BallotItemReadyToVote.propTypes = {
  ballotItemDisplayName: PropTypes.string.isRequired,
  candidateList: PropTypes.array,
  kindOfBallotItem: PropTypes.string.isRequired,
  weVoteId: PropTypes.string.isRequired,
};

export default withTheme(BallotItemReadyToVote);
