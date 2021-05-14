import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
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
            {...this.props}
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
  organization: PropTypes.object.isRequired,
  organizationWeVoteId: PropTypes.string.isRequired,
  urlWithoutHash: PropTypes.string,
  we_vote_id: PropTypes.string.isRequired,
};
