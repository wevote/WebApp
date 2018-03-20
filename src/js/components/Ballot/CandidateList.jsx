import React, { Component } from "react";
import PropTypes from "prop-types";
import CandidateItem from "../../components/Ballot/CandidateItem";

// This is related to components/VoterGuide/OrganizationVoterGuideCandidateList.jsx
export default class CandidateList extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    contest_office_name: PropTypes.string
  };

  render () {
    return <article className="card-main__list-group">
        { this.props.children.map( (child) =>
          <div key={child.we_vote_id} className="card">
            <CandidateItem key={child.we_vote_id}
                           contest_office_name={this.props.contest_office_name}
                           hidePositionStatement
                           link_to_ballot_item_page
                           position_list={child.position_list}
                           {...child}
            />
          </div>)
        }
      </article>;
  }
}
