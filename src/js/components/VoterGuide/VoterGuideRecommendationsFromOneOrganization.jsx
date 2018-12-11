import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderLog } from "../../utils/logging";
import VoterGuideStore from "../../stores/VoterGuideStore";
import GuideList from "./GuideList";


export default class VoterGuideRecommendationsFromOneOrganization extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization_we_vote_id: "",
      voter_guides_to_follow_organization_recommendation_all_elections: [],
      voter_guides_to_follow_organization_recommendation_this_election: [],
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.setState({
      organization_we_vote_id: this.props.organization_we_vote_id,
      voter_guides_to_follow_organization_recommendation_all_elections: VoterGuideStore.getVoterGuidesFollowedByOrganization(this.props.organization_we_vote_id),
      voter_guides_to_follow_organization_recommendation_this_election: VoterGuideStore.getVoterGuidesToFollowByOrganizationRecommendation(this.props.organization_we_vote_id),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization_we_vote_id is passed in, update this component to show the new data
    this.setState({
      organization_we_vote_id: nextProps.organization_we_vote_id,
      voter_guides_to_follow_organization_recommendation_all_elections: VoterGuideStore.getVoterGuidesFollowedByOrganization(nextProps.organization_we_vote_id),
      voter_guides_to_follow_organization_recommendation_this_election: VoterGuideStore.getVoterGuidesToFollowByOrganizationRecommendation(nextProps.organization_we_vote_id),
    });
  }

  onVoterGuideStoreChange () {
    this.setState({
      voter_guides_to_follow_organization_recommendation_all_elections: VoterGuideStore.getVoterGuidesFollowedByOrganization(this.state.organization_we_vote_id),
      voter_guides_to_follow_organization_recommendation_this_election: VoterGuideStore.getVoterGuidesToFollowByOrganizationRecommendation(this.state.organization_we_vote_id),
    });
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
  }

  render () {
    renderLog(__filename);
    if (this.state.voter_guides_to_follow_organization_recommendation_this_election.length) {
      return (
        <div className="">
        These are recommended voter guides to listen to from this election.
          <GuideList
            organizationsToFollow={this.state.voter_guides_to_follow_organization_recommendation_this_election}
            hide_stop_following_button
            hide_ignore_button
            instantRefreshOn={false}
          />
        </div>
      );
    } else if (this.state.voter_guides_to_follow_organization_recommendation_all_elections.length) {
      return (
        <div className="">
        These are recommended voter guides to listen to.
          <GuideList
            organizationsToFollow={this.state.voter_guides_to_follow_organization_recommendation_all_elections}
            hide_stop_following_button
            hide_ignore_button
            instantRefreshOn={false}
          />
        </div>
      );
    }

    return null;
  }
}
