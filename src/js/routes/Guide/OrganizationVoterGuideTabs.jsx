import React, { Component, PropTypes } from "react";
import GuideStore from "../../stores/GuideStore";
import VoterGuidesFollowers from "../../routes/VoterGuidesFollowers";
import VoterGuidesFollowing from "../../routes/VoterGuidesFollowing";
import VoterGuidesPositions from "../../routes/VoterGuidesPositions";
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
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
  }

  _onGuideStoreChange (){
    this.setState({
      voter_guide_followed_list: GuideStore.followedByOrganizationList(),
      voter_guide_followers_list: GuideStore.followersList()
    });
  }


  render () {
    var following_title = this.state.voter_guide_followed_list.length === 0 ?
                  "FOLLOWING" : this.state.voter_guide_followed_list.length + " FOLLOWING";
    var followers_title = this.state.voter_guide_followers_list.length === 0 ?
                  "FOLLOWERS" : this.state.voter_guide_followers_list.length + " FOLLOWERS";

    return (
      <Tabs defaultActiveKey={1} id="tabbed_voter_guide_details">
        <Tab eventKey={1} title="POSITION">
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
