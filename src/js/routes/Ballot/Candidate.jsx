import React, { Component, PropTypes } from "react";
import CandidateStore from "../../stores/CandidateStore";
import OfficeStore from "../../stores/OfficeStore";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import VoterStore from "../../stores/VoterStore";
import CandidateActions from "../../actions/CandidateActions";
import PositionList from "../../components/Ballot/PositionList";
import ItemActionBar2 from "../../components/Widgets/ItemActionBar2";
import GuideList from "../../components/VoterGuide/GuideList";
import StarAction from "../../components/Widgets/StarAction";

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
      return <div></div>;
    }
    const twitterDescription = candidate.twitter_description || "";

    return <section className="candidate well well-90 gutter-top--small">
      <div className="candidate-detail-route list-group-item">
        {
          <StarAction
          we_vote_id={candidate.we_vote_id} type="CANDIDATE"/>
        }

        <div className="row" style={{ paddingBottom: "2rem" }}>
          <div
            className="col-xs-4"
            style={candidate.candidate_photo_url ? {} : {paddingTop: "2em"}}>

            {
              candidate.candidate_photo_url ?
                <img
                  className="img-circle utils-img-contain"
                  style={{ display: "block", paddingTop: "2em"}}
                  src={candidate.candidate_photo_url}
                  alt="candidate-photo"/> :
              <i className="icon-lg icon-main icon-icon-person-placeholder-6-1 icon-light utils-img-contain-glyph"/>
            }
          </div>
          <div className="col-xs-8">
            <h4 className="bufferNone">
              { candidate.ballot_item_display_name }
              {
                candidate.party ?
                    <span className="link-text-candidate-party">, { candidate.party }</span> :
                    <span></span>
              }
            </h4>
            { twitterDescription ? <span>{twitterDescription}<br /></span> :
                <span></span>}
            {
              office.ballot_item_display_name ?
                <p>Running for <span className="running-for-office-emphasis">{ office.ballot_item_display_name }</span></p> :
                <p></p>
            }
          </div>
        </div>
        {<ItemActionBar2 we_vote_id={this.we_vote_id} type="CANDIDATE"
                       />}
        <div className="container-fluid well-90">
          {/* TODO Post privately box functionality to be implemented */}
          {/*
          <ul className="list-group">
              <li className="list-group-item">
                  <div>
                      <input type="text" name="address" className="form-control" defaultValue="What do you think?" />
                      <Link to="ballot_candidate" params={{id: 2}}><Button bsSize="small">Post Privately</Button></Link>
                  </div>
              </li>
          </ul>
          */}
          { candidate.position_list ?
            <div>
              <PositionList
              position_list={candidate.position_list}
              candidate_display_name={candidate.ballot_item_display_name} />
            </div> :
            <div></div> }
            <h5>{"More Opinions About " + candidate.ballot_item_display_name}</h5>
            {guideList.length === 0 ?
              <div>{NO_VOTER_GUIDES_TEXT}</div> :
              <GuideList id={electionId} ballotItemWeVoteId={this.we_vote_id} organizations={guideList}/>
            }
        </div>
      </div>
    </section>;

  }
}
