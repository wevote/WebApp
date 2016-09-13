import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import FollowingDropdown from "../../components/Navigation/FollowingDropdown";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import VoterGuideItem from "../../components/VoterGuide/VoterGuideItem";

/* VISUAL DESIGN HERE: https://invis.io/8F53FDX9G */

export default class OpinionsFollowed extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {voter_guide_followed_list: GuideStore.followedList()};
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    GuideActions.retrieveGuidesFollowed();
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
    var current_route = "/more/opinions/followed";
    return current_route;
  }

  getFollowingType (){
    switch (this.getCurrentRoute()) {
      case "/opinions":
        return "WHO_YOU_CAN_FOLLOW";
      case "/more/opinions/followed":
      default :
        return "WHO_YOU_FOLLOW";
    }
  }

  render () {
    return <div className="opinions-followed__container">
      <FollowingDropdown following_type={this.getFollowingType()} />
        <p>
          Organizations, public figures and other voters you currently follow. <em>We will never sell your email</em>.
        </p>
      <div className="voter-guide-list card">
        <div className="card-child__list-group">
          {
            this.state.voter_guide_followed_list && this.state.voter_guide_followed_list.length ?
            this.state.voter_guide_followed_list.map( item =>
              <VoterGuideItem key={item.we_vote_id} {...item} />
            ) : null
          }
        </div>
      </div>
    </div>;
  }
}
