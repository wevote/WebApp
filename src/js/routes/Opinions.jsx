import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { renderLog } from "../utils/logging";
import VoterGuideStore from "../stores/VoterGuideStore";
import Helmet from "react-helmet";
import SearchGuidesToFollowBox from "../components/Search/SearchGuidesToFollowBox";
import GuideList from "../components/VoterGuide/GuideList";

/* VISUAL DESIGN HERE: https://invis.io/TR4A1NYAQ */

export default class Opinions extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      ballot_has_guides: VoterGuideStore.ballotHasGuides(),
      voter_guides_to_follow_all: VoterGuideStore.getVoterGuidesToFollowAll(),
    };
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  onVoterGuideStoreChange () {
    this.setState({
      ballot_has_guides: VoterGuideStore.ballotHasGuides(),
      voter_guides_to_follow_all: VoterGuideStore.getVoterGuidesToFollowAll(),
    });
  }

  componentWillUnmount (){
    this.voterGuideStoreListener.remove();
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
    renderLog(__filename);
    const { ballot_has_guides, voter_guides_to_follow_all } = this.state;
    let guides;
    var floatRight = {
        float: "right"
    };

    guides = <div>
      <p>
        Find opinions about your ballot (ordered by Twitter followers).
        Listen to those you trust. Stop Listening at any time.
        Listening won't add you to mailing lists.
        <span style={floatRight} className="d-print-none">
          <Link to="/opinions_followed" className="u-margin-left--md u-no-break">See organizations you listen to</Link>
        </span>
      </p>
      <SearchGuidesToFollowBox />
      { ballot_has_guides ?
        <p /> :
        <p>There are no organizations with opinions on your ballot. Here are some popular organizations</p>
      }
    <div className="card">
      <GuideList organizationsToFollow={voter_guides_to_follow_all} instantRefreshOn />
    </div>
    </div>;

    return <div className="opinion-view">
      <Helmet title="Build Your Network - We Vote" />
        <h1 className="h1">Build Your Network</h1>
          {guides}
        <Link className="pull-right" to="/opinions_ignored">Organizations you are ignoring</Link><br />
      </div>;
  }
}
