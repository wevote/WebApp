import GuideStore from "../../stores/GuideStore";
import GuideList from "./GuideList";
import React, {Component, PropTypes } from "react";


export default class VoterGuideRecommendationsFromOneOrganization extends Component {
  static propTypes = {
    organization_we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props){
    super(props);
    this.state = {
      voter_guides_to_follow_organization_recommendation_all_elections: [],
      voter_guides_to_follow_organization_recommendation_this_election: [],
      //voter_guides_to_follow_organization_recommendation_this_election:  GuideStore.getVoterGuidesToFollowByOrganizationRecommendation(this.props.organization_we_vote_id),
    };
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this.setState({
      voter_guides_to_follow_organization_recommendation_all_elections: GuideStore.getVoterGuidesFollowedByLatestOrganization(),
      //voter_guides_to_follow_organization_recommendation_this_election: GuideStore.getVoterGuidesRecommendedByLatestOrganization(),
      voter_guides_to_follow_organization_recommendation_this_election: GuideStore.getVoterGuidesToFollowByOrganizationRecommendation(this.props.organization_we_vote_id),
    });
  }

  _onGuideStoreChange () {
    this.setState({
      voter_guides_to_follow_organization_recommendation_all_elections: GuideStore.getVoterGuidesFollowedByLatestOrganization(),
      //voter_guides_to_follow_organization_recommendation_this_election: GuideStore.getVoterGuidesRecommendedByLatestOrganization(),
      voter_guides_to_follow_organization_recommendation_this_election: GuideStore.getVoterGuidesToFollowByOrganizationRecommendation(this.props.organization_we_vote_id),
    });
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
  }

  render () {
    if (this.state.voter_guides_to_follow_organization_recommendation_this_election.length) {
      return <div className="">
        These are recommended voter guides to follow from this election.
        <GuideList organizationsToFollow={this.state.voter_guides_to_follow_organization_recommendation_this_election}
                   hide_stop_following_button
                   hide_ignore_button
                   instantRefreshOn={false}/>
      </div>;
    } else if (this.state.voter_guides_to_follow_organization_recommendation_all_elections.length) {
      return <div className="">
        These are recommended voter guides to follow.
        <GuideList organizationsToFollow={this.state.voter_guides_to_follow_organization_recommendation_all_elections}
                   hide_stop_following_button
                   hide_ignore_button
                   instantRefreshOn={false}/>
      </div>;
    }

    return null;
  }
}
