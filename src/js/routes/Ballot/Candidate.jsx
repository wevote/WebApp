import React, { Component, PropTypes } from "react";
import CandidateStore from "../../stores/CandidateStore";
import OfficeStore from "../../stores/OfficeStore";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import VoterStore from "../../stores/VoterStore";
import CandidateActions from "../../actions/CandidateActions";
import PositionList from "../../components/Ballot/PositionList";
import CandidateItem from "../../components/Ballot/CandidateItem";
import GuideList from "../../components/VoterGuide/GuideList";

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.we_vote_id = this.props.params.we_vote_id;
    this.state = {candidate: {}, office: {} };
  }

  componentWillUnmount () {
    this.candidateToken.remove();
    this.officeToken.remove();
    this.listener.remove();
  }

  componentDidMount (){
    this.candidateToken = CandidateStore.addListener(this._onChange.bind(this));
    this.officeToken = OfficeStore.addListener(this._onChange.bind(this));

    CandidateActions.retrieve(this.we_vote_id);

    this.listener = GuideStore.addListener(this._onChange.bind(this));
    GuideActions.retrieveGuidesToFollowByBallotItem(this.we_vote_id, "CANDIDATE");
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
      return null;
    }

    return <section className="candidate-card__container u-gutter-top--small">
            <CandidateItem {...candidate} office_name={office.ballot_item_display_name}/>
            <div className="bs-container-fluid">
              { candidate.position_list ?
                <div>
                  <PositionList
                  position_list={candidate.position_list}
                  candidate_display_name={candidate.ballot_item_display_name} />
                </div> :
                null
              }
                <h5>{"More Opinions About " + candidate.ballot_item_display_name}</h5>
                {guideList.length === 0 ?
                  <div>{NO_VOTER_GUIDES_TEXT}</div> :
                  <GuideList id={electionId} ballotItemWeVoteId={this.we_vote_id} organizations={guideList}/>
                }
            </div>
    </section>;

  }
}
