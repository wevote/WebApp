import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ElectionStore from '../../stores/ElectionStore';
import { renderLog } from '../../utils/logging';
import SelectVoterGuidesSideBarLink from './SelectVoterGuidesSideBarLink';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';


export default class SelectVoterGuidesSideBar extends Component {
  static propTypes = {
    onOwnPage: PropTypes.bool,
    voterGuideWeVoteIdSelected: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: '',
      voterGuideWeVoteIdSelected: '',
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({ voterGuideWeVoteIdSelected: this.props.voterGuideWeVoteIdSelected });
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ voterGuideWeVoteIdSelected: nextProps.voterGuideWeVoteIdSelected });
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    const voter = VoterStore.getVoter();
    const { linked_organization_we_vote_id: linkedOrganizationWeVoteId } = voter;
    // console.log("SelectVoterGuidesSideBar onVoterGuideStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  render () {
    renderLog(__filename);
    const voterGuidesOwnedByVoter = VoterGuideStore.getAllVoterGuidesOwnedByVoter();
    let voterGuideLinksHtml = <span />;
    if (voterGuidesOwnedByVoter) {
      voterGuideLinksHtml = voterGuidesOwnedByVoter.map((voterGuide) => {
        const displaySubtitles = true;
        if (voterGuide && voterGuide.we_vote_id) {
          // linkTo={this.props.onOwnPage ? `/vg/${voterGuide.we_vote_id}/settings/menu` : `/vg/${voterGuide.we_vote_id}/settings`}
          return (
            <div key={`voter-guides-${voterGuide.we_vote_id}`}>
              <SelectVoterGuidesSideBarLink
                linkTo={this.props.onOwnPage ? `/settings/voter_guide/${voterGuide.we_vote_id}` : `/settings/voter_guide/${voterGuide.we_vote_id}`}
                label={ElectionStore.getElectionName(voterGuide.google_civic_election_id)}
                subtitle={ElectionStore.getElectionDayText(voterGuide.google_civic_election_id)}
                displaySubtitles={displaySubtitles}
                voterGuideWeVoteId={voterGuide.we_vote_id}
                voterGuideWeVoteIdSelected={this.state.voterGuideWeVoteIdSelected}
              />
            </div>
          );
        } else {
          return null;
        }
      });
    }
    return (
      <div className="card">
        <div className="card-main">
          <div className="SettingsItem__summary__title">Your Voter Guides</div>
          <SelectVoterGuidesSideBarLink
            linkTo="/voterguidegetstarted"
            label="Create New Voter Guide"
          />
          {voterGuideLinksHtml}
        </div>
      </div>
    );
  }
}
