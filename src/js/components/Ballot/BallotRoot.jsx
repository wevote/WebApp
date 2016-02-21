import React, { Component, PropTypes } from "react";

import Office from "./Office";

export default class BallotRoot extends Component {
  static propTypes = {
    ballot: PropTypes.array
  };

  constructor (props) {
    super(props);
    this.state = {};

    this.ballot.map( (item) => {

      var {
        we_vote_id: key,
        kind_of_ballot_item: type,
        ballot_item_display_name: displayName,
        candidate_list: candidates
      } = item;

      if (type === "OFFICE")
        return <Office key={key} displayName={displayName} candidates={candidates} />;

    });

  }

  render () {
    const ballot =
      <div className="ballot">
      </div>;

    return ballot;
  }
}
