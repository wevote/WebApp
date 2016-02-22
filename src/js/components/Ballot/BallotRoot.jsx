import React, { Component, PropTypes } from "react";

import Office from "./Office";
import Measure from "./Measure";

export default class BallotRoot extends Component {

  static propTypes = {
    // RAW ballot data from server
    ballot: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.state = {};
    this.ballot = this.props.ballot.map(this.mapItems);
  }

  mapItems (item) {
    var {
      we_vote_id: key,
      kind_of_ballot_item: type,
      ballot_item_display_name: displayName,
      candidate_list: candidates
    } = item;

    if (type === "OFFICE")
      return <Office key={key} displayName={displayName} candidates={candidates} />;

    else if (type === "MEASURE")
      return <Measure key={key} displayName={displayName} />;
  }

  render () {
    const ballot =
      <div className="ballot">
        {this.ballot}
      </div>;

    return ballot;
  }
}
