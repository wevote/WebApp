import React, { Component, PropTypes } from "react";
import GuideStore from "../../stores/GuideStore";
import VoterGuidesFollowers from "../../routes/VoterGuidesFollowers";
import VoterGuidesFollowing from "../../routes/VoterGuidesFollowing";
import VoterGuidesPositions from "../../routes/VoterGuidesPositions";
import VoterStore from "../../stores/VoterStore";
import { Tabs, Tab } from "react-bootstrap";


export default class OrganizationVoterGuideTabs extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      voter_guide_followed_list: GuideStore.followedByOrganizationList(),
      voter_guide_followers_list: GuideStore.followersList(),
    };
  }

  componentDidMount () {
    console.log("OrganizationVoterGuideTabs, componentDidMount");
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
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
    let looking_at_self = false;
    if (this.state.voter) {
      looking_at_self = this.state.voter.linked_organization_we_vote_id === this.props.organization.organization_we_vote_id;
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
          <VoterGuidesPositions organization_we_vote_id={this.props.organization.organization_we_vote_id} />
        </Tab>

        <Tab eventKey={2} title={following_title}>
          <VoterGuidesFollowing organization={this.props.organization} />
        </Tab>

        <Tab eventKey={3} title={followers_title}>
          <VoterGuidesFollowers organization={this.props.organization} />
        </Tab>
      </Tabs>
    );
  }
}
