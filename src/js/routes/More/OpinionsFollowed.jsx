import React, {Component, PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
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
    this.listener = GuideStore.addListener(this._onChange.bind(this));
    GuideActions.retrieveGuidesFollowed();
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  _onChange (){
    var list = GuideStore.followedList();

    if (list !== undefined && list.length > 0){
      this.setState({ voter_guide_followed_list: GuideStore.followedList() });
    } else {
      this.props.history.push("/opinions");
    }
  }

  render () {
    return <div>
  <div className="container-fluid well gutter-top--small fluff-full1">
    <h3 className="text-center">Opinions I'm Following</h3>
    <div className="voter-guide-list">
    <ReactCSSTransitionGroup transitionName="org-ignore" transitionEnterTimeout={400} transitionLeaveTimeout={200}>
      {
        this.state.voter_guide_followed_list ?
        this.state.voter_guide_followed_list.map( item =>
          <VoterGuideItem key={item.we_vote_id} {...item} />
        ) : LoadingWheel
      }
      </ReactCSSTransitionGroup>
    </div>
  </div>
</div>;
  }
}
