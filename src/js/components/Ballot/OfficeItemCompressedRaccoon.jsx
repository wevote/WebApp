import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";
import TextTruncate from "react-text-truncate";
import { capitalizeString, toTitleCase } from "../../utils/textFormat";
import BallotSideBarLink from "../Navigation/BallotSideBarLink";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import CandidateActions from "../../actions/CandidateActions";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import ImageHandler from "../ImageHandler";
import IssuesFollowedByBallotItemDisplayList from "../Issues/IssuesFollowedByBallotItemDisplayList";
import IssueStore from "../../stores/IssueStore";
import ItemSupportOpposeRaccoon from "../Widgets/ItemSupportOpposeRaccoon";
import LearnMore from "../Widgets/LearnMore";
import { renderLog } from "../../utils/logging";
import OrganizationStore from "../../stores/OrganizationStore";
import SupportStore from "../../stores/SupportStore";
import VoterGuideStore from "../../stores/VoterGuideStore";
import BallotStore from "../../stores/BallotStore";

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 5; // Set to 5 in raccoon, and 3 in walrus

// This is related to components/VoterGuide/VoterGuideOfficeItemCompressed
export default class OfficeItemCompressedRaccoon extends Component {
  static propTypes = {
    allBallotItemsCount: PropTypes.number,
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    organization: PropTypes.object,
    organization_we_vote_id: PropTypes.string,
    toggleCandidateModal: PropTypes.func,
    updateOfficeDisplayUnfurledTracker: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      display_all_candidates_flag: false,
      display_office_unfurled: false,
      editMode: false,
      maximum_organization_display: 4,
      organization: {},
      show_position_statement: true,
      transitioning: false,
    };

