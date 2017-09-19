import React, { Component, PropTypes } from "react";
import { Modal } from "react-bootstrap";
import GuideList from "../VoterGuide/GuideList";
import ItemSupportOpposeCounts from "../Widgets/ItemSupportOpposeCounts";
import ItemTinyPositionBreakdownList from "../Position/ItemTinyPositionBreakdownList";
import SupportStore from "../../stores/SupportStore";

export default class MeasureModal extends Component {
  // We create this modal to pop up and show voter guides that the voter can follow relating to this Measure.

  static propTypes = {
    show: PropTypes.bool,
    toggleFunction: PropTypes.func.isRequired,
    measure: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return <Modal show onHide={this.props.toggleFunction}>
      <Modal.Header closeButton onHide={this.props.toggleFunction}>
        <Modal.Title>
          { this.props.measure ?
            "Opinions about " + this.props.measure.ballot_item_display_name :
            null }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { this.props.measure ?
          <section className="card">
            {/* Show positions in your network with the tiny icons */}
            <p className="card__no-additional">
              This is a summary of the positions of those you are following.
            </p>
            <ItemSupportOpposeCounts we_vote_id={this.props.measure.measure_we_vote_id}
                                     supportProps={SupportStore.get(this.props.measure.measure_we_vote_id)}
                                     type="MEASURE"
                                     isModal/>
            { this.props.measure.position_list ?
              <span>
                  {/* Show a break-down of the positions in your network */}
                { SupportStore.get(this.props.measure.measure_we_vote_id) &&
                ( SupportStore.get(this.props.measure.measure_we_vote_id).oppose_count ||
                  SupportStore.get(this.props.measure.measure_we_vote_id).support_count) ?
                  <span>
                      {/* In desktop mode, align left with position bar */}
                    {/* In mobile mode, turn on green up-arrow before icons */}
                    <ItemTinyPositionBreakdownList ballot_item_display_name={this.props.measure.ballot_item_display_name}
                                                   ballotItemWeVoteId={this.props.measure.measure_we_vote_id}
                                                   position_list={this.props.measure.position_list}
                                                   showSupport
                                                   supportProps={SupportStore.get(this.props.measure.measure_we_vote_id)} />
                      <span className="pull-right">
                        {/* In desktop mode, align right with position bar */}
                        {/* In mobile mode, turn on red down-arrow before icons (make sure there is line break after support positions) */}
                        <ItemTinyPositionBreakdownList ballot_item_display_name={this.props.measure.ballot_item_display_name}
                                                       ballotItemWeVoteId={this.props.measure.measure_we_vote_id}
                                                       position_list={this.props.measure.position_list}
                                                       showOppose
                                                       supportProps={SupportStore.get(this.props.measure.measure_we_vote_id)} />
                      </span>
                    </span> :
                  null }
                </span> :
              null }
            {/* Show voter guides to follow that relate to this measure */}
            <div className="card__additional">
              {this.props.measure.voter_guides_to_follow_for_ballot_item_id.length === 0 ?
                null :
                <span>
                    <p className="card__no-additional">
                      <strong>Follow</strong> the voter guides of organizations and people you trust.<br />
                      <strong>Ignore</strong> voter guides that don't share your values.
                    </p>
                    <GuideList ballotItemWeVoteId={this.props.measure.measure_we_vote_id}
                               organizationsToFollow={this.props.measure.voter_guides_to_follow_for_ballot_item_id}/>
                  </span>
              }
            </div>
          </section> :
          null }
      </Modal.Body>
    </Modal>;
  }
}
