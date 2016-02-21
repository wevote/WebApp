import React, { Component, PropTypes } from "react";

import Candidate from "./Candidate";
import Star from "../StarAction";

export default class Office extends Component {
  static propTypes = {
    key: PropTypes.string,
    displayName: PropTypes.string,
    candidates: PropTypes.array
  };

  constructor (props) {
    super(props);

    this.candidates.map( (candidate) => {

      var {
        we_vote_id: _key,
        ballot_item_display_name: name,
        candidate_photo_url: url
      } = candidate;

      return <Candidate key={_key} name={name} image={url}/>;

    });
  }

  render () {
    var { key, displayName, candidates } = this.props;

    const office =
      <div className="office ballot-item well well-skinny gutter-top--small">
        <div className="display-name">
          {displayName}
        </div>

        <Star key={key} type="OFFICE"/>

        {candidates}

      </div>;

    return office;
  }
}
