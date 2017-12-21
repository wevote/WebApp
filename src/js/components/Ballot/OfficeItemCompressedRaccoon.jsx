import React, { Component, PropTypes } from "react";
import { Link, browserHistory } from "react-router";
import TextTruncate from "react-text-truncate";
import { capitalizeString } from "../../utils/textFormat";
import BallotSideBarLink from "../Navigation/BallotSideBarLink";
import BookmarkToggle from "../Bookmarks/BookmarkToggle";
import CandidateActions from "../../actions/CandidateActions";
import CandidateStore from "../../stores/CandidateStore";
import VoterGuideStore from "../../stores/VoterGuideStore";
import ImageHandler from "../ImageHandler";
import ItemActionBar from "../Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../Widgets/ItemPositionStatementActionBar";
import ItemSupportOpposeCheetah from "../Widgets/ItemSupportOpposeCheetah";
import ItemSupportOpposeCounts from "../Widgets/ItemSupportOpposeCounts";
import ItemTinyOpinionsToFollow from "../VoterGuide/ItemTinyOpinionsToFollow";
import LearnMore from "../Widgets/LearnMore";
import SupportStore from "../../stores/SupportStore";

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 5; // Set to 5 in raccoon, and 3 in walrus

export default class OfficeItemCompressed extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    kind_of_ballot_item: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    link_to_ballot_item_page: PropTypes.bool,
    candidate_list: PropTypes.array,
    toggleCandidateModal: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      transitioning: false,
      maximum_organization_display: 4,
      display_all_candidates_flag: false,
      display_raccoon_details_flag: false,
      show_position_statement: true,
    };

    this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.openCandidateModal = this.openCandidateModal.bind(this);
    this.toggleDisplayAllCandidates = this.toggleDisplayAllCandidates.bind(this);
    this.toggleExpandCheetahDetails = this.toggleExpandCheetahDetails.bind(this);
  }

  componentDidMount () {
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));

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
  }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.supportStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState({ transitioning: false });
  }

  onSupportStoreChange () {
    this.setState({ transitioning: false });
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

  goToOfficeLink () {
    browserHistory.push("/office/" + this.props.we_vote_id);
  }

  render () {
    let { ballot_item_display_name, we_vote_id } = this.props;
    let officeLink = "/office/" + we_vote_id;

    ballot_item_display_name = capitalizeString(ballot_item_display_name);

    var candidate_list_to_display = this.props.candidate_list;
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
    let is_support;

    this.props.candidate_list.forEach((candidate) => {
      supportProps = SupportStore.get(candidate.we_vote_id);
      if (supportProps) {
        is_support = supportProps.is_support;

        if (is_support) {
          is_support_array.push(candidate.ballot_item_display_name);
          voter_supports_at_least_one_candidate = true;
        }
      }
    });

    /* This function finds the highest support count for each office but does not handle ties. If two candidates have the
    same network support count, only the first candidate will be displayed. */
    let largest_support_count;
    let at_least_one_candidate_chosen = false;

    if (is_support_array.length === 0){
      let network_support_count;
      let network_oppose_count;

      this.props.candidate_list.forEach((candidate) => {
        largest_support_count = 0;
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

    return <div className="card-main office-item">
      <a name={we_vote_id} />
      <span className="card-main__content">
        {/* Desktop */}
        <span className="hidden-xs">
          {/*<BookmarkToggle we_vote_id={we_vote_id} type="OFFICE" />*/}
          <span className="hidden-print pull-right u-push--lg">
              <Link className="BallotItem__learn-more" onClick={this.goToOfficeLink}>Learn More</Link>
          </span>
        </span>
        {/* Mobile */}
        <span className="visible-xs">
          { this.state.display_raccoon_details_flag ?
            <span className="BallotItem__learn-more hidden-print pull-right">
              <Link className="BallotItem__learn-more" onClick={this.goToOfficeLink}>Learn More</Link>
            </span> :
            null
          }
        </span>
        <span className="h2 u-f3 card-main__ballot-name u-stack--sm">{ballot_item_display_name_raccoon}</span>

        {/* Only show the candidates if the Office is "unfurled" */}
        { this.state.display_raccoon_details_flag ?
          <span>{candidate_list_to_display.map((one_candidate) => {
            let candidate_we_vote_id = one_candidate.we_vote_id;
            let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(candidate_we_vote_id);
            let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(candidate_we_vote_id);

            let candidate_party_text = one_candidate.party && one_candidate.party.length ? one_candidate.party + ". " : "";
            let candidate_description_text = one_candidate.twitter_description && one_candidate.twitter_description.length ? one_candidate.twitter_description : "";
            let candidate_text = candidate_party_text + candidate_description_text;
            let candidateSupportStore = SupportStore.get(candidate_we_vote_id);
            let is_support = false;
            let is_oppose = false;
            let voter_statement_text = false;
            if (candidateSupportStore !== undefined) {
              is_support = candidateSupportStore.is_support;
              is_oppose = candidateSupportStore.is_oppose;
              voter_statement_text = candidateSupportStore.voter_statement_text;
            }

            let candidate_photo_raccoon = this.state.display_raccoon_details_flag ?
              <div className="hidden-xs" onClick={this.props.link_to_ballot_item_page ? this.toggleExpandCheetahDetails : null}>
                <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm"
                              sizeClassName="icon-candidate-small u-push--sm "
                              imageUrl={one_candidate.candidate_photo_url_large}
                              alt="candidate-photo"
                              kind_of_ballot_item="CANDIDATE" />
              </div> :
              null;

            let candidate_name_raccoon = <h4 className="card-main__candidate-name u-f5">
              <a onClick={this.props.link_to_ballot_item_page ? () => this.openCandidateModal(one_candidate) : null}>
                <TextTruncate line={1}
                              truncateText="…"
                              text={one_candidate.ballot_item_display_name}
                              textTruncateChild={null}/>
              </a>
            </h4>;

            // We are experimenting with different display options
            let positions_display_raccoon = <div>
              <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
                {/* Positions in Your Network and Possible Voter Guides to Follow (Desktop) */}
                <ItemSupportOpposeCheetah ballotItemWeVoteId={candidate_we_vote_id}
                                          ballot_item_display_name={one_candidate.ballot_item_display_name}
                                          display_raccoon_details_flag={this.state.display_raccoon_details_flag}
                                          supportProps={candidateSupportStore}
                                          organizationsToFollowSupport={organizationsToFollowSupport}
                                          organizationsToFollowOppose={organizationsToFollowOppose}
                                          maximumOrganizationDisplay={this.state.maximum_organization_display}
                                          toggleCandidateModal={this.props.toggleCandidateModal}
                                          type="CANDIDATE"/>
              </div>
            </div>;

            let comment_display_raccoon = this.state.display_raccoon_details_flag && (is_support || is_oppose || voter_statement_text) ?
              <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
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
                  {/* Opinion Items */}
                  {positions_display_raccoon}
                </div>
              </div>
              {/* If voter has taken position, offer the comment bar */}
              {comment_display_raccoon}
            </div>;
          })}</span> :
          null
        }

        {/* If the office is "rolled up", show some details */}
        { !this.state.display_raccoon_details_flag ?
          <div>
            { candidate_list_to_display.map( (one_candidate) =>
              <div key={one_candidate.we_vote_id}>
                {/* *** Candidate name *** */}
                { SupportStore.get(one_candidate.we_vote_id) && SupportStore.get(one_candidate.we_vote_id).is_support ?
                  <div className="u-flex u-items-center">
                    <div className="u-flex-auto u-cursor--pointer" onClick={ this.props.link_to_ballot_item_page ?
                    this.goToOfficeLink : null }>
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
                      this.goToOfficeLink : null }>
                      <h2 className="h5">
                        {one_candidate.ballot_item_display_name}
                      </h2>
                    </div>
                    <div className="u-flex-none u-justify-end">
                      <span className="u-push--xs">Your network supports</span>
                      <img src="/img/global/icons/up-arrow-color-icon.svg" className="network-positions__support-icon" width="20" height="20" />
                    </div>
                  </div> :
                    is_support_array === 0 && candidate_with_most_support !== one_candidate.ballot_item_display_name && !voter_supports_at_least_one_candidate ?
                    <div className="u-flex-none u-justify-end">Your network is undecided</div> :
                      null}
                {/* *** "Positions in your Network" bar OR items you can follow *** */}
              </div>)
            }
            { voter_supports_at_least_one_candidate ?
              null :
              <span>
                { at_least_one_candidate_chosen ?
                  null :
                  <div className="u-tr">Your network is undecided</div> }
              </span>
            }
          </div> :
          null
        }

        { !this.state.display_all_candidates_flag && remaining_candidates_to_display_count ?
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
              View all candidates...</div>
          </Link>
        }
        </span>
      </div>;
  }
}
