import React, {Component, PropTypes } from "react";
import { Link } from "react-router";
import { $ajax } from "../../utils/service";
import BallotStore from "../../stores/BallotStore";
import GuideList from "../../components/VoterGuide/GuideList";
import LoadingWheel from "../../components/LoadingWheel";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479667 */

export default class OpinionsAboutItem extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object,
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = { candidate: {}, loading: true, error: false };
    this.ballotItemWeVoteId = this.props.params.we_vote_id; /* Bernie: wv02cand3, Ben Carson: wv02cand5 */
    this.kindOfBallotItem = "CANDIDATE"; /* TODO: Convert from hard coded to dynamic between CANDIDATE and MEASURE */
  }

  componentDidMount () {

    if (! this.ballotItemWeVoteId )
      this.props.history.push("/ballot");

    else
      $ajax({
        endpoint: "voterGuidesToFollowRetrieve",
        data: {
          "ballot_item_we_vote_id": this.ballotItemWeVoteId,
          "kind_of_ballot_item": this.kindOfBallotItem
        },

        success: (res) => {
          this.guideList = res.voter_guides;
          this.setState({ loading: false });
          console.log(res);
        },

        error: (err) => {
          console.error(err);
          this.setState({ loading: false, error: true });
        }
      });

    this.changeListener = this._onChange.bind(this);
    BallotStore.addChangeListener(this.changeListener);
    var candidate = BallotStore.getOrFetchCandidateByWeVoteId(this.props.params.we_vote_id);
    if (candidate) {
      this.setState({ candidate: candidate });
    }
  }

  _onChange (){
    this.setState({ candidate: BallotStore.getCandidateByWeVoteId(this.props.params.we_vote_id) });
  }

  componentWillUnmount () {
    BallotStore.removeChangeListener(this.changeListener);
  }

  render () {
    var candidate = this.state.candidate;
    if (!candidate || !candidate.we_vote_id){
      return <div></div>;
    }

    const EMPTY_TEXT = "There are no more opinions to follow about this candidate or measure.";

    const { loading, error } = this.state;
    const { guideList, ballotItemWeVoteId } = this;

    let guides;

    if ( !ballotItemWeVoteId )
      guides = EMPTY_TEXT;

    else
      if (loading)
        guides =
          LoadingWheel;

      else if (error)
        guides = "Error loading organizations";

      else if (guideList instanceof Array && guideList.length > 0)
        guides = <GuideList ballot_item_we_vote_id={ballotItemWeVoteId} organizations={guideList} />;


      else
        guides = EMPTY_TEXT;

    const content =
      <div className="opinion-view">
        <div className="container-fluid well gutter-top--small fluff-full1">
          <h3 className="text-center">More Opinions I Can Follow</h3>

        <Link className="linkLight"
              to={"/candidate/" + candidate.we_vote_id }
              onlyActiveOnIndex={false}>
          <div className="row" style={{ paddingBottom: "10px" }}>
            <div
              className="col-xs-6"
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
            <div className="col-xs-6">
              <h4 className="bufferNone">
                  about { candidate.ballot_item_display_name }
              </h4>
              <p>Running for <span className="running-for-office-emphasis">{ candidate.office_display_name }</span></p>
            </div>
          </div>
        </Link>

          <input type="text" name="search_opinions" className="form-control"
               placeholder="Search by name or twitter handle." />
          <p>
            These organizations and public figures have opinions about this ballot item.
            Click the "Follow" button to pay attention to them.
          </p>
          {guides}
        </div>
      </div>;

    return content;
  }
}
