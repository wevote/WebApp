import React, { Component, PropTypes } from "react";
import GuideActions from "../../actions/GuideActions";
import GuideStore from "../../stores/GuideStore";
import LoadingWheel from "../../components/LoadingWheel";
import VoterGuideFollowers from "./VoterGuideFollowers";
import VoterGuideFollowing from "./VoterGuideFollowing";
import VoterGuidePositions from "./VoterGuidePositions";
import VoterStore from "../../stores/VoterStore";
import { Tabs, Tab } from "react-bootstrap";


export default class OrganizationVoterGuideTabs extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization: this.props.organization,
      voter_guide_followed_list: GuideStore.followedByOrganizationList(),
      voter_guide_followers_list: GuideStore.followersList(),
    };
  }

  componentDidMount () {
    // console.log("OrganizationVoterGuideTabs, componentDidMount, organization: ", this.props.organization);
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // When a new organization is passed in, update this component to show the new data
    GuideActions.voterGuidesFollowedByOrganizationRetrieve(nextProps.organization.organization_we_vote_id);
    GuideActions.voterGuideFollowersRetrieve(nextProps.organization.organization_we_vote_id);
    this.setState({
      organization: nextProps.organization,
      voter_guide_followed_list: GuideStore.followedByOrganizationList(),
      voter_guide_followers_list: GuideStore.followersList(),
    });
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onGuideStoreChange (){
    this.setState({
      voter_guide_followed_list: GuideStore.followedByOrganizationList(),
      voter_guide_followers_list: GuideStore.followersList()
    });
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()});
   }

  render () {
    if (!this.state.organization){
      return <div>{LoadingWheel}</div>;
    }

    let looking_at_self = false;
    if (this.state.voter) {
      looking_at_self = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }
    let positions_title = "";
    let following_title = "";
    // let following_count = 0;
    let followers_title = "";
    // let followers_count = this.state.voter_guide_followers_list.length;
    if (looking_at_self) {
      positions_title = "Your Positions";
      following_title = "You Are Following";
      followers_title = this.state.voter_guide_followers_list.length === 0 ?
        "Followers" : this.state.voter_guide_followers_list.length + "Followers";
    } else {
      positions_title = "Positions";
      following_title = this.state.voter_guide_followed_list.length === 0 ?
        "Following" : this.state.voter_guide_followed_list.length + " Following";
      followers_title = this.state.voter_guide_followers_list.length === 0 ?
        "Followers" : this.state.voter_guide_followers_list.length + " Followers";
    }

    return (
      <Tabs defaultActiveKey={1} id="tabbed_voter_guide_details">
        <Tab eventKey={1} title={positions_title}>
          <VoterGuidePositions organization={this.state.organization} />
        </Tab>

        <Tab eventKey={2} title={following_title}>
          <VoterGuideFollowing organization={this.state.organization} />
        </Tab>

        <Tab eventKey={3} title={followers_title}>
          <VoterGuideFollowers organization={this.state.organization} />
        </Tab>
      </Tabs>
    );
  }
}
