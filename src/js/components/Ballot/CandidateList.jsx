import React, { Component, PropTypes } from "react";
import CandidateItem from "../../components/Ballot/CandidateItem";

export default class CandidateList extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    contest_office_name: PropTypes.string
  };

  render () {
    return <article className="card-main__list-group">
        { this.props.children.map( (child) =>
          <div key={child.we_vote_id} className="card">
            <CandidateItem key={child.we_vote_id} link_to_ballot_item_page contest_office_name={this.props.contest_office_name} {...child} />
          </div>)
        }
      </article>;
  }
}
