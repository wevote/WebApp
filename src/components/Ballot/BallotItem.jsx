import React, { Component, PropTypes } from 'react';
import BallotActions from 'actions/BallotActions';
import BallotStore from 'stores/BallotStore';
import CandidateStore from 'stores/CandidateStore';
import CandidateList from 'components/Ballot/CandidateList';

import Measure from 'components/Ballot/Measure';

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
    we_vote_id: PropTypes.string,
    is_support: PropTypes.string,
    is_oppose: PropTypes.string,
    VoterStarred: PropTypes.string
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
        candidate_list: [],
        VoterStarred: this.props.VoterStarred
      };

      CandidateStore.getCandidatesByBallotId(
        this.props.we_vote_id, this.setCandidates.bind(this)
      );
    }

    else
      this.state = {
        supportCount: null,
        opposeCount: null,
        VoterStarred: this.props.VoterStarred
      };
    BallotStore.addChangeListener(this._onChange.bind(this));
  }

  setCandidates (value) {
    this.setState({
      candidate_list: value.candidate_list
    });
  }

  displayCandidateList () {

    return this.state.candidate_list ?
      <CandidateList candidate_list={this.state.candidate_list} />
      : (<i className="fa fa-spinner fa-pulse"></i>);

  }

  displayMeasure () {
    return <Measure {...this.props} />
  }

  componentWillUnmount() {
    BallotStore.removeChangeListener(this._onChange.bind(this));
  }

  _onChange () {
    BallotStore.getBallotItemByWeVoteId(
      this.props.we_vote_id, ballot_item => this.setState({
        VoterStarred: ballot_item.VoterStarred,
      })
    );
  }

  render() {

    return (
      <div className="ballot-item well well-skinny split-top-skinny">

        <div className="display-name">
          { this.props.ballot_item_display_name }
        </div>

        <StarAction action={BallotActions} we_vote_id={this.props.we_vote_id} VoterStarred={this.state.VoterStarred}/>

        {
          this.isOffice() ?
            this.displayCandidateList() : this.displayMeasure()
        }

      </div>
    )
  }
}
