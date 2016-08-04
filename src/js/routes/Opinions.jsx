import { Button } from "react-bootstrap";
import FollowingDropdown from "../components/Navigation/followingDropdown";
import GuideStore from "../stores/GuideStore";
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
    this.state = {guideList: [], ballot_has_guides: null};
  }

  componentDidMount () {
    this._onChange();
    this.listener = GuideStore.addListener(this._onChange.bind(this));
  }

  _onChange () {
    this.setState({ guideList: GuideStore.toFollowList(),
                  ballot_has_guides: GuideStore.ballotHasGuides(),
                  address: VoterStore.getAddress() });
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  getCurrentRoute (){
    var current_route = "/opinions";
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
    const { ballot_has_guides, guideList, address } = this.state;
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
            <p></p> :
            <p>There are no organizations with opinions on your ballot. Here are some popular organizations</p>
          }
        <GuideList organizations={guideList}/>
        </div>;
      }

    const content =
      <div className="opinion-view">
        <div className="container-fluid well u-gutter-top--small fluff-full1">
          <div className="text-center"><FollowingDropdown following_type={this.getFollowingType()} /></div>
          {guides}
        </div>
      </div>;

    return content;
  }
}
