import React, {Component, PropTypes } from "react";
import FollowingFilter from "../components/Navigation/FollowingFilter";
import Helmet from "react-helmet";
import GuideStore from "../stores/GuideStore";
import GuideActions from "../actions/GuideActions";
import OpinionsFollowedList from "../components/VoterGuide/OpinionsFollowedList";

/* VISUAL DESIGN HERE: https://invis.io/8F53FDX9G */

export default class OpinionsFollowed extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {voter_guide_followed_list: GuideStore.followedList(),
                  editMode: false};
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    GuideActions.voterGuidesFollowedRetrieve();
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
  }

  _onGuideStoreChange (){
    var list = GuideStore.followedList();

    if (list !== undefined && list.length > 0){
      this.setState({ voter_guide_followed_list: GuideStore.followedList() });
    }
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
    return <div className="opinions-followed__container">
      <Helmet title="Organizations You Follow - We Vote" />
      <h1 className="h1">Build Your Network</h1>
      <FollowingFilter following_type={this.getFollowingType()} />
      <a className="fa-pull-right"
         tabIndex="0"
         onKeyDown={this.onKeyDownEditMode.bind(this)}
         onClick={this.toggleEditMode.bind(this)}>{this.state.editMode ? "Done Editing" : "Edit"}</a>
        <p>
          Organizations, public figures and other voters you currently follow. <em>We will never sell your email</em>.
        </p>
      <div className="voter-guide-list card">
        <div className="card-child__list-group">
          {
            this.state.voter_guide_followed_list && this.state.voter_guide_followed_list.length ?
            <OpinionsFollowedList organizationsFollowed={this.state.voter_guide_followed_list}
                                  editMode={this.state.editMode}
                                  instantRefreshOn /> :
              null
          }
        </div>
      </div>
    </div>;
  }
}
