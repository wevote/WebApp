import React, { Component, PropTypes } from "react";
import CandidateItem from "../../components/Ballot/CandidateItem";

export default class CandidateList extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    office_name: PropTypes.string
  };

  render () {
    return <article className="list-group">
        { this.props.children.map( (child) =>
          <CandidateItem key={child.we_vote_id} office_name={this.props.office_name} {...child} />)
        }
      </article>;
  }
}
