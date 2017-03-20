import { Button } from "react-bootstrap";
import GuideStore from "../stores/GuideStore";
import Helmet from "react-helmet";
import SearchGuidesToFollowBox from "../components/SearchGuidesToFollowBox";
import VoterStore from "../stores/VoterStore";
import GuideList from "../components/VoterGuide/GuideList";
import { Link } from "react-router";
import React, {Component, PropTypes } from "react";

/* VISUAL DESIGN HERE: https://invis.io/TR4A1NYAQ */

export default class Opinions extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      guideToFollowList: [],
      ballot_has_guides: null
    };
  }

  componentDidMount () {
    this._onChange();
    this.guideStoreListener = GuideStore.addListener(this._onChange.bind(this));
  }

  _onChange () {
    this.setState({
      guideToFollowList: GuideStore.toFollowList(),
      ballot_has_guides: GuideStore.ballotHasGuides(),
      address: VoterStore.getAddress() });
  }

  componentWillUnmount (){
    this.guideStoreListener.remove();
  }

  getCurrentRoute (){
    var current_route = "/opinions";
    return current_route;
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
    const { ballot_has_guides, guideToFollowList, address } = this.state;
    let guides;
    var floatRight = {
        float: "right"
    };

    if ( address === "" ){
      guides = <div>
          <span style={floatRight}>
              <Link to="/settings/location"><Button bsStyle="primary">Enter your address &#x21AC;</Button></Link>
          </span>
          <p>Enter your address so we can find voter guides to follow.</p>
        </div>;

    } else {
        guides = <div>
          <p>
            Find opinions about your ballot (ordered by Twitter followers).
            Follow those you trust. Unfollow at any time.
            Following won't add you to mailing lists.
          </p>
          <SearchGuidesToFollowBox />
          { ballot_has_guides ?
            <p /> :
            <p>There are no organizations with opinions on your ballot. Here are some popular organizations</p>
          }
        <div className="card">
          <GuideList organizationsToFollow={guideToFollowList} instantRefreshOn />
        </div>
        </div>;
      }

    return <div className="opinion-view">
      <Helmet title="Build Your Network - We Vote" />
        <h1 className="h1">Build Your Network</h1>
          {guides}
      </div>;
  }
}
