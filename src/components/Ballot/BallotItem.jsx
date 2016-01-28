import React, { Component, PropTypes } from 'react';
import BallotActions from 'actions/BallotActions';
import BallotStore from 'stores/BallotStore';
import CandidateList from 'components/Ballot/CandidateList';
import Measure from 'components/Ballot/Measure';
import StarAction from 'components/StarAction';

const TYPES = require('keymirror')({
  OFFICE: null,
  MEASURE: null
});

export default class BallotItem extends Component {
  static propTypes = {
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string,
    ballot_item_display_name: PropTypes.string,
    google_ballot_placement: PropTypes.number,
    google_civic_election_id: PropTypes.string,
    id: PropTypes.string,
    local_ballot_order: PropTypes.number,
    we_vote_id: PropTypes.string,
    is_support: PropTypes.string,
    is_oppose: PropTypes.string,
    is_starred: PropTypes.bool
  };

  constructor (props) {
    super(props);
  }

  isOffice () {
    return this.props.kind_of_ballot_item === TYPES.OFFICE;
  }

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  getCandidates () {
    return BallotStore.getCandidatesForBallot(this.props.we_vote_id);
  }

  render() {

    return (
      <div className="ballot-item well well-skinny gutter-top--small">

        <div className="display-name">
          { this.props.ballot_item_display_name }
        </div>

        <StarAction
          we_vote_id={ this.props.we_vote_id }
          is_starred={ this.props.is_starred } />

        { this.isMeasure() ? <Measure {...this.props} /> : <CandidateList children={this.getCandidates()}/> }


      </div>
    );
  }
}
