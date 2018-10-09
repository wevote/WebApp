import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../../utils/logging";

export default class BallotTabsRaccoon extends Component {
  static propTypes = {
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

    let remaining_decisions_count_different_than_all_items = this.props.length !== this.props.length_remaining;
    let show_remaining_decisions = remaining_decisions_count_different_than_all_items && this.props.length_remaining || false;
    let show_decisions_made = remaining_decisions_count_different_than_all_items && this.props.length_remaining || false;
    let items_decided_count = this.props.length - this.props.length_remaining || 0;

    return <ul className="nav ballot__tabs">
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
        <Link to={pathname} className={this.props.ballot_type === "ALL_BALLOT_ITEMS" ? "tab tab--active" : "tab tab--default"}>
          <span>All Items ({this.props.length})</span>
        </Link>
      </li>

      { show_decisions_made ?
        <li className="tab__item">
          <Link to={{ pathname: pathname, query: { type: "filterDecided" } }}
                className={this.props.ballot_type === "ITEMS_DECIDED" ? "tab tab--active" : "tab tab--default"}>
            {/* Desktop */}
            <span className="d-none d-sm-block">Items Decided ({items_decided_count})</span>
            {/* Mobile */}
            <span className="d-block d-sm-none-block">Decided ({items_decided_count})</span>
          </Link>
        </li> :
        null
      }
    </ul>;
  }
}
