import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import moment from "moment";
import { renderLog } from "../../utils/logging";

export default class BallotFilter extends Component {
  static propTypes = {
    params: PropTypes.object,
    pathname: PropTypes.string,
    ballot_type: PropTypes.string,
    election_day_text: PropTypes.string,
    length: PropTypes.number,
    length_remaining: PropTypes.number,
  };

  render () {
    renderLog(__filename);
    let pathname = "/ballot";
    if (this.props.pathname && this.props.pathname !== "") {
      pathname = this.props.pathname;
    }

    let show_remaining_decisions = this.props.length_remaining || false;

    return <ul className="nav ballot__tabs">
      <li className="tab__item">
        <Link to={pathname} className={this.props.ballot_type === "ALL_BALLOT_ITEMS" ? "tab tab--active" : "tab tab--default"}>
          <span>All Items ({this.props.length})</span>
        </Link>
      </li>

      { show_remaining_decisions ?
        <li className="tab__item">
          <Link to={{ pathname: pathname, query: { type: "filterRemaining" } }}
                className={this.props.ballot_type === "CHOICES_REMAINING" ? "tab tab--active" : "tab tab--default"}>
            {/* Desktop */}
            <span className="d-none d-sm-block">Remaining Decisions ({this.props.length_remaining})</span>
            {/* Mobile */}
            <span className="d-block d-sm-none-block">Decisions ({this.props.length_remaining})</span>
          </Link>
        </li> :
        null
      }

      <li className="tab__item">
        <Link to={{ pathname: pathname, query: { type: "filterReadyToVote" } }}
              className={ this.props.ballot_type === "READY_TO_VOTE" ? "tab tab--active" : "tab tab--default"}>
          <span>Vote{this.props.election_day_text ? " by " + moment(this.props.election_day_text).format("MMM Do, YYYY") : ""}!</span>
        </Link>
      </li>
    </ul>;
  }
}
