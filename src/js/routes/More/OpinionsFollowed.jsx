import React, {Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import FollowingDropdown from "../../components/Navigation/followingDropdown";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import VoterGuideItem from "../../components/VoterGuide/VoterGuideItem";
import LoadingWheel from "../../components/LoadingWheel";

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
    this.guideStoreListener = GuideStore.addListener(this._onChange.bind(this));
    GuideActions.retrieveGuidesFollowed();
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
  }

  _onChange (){
    var list = GuideStore.followedList();

    if (list !== undefined && list.length > 0){
      this.setState({ voter_guide_followed_list: GuideStore.followedList() });
    } else {
      browserHistory.push("/opinions");
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
    return <div>
  <div className="container-fluid opinions-followed__container">
    <div className="text-center"><FollowingDropdown following_type={this.getFollowingType()} /></div>
      <p>
        Organizations, public figures and other voters you currently follow. See also
        <Link to="/friends">your friends</Link>. We will never sell your email.
      </p>
    <div className="voter-guide-list">
      {
        this.state.voter_guide_followed_list ?
        this.state.voter_guide_followed_list.map( item =>
          <VoterGuideItem key={item.we_vote_id} {...item} />
        ) : LoadingWheel
      }
    </div>
  </div>
</div>;
  }
}
