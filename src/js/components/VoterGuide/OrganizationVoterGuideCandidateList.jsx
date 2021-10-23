import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import OrganizationVoterGuideCandidateItem from './OrganizationVoterGuideCandidateItem';

// This is related to components/Ballot/CandidateList.jsx
export default class OrganizationVoterGuideCandidateList extends Component {
  render () {
    renderLog('OrganizationVoterGuideCandidateList');  // Set LOG_RENDER_EVENTS to log all renders
    const top = isMobileScreenSize() ? '10px' : '0';
    return (
      <article className="card-main__list-group" style={{ paddingTop: { top } }}>
        { this.props.children.map((child) => (
          <div key={child.we_vote_id} className="card">
            <OrganizationVoterGuideCandidateItem
              key={child.we_vote_id}
              contest_office_name={this.props.contest_office_name}
              link_to_ballot_item_page
              organization_we_vote_id={this.props.organization_we_vote_id}
              // {...child}
              ballotItemDisplayName={child.ballot_item_display_name}
              candidatePhotoUrlLarge={child.candidate_photo_url_large}
              candidatePhotoUrlMedium={child.candidate_photo_url_medium}
              contestOfficeName={this.props.contest_office_name}
              showLargeImage={child.showLargeImage}
              linkToBallotItemPage={child.link_to_ballot_item_page}
              linkToOfficePage={child.linkToOfficePage}
              organizationWeVoteId={child.organization_we_vote_id}
              party={child.party}
              twitterDescription={child.twitter_description}
              twitterFollowersCount={child.twitter_followers_count}
              weVoteId={child.we_vote_id}
            />
          </div>
        ))}
      </article>
    );
  }
}
OrganizationVoterGuideCandidateList.propTypes = {
  children: PropTypes.array.isRequired,
  contest_office_name: PropTypes.string,
  organization_we_vote_id: PropTypes.string.isRequired,
};
