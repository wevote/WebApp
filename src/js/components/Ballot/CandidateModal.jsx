import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import CandidateActions from "../../actions/CandidateActions";
import CandidateStore from "../../stores/CandidateStore";
import GuideList from "../../components/VoterGuide/GuideList";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyPositionBreakdownList from "../../components/Position/ItemTinyPositionBreakdownList";
import PositionList from "../../components/Ballot/PositionList";
import SupportStore from "../../stores/SupportStore";
import VoterGuideStore from "../../stores/VoterGuideStore";


export default class CandidateModal extends Component {
  // We create this modal to pop up and show voter guides that the voter can follow relating to this Candidate.

  // July 2017: What triggers CandidateModal and MeasureModal -- it comes from clicking on the position bar (once you
  // have followed any organizations that have opinions on either the candidate or modal).

  static propTypes = {
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
    candidate: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      position_list_from_advisers_followed_by_voter: [],
      voter_guides_to_follow_for_latest_ballot_item: [],
      pause_position_list_for_ballot_item_retrieve: false,
    };
  }

  componentDidMount () {
    this.setState({
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(this.props.candidate.we_vote_id),
      voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onCandidateStoreChange (){
    // console.log("CandidateModal onCandidateStoreChange");
    this.setState({
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(this.props.candidate.we_vote_id),
      pause_position_list_for_ballot_item_retrieve: false,
    });
  }

  onVoterGuideStoreChange () {
    // console.log("CandidateModal onVoterGuideStoreChange");
    if (!this.state.pause_position_list_for_ballot_item_retrieve) {
      CandidateActions.positionListForBallotItem(this.props.candidate.we_vote_id);
      this.setState({
        pause_position_list_for_ballot_item_retrieve: true,
      });
    }
    this.setState({
      voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
  }

  render () {
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to follow about this candidate or measure.";
    return <Modal show={this.props.show}
                  onHide={this.props.toggleFunction} >
      <Modal.Header closeButton onHide={this.props.toggleFunction}>
        <Modal.Title>
          { this.props.candidate ?
            "Opinions about " + this.props.candidate.ballot_item_display_name :
            null }
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        { this.props.candidate ?
          <section className="card">
            {/* Show positions in your network with the tiny icons */}
            <p className="card__no-additional">
              This is a summary of the positions of those you are following.
            </p>
            <ItemSupportOpposeCounts we_vote_id={this.props.candidate.we_vote_id}
                                     supportProps={SupportStore.get(this.props.candidate.we_vote_id)}
                                     type="CANDIDATE"
                                     positionBarIsClickable/>
            { this.state.position_list_from_advisers_followed_by_voter ?
              <span>
                {/* Show a break-down of the positions in your network */}
                { SupportStore.get(this.props.candidate.we_vote_id) &&
                  ( SupportStore.get(this.props.candidate.we_vote_id).oppose_count ||
                    SupportStore.get(this.props.candidate.we_vote_id).support_count) ?
                  <span>
                  {/* In desktop mode, align left with position bar */}
                  {/* In mobile mode, turn on green up-arrow before icons */}
                    <ItemTinyPositionBreakdownList ballot_item_display_name={this.props.candidate.ballot_item_display_name}
                                                   ballotItemWeVoteId={this.props.candidate.we_vote_id}
                                                   position_list={this.state.position_list_from_advisers_followed_by_voter}
                                                   showSupport
                                                   supportProps={SupportStore.get(this.props.candidate.we_vote_id)} />
                    <span className="pull-right">
                      {/* In desktop mode, align right with position bar */}
                      {/* In mobile mode, turn on red down-arrow before icons (make sure there is line break after support positions) */}
                      <ItemTinyPositionBreakdownList ballot_item_display_name={this.props.candidate.ballot_item_display_name}
                                                     ballotItemWeVoteId={this.props.candidate.we_vote_id}
                                                     position_list={this.state.position_list_from_advisers_followed_by_voter}
                                                     showOppose
                                                     supportProps={SupportStore.get(this.props.candidate.we_vote_id)} />
                    </span>
                  </span> :
                  null }
              </span> :
              null }
            <div className="card__additional">
              { this.state.position_list_from_advisers_followed_by_voter ?
                <div>
                  <PositionList position_list={this.state.position_list_from_advisers_followed_by_voter}
                                hideSimpleSupportOrOppose
                                ballot_item_display_name={this.props.candidate.ballot_item_display_name} />
                </div> :
                null
              }
              {this.state.voter_guides_to_follow_for_latest_ballot_item.length === 0 ?
                <p className="card__no-additional">{NO_VOTER_GUIDES_TEXT}</p> :
                <div>
                  <h3 className="card__additional-heading">{"More opinions about " + this.props.candidate.ballot_item_display_name}</h3>
                  <p className="card__no-additional">
                      <strong>Follow</strong> the voter guides of organizations and people you trust.<br />
                      <strong>Ignore</strong> voter guides that don't share your values.
                  </p>
                  <GuideList ballotItemWeVoteId={this.props.candidate.we_vote_id}
                             organizationsToFollow={this.state.voter_guides_to_follow_for_latest_ballot_item}/>
                </div>
              }
            </div>
          </section> :
          null }
      </Modal.Body>
    </Modal>;
  }
}
