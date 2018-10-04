import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import TextTruncate from "react-text-truncate";
import { toTitleCase } from "../../utils/textFormat";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import CandidateStore from "../../stores/CandidateStore";
import ImageHandler from "../ImageHandler";
import IssueStore from "../../stores/IssueStore";
import ItemSupportOpposeRaccoon from "../Widgets/ItemSupportOpposeRaccoon";
import LearnMore from "../Widgets/LearnMore";
import { renderLog } from "../../utils/logging";
import OrganizationStore from "../../stores/OrganizationStore";
import SupportStore from "../../stores/SupportStore";
import VoterGuideStore from "../../stores/VoterGuideStore";
import BallotStore from "../../stores/BallotStore";

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 5;

// This is related to components/VoterGuide/VoterGuideOfficeItemCompressed
export default class OfficeItemCompressedRaccoon extends Component {
  static propTypes = {
    allBallotItemsCount: PropTypes.number,
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    currentBallotIdInUrl: PropTypes.string,
    kind_of_ballot_item: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    organization: PropTypes.object,
    organization_we_vote_id: PropTypes.string,
    toggleCandidateModal: PropTypes.func,
    updateOfficeDisplayUnfurledTracker: PropTypes.func,
    urlWithoutHash: PropTypes.string,
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
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.onCandidateStoreChange();
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
      });
    }

    // if (this.props.we_vote_id) {
    //   console.log("OfficeItemCompressedRaccoon componentDidMount getNumberOfCandidatesRetrievedByOffice:", CandidateStore.getNumberOfCandidatesRetrievedByOffice(this.props.we_vote_id));
    //   DALE 2018-07-31 We now retrieve the full candidate data in voterBallotItemsRetrieve
    //   if (CandidateStore.getNumberOfCandidatesRetrievedByOffice(this.props.we_vote_id) === 0) {
    //     // console.log("Calling candidatesRetrieve: ", this.props.we_vote_id);
    //     CandidateActions.candidatesRetrieve(this.props.we_vote_id);
    //   }
    // }

    // If there three or fewer offices on this ballot, unfurl them
    if (this.props.allBallotItemsCount && this.props.allBallotItemsCount <= 3) {
      this.setState({
        display_office_unfurled: true,
      });
    } else {
      //read from BallotStore
      this.setState({
        display_office_unfurled: BallotStore.getBallotItemUnfurledStatus(this.props.we_vote_id),
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
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onCandidateStoreChange () {
    if (this.props.candidate_list && this.props.candidate_list.length && this.props.we_vote_id) {
      // console.log("onCandidateStoreChange");
      let new_candidate_list = [];
      this.props.candidate_list.forEach( candidate => {
        if (candidate && candidate.we_vote_id) {
          new_candidate_list.push(CandidateStore.getCandidate(candidate.we_vote_id));
        }
      });
      this.setState({
        candidateList: new_candidate_list,
      });

      // console.log(this.props.candidate_list);
    }
  }

  onIssueStoreChange () {
    // console.log("OfficeItemCompressedRaccoon, onIssueStoreChange");
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

  toggleExpandDetails (display_office_unfurled) {
    const { we_vote_id, updateOfficeDisplayUnfurledTracker, urlWithoutHash, currentBallotIdInUrl } = this.props;
    // historyPush should be called only when current office Id (we_vote_id) is not currentBallotIdBeingShown in url.
    if (currentBallotIdInUrl !== we_vote_id) {
      historyPush(urlWithoutHash + "#" + we_vote_id);
    }
    if (typeof display_office_unfurled === "boolean"){
      this.setState({ display_office_unfurled: display_office_unfurled });
    } else {
      this.setState({ display_office_unfurled: !this.state.display_office_unfurled });
    }
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
    let unsortedCandidateList = this.state.candidateList.slice(0);
    let total_number_of_candidates_to_display = this.state.candidateList.length;
    let remaining_candidates_to_display_count = 0;
    let advisorsThatMakeVoterIssuesScoreDisplay;
    // let advisorsThatMakeVoterIssuesScoreCount = 0;
    let advisorsThatMakeVoterNetworkScoreCount = 0;
    let advisorsThatMakeVoterNetworkScoreDisplay = null;
    let arrayOfCandidatesVoterSupports = [];
    let atLeastOneCandidateChosenByNetwork = false;
    let atLeastOneCandidateChosenByIssueScore = false;
    let candidateWithMostSupportFromNetwork = null;
    let candidateWeVoteWithMostSupportFromNetwork = null;
    let candidateWithHighestIssueScore = null;
    let candidateWeVoteIdWithHighestIssueScore = null;
    let voterSupportsAtLeastOneCandidate = false;
    let supportProps;
    let candidate_has_voter_support;
    let voterIssuesScoreForCandidate;
    let sortedCandidateList;
    let limitedCandidateList;

    // Prepare an array of candidate names that are supported by voter
    unsortedCandidateList.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        candidate_has_voter_support = supportProps.is_support;
        voterIssuesScoreForCandidate = IssueStore.getIssuesScoreByBallotItemWeVoteId(candidate.we_vote_id);
        candidate.voterNetworkScoreForCandidate = Math.abs(supportProps.support_count - supportProps.oppose_count);
        candidate.voterIssuesScoreForCandidate = Math.abs(voterIssuesScoreForCandidate);
        candidate.is_support = supportProps.is_support;
        if (candidate_has_voter_support) {
          arrayOfCandidatesVoterSupports.push(candidate.ballot_item_display_name);
          voterSupportsAtLeastOneCandidate = true;
        }
      }
    });

    unsortedCandidateList.sort((optionA, optionB)=>optionB.voterNetworkScoreForCandidate - optionA.voterNetworkScoreForCandidate ||
                                                   (optionA.is_support === optionB.is_support ? 0 : optionA.is_support ? -1 : 1) ||
                                                   optionB.voterIssuesScoreForCandidate - optionA.voterIssuesScoreForCandidate);
    limitedCandidateList = unsortedCandidateList;
    sortedCandidateList = unsortedCandidateList;
    if (!this.state.display_all_candidates_flag && this.state.candidateList.length > NUMBER_OF_CANDIDATES_TO_DISPLAY) {
      limitedCandidateList = sortedCandidateList.slice(0, NUMBER_OF_CANDIDATES_TO_DISPLAY);
      remaining_candidates_to_display_count = this.state.candidateList.length - NUMBER_OF_CANDIDATES_TO_DISPLAY;
    }

    // If the voter isn't supporting any candidates, then figure out which candidate the voter's network likes the best
    if (arrayOfCandidatesVoterSupports.length === 0){
      // This function finds the highest support count for each office but does not handle ties. If two candidates have
      // the same network support count, only the first candidate will be displayed.
      let largestNetworkSupportCount = 0;
      let network_support_count;
      let network_oppose_count;
      let largestIssueScore = 0;
      sortedCandidateList.forEach((candidate) => {
        // Support in voter's network
        supportProps = SupportStore.get(candidate.we_vote_id);
        if (supportProps) {
          network_support_count = supportProps.support_count;
          network_oppose_count = supportProps.oppose_count;

          if (network_support_count > network_oppose_count) {
            if (network_support_count > largestNetworkSupportCount) {
              largestNetworkSupportCount = network_support_count;
              candidateWithMostSupportFromNetwork = candidate.ballot_item_display_name;
              candidateWeVoteWithMostSupportFromNetwork = candidate.we_vote_id;
              atLeastOneCandidateChosenByNetwork = true;
            }
          }
        }
        // Support based on Issue score
        if (voterIssuesScoreForCandidate > largestIssueScore) {
          largestIssueScore = voterIssuesScoreForCandidate;
          candidateWithHighestIssueScore = candidate.ballot_item_display_name;
          candidateWeVoteIdWithHighestIssueScore = candidate.we_vote_id;
          atLeastOneCandidateChosenByIssueScore = true;
        }
      });
      if (atLeastOneCandidateChosenByIssueScore) {
        // If there are issues the voter is following, we should attempt to to create a list of orgs that support or oppose this ballot item
        let organizationNameIssueSupportList = IssueStore.getOrganizationNameSupportListUnderThisBallotItem(candidateWeVoteIdWithHighestIssueScore);
        let organizationNameIssueSupportListDisplay = organizationNameIssueSupportList.map( organization_name => {
          return <span key={organization_name} className="u-flex u-flex-row u-justify-start u-items-start"><img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")} width="20" height="20" /><span>&nbsp;</span><span>{organization_name} <strong>+1</strong></span></span>;
        });
        let organizationNameIssueOpposeList = IssueStore.getOrganizationNameOpposeListUnderThisBallotItem(candidateWeVoteIdWithHighestIssueScore);
        let organizationNameIssueOpposeListDisplay = organizationNameIssueOpposeList.map( organization_name => {
          return <span key={organization_name} className="u-flex u-flex-row u-justify-start u-items-start"><img src={cordovaDot("/img/global/icons/thumbs-down-color-icon.svg")} width="20" height="20" /><span>&nbsp;</span><span>{organization_name} <strong>-1</strong></span></span>;
        });
        advisorsThatMakeVoterIssuesScoreDisplay = <span>
          { organizationNameIssueSupportList.length ? <span>{organizationNameIssueSupportListDisplay}</span> : null}
          { organizationNameIssueOpposeList.length ? <span>{organizationNameIssueOpposeListDisplay}</span> : null}
        </span>;
        // advisorsThatMakeVoterIssuesScoreCount = organizationNameIssueSupportList.length + organizationNameIssueOpposeList.length;
      }

      if (candidateWeVoteWithMostSupportFromNetwork) {
        // If there are issues the voter is following, we should attempt to to create a list of orgs that support or oppose this ballot item
        let nameNetworkSupportList = SupportStore.getNameSupportListUnderThisBallotItem(candidateWeVoteWithMostSupportFromNetwork);
        let nameNetworkSupportListDisplay = nameNetworkSupportList.map( speaker_display_name => {
          return <span key={speaker_display_name} className="u-flex u-flex-row u-justify-start u-items-start"><img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")} width="20" height="20" /><span>&nbsp;</span><span>{speaker_display_name} <strong>+1</strong></span></span>;
        });
        let nameNetworkOpposeList = SupportStore.getNameOpposeListUnderThisBallotItem(candidateWeVoteWithMostSupportFromNetwork);
        let nameNetworkOpposeListDisplay = nameNetworkOpposeList.map( speaker_display_name => {
          return <span key={speaker_display_name} className="u-flex u-flex-row u-justify-start u-items-start"><img src={cordovaDot("/img/global/icons/thumbs-down-color-icon.svg")} width="20" height="20" /><span>&nbsp;</span><span>{speaker_display_name} <strong>-1</strong></span></span>;
        });
        advisorsThatMakeVoterNetworkScoreDisplay = <span>
          { nameNetworkSupportList.length ? <span>{nameNetworkSupportListDisplay}</span> : null}
          { nameNetworkOpposeList.length ? <span>{nameNetworkOpposeListDisplay}</span> : null}
        </span>;
        advisorsThatMakeVoterNetworkScoreCount = nameNetworkSupportList.length + nameNetworkOpposeList.length;
      }
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
      <a className="anchor-under-header" name={we_vote_id} />
      <div className="card-main__content">
        {/* Desktop */}
        <span className="hidden-xs">
          <BookmarkToggle we_vote_id={we_vote_id} type="OFFICE" />
          {/* Turning off the "show more" on Desktop for now
          <span className="hidden-print pull-right u-push--lg">
            { this.state.display_office_unfurled ?
              null :
              <Link onClick={this.toggleExpandDetails}>
                <span className="BallotItem__view-more u-items-center u-no-break hidden-print">
                  show more
                </span>
              </Link>
            }
          </span>
          */}
        </span>
        {/* Mobile - "show more" and "show less" not used */}

        <h2 className="u-f3 card-main__ballot-name u-gray-dark u-stack--sm">
          <span className="hidden-print" onClick={this.toggleExpandDetails}>
            { this.state.display_office_unfurled ?
              <span className="glyphicon glyphicon-triangle-bottom u-font-size6 hidden-print u-push--xs"/> :
              <span className="glyphicon glyphicon-triangle-right u-font-size6 hidden-print u-push--xs"/>
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
          <span>{limitedCandidateList.map((one_candidate) => {

            if (!one_candidate || !one_candidate.we_vote_id) { return null; }

            let candidate_we_vote_id = one_candidate.we_vote_id;
            let candidateSupportStore = SupportStore.get(candidate_we_vote_id);
            let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(candidate_we_vote_id);
            let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(candidate_we_vote_id);
            let candidate_party_text = one_candidate.party && one_candidate.party.length ? one_candidate.party + ". " : "";
            let candidate_twitter_description_text = one_candidate.twitter_description && one_candidate.twitter_description.length ? one_candidate.twitter_description : "";
            let ballotpediaCandidateSummary = one_candidate.ballotpedia_candidate_summary && one_candidate.ballotpedia_candidate_summary.length ? " " + one_candidate.ballotpedia_candidate_summary : "";
            // Strip away any HTML tags
            ballotpediaCandidateSummary = ballotpediaCandidateSummary.split(/<[^<>]*>/).join("");
            let candidate_text = candidate_party_text + candidate_twitter_description_text + ballotpediaCandidateSummary;

            let positions_display_raccoon = <div>
              <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
                {/* Positions in Your Network and Possible Voter Guides to Follow */}
                <ItemSupportOpposeRaccoon ballotItemWeVoteId={candidate_we_vote_id}
                                          ballot_item_display_name={one_candidate.ballot_item_display_name}
                                          currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                          display_raccoon_details_flag={this.state.display_office_unfurled}
                                          goToCandidate={() => this.goToCandidateLink(one_candidate.we_vote_id)}
                                          maximumOrganizationDisplay={this.state.maximum_organization_display}
                                          organizationsToFollowSupport={organizationsToFollowSupport}
                                          organizationsToFollowOppose={organizationsToFollowOppose}
                                          popoverBottom
                                          supportProps={candidateSupportStore}
                                          type="CANDIDATE"
                                          urlWithoutHash={this.props.urlWithoutHash}
                                          we_vote_id={this.props.we_vote_id}
                                          />
              </div>
            </div>;

            return <div key={candidate_we_vote_id} className="u-stack--md u-gray-border-bottom">
              <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                {/* Candidate Photo, only shown in Desktop */}
                {this.state.display_office_unfurled ?
                  <div onClick={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(one_candidate.we_vote_id) : null}>
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
                  <h4 className="card-main__candidate-name u-f5">
                    <a onClick={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(one_candidate.we_vote_id) : null}>
                      <TextTruncate line={1}
                                    truncateText="…"
                                    text={one_candidate.ballot_item_display_name}
                                    textTruncateChild={null}/>
                    </a>
                  </h4>
                  {/* Description under candidate name */}
                  <LearnMore on_click={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(one_candidate.we_vote_id) : null}
                             num_of_lines={3}
                             text_to_display={candidate_text}
                             />
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

        {/* *************************
        If the office is "rolled up", show some details for the organization's endorsement
        ************************* */}
        { !this.state.display_office_unfurled ?
          <div>
            {/* <span className="hidden-print">
              <IssuesFollowedByBallotItemDisplayList ballot_item_display_name={this.props.ballot_item_display_name}
                                                     ballotItemWeVoteId={this.props.we_vote_id}
                                                     overlayTriggerOnClickOnly
                                                     placement={"bottom"}
                                                     urlWithoutHash={this.props.urlWithoutHash}
                                                     currentBallotIdInUrl={this.props.currentBallotIdInUrl}
                                                     we_vote_id={this.props.we_vote_id} />
            </span> */}
            { this.state.candidateList.map( (one_candidate) => {

              if (!one_candidate || !one_candidate.we_vote_id) { return null; }

              const voter_supports_this_candidate = SupportStore.get(one_candidate.we_vote_id) && SupportStore.get(one_candidate.we_vote_id).is_support;

              let networkOrIssueScoreSupport;
              if (atLeastOneCandidateChosenByNetwork) {
                let yourNetworkSupportsPopover;
                if (advisorsThatMakeVoterNetworkScoreCount > 0) {
                  yourNetworkSupportsPopover =
                    <Popover id="popover-trigger-click-root-close"
                             title={<span>Your Network Supports <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                             onClick={this.closeYourNetworkSupportsPopover}>
                      <strong>{one_candidate.ballot_item_display_name}</strong> has
                      the highest <strong>Score in Your Network</strong>, based on these friends and organizations:<br />
                      {advisorsThatMakeVoterNetworkScoreDisplay}
                    </Popover>;
                } else {
                  yourNetworkSupportsPopover =
                    <Popover id="popover-trigger-click-root-close"
                             title={<span>Your Network Supports <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                             onClick={this.closeYourNetworkSupportsPopover}>
                      Your friends, and the organizations you listen to, are <strong>Your Network</strong>.
                      Everyone in your network
                      that <span className="u-no-break"> <img src={cordovaDot("/img/global/icons/thumbs-up-color-icon.svg")} width="20" height="20" /> supports</span> {one_candidate.ballot_item_display_name} adds
                      +1 to {one_candidate.ballot_item_display_name}'s <strong>Score in Your Network</strong>. <strong>{one_candidate.ballot_item_display_name}</strong> has
                      the highest score in your network.
                    </Popover>;
                }

                networkOrIssueScoreSupport = candidateWithMostSupportFromNetwork === one_candidate.ballot_item_display_name ?
                  <div className="u-flex u-items-center">
                    <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                      this.toggleExpandDetails : null }>
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
                const hasHighestIssueScorePopover =
                  <Popover id="popover-trigger-click-root-close"
                           title={<span>Highest Issue Score <span className="fa fa-times pull-right u-cursor--pointer" aria-hidden="true" /></span>}
                           onClick={this.closeHighestIssueScorePopover}>
                    We took the issues you are following, and added up the opinions of all of the organizations
                    under those issues. <strong>{one_candidate.ballot_item_display_name}</strong> has
                    the most support from these
                    organizations.<br />
                    {advisorsThatMakeVoterIssuesScoreDisplay}
                    <Link onClick={this.toggleExpandDetails}> learn more</Link>
                  </Popover>;
                networkOrIssueScoreSupport = candidateWithHighestIssueScore === one_candidate.ballot_item_display_name ?
                  <div className="u-flex u-items-center">
                    <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                      this.toggleExpandDetails : null }>
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
                    this.toggleExpandDetails : null }>
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
            { voterSupportsAtLeastOneCandidate ?
              null :
              <span>
                { atLeastOneCandidateChosenByNetwork || atLeastOneCandidateChosenByIssueScore ?
                  null :
                  <div className="u-tr">
                    <OverlayTrigger trigger="click"
                                  ref="undecided-overlay"
                                  onExit={this.closeYourNetworkIsUndecidedPopover}
                                  rootClose
                                  placement="top"
                                  overlay={yourNetworkIsUndecidedPopover}>
                      <span className=" u-cursor--pointer">Your network is undecided <i className="fa fa-info-circle fa-md network-positions-stacked__info-icon-for-popover hidden-print" aria-hidden="true" /></span>
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
              <i className="fa fa-plus BallotItem__view-more-plus" aria-hidden="true" />
              <span> Show {remaining_candidates_to_display_count} more candidate{ remaining_candidates_to_display_count !== 1 ? "s" : null }</span>
            </span>
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
            <span className="BallotItem__view-more u-items-center pull-right u-no-break hidden-print">
              show fewer</span>
          </Link> :
          <Link onClick={this.toggleExpandDetails}>
            <div className="BallotItem__view-more u-items-center u-no-break hidden-print">
              <i className="fa fa-plus BallotItem__view-more-plus" aria-hidden="true" />
              { total_number_of_candidates_to_display > 1 ?
                <span> View all {total_number_of_candidates_to_display} candidates</span> :
                <span> View candidate</span>
              }
            </div>
          </Link>
        }
        </div>
      </div>;
  }
}
