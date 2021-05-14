import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { historyPush } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

const CandidateItem = React.lazy(() => import(/* webpackChunkName: 'CandidateItem' */ './CandidateItem'));
const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../Widgets/DelayedLoad'));


// This is related to components/VoterGuide/OrganizationVoterGuideCandidateList.jsx
export default class CandidateList extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
  }

  getCandidateLink (candidateWeVoteId) {
    // If no organizationWeVoteId, signal that we want to link back to default ballot
    return `/candidate/${candidateWeVoteId}/b/btdb`; // back-to-default-ballot
  }

  goToCandidateLink (candidateWeVoteId) {
    // console.log('CandidateList goToCandidateLink, candidateWeVoteId:', candidateWeVoteId);
    const candidateLink = this.getCandidateLink(candidateWeVoteId);
    historyPush(candidateLink);
  }

  render () {
    renderLog('CandidateList');  // Set LOG_RENDER_EVENTS to log all renders
    const { forMoreInformationSeeBallotpediaOff } = this.props;
    // console.log('CandidateList render');
    let candidateNumber = 0;
    let candidatesDelayed = 0;
    let showLoadingText = true;
    return (
      <article className="card-main__list-group">
        { this.props.children.map((child) => {
          candidateNumber += 1;
          if (candidateNumber <= 3) {
            return (
              <div key={child.we_vote_id} className="card">
                <CandidateItem
                  candidateWeVoteId={child.we_vote_id}
                  forMoreInformationSeeBallotpediaOff={forMoreInformationSeeBallotpediaOff}
                  goToBallotItem={this.goToCandidateLink}
                  hideBallotItemSupportOpposeComment
                  key={child.we_vote_id}
                  linkToBallotItemPage
                  showHover
                  showTopCommentByBallotItem
                />
              </div>
            );
          } else {
            candidatesDelayed += 1;
            if (candidatesDelayed > 1) {
              // Only show the first "Loading..." text
              showLoadingText = false;
            }
            return (
              <DelayedLoad key={child.we_vote_id} showLoadingText={showLoadingText} waitBeforeShow={1000}>
                <div className="card">
                  <CandidateItem
                    candidateWeVoteId={child.we_vote_id}
                    goToBallotItem={this.goToCandidateLink}
                    hideBallotItemSupportOpposeComment
                    key={child.we_vote_id}
                    linkToBallotItemPage
                    showHover
                    showTopCommentByBallotItem
                  />
                </div>
              </DelayedLoad>
            );
          }
        })}
      </article>
    );
  }
}
CandidateList.propTypes = {
  children: PropTypes.array.isRequired,
  forMoreInformationSeeBallotpediaOff: PropTypes.bool,
};
