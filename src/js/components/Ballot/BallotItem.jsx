import React, { Component } from "react";
import PropTypes from "prop-types";
import CandidateList from "./CandidateList";
import { renderLog } from "../../utils/logging";
import MeasureItem from "./MeasureItem";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";

const TYPES = require("keymirror")({
  OFFICE: null,
  MEASURE: null,
});

export default class BallotItem extends Component {
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
    return (
      <div className="BallotItem" id={this.props.we_vote_id}>
        { this.isMeasure() ? (
          <MeasureItem
            {...this.props}
            link_to_ballot_item_page
          />
        ) : (
          <span>
            <h2 className="BallotItem__summary__item__display-name">
              { this.props.ballot_item_display_name }
            </h2>
            <BookmarkToggle
              we_vote_id={this.props.we_vote_id}
              type={this.props.kind_of_ballot_item}
            />
            <CandidateList
              children={this.props.candidate_list}
              contest_office_name={this.props.ballot_item_display_name}
            />
          </span>
        )}

      </div>
    );
  }
}
