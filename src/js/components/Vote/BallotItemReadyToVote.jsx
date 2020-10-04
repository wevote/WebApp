import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { renderLog } from '../../utils/logging';
import MeasureItemReadyToVote from './MeasureItemReadyToVote';
import OfficeItemReadyToVote from './OfficeItemReadyToVote';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

class BallotItemReadyToVote extends Component {
  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    renderLog('BallotItemReadyToVote');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <>
        { this.isMeasure() ? (
          <MeasureItemReadyToVote
            ballotItemDisplayName={this.props.ballot_item_display_name}
            measureWeVoteId={this.props.we_vote_id}
          />
        ) : (
          <OfficeItemReadyToVote
            candidateList={this.props.candidate_list}
          />
        )}
      </>
    );
  }
}
BallotItemReadyToVote.propTypes = {
  kind_of_ballot_item: PropTypes.string.isRequired,
  we_vote_id: PropTypes.string.isRequired,
  ballot_item_display_name: PropTypes.string.isRequired,
  candidate_list: PropTypes.array,
};

export default withTheme(BallotItemReadyToVote);
