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
  static propTypes = {
    // allBallotItemsCount: PropTypes.number,
    kind_of_ballot_item: PropTypes.string.isRequired,
    organization: PropTypes.object,
    we_vote_id: PropTypes.string.isRequired,
    // updateOfficeDisplayUnfurledTracker: PropTypes.func,
  };

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    renderLog(__filename);
    return (
      <div className="BallotItem card" id={this.props.we_vote_id}>
        { this.isMeasure() ? (
          <MeasureItemCompressed
            measureWeVoteId={this.props.we_vote_id}
            organization={this.props.organization}
          />
        ) : (
          <CandidateItemCompressed
            candidateWeVoteId={this.props.we_vote_id}
            organization={this.props.organization}
          />
        )
        }
      </div>
    );
  }
}
