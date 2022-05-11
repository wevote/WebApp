import PropTypes from 'prop-types';
import React, { Component } from 'react';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
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
              ballotItemDisplayName={child.ballot_item_display_name}
              candidatePhotoUrlLarge={child.candidate_photo_url_large}
              candidatePhotoUrlMedium={child.candidate_photo_url_medium}
              contestOfficeName={this.props.contestOfficeName}
              key={child.we_vote_id}
              linkToBallotItemPage
              linkToOfficePage
              organizationWeVoteId={this.props.organizationWeVoteId}
              party={child.party}
              showLargeImage
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
  contestOfficeName: PropTypes.string,
  organizationWeVoteId: PropTypes.string.isRequired,
};
