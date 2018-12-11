import React, { Component } from "react";
import PropTypes from "prop-types";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import { historyPush } from "../../utils/cordovaUtils";
import IssuesByBallotItemDisplayList from "../Issues/IssuesByBallotItemDisplayList";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import { renderLog } from "../../utils/logging";
import MeasureStore from "../../stores/MeasureStore";
import OrganizationStore from "../../stores/OrganizationStore";
import ReadMore from "../Widgets/ReadMore";
import SupportStore from "../../stores/SupportStore";
import { capitalizeString } from "../../utils/textFormat";
import VoterGuideStore from "../../stores/VoterGuideStore";
// import ItemSupportOpposeRaccoon from "../Widgets/ItemSupportOpposeRaccoon";


export default class MeasureItemCompressed extends Component {
  static propTypes = {
    ballot_item_display_name: PropTypes.string.isRequired,
    currentBallotIdInUrl: PropTypes.string,
    kind_of_ballot_item: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    measure: PropTypes.object,
    measure_subtitle: PropTypes.string,
    measure_text: PropTypes.string,
    measure_url: PropTypes.string,
    organization: PropTypes.object,
    position_list: PropTypes.array,
    showPositionStatementActionBar: PropTypes.bool,
    toggleMeasureModal: PropTypes.func,
    urlWithoutHash: PropTypes.string,
    we_vote_id: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    const ballotItemType = "MEASURE";
    this.state = {
      ballotItemType,
      ballotItemWeVoteId: "",
      componentDidMountFinished: false,
      maximum_organization_display: 4,
      organization: {},
      showModal: false,
      showPositionStatement: false,
      shouldFocusCommentArea: false,
      transitioning: false,
    };
    this.getMeasureLink = this.getMeasureLink.bind(this);
    this.goToMeasureLink = this.goToMeasureLink.bind(this);
    this.passDataBetweenItemActionToItemPosition = this.passDataBetweenItemActionToItemPosition.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    const ballotItemType = "MEASURE";
    const is_measure = true;
    this.setState({
      ballotItemType,
      ballotItemWeVoteId: this.props.we_vote_id,
      componentDidMountFinished: true,
      is_measure,
      measure: MeasureStore.getMeasure(this.props.we_vote_id),
      supportProps: SupportStore.get(this.props.we_vote_id),
    });
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
        organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
      });
    }
    this.setState({
      measure: MeasureStore.getMeasure(this.props.we_vote_id),
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.componentDidMountFinished === false) {
      // console.log("shouldComponentUpdate: componentDidMountFinished === false");
      return true;
    }
    if (this.state.ballot_item_display_name !== nextState.ballot_item_display_name) {
      // console.log("shouldComponentUpdate: this.state.ballot_item_display_name", this.state.ballot_item_display_name, ", nextState.ballot_item_display_name", nextState.ballot_item_display_name);
      return true;
    }
    if (this.state.measure !== nextState.measure) {
      // console.log("shouldComponentUpdate: this.state.measure", this.state.measure, ", nextState.measure", nextState.measure);
      return true;
    }
    if (this.props.showPositionStatementActionBar !== nextProps.showPositionStatementActionBar) {
      // console.log("shouldComponentUpdate: this.props.showPositionStatementActionBar change");
      return true;
    }
    if (this.state.showPositionStatement !== nextState.showPositionStatement) {
      // console.log("shouldComponentUpdate: this.state.showPositionStatement change");
      return true;
    }
    if (this.state.supportProps !== undefined && nextState.supportProps !== undefined) {
      const currentNetworkSupportCount = parseInt(this.state.supportProps.support_count) || 0;
      const nextNetworkSupportCount = parseInt(nextState.supportProps.support_count) || 0;
      const currentNetworkOpposeCount = parseInt(this.state.supportProps.oppose_count) || 0;
      const nextNetworkOpposeCount = parseInt(nextState.supportProps.oppose_count) || 0;
      if (currentNetworkSupportCount !== nextNetworkSupportCount || currentNetworkOpposeCount !== nextNetworkOpposeCount) {
        // console.log("shouldComponentUpdate: support or oppose count change");
        return true;
      }
    }
    return false;
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onOrganizationStoreChange () {
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onVoterGuideStoreChange () {
    // We just want to trigger a re-render
    this.setState({ transitioning: false });
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
      supportProps: SupportStore.get(this.props.we_vote_id),
      transitioning: false,
    });
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

  passDataBetweenItemActionToItemPosition () {
    this.setState({ shouldFocusCommentArea: true });
  }

  togglePositionStatement () {
    this.setState({
      showPositionStatement: !this.state.showPositionStatement,
      shouldFocusCommentArea: true,
    });
  }

  render () {
    // console.log("MeasureItemCompressed render");
    renderLog(__filename);
    let { ballot_item_display_name, measure_subtitle } = this.props;
    const { we_vote_id: measureWeVoteId } = this.props;
    measure_subtitle = capitalizeString(measure_subtitle);
    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    // let measureGuidesList = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(measureWeVoteId);

    // let measure_for_modal = {
    //   ballot_item_display_name: ballot_item_display_name,
    //   voter_guides_to_follow_for_ballot_item_id: measureGuidesList,
    //   kind_of_ballot_item: this.props.kind_of_ballot_item,
    //   link_to_ballot_item_page: this.props.link_to_ballot_item_page,
    //   measure_subtitle: measure_subtitle,
    //   measure_text: this.props.measure_text,
    //   measure_url: this.props.measure_url,
    //   we_vote_id: measureWeVoteId,
    //   position_list: this.props.position_list,
    // };

    // let measureSupportStore = SupportStore.get(measureWeVoteId);
    // let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(measureWeVoteId);
    // let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(measureWeVoteId);

    // Voter Support or opposition
    let is_voter_support = false;
    let is_voter_oppose = false;
    let voter_statement_text = false;
    const ballotItemSupportStore = SupportStore.get(this.state.ballotItemWeVoteId);
    if (ballotItemSupportStore !== undefined) {
      // console.log("ballotItemSupportStore: ", ballotItemSupportStore);
      is_voter_support = ballotItemSupportStore.is_support;
      is_voter_oppose = ballotItemSupportStore.is_oppose;
      voter_statement_text = ballotItemSupportStore.voter_statement_text;
    }

    let commentBoxIsVisible = false;
    if (this.props.showPositionStatementActionBar || is_voter_support || is_voter_oppose || voter_statement_text || this.state.showPositionStatement) {
      commentBoxIsVisible = true;
    }
    const item_action_bar = (
      <span>
        <ItemActionBar
          ballot_item_display_name={this.state.ballot_item_display_name}
          ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
          commentButtonHide={commentBoxIsVisible}
          commentButtonHideInMobile
          currentBallotIdInUrl={this.props.currentBallotIdInUrl}
          shareButtonHide
          supportProps={ballotItemSupportStore}
          supportOrOpposeHasBeenClicked={this.passDataBetweenItemActionToItemPosition}
          toggleFunction={this.togglePositionStatement.bind(this)}
          transitioning={this.state.transitioning}
          type={this.state.ballotItemType}
          urlWithoutHash={this.props.urlWithoutHash}
          we_vote_id={this.props.we_vote_id}
        />
      </span>
    );

    const comment_display_raccoon_desktop = this.props.showPositionStatementActionBar || is_voter_support || is_voter_oppose || voter_statement_text || this.state.showPositionStatement ? (
      <div className="d-none d-sm-block o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
        <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
          <ItemPositionStatementActionBar
            ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
            ballot_item_display_name={this.state.ballot_item_display_name}
            comment_edit_mode_on={this.state.showPositionStatement}
            supportProps={ballotItemSupportStore}
            shouldFocus={this.state.shouldFocusCommentArea}
            transitioning={this.state.transitioning}
            type={this.state.ballotItemType}
            shown_in_list
          />
        </div>
      </div>
    ) :
      null;

    const comment_display_raccoon_mobile = this.props.showPositionStatementActionBar || is_voter_support || is_voter_oppose || voter_statement_text ? (
      <div className="d-block d-sm-none o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
        <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
          <ItemPositionStatementActionBar
            ballot_item_we_vote_id={this.state.ballotItemWeVoteId}
            ballot_item_display_name={this.state.ballot_item_display_name}
            supportProps={ballotItemSupportStore}
            shouldFocus={this.state.shouldFocusCommentArea}
            transitioning={this.state.transitioning}
            type={this.state.ballotItemType}
            shown_in_list
          />
        </div>
      </div>
    ) :
      null;

    return (
      <div className="card-main measure-card">
        <a className="anchor-under-header" name={measureWeVoteId} />
        <div className="card-main__content">
          <h2 className="card-main__display-name">
            { this.props.link_to_ballot_item_page ? (
              <div className="card-main__ballot-name-group">
                <div className="card-main__ballot-name-item card-main__ballot-name card-main__ballot-name-link">
                  <a onClick={() => this.goToMeasureLink(measureWeVoteId)}>
                    {ballot_item_display_name}
                  </a>
                </div>
              </div>
            ) :
              ballot_item_display_name
          }
          </h2>
          <BookmarkToggle we_vote_id={measureWeVoteId} type="MEASURE" />
          <div>
            <div className="u-stack--md u-cursor--pointer" onClick={() => this.goToMeasureLink(measureWeVoteId)}>
          Click to see more details about this measure.
            </div>

          </div>
          <div>
            {/* Issues related to this Measure */}
            <IssuesByBallotItemDisplayList
              ballotItemDisplayName={ballot_item_display_name}
              ballotItemWeVoteId={measureWeVoteId}
              currentBallotIdInUrl={this.props.currentBallotIdInUrl}
              issuesListHidden
              overlayTriggerOnClickOnly
              placement="bottom"
              urlWithoutHash={this.props.urlWithoutHash}
            />
          </div>
          {/* Measure information */}
          <div
            className={this.props.link_to_ballot_item_page ? "u-cursor--pointer" : null}
            onClick={this.props.link_to_ballot_item_page ? () => this.goToMeasureLink(measureWeVoteId) : null}
          >
            {measure_subtitle}
          </div>
          { this.state.measure_text ? (
            <div className="measure_text u-gray-mid">
              <ReadMore
                num_of_lines={3}
                text_to_display={this.state.measure_text}
              />
            </div>
          ) :
            null
        }

          {/* Positions in Your Network and Possible Voter Guides to Follow */}
          <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
            {/* <ItemSupportOpposeRaccoon ballotItemWeVoteId={measureWeVoteId}
                                    ballot_item_display_name={ballot_item_display_name}
                                    currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                    maximumOrganizationDisplay={this.state.maximum_organization_display}
                                    organizationsToFollowSupport={organizationsToFollowSupport}
                                    organizationsToFollowOppose={organizationsToFollowOppose}
                                    showPositionStatementActionBar={this.props.showPositionStatementActionBar}
                                    supportProps={measureSupportStore}
                                    urlWithoutHash={this.props.urlWithoutHash}
                                    we_vote_id={this.props.we_vote_id}/> */}

            <div className="network-positions-stacked">
              <div className="network-positions-stacked__support">
                {/* Support toggle here */}
                {item_action_bar}
              </div>
              { comment_display_raccoon_desktop }
              { comment_display_raccoon_mobile }
            </div>
          </div>
        </div>
        {" "}
        {/* END .card-main__content */}
      </div>
    );
  }
}
