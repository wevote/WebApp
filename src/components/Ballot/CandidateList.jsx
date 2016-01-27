import React, { Component, PropTypes } from 'react';
import Candidate from 'components/Ballot/Candidate';

export default class CandidateList extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <article className="list-group">
        { this.props.children.map( (child) => <Candidate key={child.we_vote_id} {...child} />) }
      </article>
    );
  }
}
