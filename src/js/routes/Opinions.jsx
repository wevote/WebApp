import React, {Component, PropTypes } from "react";
import LoadingWheel from "../components/LoadingWheel";

import BallotStore from "../stores/BallotStore";
import GuideActions from "../actions/GuideActions";
import GuideStore from "../stores/GuideStore";
import GuideList from "../components/VoterGuide/GuideList";

/* VISUAL DESIGN HERE: https://invis.io/TR4A1NYAQ */

export default class Opinions extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = { loading: true, error: false };
    this.electionId = BallotStore.getGoogleCivicElectionId();
  }

  componentDidMount () {
    this.listener = GuideStore.addListener(this._onChange.bind(this));

    if (! this.electionId )
      this.props.history.push("/ballot");

    else
      GuideActions.retrieveGuidesToFollow(this.electionId);
  }

  _onChange (){
    this.setState({ loading: false, error: false, guideList: GuideStore.toFollowList() });
  }

  componentWillUnmount (){
    this.listener.remove();
  }

  render () {
    const EMPTY_TEXT = "You do not have a ballot yet!";

    const { loading, error, guideList } = this.state;
    const { electionId } = this;

    let guides;

    if ( !electionId )
      guides = EMPTY_TEXT;

    else
      if (loading)
        guides =
          LoadingWheel;

      else if (error)
        guides = "Error loading organizations";

      else if (guideList instanceof Array && guideList.length > 0)
        guides = <GuideList id={electionId} organizations={guideList} />;

      else
        guides = EMPTY_TEXT;

    const content =
      <div className="opinion-view">
        <div className="container-fluid well gutter-top--small fluff-full1">
          <h3 className="text-center">More Opinions I Can Follow</h3>
          {/*
            <input type="text" name="search_opinions" className="form-control"
                 placeholder="Search by name or twitter handle." />
          */}
          <p>
            These organizations and public figures have opinions about items on
            your ballot. Click the "Follow" button to pay attention to them.
          </p>
          {guides}
        </div>
      </div>;

    return content;
  }
}
