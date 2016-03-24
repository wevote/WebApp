import BallotStore from "../stores/BallotStore";
import { Button } from "react-bootstrap";
import GuideActions from "../actions/GuideActions";
import GuideStore from "../stores/GuideStore";
import GuideList from "../components/VoterGuide/GuideList";
import { Link } from "react-router";
import LoadingWheel from "../components/LoadingWheel";
import React, {Component, PropTypes } from "react";

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

    if (! this.electionId ) {
      var emptyElection = 0;
      GuideActions.retrieveGuidesToFollow(emptyElection);
    }
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
    const NO_BALLOT_TEXT = "Enter your address so we can find voter guides to follow.";
    const NO_VOTER_GUIDES_TEXT = "We could not find any voter guides for this election.";

    const { loading, error, guideList } = this.state;
    const { electionId } = this;

    let guides;
    var floatRight = {
        float: "right"
    };

    if ( !electionId )
      guides = <div>
          <span style={floatRight}>
              <Link to="/settings/location"><Button bsStyle="primary">Enter my address &#x21AC;</Button></Link>
          </span>
          <p>{ NO_BALLOT_TEXT }</p>
        </div>;

    else
      if (loading)
        guides =
          LoadingWheel;

      else if (error)
        guides = "Error loading organizations";

      else if (guideList instanceof Array && guideList.length > 0)
        guides = <div>
          <p>
            These organizations and public figures have opinions about items on
            your ballot. They are ordered by number of Twitter followers.
          </p>
          <input type="text" name="search_opinions" className="form-control"
               placeholder="Search by name or twitter handle." />
          <GuideList id={electionId} organizations={guideList} />
        </div>;

      else
        guides = NO_VOTER_GUIDES_TEXT;

    const content =
      <div className="opinion-view">
        <div className="container-fluid well gutter-top--small fluff-full1">
          <h3 className="text-center">More Opinions I Can Follow</h3>
          {guides}
        </div>
      </div>;

    return content;
  }
}
