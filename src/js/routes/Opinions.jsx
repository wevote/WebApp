import React, {Component, PropTypes } from "react";
import { $ajax } from "../utils/service";

import BallotStore from "../stores/BallotStore";
import GuideList from "../components/VoterGuide/GuideList";

/* VISUAL DESIGN HERE: https://invis.io/TR4A1NYAQ */

export default class Opinions extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  constructor (props) {
    super(props);

    this.state = {
      loading: true,
      error: false
    };

    this.electionId = BallotStore.getGoogleCivicElectionId();

  }

  componentDidMount () {

    if (! this.electionId )
      this.setState({ loading: false, error: false });

    else
      $ajax({
        endpoint: "voterGuidesToFollowRetrieve",
        data: { "google_civic_election_id": this.electionId },

        success: (res) => {
          this.guideList = res.voter_guides;
          this.setState({ loading: false });
          console.log(res);
        },

        error: (err) => {
          console.error(err);

          this.setState({
            loading: false,
            error: true
          });
        }
      });
    // VoterGuideStore.initialize( voter_guide_list => this.setState({ voter_guide_list }));
  }

  render () {
    const { loading, error } = this.state;
    const EMPTY_TEXT = "You do not have a ballot yet!";
    const { guideList, electionId } = this;


    let opinions;

    if ( !electionId )
      opinions = EMPTY_TEXT;

    else
      if (loading)
        opinions =
          <div className="box-loader">
            <i className="fa fa-spinner fa-pulse"></i>
            <p>Loading ... One Moment</p>
          </div>;

      else if (error)
        opinions = "Error loading your organizations";

      else if (guideList.length > 0)
        opinions = <GuideList id={electionId} organizations={guideList} />;


      else
        opinions = EMPTY_TEXT;

    const content =
      <div>
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

          {opinions}

        </div>
      </div>;

    return content;
  }
}
