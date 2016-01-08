import React, { Component, PropTypes } from 'react';

import CandidateStore from 'stores/CandidateStore';
import Candidate from 'components/Ballot/CandidateList';

import InfoIconAction from 'components/InfoIconAction';
import StarAction from 'components/StarAction';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null
});

export default class BallotItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string,
    google_ballot_placement: PropTypes.number,
    google_civic_election_id: PropTypes.string,
    id: PropTypes.string,
    kind_of_ballot_item: PropTypes.string,
    local_ballot_order: PropTypes.number,
    we_vote_id: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    if ( this.props.kind_of_ballot_item === TYPES.OFFICE ) {
      CandidateStore.getCandidatesByBallotId(
        this.props.we_vote_id, this.setCandidates
      );
    }

    else
      this.state = {
        supportCount: null,
        opposeCount: null
      };
  }

  setCandidates (value) {
    console.log(value);
  }

  render() {
    return (
      <div
        id={ this.props.we_vote_id }
        className="ballot-item well well-skinny split-top-skinny">

        { this.props.ballot_item_display_name }

        <InfoIconAction />
        <StarAction />

        <ul className="list-group">
            { 'candidate list ' + 'or none,...'  }
        </ul>

      </div>
    )
  }
}
