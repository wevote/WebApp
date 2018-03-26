import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import MeasureItemReadyToVote from "../../components/Ballot/MeasureItemReadyToVote";
import OfficeItemReadyToVote from "../../components/Ballot/OfficeItemReadyToVote";

const TYPES = require("keymirror")({
  OFFICE: null,
  MEASURE: null,
});

export default class BallotItemReadyToVote extends Component {
  static propTypes = {
    kind_of_ballot_item: PropTypes.string.isRequired,
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
  };

  isMeasure () {
    return this.props.kind_of_ballot_item === TYPES.MEASURE;
  }

  render () {
    renderLog(__filename);
    return <div className="BallotItem card" id={this.props.we_vote_id}>
        { this.isMeasure() ?
          <MeasureItemReadyToVote {...this.props}
                   link_to_ballot_item_page /> :
          <OfficeItemReadyToVote {...this.props}
                   link_to_ballot_item_page />
        }
      </div>;
  }
}
