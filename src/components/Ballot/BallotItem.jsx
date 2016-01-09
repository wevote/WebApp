import React, { Component, PropTypes } from 'react';

import CandidateStore from 'stores/CandidateStore';
import CandidateList from 'components/Ballot/CandidateList';

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

  isOffice () {
    return this.props.kind_of_ballot_item === TYPES.OFFICE;
  }

  componentDidMount () {
    if ( this.isOffice() ) {
      this.state = {
        candidate_list: []
      };

      CandidateStore.getCandidatesByBallotId(
        this.props.we_vote_id, this.setCandidates.bind(this)
      );
    }

    else
      this.state = {
        supportCount: null,
        opposeCount: null
      };
  }

  setCandidates (value) {
    this.setState({
      candidate_list: value.candidate_list
    });
  }

  displayCandidateList () {

    return this.state.candidate_list ?
        <CandidateList candidate_list={this.state.candidate_list} />
      : 'loading...';

  }

  displayMeasureCounts () {
    return (
      <div>
        <div className="support">
          ?? support
        </div>
        <div className="oppose">
          ?? support
        </div>
      </div>
    );
  }

  render() {

    return (
      <div
        id={ this.props.we_vote_id }
        className="ballot-item well well-skinny split-top-skinny">

        { this.props.ballot_item_display_name }

        <InfoIconAction />
        <StarAction />

        <ul >
            {
              this.isOffice() ?
                this.displayCandidateList() : this.displayMeasureCounts()
            }
        </ul>

      </div>
    )
  }
}
