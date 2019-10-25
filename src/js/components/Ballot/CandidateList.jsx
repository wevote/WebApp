import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CandidateItem from './CandidateItem';
import { renderLog } from '../../utils/logging';

// This is related to components/VoterGuide/OrganizationVoterGuideCandidateList.jsx
export default class CandidateList extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
  };

  render () {
    renderLog('CandidateList');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <article className="card-main__list-group">
        { this.props.children.map(child => (
          <div key={child.we_vote_id} className="card">
            <CandidateItem
              candidateWeVoteId={child.we_vote_id}
              hideBallotItemSupportOpposeComment
              key={child.we_vote_id}
              linkToBallotItemPage
              showHover
              showTopCommentByBallotItem
            />
          </div>
        ))
        }
      </article>
    );
  }
}
