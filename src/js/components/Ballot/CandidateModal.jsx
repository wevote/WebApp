import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import GuideList from "../../components/VoterGuide/GuideList";
import ItemSupportOpposeCounts from "../../components/Widgets/ItemSupportOpposeCounts";
import ItemTinyPositionBreakdownList from "../../components/Position/ItemTinyPositionBreakdownList";
import SupportStore from "../../stores/SupportStore";

export default class CandidateModal extends Component {
  // We create this modal to pop up and show voter guides that the voter can follow relating to this Candidate.

  static propTypes = {
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
    candidate: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
  }

  render () {
    return <Modal show >
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
                                     type="CANDIDATE" />
            { this.props.candidate.position_list ?
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
                                                   position_list={this.props.candidate.position_list}
                                                   showSupport
                                                   supportProps={SupportStore.get(this.props.candidate.we_vote_id)} />
                                <span className="pull-right">
                                    {/* In desktop mode, align right with position bar */}
                                  {/* In mobile mode, turn on red down-arrow before icons (make sure there is line break after support positions) */}
                                  <ItemTinyPositionBreakdownList ballot_item_display_name={this.props.candidate.ballot_item_display_name}
                                                                 ballotItemWeVoteId={this.props.candidate.we_vote_id}
                                                                 position_list={this.props.candidate.position_list}
                                                                 showOppose
                                                                 supportProps={SupportStore.get(this.props.candidate.we_vote_id)} />
                                </span>
                            </span> :
                  null }
                    </span> :
              null }
            {/* Show voter guides to follow that relate to this candidate */}
            <div className="card__additional">
              {this.props.candidate.guides_to_follow_list.length === 0 ?
                null :
                <span>
                            <p className="card__no-additional">
                                <strong>Follow</strong> the voter guides of organizations and people you trust.<br />
                                <strong>Ignore</strong> voter guides that don't share your values.
                            </p>
                            <GuideList ballotItemWeVoteId={this.props.candidate.we_vote_id}
                                       organizationsToFollow={this.props.candidate.guides_to_follow_list}/>
                        </span>
              }
            </div>
          </section> :
          null }
      </Modal.Body>
    </Modal>;
  }
}
