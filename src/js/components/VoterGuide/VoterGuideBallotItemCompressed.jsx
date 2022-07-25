import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';
import VoterGuideMeasureItemCompressed from './VoterGuideMeasureItemCompressed';
import VoterGuideOfficeItemCompressed from './VoterGuideOfficeItemCompressed';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null,
});

export default class VoterGuideBallotItemCompressed extends Component {
  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    renderLog('VoterGuideBallotItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div className="BallotItem card" id={this.props.we_vote_id}>
        { this.isMeasure() ? (
          <VoterGuideMeasureItemCompressed
            measureWeVoteId={this.props.we_vote_id}
            organizationWeVoteId={this.props.organizationWeVoteId}
          />
        ) : (
          <VoterGuideOfficeItemCompressed
            we_vote_id={this.props.we_vote_id}
            ballot_item_display_name={this.props.ballot_item_display_name}
            candidate_list={this.props.candidate_list}
            organizationWeVoteId={this.props.organizationWeVoteId}
          />
        )}
      </div>
    );
  }
}
VoterGuideBallotItemCompressed.propTypes = {
  ballot_item_display_name: PropTypes.string.isRequired,
  candidate_list: PropTypes.array,
  kind_of_ballot_item: PropTypes.string.isRequired,
  organizationWeVoteId: PropTypes.string.isRequired,
  we_vote_id: PropTypes.string.isRequired,
};
