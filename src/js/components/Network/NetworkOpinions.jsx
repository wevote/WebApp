import { Button } from "react-bootstrap";
import Helmet from "react-helmet";
import GuideStore from "../../stores/GuideStore";
import SearchGuidesToFollowBox from "../Search/SearchGuidesToFollowBox";
import VoterStore from "../../stores/VoterStore";
import GuideList from "../VoterGuide/GuideList";
import { Link } from "react-router";
import React, {Component, PropTypes } from "react";


export default class NetworkOpinions extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      ballot_has_guides: GuideStore.ballotHasGuides(),
      text_for_map_search: VoterStore.getTextForMapSearch(),
      voter_guides_to_follow_all: GuideStore.getVoterGuidesToFollowAll(),
    };
  }

  componentDidMount () {
    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
  }

  _onGuideStoreChange () {
    this.setState({
      ballot_has_guides: GuideStore.ballotHasGuides(),
      text_for_map_search: VoterStore.getTextForMapSearch(),
      voter_guides_to_follow_all: GuideStore.getVoterGuidesToFollowAll(),
    });
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
    const { ballot_has_guides, voter_guides_to_follow_all, text_for_map_search } = this.state;
    var floatRight = {
        float: "right"
    };

    if ( text_for_map_search === "" ){
      return <div className="opinion-view">
        <section className="card">
            <div className="card-main">
            <span style={floatRight}>
                <Link to="/settings/location"><Button bsStyle="primary">Enter your address &#x21AC;</Button></Link>
            </span>
            <p>Enter your address so we can find voter guides to follow.</p>
          </div>
          <Link className="pull-right" to="/opinions_ignored u-no-break">Organizations you are ignoring</Link><br />
        </section>
      </div>;
    } else {
      return <div className="opinions-followed__container">
      <Helmet title="Organizations to Follow - We Vote" />
        <section className="card">
          <div className="card-main">
            <p className="hidden-print">
              Find opinions about your ballot (ordered by Twitter followers).
              Follow those you trust. Unfollow at any time.
              Following won't add you to mailing lists.
              <span style={floatRight} className="hidden-print">
                <Link to="/opinions_followed" className="u-margin-left--md u-no-break">See organizations you follow</Link>
              </span>
            </p>
            <div className="hidden-print">
              <SearchGuidesToFollowBox />
            </div>
            { ballot_has_guides ?
              <p /> :
              <p>There are no organizations with opinions on your ballot. Here are some popular organizations</p>
            }
            <div className="card">
              <GuideList organizationsToFollow={voter_guides_to_follow_all} instantRefreshOn />
            </div>
            <Link className="pull-right hidden-print" to="/opinions_ignored">Organizations you are ignoring</Link><br />
          </div>
        </section>
      </div>;
    }
  }
}
