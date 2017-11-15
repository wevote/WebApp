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

const NUMBER_OF_CANDIDATES_TO_DISPLAY = 5; // Set to 5 in cheetah, and 3 in walrus

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
      display_cheetah_details_flag: false,
      show_position_statement: true,
    };

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
    this.setState({ display_cheetah_details_flag: !this.state.display_cheetah_details_flag });
  }

  openCandidateModal (candidate) {
    // console.log("this.state.candidate: ", this.state.candidate);
    if (candidate && candidate.we_vote_id) {
      this.props.toggleCandidateModal(candidate);
    }
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

    let ballot_item_display_name_cheetah = this.state.display_cheetah_details_flag ?
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

    let ballot_item_display_name_walrus = this.props.link_to_ballot_item_page ?
            <Link to={officeLink}>
              <TextTruncate line={1}
                            truncateText="…"
                            text={ballot_item_display_name}
                            textTruncateChild={null} />
            </Link> :
            <TextTruncate line={1}
                          truncateText="…"
                          text={ballot_item_display_name}
                          textTruncateChild={null} />;

    return <div className="card-main office-item">
      <a name={we_vote_id} />
      <div className="card-main__content">
        <BookmarkToggle we_vote_id={we_vote_id} type="OFFICE" />
        <h2 className="u-f3 card-main__ballot-name u-stack--sm">{ballot_item_display_name_cheetah}</h2>
        { candidate_list_to_display.map( (one_candidate) => {
          let candidate_we_vote_id = one_candidate.we_vote_id;
          let candidateGuidesList = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidate_we_vote_id);
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

          let candidate_photo_cheetah = this.state.display_cheetah_details_flag ?
              <div onClick={this.props.link_to_ballot_item_page ? this.toggleExpandCheetahDetails : null}>
                <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm"
                              sizeClassName="icon-candidate-small u-push--sm "
                              imageUrl={one_candidate.candidate_photo_url_large}
                              alt="candidate-photo"
                              kind_of_ballot_item="CANDIDATE" />
              </div> :
              null;

          let candidate_photo_walrus = <div onClick={this.props.link_to_ballot_item_page ? () => browserHistory.push("/candidate/" + candidate_we_vote_id) : null}>
                <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm"
                              sizeClassName="icon-candidate-small u-push--sm "
                              imageUrl={one_candidate.candidate_photo_url_large}
                              alt="candidate-photo"
                              kind_of_ballot_item="CANDIDATE" />
              </div>;

          let candidate_name_cheetah = <h4 className="card-main__candidate-name u-f5">
                  <a onClick={this.props.link_to_ballot_item_page ? this.toggleExpandCheetahDetails : null}>
                    <TextTruncate line={1}
                                  truncateText="…"
                                  text={one_candidate.ballot_item_display_name}
                                  textTruncateChild={null} />
                  </a>
                </h4>;

          let candidate_name_walrus = <h4 className="card-main__candidate-name u-f4">
                  <a onClick={this.props.link_to_ballot_item_page ? () => browserHistory.push("/candidate/" + candidate_we_vote_id) : null}>
                    <TextTruncate line={1}
                                  truncateText="…"
                                  text={one_candidate.ballot_item_display_name}
                                  textTruncateChild={null} />
                  </a>
                </h4>;

          let candidate_description_cheetah = this.state.display_cheetah_details_flag ?
            <div className="card-main__candidate-description">
                  <LearnMore text_to_display={candidate_text}
                             on_click={() => this.openCandidateModal(one_candidate)} />
                </div> :
            null;

          let candidate_description_walrus = <div className="card-main__candidate-description">
                  <LearnMore text_to_display={candidate_text}
                             on_click={ this.props.link_to_ballot_item_page ? () => browserHistory.push("/candidate/" + candidate_we_vote_id) : null } />
                </div>;

          // We are experimenting with different display options
          let positions_display_cheetah = <div>
            <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
              {/* Positions in Your Network and Possible Voter Guides to Follow (Desktop) */}
              <ItemSupportOpposeCheetah ballotItemWeVoteId={candidate_we_vote_id}
                                        ballot_item_display_name={one_candidate.ballot_item_display_name}
                                        display_cheetah_details_flag={this.state.display_cheetah_details_flag}
                                        supportProps={candidateSupportStore}
                                        organizationsToFollowSupport={organizationsToFollowSupport}
                                        organizationsToFollowOppose={organizationsToFollowOppose}
                                        maximumOrganizationDisplay={this.state.maximum_organization_display}
                                        toggleCandidateModal={this.props.toggleCandidateModal}
                                        type="CANDIDATE" />
            </div>
            {/* Support or Oppose actions for voter */}
            {this.state.display_cheetah_details_flag ?
              <div className="u-cursor--pointer">
                <ItemActionBar ballot_item_we_vote_id={candidate_we_vote_id}
                               supportProps={candidateSupportStore}
                               transitioniing={this.state.transitioning}
                               ballot_item_display_name={one_candidate.ballot_item_display_name}
                               type="CANDIDATE"/>
              </div> :
              null
            }
          </div>;

          let positions_display_walrus = <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
                  {/* Positions in Your Network */}
                  <div className={ this.props.link_to_ballot_item_page ? "u-cursor--pointer" : null }
                       onClick={ this.props.link_to_ballot_item_page ? () => this.props.toggleCandidateModal(one_candidate) : null }>
                    <ItemSupportOpposeCounts we_vote_id={candidate_we_vote_id}
                                             supportProps={candidateSupportStore}
                                             guideProps={candidateGuidesList}
                                             type="CANDIDATE" />
                  </div>

                  {/* Possible Voter Guides to Follow (Desktop) */}
                  { candidateGuidesList && candidateGuidesList.length ?
                    <ItemTinyOpinionsToFollow ballotItemWeVoteId={candidate_we_vote_id}
                                              organizationsToFollow={candidateGuidesList}
                                              maximumOrganizationDisplay={this.state.maximum_organization_display}
                                              supportProps={candidateSupportStore} /> : null }

                  {/* Support or Oppose actions for voter */}
                  <div className="u-cursor--pointer">
                    <ItemActionBar ballot_item_we_vote_id={candidate_we_vote_id}
                                   supportProps={candidateSupportStore}
                                   shareButtonHide
                                   commentButtonHide
                                   transitioniing={this.state.transitioning}
                                   ballot_item_display_name={one_candidate.ballot_item_display_name}
                                   type="CANDIDATE" />
                  </div>
                </div>;

          let comment_display_cheetah = this.state.display_cheetah_details_flag && (is_support || is_oppose || voter_statement_text) ?
              <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                <div className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm">&nbsp;
                </div>
                <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                    <ItemPositionStatementActionBar ballot_item_we_vote_id={candidate_we_vote_id}
                                                    ballot_item_display_name={one_candidate.ballot_item_display_name}
                                                    supportProps={candidateSupportStore}
                                                    transitioning={this.state.transitioning}
                                                    type="CANDIDATE"
                                                    shown_in_list />
                </div>
              </div> :
              null;

          let comment_display_walrus = is_support || is_oppose || voter_statement_text ?
              <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
                <div className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm">&nbsp;
                </div>
                <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                    <ItemPositionStatementActionBar ballot_item_we_vote_id={candidate_we_vote_id}
                                                    ballot_item_display_name={one_candidate.ballot_item_display_name}
                                                    supportProps={candidateSupportStore}
                                                    transitioning={this.state.transitioning}
                                                    type="CANDIDATE"
                                                    shown_in_list />
                </div>
              </div> :
              null;

          return <div key={candidate_we_vote_id} className="u-stack--md">
            <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
              {/* Candidate Photo */}
              {candidate_photo_cheetah}
              <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
                {/* Candidate Name */}
                {candidate_name_cheetah}
                {candidate_description_cheetah}
                {/* Opinion Items */}
                {positions_display_cheetah}
              </div>
            </div>
            {/* If voter has taken position, offer the comment bar */}
            {comment_display_cheetah}
          </div>;
        })}

        { !this.state.display_all_candidates_flag && remaining_candidates_to_display_count ?
          <Link onClick={this.toggleDisplayAllCandidates}>
            <span className="u-items-center u-no-break">
              Click to show {remaining_candidates_to_display_count} more candidate{ remaining_candidates_to_display_count !== 1 ? "s" : null }...</span>
          </Link> : null
        }
        { this.state.display_all_candidates_flag && this.props.candidate_list.length > NUMBER_OF_CANDIDATES_TO_DISPLAY ?
          <BallotSideBarLink url={"#" + this.props.we_vote_id}
                             label={"Click to show fewer candidates..."}
                             displaySubtitles={false}
                             onClick={this.toggleDisplayAllCandidates} /> : null
        }
        { this.state.display_cheetah_details_flag ?
          <Link onClick={this.toggleExpandCheetahDetails}>
            <div className="u-items-center u-no-break">
              Click to show fewer details...</div>
          </Link> :
          <Link onClick={this.toggleExpandCheetahDetails}>
            <div className="u-items-center u-no-break">
              Click to show more details...</div>
          </Link>
        }
      </div>
    </div>;
  }
}
