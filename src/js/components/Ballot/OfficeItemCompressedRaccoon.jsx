import React, { Component, PropTypes } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link, browserHistory } from "react-router";
import TextTruncate from "react-text-truncate";
import { capitalizeString } from "../../utils/textFormat";
import BallotSideBarLink from "../Navigation/BallotSideBarLink";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import CandidateActions from "../../actions/CandidateActions";
import CandidateStore from "../../stores/CandidateStore";
import ImageHandler from "../ImageHandler";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeRaccoon from "../Widgets/ItemSupportOpposeRaccoon";
import LearnMore from "../Widgets/LearnMore";
import OrganizationStore from "../../stores/OrganizationStore";
import SupportStore from "../../stores/SupportStore";
import VoterGuideStore from "../../stores/VoterGuideStore";

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 5; // Set to 5 in raccoon, and 3 in walrus

// This is related to components/VoterGuide/VoterGuideOfficeItemCompressed
export default class OfficeItemCompressedRaccoon extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    organization: PropTypes.object,
    organization_we_vote_id: PropTypes.string,
    toggleCandidateModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      display_all_candidates_flag: false,
      display_raccoon_details_flag: false,
      editMode: false,
      maximum_organization_display: 4,
      organization: {},
      show_position_statement: true,
      transitioning: false,
    };

    this.closeYourNetworkIsUndecidedPopover = this.closeYourNetworkIsUndecidedPopover.bind(this);
    this.closeYourNetworkSupportsPopover = this.closeYourNetworkSupportsPopover.bind(this);
    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.openCandidateModal = this.openCandidateModal.bind(this);
    this.toggleDisplayAllCandidates = this.toggleDisplayAllCandidates.bind(this);
    this.toggleExpandCheetahDetails = this.toggleExpandCheetahDetails.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();

    // console.log("this.props.candidate_list: ", this.props.candidate_list);
    if (this.props.candidate_list && this.props.candidate_list.length) {
      this.props.candidate_list.forEach( function (candidate) {
        // console.log("OfficeItemCompressed, candidate: ", candidate);
        if (candidate && candidate.hasOwnProperty("we_vote_id") && !CandidateStore.isCandidateInStore(candidate.we_vote_id)) {
          // console.log("OfficeItemCompressed, retrieving");
          CandidateActions.candidateRetrieve(candidate.we_vote_id);
        }
      });
    }
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }
  }

  componentWillReceiveProps (nextProps){
    // console.log("VoterGuideOfficeItemCompressed componentWillReceiveProps");
    // console.log("nextProps.candidate_list: ", nextProps.candidate_list);
    // Doesn't seem necessary
    // if (nextProps.candidate_list && nextProps.candidate_list.length) {
    //   nextProps.candidate_list.forEach( function (candidate) {
    //     // console.log("OfficeItemCompressed, candidate: ", candidate);
    //     if (candidate && candidate.hasOwnProperty("we_vote_id") && !CandidateStore.isCandidateInStore(candidate.we_vote_id)) {
    //       // console.log("OfficeItemCompressed, retrieving");
    //       CandidateActions.candidateRetrieve(candidate.we_vote_id);
    //     }
    //   });
    // }
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
         organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
       });
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState({
      transitioning: false
    });
  }

  _onOrganizationStoreChange (){
    // console.log("VoterGuideOfficeItemCompressed _onOrganizationStoreChange, org_we_vote_id: ", this.state.organization.organization_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
      transitioning: false,
    });
  }

  toggleDisplayAllCandidates () {
    this.setState({ display_all_candidates_flag: !this.state.display_all_candidates_flag });
  }

  toggleExpandCheetahDetails () {
    this.setState({ display_raccoon_details_flag: !this.state.display_raccoon_details_flag });
  }

  openCandidateModal (candidate) {
    // console.log("this.state.candidate: ", this.state.candidate);
    if (candidate && candidate.we_vote_id) {
      this.props.toggleCandidateModal(candidate);
    }
  }

  getCandidateLink (candidate_we_vote_id) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return "/candidate/" + candidate_we_vote_id + "/btvg/" + this.state.organization.organization_we_vote_id;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return "/candidate/" + candidate_we_vote_id + "/b/btdb/";
    }
  }

  getOfficeLink () {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return "/office/" + this.props.we_vote_id + "/btvg/" + this.state.organization.organization_we_vote_id;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return "/office/" + this.props.we_vote_id + "/b/btdb/";
    }
  }

  goToCandidateLink (candidate_we_vote_id) {
    let candidate_link = this.getCandidateLink(candidate_we_vote_id);
    browserHistory.push(candidate_link);
  }

  goToOfficeLink () {
    let office_link = this.getOfficeLink();
    browserHistory.push(office_link);
  }

  closeYourNetworkSupportsPopover () {
    this.refs["supports-overlay"].hide();
  }

  closeYourNetworkIsUndecidedPopover () {
    this.refs["undecided-overlay"].hide();
  }

  render () {
    // console.log("OfficeItemCompressedRaccoon render");
    let { ballot_item_display_name, we_vote_id } = this.props;

    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    var candidate_list_to_display = this.props.candidate_list;
    let total_number_of_candidates_to_display = this.props.candidate_list.length;
    var remaining_candidates_to_display_count = 0;

    if (!this.state.display_all_candidates_flag && this.props.candidate_list.length > NUMBER_OF_CANDIDATES_TO_DISPLAY) {
      candidate_list_to_display = this.props.candidate_list.slice(0, NUMBER_OF_CANDIDATES_TO_DISPLAY);
      remaining_candidates_to_display_count = this.props.candidate_list.length - NUMBER_OF_CANDIDATES_TO_DISPLAY;
    }

    let ballot_item_display_name_raccoon = this.state.display_raccoon_details_flag ?
            <Link onClick={this.toggleExpandCheetahDetails}>
              <TextTruncate line={1}
                            truncateText="…"
                            text={ballot_item_display_name}
                            textTruncateChild={null} />
            </Link> :
            <Link onClick={this.toggleExpandCheetahDetails}>
              <TextTruncate line={1}
                            truncateText="…"
                            text={ballot_item_display_name}
                            textTruncateChild={null} />
            </Link>;

    // Ready to Vote code
    let is_support_array = [];
    let candidate_with_most_support = null;
    let voter_supports_at_least_one_candidate = false;
    let supportProps;
    let candidate_has_voter_support;

    // Prepare an array of candidate names that are supported by voter
    this.props.candidate_list.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        candidate_has_voter_support = supportProps.is_support;

        if (candidate_has_voter_support) {
          is_support_array.push(candidate.ballot_item_display_name);
          voter_supports_at_least_one_candidate = true;
        }
      }
    });

    // This function finds the highest support count for each office but does not handle ties. If two candidates have
    // the same network support count, only the first candidate will be displayed.
    let largest_support_count = 0;
    let at_least_one_candidate_chosen = false;

    // If the voter isn't supporting any candidates, then figure out which candidate the voter's network likes the best
    if (is_support_array.length === 0){
      let network_support_count;
      let network_oppose_count;

      this.props.candidate_list.forEach((candidate) => {
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          network_support_count = supportProps.support_count;
          network_oppose_count = supportProps.oppose_count;

          if (network_support_count > network_oppose_count) {
            if (network_support_count > largest_support_count) {
              largest_support_count = network_support_count;
              candidate_with_most_support = candidate.ballot_item_display_name;
              at_least_one_candidate_chosen = true;
            }
          }
        }
      });
    }

    const yourNetworkIsUndecidedPopover =
      <Popover id="popover-trigger-click-root-close"
               title={<span>Your Network is Undecided <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
               onClick={this.closeYourNetworkIsUndecidedPopover}>
        Your friends, and the organizations you follow, are <strong>Your Network</strong>.
        Each friend or organization in your network
        that <span className="u-no-break"><img src="/img/global/icons/thumbs-up-color-icon.svg"
                                               width="20" height="20" /> supports</span> a candidate adds
        +1 to that candidate's <strong>Score in Your Network</strong>. None of the candidates running
        for {ballot_item_display_name} have more support in your network than the other candidates.
      </Popover>;

    return <div className="card-main office-item">
      <a name={we_vote_id} />
      <div className="card-main__content">
        {/* Desktop */}
        <span className="hidden-xs">
          <BookmarkToggle we_vote_id={we_vote_id} type="OFFICE" />
          <span className="hidden-print pull-right u-push--lg">
              <Link className="BallotItem__learn-more" onClick={this.goToOfficeLink}>learn more</Link>
          </span>
        </span>
        {/* Mobile */}
        <span className="visible-xs">
          { this.state.display_raccoon_details_flag ?
            <span className="BallotItem__learn-more hidden-print pull-right">
              <Link className="BallotItem__learn-more" onClick={this.goToOfficeLink}>learn more</Link>
            </span> :
            null
          }
        </span>

        <h2 className="u-f3 card-main__ballot-name u-stack--sm">{ballot_item_display_name_raccoon}</h2>

        {/* Only show the candidates if the Office is "unfurled" */}
        { this.state.display_raccoon_details_flag ?
          <span>{candidate_list_to_display.map((one_candidate) => {
            let candidate_we_vote_id = one_candidate.we_vote_id;
            let candidateSupportStore = SupportStore.get(candidate_we_vote_id);
            let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(candidate_we_vote_id);
            let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(candidate_we_vote_id);
            // console.log("OfficeItemCompressedRaccoon, just retrieved getVoterGuidesToFollowForBallotItemIdSupports");
            let candidate_party_text = one_candidate.party && one_candidate.party.length ? one_candidate.party + ". " : "";
            let candidate_description_text = one_candidate.twitter_description && one_candidate.twitter_description.length ? one_candidate.twitter_description : "";
            let candidate_text = candidate_party_text + candidate_description_text;
            let is_support = false;
            let is_oppose = false;
            let voter_statement_text = false;
            if (candidateSupportStore !== undefined) {
              is_support = candidateSupportStore.is_support;
              is_oppose = candidateSupportStore.is_oppose;
              voter_statement_text = candidateSupportStore.voter_statement_text;
            }

            let candidate_photo_raccoon = this.state.display_raccoon_details_flag ?
              <div onClick={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(one_candidate.we_vote_id) : null}>
                <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm"
                              sizeClassName="icon-candidate-small u-push--sm "
                              imageUrl={one_candidate.candidate_photo_url_large}
                              alt="candidate-photo"
                              kind_of_ballot_item="CANDIDATE" />
              </div> :
              null;

            let candidate_name_raccoon = <h4 className="card-main__candidate-name u-f5">
              <a onClick={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(one_candidate.we_vote_id) : null}>
                <TextTruncate line={1}
                              truncateText="…"
                              text={one_candidate.ballot_item_display_name}
                              textTruncateChild={null}/>
              </a>
            </h4>;

            let positions_display_raccoon = <div>
              <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
                {/* Positions in Your Network and Possible Voter Guides to Follow */}
                <ItemSupportOpposeRaccoon ballotItemWeVoteId={candidate_we_vote_id}
                                          ballot_item_display_name={one_candidate.ballot_item_display_name}
                                          display_raccoon_details_flag={this.state.display_raccoon_details_flag}
                                          goToCandidate={() => this.goToCandidateLink(one_candidate.we_vote_id)}
                                          maximumOrganizationDisplay={this.state.maximum_organization_display}
                                          organizationsToFollowSupport={organizationsToFollowSupport}
                                          organizationsToFollowOppose={organizationsToFollowOppose}
                                          supportProps={candidateSupportStore}
                                          type="CANDIDATE"/>
              </div>
            </div>;

            // TODO: NOT WORKING YET
            let comment_display_raccoon_desktop = this.state.display_raccoon_details_flag && (is_support || is_oppose || voter_statement_text) ?
              <div className="hidden-xs o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                <div
                  className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm">&nbsp;
                </div>
                <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                  <ItemPositionStatementActionBar ballot_item_we_vote_id={candidate_we_vote_id}
                                                  ballot_item_display_name={one_candidate.ballot_item_display_name}
                                                  supportProps={candidateSupportStore}
                                                  transitioning={this.state.transitioning}
                                                  type="CANDIDATE"
                                                  shown_in_list/>
                </div>
              </div> :
              null;

            // TODO: NOT WORKING YET
            let comment_display_raccoon_mobile = this.state.display_raccoon_details_flag && (is_support || is_oppose || voter_statement_text) ?
              <div className="visible-xs o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                <div
                  className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm">&nbsp;
                </div>
                <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                  <ItemPositionStatementActionBar ballot_item_we_vote_id={candidate_we_vote_id}
                                                  ballot_item_display_name={one_candidate.ballot_item_display_name}
                                                  supportProps={candidateSupportStore}
                                                  transitioning={this.state.transitioning}
                                                  type="CANDIDATE"
                                                  shown_in_list/>
                </div>
              </div> :
              null;

            return <div key={candidate_we_vote_id} className="u-stack--md">
              <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                {/* Candidate Photo, only shown in Desktop */}
                {candidate_photo_raccoon}
                <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                  {/* Candidate Name */}
                  {candidate_name_raccoon}
                  {/* Description under candidate name */}
                  <LearnMore text_to_display={candidate_text}
                             on_click={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(one_candidate.we_vote_id) : null} />
                  {/* DESKTOP: If voter has taken position, offer the comment bar */}
                  {/* comment_display_raccoon_desktop */}
                  {/* Organization's Followed AND to Follow Items */}
                  {positions_display_raccoon}
                </div>
                {/* MOBILE: If voter has taken position, offer the comment bar */}
                {/* comment_display_raccoon_mobile */}
              </div>
            </div>;
          })}</span> :
          null
        }

        {/* If the office is "rolled up", show some details */}
        { !this.state.display_raccoon_details_flag ?
          <div>
            { candidate_list_to_display.map( (one_candidate) => {

              const yourNetworkSupportsPopover =
                <Popover id="popover-trigger-click-root-close"
                         title={<span>Your Network Supports <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                         onClick={this.closeYourNetworkSupportsPopover}>
                  Your friends, and the organizations you follow, are <strong>Your Network</strong>.
                  Each friend or organization in your network
                  that <span className="u-no-break"><img src="/img/global/icons/thumbs-up-color-icon.svg"
                                                         width="20" height="20" /> supports</span> {one_candidate.ballot_item_display_name} adds
                  +1 to {one_candidate.ballot_item_display_name}'s <strong>Score in Your Network</strong>. {one_candidate.ballot_item_display_name} has
                  the highest score in your network.
                </Popover>;

              return <div key={one_candidate.we_vote_id}>
                {/* *** Candidate name *** */}
                { SupportStore.get(one_candidate.we_vote_id) && SupportStore.get(one_candidate.we_vote_id).is_support ?
                  <div className="u-flex u-items-center">
                    <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                    () => this.goToCandidateLink(one_candidate.we_vote_id) : null }>
                      <h2 className="h5">
                      {one_candidate.ballot_item_display_name}
                      </h2>
                    </div>

                    <div className="u-flex-none u-justify-end">
                      <span className="u-push--xs">Supported by you</span>
                      <img src="/img/global/svg-icons/thumbs-up-color-icon.svg" width="24" height="24" />
                    </div>
                  </div> :

                  candidate_with_most_support === one_candidate.ballot_item_display_name ?
                  <div className="u-flex u-items-center">
                    <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                      () => this.goToCandidateLink(one_candidate.we_vote_id) : null }>
                      <h2 className="h5">
                        {one_candidate.ballot_item_display_name}
                      </h2>
                    </div>
                    <div className="u-flex-none u-justify-end">
                      <OverlayTrigger trigger="click"
                                      ref="supports-overlay"
                                      onExit={this.closeYourNetworkSupportsPopover}
                                      rootClose
                                      placement="top"
                                      overlay={yourNetworkSupportsPopover}>
                        <div>
                          <span className="u-push--xs u-cursor--pointer">Your network supports</span>
                          <img src="/img/global/icons/up-arrow-color-icon.svg" className="network-positions__support-icon" width="20" height="20" />
                        </div>
                      </OverlayTrigger>
                    </div>
                  </div> :
                    is_support_array === 0 && candidate_with_most_support !== one_candidate.ballot_item_display_name && !voter_supports_at_least_one_candidate ?
                    <div className="u-flex-none u-justify-end">
                      <OverlayTrigger trigger="click"
                                      ref="undecided-overlay"
                                      onExit={this.closeYourNetworkIsUndecidedPopover}
                                      rootClose
                                      placement="top"
                                      overlay={yourNetworkIsUndecidedPopover}>
                        <span className=" u-cursor--pointer">Your network is undecided</span>
                      </OverlayTrigger>
                    </div> :
                      null}
                {/* *** "Positions in your Network" bar OR items you can follow *** */}
              </div>;
              })
            }
            { voter_supports_at_least_one_candidate ?
              null :
              <span>
                { at_least_one_candidate_chosen ?
                  null :
                  <div className="u-tr">
                    <OverlayTrigger trigger="click"
                                  ref="undecided-overlay"
                                  onExit={this.closeYourNetworkIsUndecidedPopover}
                                  rootClose
                                  placement="top"
                                  overlay={yourNetworkIsUndecidedPopover}>
                      <span className=" u-cursor--pointer">Your network is undecided</span>
                    </OverlayTrigger>
                  </div>
                }
              </span>
            }
          </div> :
          null
        }

        { !this.state.display_all_candidates_flag && this.state.display_raccoon_details_flag && remaining_candidates_to_display_count ?
          <Link onClick={this.toggleDisplayAllCandidates}>
            <span className="u-items-center u-no-break hidden-print">
              Click to show {remaining_candidates_to_display_count} more candidate{ remaining_candidates_to_display_count !== 1 ? "s" : null }...</span>
          </Link> : null
        }
        { this.state.display_all_candidates_flag && this.props.candidate_list.length > NUMBER_OF_CANDIDATES_TO_DISPLAY ?
          <BallotSideBarLink url={"#" + this.props.we_vote_id}
                             label={"Click to show fewer candidates..."}
                             displaySubtitles={false}
                             onClick={this.toggleDisplayAllCandidates} /> : null
        }
        { this.state.display_raccoon_details_flag ?
          <Link onClick={this.toggleExpandCheetahDetails}>
            <div className="BallotItem__view-more u-items-center u-no-break hidden-print">
              Show less...</div>
          </Link> :
          <Link onClick={this.toggleExpandCheetahDetails}>
            <div className="BallotItem__view-more u-items-center u-no-break hidden-print">
              { total_number_of_candidates_to_display > 1 ?
                <span>View all {total_number_of_candidates_to_display} candidates...</span> :
                <span>View candidate...</span> }
            </div>
          </Link>
        }
        </div>
      </div>;
  }
}
