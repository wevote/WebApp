import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import TextTruncate from "react-text-truncate";
import { toTitleCase } from "../../utils/textFormat";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import CandidateActions from "../../actions/CandidateActions";
import ImageHandler from "../ImageHandler";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeRaccoon from "../Widgets/ItemSupportOpposeRaccoon";
import LearnMore from "../Widgets/LearnMore";
import { renderLog } from "../../utils/logging";
import OrganizationPositionItem from "./OrganizationPositionItem";
import OrganizationStore from "../../stores/OrganizationStore";
import SupportStore from "../../stores/SupportStore";
import VoterGuideStore from "../../stores/VoterGuideStore";

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 30; // On voter guide pages, we want to show all

// This is based on components/Ballot/OfficeItemCompressed
export default class VoterGuideOfficeItemCompressed extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    kind_of_ballot_item: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    organization: PropTypes.object.isRequired,
    organization_we_vote_id: PropTypes.string.isRequired,
    toggleCandidateModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      display_all_candidates_flag: false,
      display_office_unfurled: false,
      editMode: false,
      maximum_organization_display: 4,
      organization: {},
      show_position_statement: true,
      transitioning: false,
    };

    this.getCandidateLink = this.getCandidateLink.bind(this);
    this.getOfficeLink = this.getOfficeLink.bind(this);
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.openCandidateModal = this.openCandidateModal.bind(this);
    this.toggleDisplayAllCandidates = this.toggleDisplayAllCandidates.bind(this);
    this.toggleExpandDetails = this.toggleExpandDetails.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();

    if (this.props.candidate_list && this.props.candidate_list.length) {
      CandidateActions.candidatesRetrieve(this.props.we_vote_id);

      // this.props.candidate_list.forEach( function (candidate) {
      //   if (candidate && candidate.hasOwnProperty("we_vote_id") && !CandidateStore.isCandidateInStore(candidate.we_vote_id)) {
      //     // Slows down the browser too much when run for all candidates
      //     // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidate.we_vote_id, "CANDIDATE");
      //   }
      // });
      this.setState({
        candidateList: this.props.candidate_list,
      });
    }
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log("officeItemCompressed componentWillReceiveProps, nextProps.candidate_list:", nextProps.candidate_list);
    // 2018-05-10 I don't think we need to trigger a new render because the incoming candidate_list should be the same
    // if (nextProps.candidate_list && nextProps.candidate_list.length) {
    //   this.setState({
    //     candidateList: nextProps.candidate_list,
    //   });
    // }

    // Only update organization if it is a different organization
    if (nextProps.organization && nextProps.organization.organization_we_vote_id && this.state.organization.organization_we_vote_id !== nextProps.organization.organization_we_vote_id) {
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
    this.setState({ transitioning: false });
  }

  onOrganizationStoreChange (){
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
    this.setState({ display_office_unfurled: !this.state.display_office_unfurled });
  }

  openCandidateModal (candidate) {
    // console.log("this.state.candidate: ", this.state.candidate);
    if (candidate && candidate.we_vote_id) {
      this.props.toggleCandidateModal(candidate);
    }
  }

  getCandidateLink (candidate_we_vote_id) {
    return "/candidate/" + candidate_we_vote_id + "/btvg/" + this.state.organization.organization_we_vote_id;
  }

  getOfficeLink () {
    return "/office/" + this.props.we_vote_id + "/btvg/" + this.state.organization.organization_we_vote_id;
  }

  goToCandidateLink (candidate_we_vote_id) {
    let candidate_link = this.getCandidateLink(candidate_we_vote_id);
    historyPush(candidate_link);
  }

  goToOfficeLink () {
    let office_link = this.getOfficeLink();
    historyPush(office_link);
  }

  doesOrganizationHavePositionOnCandidate (candidate_we_vote_id) {
    return OrganizationStore.doesOrganizationHavePositionOnCandidate(this.state.organization.organization_we_vote_id, candidate_we_vote_id);
  }

  getOrganizationPositionForThisCandidate (candidate_we_vote_id, position_list_for_one_election) {
    // console.log("getOrganizationPositionForThisCandidate position_list_for_one_election: ", position_list_for_one_election);
    let one_position_to_return = {};
    if (position_list_for_one_election) {
      position_list_for_one_election.forEach((one_position) => {
        // console.log("getOrganizationPositionForThisCandidate candidate_we_vote_id: ", candidate_we_vote_id, ", one_position: ", one_position);
        if (one_position.ballot_item_we_vote_id === candidate_we_vote_id) {
          // console.log("getOrganizationPositionForThisCandidate one_position found to return");
          // Because this is a forEach, we aren't able to break out of the loop
          one_position_to_return = one_position;
        }
      });
    }

    return one_position_to_return;
  }

  closeYourNetworkIsUndecidedPopover () {
    this.refs["undecided-overlay"].hide();
  }

  render () {
    renderLog(__filename);
    let { ballot_item_display_name, we_vote_id } = this.props;

    ballot_item_display_name = toTitleCase(ballot_item_display_name);

    let filteredCandidateList = this.state.candidateList;
    let total_number_of_candidates_to_display = this.state.candidateList.length;
    let remaining_candidates_to_display_count = 0;

    if (!this.state.display_all_candidates_flag && this.state.candidateList.length > NUMBER_OF_CANDIDATES_TO_DISPLAY) {
      filteredCandidateList = this.state.candidateList.slice(0, NUMBER_OF_CANDIDATES_TO_DISPLAY);
      remaining_candidates_to_display_count = this.state.candidateList.length - NUMBER_OF_CANDIDATES_TO_DISPLAY;
    }

    // let advisorsThatMakeVoterIssuesScoreDisplay;
    // let advisorsThatMakeVoterIssuesScoreCount = 0;
    // let advisorsThatMakeVoterNetworkScoreCount = 0;
    // let advisorsThatMakeVoterNetworkScoreDisplay = null;
    let arrayOfCandidatesVoterSupports = [];
    let atLeastOneCandidateChosenByNetwork = false;
    // let atLeastOneCandidateChosenByIssueScore = false;
    // let candidateWithMostSupportFromNetwork = null;
    // let candidateWeVoteWithMostSupportFromNetwork = null;
    // let candidateWithHighestIssueScore = null;
    // let candidateWeVoteIdWithHighestIssueScore = null;
    let voterSupportsAtLeastOneCandidate = false;
    let supportProps;
    let candidate_has_voter_support;

    // Prepare an array of candidate names that are supported by voter
    this.state.candidateList.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        candidate_has_voter_support = supportProps.is_support;

        if (candidate_has_voter_support) {
          arrayOfCandidatesVoterSupports.push(candidate.ballot_item_display_name);
          voterSupportsAtLeastOneCandidate = true;
        }
      }
    });

    // If the voter isn't supporting any candidates, then figure out which candidate the voter's network likes the best
    if (arrayOfCandidatesVoterSupports.length === 0){
      // This function finds the highest support count for each office but does not handle ties. If two candidates have
      // the same network support count, only the first candidate will be displayed.
      let largestNetworkSupportCount = 0;
      let network_support_count;
      let network_oppose_count;

      this.state.candidateList.forEach((candidate) => {
        // Support in voter's network
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          network_support_count = supportProps.support_count;
          network_oppose_count = supportProps.oppose_count;

          if (network_support_count > network_oppose_count) {
            if (network_support_count > largestNetworkSupportCount) {
              largestNetworkSupportCount = network_support_count;
              // candidateWithMostSupportFromNetwork = candidate.ballot_item_display_name;
              // candidateWeVoteWithMostSupportFromNetwork = candidate.we_vote_id;
              atLeastOneCandidateChosenByNetwork = true;
            }
          }
        }
      });
    }

    let organization_position_for_this_candidate;
    let candidate_we_vote_id;
    let candidateSupportStore;
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
        </span>
        {/* Mobile - "show more" and "show less" not used */}

        {/* On the voter guide, we bring the size of the office name down so we can emphasize the candidate being supported */}
        <h2 className="h4 u-f5 card-main__ballot-name u-gray-dark u-stack--sm">
          <span className="hidden-print" onClick={this.toggleExpandDetails}>
            { this.state.display_office_unfurled ?
              <span className="glyphicon glyphicon-triangle-bottom u-font-size6 hidden-print u-push--xs"/> :
              null
            }
            {ballot_item_display_name}
          </span>

          {/* Print */}
          <span className="u-f3 visible-print">
            {ballot_item_display_name}
          </span>
        </h2>

        {/* *************************
        Only show the candidates if the Office is "unfurled"
        ************************* */}
        { this.state.display_office_unfurled ?
          <span>{filteredCandidateList.map((one_candidate) => {
            candidate_we_vote_id = one_candidate.we_vote_id;
            candidateSupportStore = SupportStore.get(candidate_we_vote_id);
            let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(candidate_we_vote_id);
            let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(candidate_we_vote_id);

            let candidate_party_text = one_candidate.party && one_candidate.party.length ? one_candidate.party + ". " : "";
            let candidate_description_text = one_candidate.twitter_description && one_candidate.twitter_description.length ? one_candidate.twitter_description : "";
            let candidate_text = candidate_party_text + candidate_description_text;

            organization_position_for_this_candidate = this.getOrganizationPositionForThisCandidate(candidate_we_vote_id, this.state.organization.position_list_for_one_election);

            return <div key={candidate_we_vote_id} className="u-stack--md">
              <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                {/* Candidate Photo, only shown in Desktop */}
                {this.state.display_office_unfurled ?
                  <div className="hidden-xs" onClick={this.props.link_to_ballot_item_page ? this.toggleExpandDetails : null}>
                    <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm"
                                  sizeClassName="icon-candidate-small u-push--sm "
                                  imageUrl={one_candidate.candidate_photo_url_large}
                                  alt="candidate-photo"
                                  kind_of_ballot_item="CANDIDATE" />
                  </div> :
                  null
                }
                <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                  {/* Candidate Name */}
                  <h4 className={"card-main__candidate-name" + (this.doesOrganizationHavePositionOnCandidate(candidate_we_vote_id) ? " u-f2" : " u-f6")}>
                    <a onClick={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(one_candidate.we_vote_id) : null}>
                      <TextTruncate line={1}
                                    truncateText="…"
                                    text={one_candidate.ballot_item_display_name}
                                    textTruncateChild={null}/>
                    </a>
                  </h4>
                  {/* Description under candidate name */}
                  <LearnMore text_to_display={candidate_text}
                             on_click={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(one_candidate.we_vote_id) : null} />

                  {/* Organization Endorsement */}
                  { this.doesOrganizationHavePositionOnCandidate(candidate_we_vote_id) && organization_position_for_this_candidate ?
                    <OrganizationPositionItem key={organization_position_for_this_candidate.position_we_vote_id}
                                              position={organization_position_for_this_candidate}
                                              organization={this.state.organization}
                                              editMode={this.state.editMode}
                                              turnOffLogo
                                              turnOffName
                             /> :
                    null }

                  {/* Organization's Followed AND to Follow Items -- only show for promoted candidate */}
                  { this.doesOrganizationHavePositionOnCandidate(candidate_we_vote_id) ?
                    <div>
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
                    </div> :
                    null}
                </div>
              </div>
            </div>;
          })}</span> :
          null
        }

        {/* *************************
        If the office is "rolled up", show some details for the organization's endorsement
        ************************* */}
        { !this.state.display_office_unfurled ?
          <div>
            { this.state.candidateList.map( (one_candidate) => {
                if (this.doesOrganizationHavePositionOnCandidate(one_candidate.we_vote_id) ) {
                  organization_position_for_this_candidate = this.getOrganizationPositionForThisCandidate(one_candidate.we_vote_id, this.state.organization.position_list_for_one_election);

                  if (organization_position_for_this_candidate) {
                    candidate_we_vote_id = one_candidate.we_vote_id;
                    candidateSupportStore = SupportStore.get(candidate_we_vote_id);

                    let is_support = false;
                    let is_oppose = false;
                    let voter_statement_text = false;
                    if (candidateSupportStore !== undefined) {
                      is_support = candidateSupportStore.is_support;
                      is_oppose = candidateSupportStore.is_oppose;
                      voter_statement_text = candidateSupportStore.voter_statement_text;
                    }

                    return <div key={candidate_we_vote_id}>
                      {/* Organization Endorsement */}
                      <OrganizationPositionItem ballotItemLink={this.getCandidateLink(candidate_we_vote_id)}
                                                key={organization_position_for_this_candidate.position_we_vote_id}
                                                position={organization_position_for_this_candidate}
                                                organization={this.state.organization}
                                                editMode={this.state.editMode}
                      />
                      <div className="flex">
                          <ItemActionBar ballot_item_display_name={one_candidate.ballot_item_display_name}
                                         ballot_item_we_vote_id={candidate_we_vote_id}
                                         commentButtonHide
                                         shareButtonHide
                                         supportProps={candidateSupportStore}
                                         transitioning={this.state.transitioning}
                                         type="CANDIDATE"/>
                      </div>
                      {/* DESKTOP: If voter has taken position, offer the comment bar */}
                      {is_support || is_oppose || voter_statement_text ?
                        <div className="hidden-xs o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                          <div
                            className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm">&nbsp;
                          </div>
                          <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                            <ItemPositionStatementActionBar ballot_item_display_name={one_candidate.ballot_item_display_name}
                                                            ballot_item_we_vote_id={candidate_we_vote_id}
                                                            supportProps={candidateSupportStore}
                                                            transitioning={this.state.transitioning}
                                                            type="CANDIDATE"
                                                            shown_in_list/>
                          </div>
                        </div> :
                        null }
                      {/* MOBILE: If voter has taken position, offer the comment bar */}
                      {is_support || is_oppose || voter_statement_text ?
                        <div className="visible-xs o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                          <div
                            className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm">&nbsp;
                          </div>
                          <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                            <ItemPositionStatementActionBar ballot_item_display_name={one_candidate.ballot_item_display_name}
                                                            ballot_item_we_vote_id={candidate_we_vote_id}
                                                            supportProps={candidateSupportStore}
                                                            transitioning={this.state.transitioning}
                                                            type="CANDIDATE"
                                                            shown_in_list/>
                          </div>
                        </div> :
                        null }
                    </div>;
                  }
                }
                return null;
              })
            }
            {/* Now that we are out of the candidate loop... */}
            { voterSupportsAtLeastOneCandidate ?
              null :
              <span>
                { atLeastOneCandidateChosenByNetwork ?
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
        {/* this.state.display_all_candidates_flag && this.state.candidateList.length > NUMBER_OF_CANDIDATES_TO_DISPLAY ?
          <BallotSideBarLink url={"#" + this.props.we_vote_id}
                             label={"Click to show fewer candidates..."}
                             displaySubtitles={false}
                             onClick={this.toggleDisplayAllCandidates} /> : null
        */}
        { this.state.display_office_unfurled ?
          <Link onClick={this.toggleExpandDetails}>
            <div className="BallotItem__view-more u-items-center u-no-break hidden-print">
              Show less...</div>
          </Link> :
          <Link onClick={this.toggleExpandDetails}>
            <div className="BallotItem__view-more u-items-center u-no-break hidden-print">
              <i className="fa fa-plus BallotItem__view-more-plus" aria-hidden="true" />
              { total_number_of_candidates_to_display > 1 ?
                <span> View all {total_number_of_candidates_to_display} candidates...</span> :
                <span> View candidate...</span>
              }
            </div>
          </Link>
        }
        </div>
      </div>;
  }
}
