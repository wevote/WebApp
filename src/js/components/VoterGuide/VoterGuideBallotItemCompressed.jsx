import React, { Component, PropTypes } from "react";
import MeasureItemCompressed from "../../components/Ballot/MeasureItemCompressed";
import VoterGuideOfficeItemCompressed from "../../components/VoterGuide/VoterGuideOfficeItemCompressed";

const TYPES = require("keymirror")({
  OFFICE: null,
  MEASURE: null
});

export default class VoterGuideBallotItemCompressed extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    organization: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string.isRequired,
    toggleCandidateModal: PropTypes.func,
    toggleMeasureModal: PropTypes.func,
    we_vote_id: PropTypes.string.isRequired,
  };

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    return <div className="BallotItem card" id={this.props.we_vote_id}>
        { this.isMeasure() ?
          <MeasureItemCompressed {...this.props}
                   link_to_ballot_item_page /> :
          <VoterGuideOfficeItemCompressed {...this.props}
                   link_to_ballot_item_page />
        }
      </div>;
  }
}
