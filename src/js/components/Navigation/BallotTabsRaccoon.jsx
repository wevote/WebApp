import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import BallotActions from "../../actions/BallotActions";
import { renderLog } from "../../utils/logging";

export default class BallotTabsRaccoon extends Component {
  static propTypes = {
    completionLevelFilterType: PropTypes.string,
    election_day_text: PropTypes.string,
    length: PropTypes.number,
    length_remaining: PropTypes.number,
  };

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.props.completionLevelFilterType !== nextProps.completionLevelFilterType) {
      // console.log("shouldComponentUpdate: this.props.completionLevelFilterType", this.props.completionLevelFilterType, ", nextProps.completionLevelFilterType", nextProps.completionLevelFilterType);
      return true;
    }
    if (this.props.length !== nextProps.length) {
      // console.log("shouldComponentUpdate: this.props.length", this.props.length, ", nextProps.length", nextProps.length);
      return true;
    }
    if (this.props.length_remaining !== nextProps.length_remaining) {
      // console.log("shouldComponentUpdate: this.props.length_remaining", this.props.length_remaining, ", nextProps.length_remaining", nextProps.length_remaining);
      return true;
    }
    return false;
  }

  goToDifferentCompletionLevelTab (completionLevelFilterType = "") {
    BallotActions.completionLevelFilterTypeSave(completionLevelFilterType);
  }

  render () {
    // console.log("BallotTabsRaccoon render, this.props.completionLevelFilterType:", this.props.completionLevelFilterType);
    renderLog(__filename);

    let remaining_decisions_count_different_than_all_items = this.props.length !== this.props.length_remaining;
    let show_remaining_decisions = remaining_decisions_count_different_than_all_items && this.props.length_remaining || false;
    let show_decisions_made = remaining_decisions_count_different_than_all_items && this.props.length_remaining || false;
    let items_decided_count = this.props.length - this.props.length_remaining || 0;

    return <ul className="nav ballot__tabs">
      <li className="tab__item">
        <Link onClick={() => this.goToDifferentCompletionLevelTab("filterAllBallotItems")}
              className={this.props.completionLevelFilterType === "filterAllBallotItems" ? "tab tab--active" : "tab tab--default"}>
          {/* Desktop */}
          <span className="d-none d-sm-block">All Items ({this.props.length})</span>
          {/* Mobile */}
          <span className="d-block d-sm-none">All ({this.props.length})</span>
        </Link>
      </li>

      { show_remaining_decisions ?
        <li className="tab__item">
          <Link onClick={() => this.goToDifferentCompletionLevelTab("filterRemaining")}
                className={this.props.completionLevelFilterType === "filterRemaining" ? "tab tab--active" : "tab tab--default"}>
            {/* Desktop */}
            <span className="d-none d-sm-block">Remaining Decisions ({this.props.length_remaining})</span>
            {/* Mobile */}
            <span className="d-block d-sm-none">Decisions ({this.props.length_remaining})</span>
          </Link>
        </li> :
        null
      }

      { show_decisions_made ?
        <li className="tab__item">
          <Link onClick={() => this.goToDifferentCompletionLevelTab("filterDecided")}
                className={this.props.completionLevelFilterType === "filterDecided" ? "tab tab--active" : "tab tab--default"}>
            {/* Desktop */}
            <span className="d-none d-sm-block">Items Decided ({items_decided_count})</span>
            {/* Mobile */}
            <span className="d-block d-sm-none">Decided ({items_decided_count})</span>
          </Link>
        </li> :
        null
      }
    </ul>;
  }
}
