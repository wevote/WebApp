import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class BallotFilter extends Component {
  static propTypes = {
    params: PropTypes.object,
    ballot_type: PropTypes.string
  };


  render () {
    const {ballot_type} = this.props;

    return <div className="btn-group">
      <Link to="/ballot" className={ ballot_type === "ALL_BALLOT_ITEMS" ? "active btn btn-default" : "btn btn-default"}>
        <span>All Items</span>
      </Link>

      <Link to={{ pathname: "/ballot", query: { type: "filterRemaining" } }} className={ ballot_type === "CHOICES_REMAINING" ? "active btn btn-default" : "btn btn-default"}>
        <span>Remaining</span>
      </Link>

      <Link to={{ pathname: "/ballot", query: { type: "filterReadyToVote" } }} className={ ballot_type === "READY_TO_VOTE" ? "active btn btn-default" : "btn btn-default"}>
        <span>Ready to Vote</span>
      </Link>

    </div>;
  }
}
