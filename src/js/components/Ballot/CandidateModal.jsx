import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import CandidateActions from "../../actions/CandidateActions";
import CandidateStore from "../../stores/CandidateStore";
import GuideList from "../../components/VoterGuide/GuideList";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyPositionBreakdownList from "../../components/Position/ItemTinyPositionBreakdownList";
import { renderLog } from "../../utils/logging";
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
      hide_position_statement: true,
      pause_position_list_for_ballot_item_retrieve: false,
      position_list_from_advisers_followed_by_voter: [],
      voter_guides_to_follow_for_latest_ballot_item: [],
    };
  }

  componentDidMount () {
    this.setState({
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(this.props.candidate.we_vote_id),
      voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
    var candidateSupportProps = SupportStore.get(this.props.candidate.we_vote_id);
    if (candidateSupportProps !== undefined) {
      this.setState({ candidateSupportProps: candidateSupportProps });
    }
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onCandidateStoreChange () {
    // console.log("CandidateModal onCandidateStoreChange");
    this.setState({
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(this.props.candidate.we_vote_id),
      pause_position_list_for_ballot_item_retrieve: false,
    });
  }

  onSupportStoreChange () {
    let candidateSupportProps = SupportStore.get(this.props.candidate.we_vote_id);
    if (candidateSupportProps !== undefined) {
      this.setState({ candidateSupportProps: candidateSupportProps });
    }
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

  togglePositionStatement () {
    this.setState({ hide_position_statement: !this.state.hide_position_statement });
  }

  render () {
    renderLog(__filename);

    let is_support = false;
    let is_oppose = false;
    let voter_statement_text = false;
    if (this.state.candidateSupportProps !== undefined) {
      is_support = this.state.candidateSupportProps.is_support;
      is_oppose = this.state.candidateSupportProps.is_oppose;
      voter_statement_text = this.state.candidateSupportProps.voter_statement_text;
    }

    const NO_VOTER_GUIDES_TEXT = "We couldn't find any more voter guides to listen to related to this candidate.";
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
              This is a summary of the positions you are listening to.
            </p>
            <ItemSupportOpposeCounts we_vote_id={this.props.candidate.we_vote_id}
                                     supportProps={this.state.candidateSupportProps}
                                     type="CANDIDATE"
                                     positionBarIsClickable/>
            { this.state.position_list_from_advisers_followed_by_voter ?
              <span>
                {/* Show a break-down of the positions in your network */}
                { this.state.candidateSupportProps &&
                  ( this.state.candidateSupportProps.oppose_count ||
                    this.state.candidateSupportProps.support_count) ?
                  <div className="u-flex u-justify-between u-inset__v--xs">
                  {/* In desktop mode, align left with position bar */}
                  {/* In mobile mode, turn on green up-arrow before icons */}
                    <ItemTinyPositionBreakdownList ballot_item_display_name={this.props.candidate.ballot_item_display_name}
                                                   ballotItemWeVoteId={this.props.candidate.we_vote_id}
                                                   position_list={this.state.position_list_from_advisers_followed_by_voter}
                                                   showSupport
                                                   supportProps={this.state.candidateSupportProps} />
                    <span className="pull-right">
                      {/* In desktop mode, align right with position bar */}
                      {/* In mobile mode, turn on red down-arrow before icons (make sure there is line break after support positions) */}
                      <ItemTinyPositionBreakdownList ballot_item_display_name={this.props.candidate.ballot_item_display_name}
                                                     ballotItemWeVoteId={this.props.candidate.we_vote_id}
                                                     position_list={this.state.position_list_from_advisers_followed_by_voter}
                                                     showOppose
                                                     supportProps={this.state.candidateSupportProps} />
                    </span>
                  </div> :
                  null }
              </span> :
              null }
            <div className="card-main__actions">
              <ItemActionBar ballot_item_we_vote_id={this.props.candidate.we_vote_id}
                             ballot_item_display_name={this.props.candidate.ballot_item_display_name}
                             supportProps={this.state.candidateSupportProps}
                             type="CANDIDATE"
                             toggleFunction={this.togglePositionStatement.bind(this)}
              />
              { is_support || is_oppose || voter_statement_text || !this.state.hide_position_statement ?
                <ItemPositionStatementActionBar ballot_item_we_vote_id={this.props.candidate.we_vote_id}
                                              ballot_item_display_name={this.props.candidate.ballot_item_display_name}
                                              supportProps={this.state.candidateSupportProps}
                                              type="CANDIDATE" /> :
              null }
            </div>
            <div className="card__additional">
              { this.state.position_list_from_advisers_followed_by_voter ?
                <div>
                  <PositionList position_list={this.state.position_list_from_advisers_followed_by_voter}
                                hideSimpleSupportOrOppose
                                ballot_item_display_name={this.props.candidate.ballot_item_display_name} />
                </div> :
                null
              }
            {/* Show voter guides to follow that relate to this candidate */}
              {this.state.voter_guides_to_follow_for_latest_ballot_item.length === 0 ?
                <p className="card__no-additional">{NO_VOTER_GUIDES_TEXT}</p> :
                <div>
                  <h3 className="card__additional-heading">{"More opinions about " + this.props.candidate.ballot_item_display_name}</h3>
                  <p className="card__no-additional">
                      <strong>Listen</strong> to the voter guides of organizations and people you trust.<br />
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
