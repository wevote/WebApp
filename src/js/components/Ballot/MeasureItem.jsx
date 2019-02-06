import React, { Component } from "react";
import PropTypes from "prop-types";
import { historyPush } from "../../utils/cordovaUtils";
import IssuesByBallotItemDisplayList from "../Issues/IssuesByBallotItemDisplayList";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeCounts from "../Widgets/ItemSupportOpposeCounts";
import ItemTinyPositionBreakdownList from "../Position/ItemTinyPositionBreakdownList";
import { renderLog } from "../../utils/logging";
import ReadMore from "../Widgets/ReadMore";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";

export default class MeasureItem extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    commentButtonHide: PropTypes.bool,
    election_display_name: PropTypes.string,
    link_to_ballot_item_page: PropTypes.bool,
    measure_subtitle: PropTypes.string,
    measure_text: PropTypes.string,
    state_code: PropTypes.string,
    positionList: PropTypes.array,
    regional_display_name: PropTypes.string,
    state_display_name: PropTypes.string,
    showPositionsInYourNetworkBreakdown: PropTypes.bool,
    we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { transitioning: false };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
  }

  componentDidMount () {
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id) });
  }

  componentWillUnmount () {
    this.supportStoreListener.remove();
  }

  onSupportStoreChange () {
    this.setState({ supportProps: SupportStore.get(this.props.we_vote_id), transitioning: false });
  }

  getMeasureLink (oneMeasureWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return `/measure/${oneMeasureWeVoteId}/btvg/${this.state.organization.organization_we_vote_id}`;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return `/measure/${oneMeasureWeVoteId}/b/btdb/`;
    }
  }

  goToMeasureLink (oneMeasureWeVoteId) {
    const measureLink = this.getMeasureLink(oneMeasureWeVoteId);
    historyPush(measureLink);
  }

  render () {
    renderLog(__filename);
    const { supportProps, transitioning } = this.state;
    let {
      ballot_item_display_name: ballotItemDisplayName, measure_subtitle: measureSubtitle,
      state_display_name: stateDisplayName,
    } = this.props;
    const {
      measure_text: measureText, we_vote_id: measureWeVoteId, election_display_name: electionDisplayName,
      regional_display_name: regionalDisplayName, state_code: stateCode,
    } = this.props;
    if (stateDisplayName === undefined && stateCode) {
      stateDisplayName = stateCode.toUpperCase();
    }

    const numberOfLines = 2;
    measureSubtitle = capitalizeString(measureSubtitle);
    ballotItemDisplayName = capitalizeString(ballotItemDisplayName);

    const positionsInYourNetwork = SupportStore.get(measureWeVoteId) && (SupportStore.get(measureWeVoteId).oppose_count || SupportStore.get(measureWeVoteId).support_count);

    return (
      <div className="card-main">
        <div className="card-main__content">
          <h2 className="card-main__display-name">
            { this.props.link_to_ballot_item_page ?
              <a onClick={() => this.goToMeasureLink(measureWeVoteId)}>{ballotItemDisplayName}</a> :
              ballotItemDisplayName
          }
          </h2>
          <div className="card-main__measure-election u-bold u-gray-darker">
            <p>
              { electionDisplayName || "Appearing on the ballot in " }
              { electionDisplayName ? <span> &middot; </span> : null }
              { regionalDisplayName || null }
              { regionalDisplayName && stateDisplayName ? ", " : null }
              { stateDisplayName }
            </p>
          </div>
          <div
            className={this.props.link_to_ballot_item_page ?
              "u-cursor--pointer" : null}
            onClick={this.props.link_to_ballot_item_page ? () => this.goToMeasureLink(measureWeVoteId) : null}
          >
            {measureSubtitle}
          </div>
          { measureText ? (
            <div className="measure_text u-gray-mid">
              <ReadMore
                num_of_lines={numberOfLines}
                text_to_display={measureText}
              />
            </div>
          ) :
            null
          }

          <div className="row" style={{ paddingBottom: "0.5rem" }}>
            <div className="col-12" />
          </div>

          <div>
            {/* Issues related to this Measure */}
            <IssuesByBallotItemDisplayList
              ballotItemWeVoteId={measureWeVoteId}
              issuesListHidden
              placement="bottom"
            />
          </div>

          <div
            className={this.props.link_to_ballot_item_page ?
              "u-cursor--pointer" :
              null}
            onClick={this.props.link_to_ballot_item_page ? () => this.goToMeasureLink(measureWeVoteId) : null}
          >
            <div className="u-stack--md">
              <ItemSupportOpposeCounts
                we_vote_id={measureWeVoteId}
                supportProps={supportProps}
                transitioning={transitioning}
                type="MEASURE"
                positionBarIsClickable
              />
            </div>
            {/* Show a break-down of the positions in your network */}
            { positionsInYourNetwork && this.props.showPositionsInYourNetworkBreakdown ? (
              <div className="u-flex u-justify-between u-inset__v--xs">
                {/* In desktop mode, align left with position bar */}
                {/* In mobile mode, turn on green up-arrow before icons */}
                <ItemTinyPositionBreakdownList
                  ballot_item_display_name={ballotItemDisplayName}
                  ballotItemWeVoteId={measureWeVoteId}
                  position_list={this.props.positionList}
                  showSupport
                  supportProps={this.state.supportProps}
                />

                {/* In desktop mode, align right with position bar */}
                {/* In mobile mode, turn on red down-arrow before icons (make sure there is line break after support positions) */}
                <ItemTinyPositionBreakdownList
                  ballot_item_display_name={ballotItemDisplayName}
                  ballotItemWeVoteId={measureWeVoteId}
                  position_list={this.props.positionList}
                  showOppose
                  supportProps={this.state.supportProps}
                />
              </div>
            ) : null
            }
          </div>
        </div>
        {" "}
        {/* END .card-main__content */}
        <div className="card-main__actions">
          <ItemActionBar
            ballot_item_we_vote_id={measureWeVoteId}
            ballotItemDisplayName={ballotItemDisplayName}
            commentButtonHide={this.props.commentButtonHide}
            supportProps={supportProps}
            transitioning={transitioning}
            type="MEASURE"
          />
          <ItemPositionStatementActionBar
            ballot_item_we_vote_id={measureWeVoteId}
            ballotItemDisplayName={ballotItemDisplayName}
            supportProps={supportProps}
            transitioning={transitioning}
            type="MEASURE"
          />
        </div>
      </div>
    );
  }
}
