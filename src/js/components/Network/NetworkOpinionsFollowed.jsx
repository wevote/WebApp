import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import OpinionsFollowedListCompressed from "../VoterGuide/OpinionsFollowedListCompressed";

export default class NetworkOpinionsFollowed extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {
      voter_guide_followed_list: [],
      editMode: false
    };
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    GuideActions.voterGuidesFollowedRetrieve();
    let voter_guide_followed_list = GuideStore.getVoterGuidesVoterIsFollowing();
    const OPINIONS_TO_SHOW = 3;
    let voter_guide_followed_list_limited = voter_guide_followed_list.slice(0, OPINIONS_TO_SHOW);
    this.setState({
      voter_guide_followed_list: voter_guide_followed_list_limited
    });
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
  }

  _onGuideStoreChange (){
    let voter_guide_followed_list = GuideStore.getVoterGuidesVoterIsFollowing();
    const OPINIONS_TO_SHOW = 3;
    let voter_guide_followed_list_limited = voter_guide_followed_list.slice(0, OPINIONS_TO_SHOW);
    this.setState({
      voter_guide_followed_list: voter_guide_followed_list_limited
    });
  }

  getCurrentRoute (){
    var current_route = "/opinions_followed";
    return current_route;
  }

  toggleEditMode (){
    this.setState({editMode: !this.state.editMode});
  }

  onKeyDownEditMode (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({editMode: !this.state.editMode});
    }
  }

  getFollowingType (){
    switch (this.getCurrentRoute()) {
      case "/opinions":
        return "WHO_YOU_CAN_FOLLOW";
      case "/opinions_followed":
      default :
        return "WHO_YOU_FOLLOW";
    }
  }

  render () {
    // console.log("NetworkOpinionsFollowed, this.state.voter_guide_followed_list: ", this.state.voter_guide_followed_list);
    return <div className="opinions-followed__container">
      <section className="card">
        <div className="card-main">
          <h1 className="h4">Who You Are Following</h1>
          <div className="voter-guide-list card">
            <div className="card-child__list-group">
              {
                this.state.voter_guide_followed_list && this.state.voter_guide_followed_list.length ?
                  <span>
                    <OpinionsFollowedListCompressed organizationsFollowed={this.state.voter_guide_followed_list}
                                                    editMode={this.state.editMode}
                                                    instantRefreshOn />
                    <Link to="/opinions_followed">See All</Link>
                  </span> :
                  <span>You are not following any organizations yet.</span>
              }
            </div>
          </div>
          <br />
        </div>
      </section>
    </div>;
  }
}
