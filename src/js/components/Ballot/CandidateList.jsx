import React, { Component, PropTypes } from 'react';
import CandidateItem from '../../components/Ballot/CandidateItem';

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
        { this.props.children.map( (child) => <CandidateItem key={child.we_vote_id} {...child} />) }
      </article>
    );
  }
}
