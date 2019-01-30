import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import MeasureItemCompressed from "./MeasureItemCompressed";
import CandidateItemCompressed from "./CandidateItemCompressed";

const TYPES = require("keymirror")({
  OFFICE: null,
  MEASURE: null,
});

export default class BallotItemSearchResult extends Component {
  static propTypes = {
    allBallotItemsCount: PropTypes.number,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    organization: PropTypes.object,
    organization_we_vote_id: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
    updateOfficeDisplayUnfurledTracker: PropTypes.func,
  };

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    renderLog(__filename);
    return (
      <div className="BallotItem card" id={this.props.we_vote_id}>
        { this.isMeasure() ? (
          <MeasureItemCompressed
            {...this.props}
            link_to_ballot_item_page
          />
        ) :
          <CandidateItemCompressed oneCandidate={this.props} />
        }
      </div>
    );
  }
}
