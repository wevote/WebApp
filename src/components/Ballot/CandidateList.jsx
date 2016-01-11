import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Candidate from 'components/Ballot/Candidate';

export default class CandidateList extends Component {
  static propTypes = {
    candidate_list: PropTypes.array
  };

  mapListToHTML () {
    return this.props.candidate_list.map( candidate =>
      <Candidate key={candidate.we_vote_id} {...candidate} />
    );
  }

    render () {
      return (
          <article className="list-group">
            { this.mapListToHTML() }
          </article>
      );
    }
}
