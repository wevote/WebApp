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
        <span>All</span>
      </Link>

      <Link to={{ pathname: "/ballot", query: { type: "filterRemaining" } }} className={ ballot_type === "CHOICES_REMAINING" ? "active btn btn-default" : "btn btn-default"}>
        <span>Remaining</span>
      </Link>

      {/* <Link to={{ pathname: "/ballot", query: { type: "filterSupport" } }} className={ ballot_type === "WHAT_I_SUPPORT" ? "active btn btn-default" : "btn btn-default"}>
        <span>My Endorsements</span>
      </Link> */}

      <Link to="/bookmarks" className={ ballot_type === "BOOKMARKS" ? "active btn btn-default" : "btn btn-default"}>
        <span>Bookmarked</span>
      </Link>

      <Link to={{ pathname: "/ballot", query: { type: "filterReadyToVote" } }} className={ ballot_type === "READY_TO_VOTE" ? "active btn btn-default" : "btn btn-default"}>
        <span>Ready to Vote</span>
      </Link>

    </div>;
  }
}
