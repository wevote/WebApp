import React, { Component, PropTypes } from "react";
import MeasureItemCompressed from "../../components/Ballot/MeasureItemCompressed";
import OfficeItemCompressedRaccoon from "../../components/Ballot/OfficeItemCompressedRaccoon";

const TYPES = require("keymirror")({
  OFFICE: null,
  MEASURE: null
});

export default class BallotItemCompressed extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    organization: PropTypes.object,
    organization_we_vote_id: PropTypes.string,
    toggleCandidateModal: PropTypes.func,
    toggleMeasureModal: PropTypes.func,
    we_vote_id: PropTypes.string.isRequired,
    updateRaccoonDetailsFlagTracker: PropTypes.func,
  };

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    return <div className="BallotItem card" id={this.props.we_vote_id}>
        { this.isMeasure() ?
          <MeasureItemCompressed {...this.props}
                   link_to_ballot_item_page /> :
          <OfficeItemCompressedRaccoon {...this.props}
                   link_to_ballot_item_page />
        }
      </div>;
  }
}
