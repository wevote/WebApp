import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import OrganizationVoterGuideCandidateItem from "./OrganizationVoterGuideCandidateItem";

// This is related to components/Ballot/CandidateList.jsx
export default class OrganizationVoterGuideCandidateList extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    contest_office_name: PropTypes.string,
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  render () {
    renderLog(__filename);
    return (
      <article className="card-main__list-group">
        { this.props.children.map( child => (
          <div key={child.we_vote_id} className="card">
            <OrganizationVoterGuideCandidateItem
              key={child.we_vote_id}
              contest_office_name={this.props.contest_office_name}
              hidePositionStatement
              link_to_ballot_item_page
              organization_we_vote_id={this.props.organization_we_vote_id}
              position_list={child.position_list}
              {...child}
            />
          </div>
        ))
        }
      </article>
    );
  }
}
