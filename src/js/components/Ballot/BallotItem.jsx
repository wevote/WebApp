import React, { Component, PropTypes } from "react";
import BallotStore from "../../stores/BallotStore";
import CandidateList from "../../components/Ballot/CandidateList";
import Measure from "../../components/Ballot/Measure";
import StarAction from "../../components/StarAction";

const TYPES = require("keymirror")({
  OFFICE: null,
  MEASURE: null
});

export default class BallotItem extends Component {

  constructor (props) {
    super(props);
  }

  isOffice () {
    return this.props.kind_of_ballot_item === TYPES.OFFICE;
  }

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {

    return (<div className="ballot-item well well-skinny gutter-top--small">

        <div className="display-name">
          { this.props.ballot_item_display_name }
        </div>

        <StarAction
          we_vote_id={ this.props.we_vote_id }
          is_starred={ this.props.is_starred } />

        { this.isMeasure() ? <Measure {...this.props} /> : <CandidateList children={this.props.candidate_list}/> }

      </div>);
  }
}
