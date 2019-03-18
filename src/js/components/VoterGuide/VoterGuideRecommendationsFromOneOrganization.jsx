import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import GuideList from './GuideList';


export default class VoterGuideRecommendationsFromOneOrganization extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organizationWeVoteId: '',
      voterGuidesToFollowOrganizationRecommendationAllElections: [],
      voterGuidesToFollowOrganizationRecommendationThisElection: [],
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      organizationWeVoteId: this.props.organization_we_vote_id,
      voterGuidesToFollowOrganizationRecommendationAllElections: VoterGuideStore.getVoterGuidesFollowedByOrganization(this.props.organization_we_vote_id),
      voterGuidesToFollowOrganizationRecommendationThisElection: VoterGuideStore.getVoterGuidesToFollowByOrganizationRecommendation(this.props.organization_we_vote_id),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization_we_vote_id is passed in, update this component to show the new data
    this.setState({
      organizationWeVoteId: nextProps.organization_we_vote_id,
      voterGuidesToFollowOrganizationRecommendationAllElections: VoterGuideStore.getVoterGuidesFollowedByOrganization(nextProps.organization_we_vote_id),
      voterGuidesToFollowOrganizationRecommendationThisElection: VoterGuideStore.getVoterGuidesToFollowByOrganizationRecommendation(nextProps.organization_we_vote_id),
    });
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({
      voterGuidesToFollowOrganizationRecommendationAllElections: VoterGuideStore.getVoterGuidesFollowedByOrganization(organizationWeVoteId),
      voterGuidesToFollowOrganizationRecommendationThisElection: VoterGuideStore.getVoterGuidesToFollowByOrganizationRecommendation(organizationWeVoteId),
    });
  }

  render () {
    renderLog(__filename);
    if (this.state.voterGuidesToFollowOrganizationRecommendationThisElection.length) {
      return (
        <div className="">
        These are recommended voter guides to follow from this election.
          <GuideList
            incomingVoterGuideList={this.state.voterGuidesToFollowOrganizationRecommendationThisElection}
            hideStopFollowingButton
            hideIgnoreButton
            instantRefreshOn={false}
          />
        </div>
      );
    } else if (this.state.voterGuidesToFollowOrganizationRecommendationAllElections.length) {
      return (
        <div className="">
        These are recommended voter guides to follow.
          <GuideList
            incomingVoterGuideList={this.state.voterGuidesToFollowOrganizationRecommendationAllElections}
            hideStopFollowingButton
            hideIgnoreButton
            instantRefreshOn={false}
          />
        </div>
      );
    }

    return null;
  }
}
