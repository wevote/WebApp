import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class BallotFilter extends Component {
  static propTypes = {
    params: PropTypes.object,
    pathname: PropTypes.string,
    ballot_type: PropTypes.string,
    length: PropTypes.number,
    length_remaining: PropTypes.number,
  };

  render () {
    let pathname = "/ballot";
    if (this.props.pathname && this.props.pathname !== "") {
      pathname = this.props.pathname;
    }

    return <ul className="nav ballot__tabs">
      <li className="tab-item">
        <Link to={pathname} className={this.props.ballot_type === "ALL_BALLOT_ITEMS" ? "tab tab-active" : "tab tab-default"}>
          <span>All Items ({this.props.length})</span>
        </Link>
      </li>

      { this.props.length === this.props.length_remaining ?
        null :
        <li className="tab-item">
          <Link to={{ pathname: pathname, query: { type: "filterRemaining" } }}
                className={this.props.ballot_type === "CHOICES_REMAINING" ? "tab tab-active" : "tab tab-default"}>
            <span>Remaining Decisions ({this.props.length_remaining})</span>
          </Link>
        </li>
      }

      <li className="tab-item">
        <Link to={{ pathname: pathname, query: { type: "filterReadyToVote" } }}
              className={ this.props.ballot_type === "READY_TO_VOTE" ? "tab tab-active" : "tab tab-default"}>
          <span>Vote!</span>
        </Link>
      </li>
    </ul>;
  }
}
