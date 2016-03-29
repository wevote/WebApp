import React, {Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import CandidateActions from "../../actions/CandidateActions";
import CandidateStore from "../../stores/CandidateStore";
import GuideActions from "../../actions/GuideActions";
import GuideList from "../../components/VoterGuide/GuideList";
import GuideStore from "../../stores/GuideStore";
import LoadingWheel from "../../components/LoadingWheel";
import OfficeStore from "../../stores/OfficeStore";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479667 */

export default class OpinionsAboutItem extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object,
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { candidate: {}, office: {}, loading: true, error: false };
    this.ballotItemWeVoteId = this.props.params.we_vote_id;
    this.kindOfBallotItem = "CANDIDATE"; /* TODO: Convert from hard coded to dynamic between CANDIDATE and MEASURE */
    this.electionId = BallotStore.getGoogleCivicElectionId();
  }

  componentDidMount () {
    if (! this.ballotItemWeVoteId )
      this.props.history.push("/opinions");

    this.candidateToken = CandidateStore.addListener(this._onChange.bind(this));
    this.officeToken = OfficeStore.addListener(this._onChange.bind(this));

    CandidateActions.retrieve(this.props.params.we_vote_id);

    this.listener = GuideStore.addListener(this._onChange.bind(this));
    GuideActions.retrieveGuidesToFollowByBallotItem(this.ballotItemWeVoteId, this.kindOfBallotItem);
  }

  _onChange (){
    var candidate = CandidateStore.get(this.ballotItemWeVoteId) || {};
    if (candidate) {
      this.setState({ candidate: candidate });

      if (candidate.contest_office_we_vote_id){
        this.setState({ office: OfficeStore.get(candidate.contest_office_we_vote_id) || {} });
      }
    }
    this.setState({ loading: false, error: false, guideList: GuideStore.toFollowList() });
  }

  componentWillUnmount (){
    this.listener.remove();
    this.candidateToken.remove();
    this.officeToken.remove();
  }

  render () {
    var { candidate, office } = this.state;
    const { loading, error } = this.state;
    const { electionId } = this;
    const { guideList, ballotItemWeVoteId } = this.state;
    const NO_BALLOT_ITEM_TEXT = "We could not find this candidate or measure.";
    const NO_BALLOT_TEXT = "Enter your address so we can find voter guides to follow.";
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to follow about this candidate or measure.";

    let guides;

    if (!candidate || !candidate.we_vote_id){
      // console.log("candidate info not found, candidate.we_vote_id: ", candidate.we_vote_id);
      return <div>The ballot item could not be found.</div>;
    }
    var floatRight = {
        float: "right"
    };

    if (electionId || ballotItemWeVoteId )
      if (loading)
        guides =
          LoadingWheel;

      else if (error)
        guides = "Error loading organizations";

      else if (guideList instanceof Array && guideList.length > 0) {
        // console.log("guideList found, electionId: ", electionId, " ballotWeVoteId: ", this.ballotItemWeVoteId);
        guides = <GuideList id={electionId} ballotItemWeVoteId={ballotItemWeVoteId} organizations={guideList}/>;
      }
      else
        guides = NO_VOTER_GUIDES_TEXT;
    else if ( !electionId )
      guides = <div>
          <span style={floatRight}>
              <Link to="/settings/location"><Button bsStyle="primary">Enter my address &#x21AC;</Button></Link>
          </span>
          <p>{ NO_BALLOT_TEXT }</p>
        </div>;

    else if ( !ballotItemWeVoteId )
      guides = NO_BALLOT_ITEM_TEXT;


    const content =
      <section className="candidate">
        <div className="opinion-view">
        <div className="container-fluid well gutter-top--small fluff-full1">
          <h3 className="text-center">More Opinions I Can Follow</h3>

        <Link className="linkLight"
              to={"/candidate/" + candidate.we_vote_id }
              onlyActiveOnIndex={false}>
          <div className="row" style={{ paddingBottom: "2rem" }}>
            <div
              className="col-xs-4"
              style={candidate.candidate_photo_url ? {} : { height: "45px" }}>

              {
                candidate.candidate_photo_url ?
                  <img
                    className="img-circle"
                    style={{ display: "block", paddingTop: "10px", width: "50px" }}
                    src={candidate.candidate_photo_url}
                    alt="candidate-photo"/> :
                <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light"/>
              }
            </div>
            <div className="col-xs-8">
              <h4 className="bufferNone">
                  about { candidate.ballot_item_display_name }
                  {
                    candidate.party ?
                      <span className="link-text-candidate-party"><br />{ candidate.party }</span> :
                      <span></span>
                  }
              </h4>
              {
                office.ballot_item_display_name ?
                  <p>Running for <span className="running-for-office-emphasis">{ office.ballot_item_display_name }</span></p> :
                  <p></p>
              }
            </div>
          </div>
        </Link>

          <input type="text" name="search_opinions" className="form-control"
               placeholder="Search by name or twitter handle." />
          <p>
            These organizations and public figures have opinions about this ballot item.
            They are ordered by number of Twitter followers.
          </p>
          {guides}
        </div>
      </div>
    </section>;

    return content;
  }
}
