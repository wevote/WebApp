import React, { Component, PropTypes } from "react";
import MeasureItemCompressed from "../../components/Ballot/MeasureItemCompressed";
import OfficeItemCompressed from "../../components/Ballot/OfficeItemCompressed";

const TYPES = require("keymirror")({
  OFFICE: null,
  MEASURE: null
});

export default class BallotItemCompressed extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    we_vote_id: PropTypes.string.isRequired,
    _toggleCandidateModal: PropTypes.func,
    _toggleMeasureModal: PropTypes.func
  };

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    return <div className="BallotItem card" id={this.props.we_vote_id}>
        { this.isMeasure() ?
          <MeasureItemCompressed {...this.props}
                   link_to_ballot_item_page /> :
          <OfficeItemCompressed {...this.props}
                   link_to_ballot_item_page />
        }
      </div>;
  }
}