    this.closeYourNetworkIsUndecidedPopover = this.closeYourNetworkIsUndecidedPopover.bind(this);
    this.closeYourNetworkSupportsPopover = this.closeYourNetworkSupportsPopover.bind(this);
    this.closeHighestIssueScorePopover = this.closeHighestIssueScorePopover.bind(this);
    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.openCandidateModal = this.openCandidateModal.bind(this);
    this.toggleDisplayAllCandidates = this.toggleDisplayAllCandidates.bind(this);
    this.toggleExpandDetails = this.toggleExpandDetails.bind(this);
  }

  componentDidMount () {
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();

    // console.log("this.props.candidate_list: ", this.props.candidate_list);
    if (this.props.candidate_list && this.props.candidate_list.length) {
      CandidateActions.candidatesRetrieve(this.props.we_vote_id);

      // this.props.candidate_list.forEach( function (candidate) {
      //   // console.log("OfficeItemCompressed, candidate: ", candidate);
      //   if (candidate && candidate.hasOwnProperty("we_vote_id") && !CandidateStore.isCandidateInStore(candidate.we_vote_id)) {
      //     // console.log("OfficeItemCompressed, retrieving");
      //     // CandidateActions.candidateRetrieve(candidate.we_vote_id); // Replaced by candidatesRetrieve on the office level
      //     // Slows down the browser too much when run for all candidates
      //     // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidate.we_vote_id, "CANDIDATE");
      //   }
      // });
    }
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }

    // If there three or fewer offices on this ballot, unfurl them
    if (this.props.allBallotItemsCount && this.props.allBallotItemsCount <= 3) {
      this.setState({
        display_office_unfurled: true,
      });
    } else {
      //read from BallotStore
      this.setState({
        display_office_unfurled: BallotStore.getBallotItemUnfurledStatus(this.props.we_vote_id)
      });
    }
  }

  componentWillReceiveProps (nextProps){
    // console.log("officeItem nextProps", nextProps);
    if (nextProps.organization && nextProps.organization.organization_we_vote_id) {
      this.setState({
        organization: OrganizationStore.getOrganizationByWeVoteId(nextProps.organization.organization_we_vote_id),
      });
    }
  }

  componentWillUnmount () {
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onIssueStoreChange () {
    this.setState({
      transitioning: false,
    });
  }

  onVoterGuideStoreChange () {
    this.setState({
      transitioning: false,
    });
  }

  onOrganizationStoreChange () {
    // console.log("VoterGuideOfficeItemCompressed onOrganizationStoreChange, org_we_vote_id: ", this.state.organization.organization_we_vote_id);
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

  toggleExpandDetails () {
    const { we_vote_id, updateOfficeDisplayUnfurledTracker } = this.props;
    this.setState({ display_office_unfurled: !this.state.display_office_unfurled });
    if (this.props.allBallotItemsCount && this.props.allBallotItemsCount <= 3) {
      //only update tracker if there are more than 3 offices
    } else {
      updateOfficeDisplayUnfurledTracker(we_vote_id, !this.state.display_office_unfurled);
    }
    // console.log('toggling raccoon Details!');
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
    historyPush(candidate_link);
  }

  goToOfficeLink () {
    let office_link = this.getOfficeLink();
    historyPush(office_link);
  }

  closeYourNetworkSupportsPopover () {
    this.refs["supports-overlay"].hide();
  }

  closeHighestIssueScorePopover () {
    this.refs["highest-issue-score-overlay"].hide();
  }

  closeYourNetworkIsUndecidedPopover () {
    this.refs["undecided-overlay"].hide();
  }

  render () {
    renderLog(__filename);
    let { ballot_item_display_name, we_vote_id } = this.props;

    ballot_item_display_name = toTitleCase(ballot_item_display_name);

    let candidate_list_to_display = this.props.candidate_list;
    let total_number_of_candidates_to_display = this.props.candidate_list.length;
    let remaining_candidates_to_display_count = 0;

    if (!this.state.display_all_candidates_flag && this.props.candidate_list.length > NUMBER_OF_CANDIDATES_TO_DISPLAY) {
      candidate_list_to_display = this.props.candidate_list.slice(0, NUMBER_OF_CANDIDATES_TO_DISPLAY);
      remaining_candidates_to_display_count = this.props.candidate_list.length - NUMBER_OF_CANDIDATES_TO_DISPLAY;
    }

    // Ready to Vote code
    let array_of_candidates_voter_supports = [];
    let candidate_with_most_support_from_network = null;
    let candidateWithHighestIssueScore = null;
    let voter_supports_at_least_one_candidate = false;
    let supportProps;
    let candidate_has_voter_support;

    // Prepare an array of candidate names that are supported by voter
    this.props.candidate_list.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        candidate_has_voter_support = supportProps.is_support;

        if (candidate_has_voter_support) {
          array_of_candidates_voter_supports.push(candidate.ballot_item_display_name);
          voter_supports_at_least_one_candidate = true;
        }
      }
    });

    let at_least_one_candidate_chosen_by_network = false;
    let atLeastOneCandidateChosenByIssueScore = false;

    // If the voter isn't supporting any candidates, then figure out which candidate the voter's network likes the best
    if (array_of_candidates_voter_supports.length === 0){
      // This function finds the highest support count for each office but does not handle ties. If two candidates have
      // the same network support count, only the first candidate will be displayed.
      let largestNetworkSupportCount = 0;
      let network_support_count;
      let network_oppose_count;
      let largestIssueScore = 0;
      let voterIssuesScoreForCandidate;

      this.props.candidate_list.forEach((candidate) => {
        // Support in voter's network
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          network_support_count = supportProps.support_count;
          network_oppose_count = supportProps.oppose_count;

          if (network_support_count > network_oppose_count) {
            if (network_support_count > largestNetworkSupportCount) {
              largestNetworkSupportCount = network_support_count;
              candidate_with_most_support_from_network = candidate.ballot_item_display_name;
              at_least_one_candidate_chosen_by_network = true;
            }
          }
        }
        // Support based on Issue score
        voterIssuesScoreForCandidate = IssueStore.getIssuesScoreByBallotItemWeVoteId(candidate.we_vote_id);
        if (voterIssuesScoreForCandidate > largestIssueScore) {
          largestIssueScore = voterIssuesScoreForCandidate;
          candidateWithHighestIssueScore = candidate.ballot_item_display_name;
          atLeastOneCandidateChosenByIssueScore = true;
        }
      });
    }

    const yourNetworkIsUndecidedPopover =
      <Popover id="popover-trigger-click-root-close"
               title={<span>Your Network is Undecided <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
               onClick={this.closeYourNetworkIsUndecidedPopover}>
        Your friends, and the organizations you listen to, are <strong>Your Network</strong>.
        Everyone in your network
        that <span className="u-no-break"> <img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")} width="20" height="20" /> supports</span> a
        candidate adds
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
            { this.state.display_office_unfurled ?
              <Link onClick={this.toggleExpandDetails}>
                <span className="BallotItem__view-more u-items-center u-no-break hidden-print">
                  show less</span>
              </Link> :
              <Link onClick={this.toggleExpandDetails}>
                <span className="BallotItem__view-more u-items-center u-no-break hidden-print">
                  show more
                </span>
              </Link>
            }
          </span>
        </span>
        {/* Mobile */}
        <span className="visible-xs">
          <span className="hidden-print pull-right u-push--xs">
            { this.state.display_office_unfurled ?
              <Link onClick={this.toggleExpandDetails}>
                <span className="BallotItem__view-more u-items-center u-no-break hidden-print">
                  show less</span>
              </Link> :
              <Link onClick={this.toggleExpandDetails}>
                <span className="BallotItem__view-more u-items-center u-no-break hidden-print">
                  show more
                </span>
              </Link>
            }
          </span>
        </span>

        <h2 className="u-f3 card-main__ballot-name u-gray-dark u-stack--sm">
          {/* Desktop */}
          <span className="hidden-xs" onClick={this.toggleExpandDetails}>
            { this.state.display_office_unfurled ?
              <span className="glyphicon glyphicon-triangle-bottom u-font-size6 hidden-print u-push--xs"/> :
              <span className="glyphicon glyphicon-triangle-right u-font-size6 hidden-print u-push--xs"/>
            }
            {ballot_item_display_name}
          </span>

          {/* Mobile */}
          <span className="visible-xs">
            <span onClick={this.toggleExpandDetails}>
              <TextTruncate line={1}
                            truncateText="…"
                            text={ballot_item_display_name}
                            textTruncateChild={null} />
            </span>
          </span>

          {/* Print */}
          <span className="u-f3 visible-print">
            {ballot_item_display_name}
          </span>

        </h2>

        {/* Only show the candidates if the Office is "unfurled" */}
        {/* TODO: Note that this next block of code could be replaced with CandidateItemCompressed */}
        { this.state.display_office_unfurled ?
          <span>{candidate_list_to_display.map((one_candidate) => {
            let candidate_we_vote_id = one_candidate.we_vote_id;
            let candidateSupportStore = SupportStore.get(candidate_we_vote_id);
            let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(candidate_we_vote_id);
            let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(candidate_we_vote_id);
            // console.log("OfficeItemCompressedRaccoon, just retrieved getVoterGuidesToFollowForBallotItemIdSupports");
            let candidate_party_text = one_candidate.party && one_candidate.party.length ? one_candidate.party + ". " : "";
            let candidate_description_text = one_candidate.twitter_description && one_candidate.twitter_description.length ? one_candidate.twitter_description : "";
            let candidate_text = candidate_party_text + candidate_description_text;

            let candidate_photo_raccoon = this.state.display_office_unfurled ?
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
                                          display_raccoon_details_flag={this.state.display_office_unfurled}
                                          goToCandidate={() => this.goToCandidateLink(one_candidate.we_vote_id)}
                                          maximumOrganizationDisplay={this.state.maximum_organization_display}
                                          organizationsToFollowSupport={organizationsToFollowSupport}
                                          organizationsToFollowOppose={organizationsToFollowOppose}
                                          supportProps={candidateSupportStore}
                                          type="CANDIDATE"/>
              </div>
            </div>;

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
        { !this.state.display_office_unfurled ?
          <div>
            <span className="hidden-print">
              <IssuesFollowedByBallotItemDisplayList ballot_item_display_name={this.props.ballot_item_display_name}
                                                     ballotItemWeVoteId={this.props.we_vote_id}
                                                     overlayTriggerOnClickOnly
                                                     placement={"bottom"}
                                                     />
            </span>
            { candidate_list_to_display.map( (one_candidate) => {

              const yourNetworkSupportsPopover =
                <Popover id="popover-trigger-click-root-close"
                         title={<span>Your Network Supports <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                         onClick={this.closeYourNetworkSupportsPopover}>
                  Your friends, and the organizations you listen to, are <strong>Your Network</strong>.
                  Everyone in your network
                  that <span className="u-no-break"> <img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")} width="20" height="20" /> supports</span> {one_candidate.ballot_item_display_name} adds
                  +1 to {one_candidate.ballot_item_display_name}'s <strong>Score in Your Network</strong>. {one_candidate.ballot_item_display_name} has
                  the highest score in your network.
                </Popover>;

              const hasHighestIssueScorePopover =
                <Popover id="popover-trigger-click-root-close"
                         title={<span>Highest Issue Score <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                         onClick={this.closeHighestIssueScorePopover}>
                  We took the issues you are following, and added up the opinions of all of the organizations
                  under those issues. <strong>{one_candidate.ballot_item_display_name}</strong> has
                  the most support from these
                  organizations.<br />
                  <Link onClick={this.toggleExpandDetails}> learn more</Link>
                </Popover>;

              const voter_supports_this_candidate = SupportStore.get(one_candidate.we_vote_id) && SupportStore.get(one_candidate.we_vote_id).is_support;

              let networkOrIssueScoreSupport;
              if (at_least_one_candidate_chosen_by_network) {
                networkOrIssueScoreSupport = candidate_with_most_support_from_network === one_candidate.ballot_item_display_name ?
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
                          <img src={cordovaDot("/img/global/icons/up-arrow-color-icon.svg")} className="network-positions__support-icon" width="20" height="20" />
                        </div>
                      </OverlayTrigger>
                    </div>
                  </div> :
                  null;
              } else if (atLeastOneCandidateChosenByIssueScore) {
                networkOrIssueScoreSupport = candidateWithHighestIssueScore === one_candidate.ballot_item_display_name ?
                  <div className="u-flex u-items-center">
                    <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                      () => this.goToCandidateLink(one_candidate.we_vote_id) : null }>
                      <h2 className="h5">
                        {one_candidate.ballot_item_display_name}
                      </h2>
                    </div>
                    <div className="u-flex-none u-justify-end">
                      <OverlayTrigger trigger="click"
                                      ref="highest-issue-score-overlay"
                                      onExit={this.closeHighestIssueScorePopover}
                                      rootClose
                                      placement="top"
                                      overlay={hasHighestIssueScorePopover}>
                        <div>
                          <span className="u-push--xs u-cursor--pointer">Has the highest <strong>Issue Score</strong></span>
                          <img src={cordovaDot("/img/global/icons/up-arrow-color-icon.svg")} className="network-positions__support-icon" width="20" height="20" />
                        </div>
                      </OverlayTrigger>
                    </div>
                  </div> :
                  null;
              }

              return <div key={one_candidate.we_vote_id}>
                {/* *** Candidate name *** */}
                { voter_supports_this_candidate ?
                  <div className="u-flex u-items-center">
                    <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                    () => this.goToCandidateLink(one_candidate.we_vote_id) : null }>
                      <h2 className="h5">
                      {one_candidate.ballot_item_display_name}
                      </h2>
                    </div>

                    <div className="u-flex-none u-justify-end">
                      <span className="u-push--xs">Supported by you</span>
                      <img src={cordovaDot("/img/global/svg-icons/thumbs-up-color-icon.svg")} width="24" height="24" />
                    </div>
                  </div> :
                  <span>{ networkOrIssueScoreSupport }</span>
                }
                {/* *** "Positions in your Network" bar OR items you can follow *** */}
              </div>;
              })
            }
            {/* Now that we are out of the candidate loop... */}
            { voter_supports_at_least_one_candidate ?
              null :
              <span>
                { at_least_one_candidate_chosen_by_network || atLeastOneCandidateChosenByIssueScore ?
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

        { !this.state.display_all_candidates_flag && this.state.display_office_unfurled && remaining_candidates_to_display_count ?
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
        { this.state.display_office_unfurled ?
          <Link onClick={this.toggleExpandDetails}>
            <div className="BallotItem__view-more u-items-center u-no-break hidden-print">
              Show less...</div>
          </Link> :
          <Link onClick={this.toggleExpandDetails}>
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
