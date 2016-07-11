import React, { Component, PropTypes } from "react";
import CandidateActions from "../../actions/CandidateActions";
import CandidateItem from "../../components/Ballot/CandidateItem";
import CandidateStore from "../../stores/CandidateStore";
import GuideList from "../../components/VoterGuide/GuideList";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import OfficeStore from "../../stores/OfficeStore";
import PositionList from "../../components/Ballot/PositionList";
import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";
import VoterStore from "../../stores/VoterStore";
import { exitSearch } from "../../utils/search-functions";

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.we_vote_id = this.props.params.we_vote_id;
    this.state = {candidate: {}, office: {} };
  }

  componentDidMount (){
    this.candidateToken = CandidateStore.addListener(this._onChange.bind(this));
    this.officeToken = OfficeStore.addListener(this._onChange.bind(this));

    CandidateActions.retrieve(this.we_vote_id);

    this.listener = GuideStore.addListener(this._onChange.bind(this));
    GuideActions.retrieveGuidesToFollowByBallotItem(this.we_vote_id, "CANDIDATE");

    // Display the candidate's name in the search box
    var { candidate } = this.state;
    var searchBoxText = candidate.ballot_item_display_name || "";  // TODO DALE Not working right now
    exitSearch(searchBoxText);
  }

  componentWillUnmount () {
    this.candidateToken.remove();
    this.officeToken.remove();
    this.listener.remove();
  }

  _onChange (){
    var candidate = CandidateStore.get(this.we_vote_id) || {};
    this.setState({ candidate: candidate, guideList: GuideStore.toFollowListForCand() });

    if (candidate.contest_office_we_vote_id){
      this.setState({ office: OfficeStore.get(candidate.contest_office_we_vote_id) || {} });
    }

  }

  render () {
    const electionId = VoterStore.election_id();
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to follow about this candidate or measure.";
    var { candidate, office, guideList } = this.state;

    if (!candidate.ballot_item_display_name){
      return <div className="bs-container-fluid bs-well u-gutter-top--small fluff-full1">
              <h3>No Candidate Found</h3>
                <div className="small">We were not able to find that candidate.
                  Please search again.</div>
                <br />
            </div>;
    }

    return <span>
        <section className="candidate-card__container">
          <CandidateItem {...candidate} office_name={office.ballot_item_display_name}/>
          <div className="candidate-card__additional">
            { candidate.position_list ?
              <div>
                <PositionList
                position_list={candidate.position_list}
                candidate_display_name={candidate.ballot_item_display_name} />
              </div> :
              null
            }
            {guideList.length === 0 ?
              <p className="candidate-card__no-additional">{NO_VOTER_GUIDES_TEXT}</p> :
              <div><h3 className="candidate-card__additional-heading">{"More opinions about " + candidate.ballot_item_display_name}</h3>
              <GuideList id={electionId} ballotItemWeVoteId={this.we_vote_id} organizations={guideList}/></div>
            }
          </div>
        </section>
        <br />
        <ThisIsMeAction twitter_handle_being_viewed={candidate.twitter_handle}
                      name_being_viewed={candidate.ballot_item_display_name}
                      kind_of_owner="POLITICIAN" />
        <br />
      </span>;

  }
}
