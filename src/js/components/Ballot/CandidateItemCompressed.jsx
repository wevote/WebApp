import React, { Component } from "react";
import PropTypes from "prop-types";
import TextTruncate from "react-text-truncate";
import { historyPush } from "../../utils/cordovaUtils";
import ImageHandler from "../ImageHandler";
import ItemSupportOpposeRaccoon from "../Widgets/ItemSupportOpposeRaccoon";
import LearnMore from "../Widgets/LearnMore";
import { renderLog } from "../../utils/logging";
import OrganizationStore from "../../stores/OrganizationStore";
import SupportStore from "../../stores/SupportStore";
import VoterGuideStore from "../../stores/VoterGuideStore";

export default class CandidateItemCompressed extends Component {
  static propTypes = {
    link_to_ballot_item_page: PropTypes.bool,
    organization: PropTypes.object,
    oneCandidate: PropTypes.object,
    showPositionStatementActionBar: PropTypes.bool,
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
    this.goToCandidateLink = this.goToCandidateLink.bind(this);
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();

    // console.log("this.props.candidate_list: ", this.props.candidate_list);
    if (this.props.oneCandidate && this.props.oneCandidate.we_vote_id) {
      this.setState({
        oneCandidate: this.props.oneCandidate,
      });
    }
    if (this.props.organization && this.props.organization.organization_we_vote_id) {
      this.setState({
        organization: this.props.organization,
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
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    this.setState({
      transitioning: false,
    });
  }

  _onOrganizationStoreChange () {
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

  getCandidateLink (oneCandidateWeVoteId) {
    if (this.state.organization && this.state.organization.organization_we_vote_id) {
      // If there is an organization_we_vote_id, signal that we want to link back to voter_guide for that organization
      return "/candidate/" + oneCandidateWeVoteId + "/btvg/" + this.state.organization.organization_we_vote_id;
    } else {
      // If no organization_we_vote_id, signal that we want to link back to default ballot
      return "/candidate/" + oneCandidateWeVoteId + "/b/btdb/";
    }
  }

  goToCandidateLink (oneCandidateWeVoteId) {
    let candidate_link = this.getCandidateLink(oneCandidateWeVoteId);
    historyPush(candidate_link);
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
    if (!this.state.oneCandidate || !this.state.oneCandidate.we_vote_id) {
      return null;
    }

    let oneCandidateWeVoteId = this.state.oneCandidate.we_vote_id;
    let candidateSupportStore = SupportStore.get(oneCandidateWeVoteId);
    let organizationsToFollowSupport = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdSupports(oneCandidateWeVoteId);
    let organizationsToFollowOppose = VoterGuideStore.getVoterGuidesToFollowForBallotItemIdOpposes(oneCandidateWeVoteId);
    // console.log("OfficeItemCompressedRaccoon, just retrieved getVoterGuidesToFollowForBallotItemIdSupports");
    let candidate_party_text = this.state.oneCandidate.party && this.state.oneCandidate.party.length ? this.state.oneCandidate.party + ". " : "";
    let candidate_description_text = this.state.oneCandidate.twitter_description && this.state.oneCandidate.twitter_description.length ? this.state.oneCandidate.twitter_description : "";
    let candidate_text = candidate_party_text + candidate_description_text;

    let candidate_photo_raccoon = <div onClick={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(this.state.oneCandidate.we_vote_id) : null}>
        <ImageHandler className="card-main__avatar-compressed o-media-object__anchor u-cursor--pointer u-self-start u-push--sm"
                      sizeClassName="icon-candidate-small u-push--sm "
                      imageUrl={this.state.oneCandidate.candidate_photo_url_large}
                      alt="candidate-photo"
                      kind_of_ballot_item="CANDIDATE" />
      </div>;

    let candidate_name_raccoon = <h4 className="card-main__candidate-name u-f5">
      {this.props.link_to_ballot_item_page ?
        <a onClick={() => this.goToCandidateLink(this.state.oneCandidate.we_vote_id)}>
          <TextTruncate line={1}
                        truncateText="…"
                        text={this.state.oneCandidate.ballot_item_display_name}
                        textTruncateChild={null}/>
        </a> :
        <TextTruncate line={1}
                      truncateText="…"
                      text={this.state.oneCandidate.ballot_item_display_name}
                      textTruncateChild={null}/>
      }

    </h4>;

    let positions_display_raccoon = <div>
      <div className="u-flex u-flex-auto u-flex-row u-justify-between u-items-center u-min-50">
        {/* Positions in Your Network and Possible Voter Guides to Follow */}
        <ItemSupportOpposeRaccoon ballotItemWeVoteId={oneCandidateWeVoteId}
                                  ballot_item_display_name={this.state.oneCandidate.ballot_item_display_name}
                                  display_raccoon_details_flag
                                  goToCandidate={() => this.goToCandidateLink(this.state.oneCandidate.we_vote_id)}
                                  maximumOrganizationDisplay={this.state.maximum_organization_display}
                                  organizationsToFollowSupport={organizationsToFollowSupport}
                                  organizationsToFollowOppose={organizationsToFollowOppose}
                                  showPositionStatementActionBar={this.props.showPositionStatementActionBar}
                                  supportProps={candidateSupportStore}
                                  type="CANDIDATE"/>
      </div>
    </div>;

    return <div key={oneCandidateWeVoteId} className="u-stack--md">
      <div className="o-media-object u-flex-auto u-min-50 u-push--sm u-stack--sm">
        {/* Candidate Photo, only shown in Desktop */}
        {candidate_photo_raccoon}
        <div className="o-media-object__body u-flex u-flex-column u-flex-auto u-justify-between">
          {/* Candidate Name */}
          {candidate_name_raccoon}
          {/* Description under candidate name */}
          <LearnMore text_to_display={candidate_text}
                     on_click={this.props.link_to_ballot_item_page ? () => this.goToCandidateLink(this.state.oneCandidate.we_vote_id) : null}
                     num_of_lines={3} />
          {/* DESKTOP: If voter has taken position, offer the comment bar */}
          {/* comment_display_raccoon_desktop */}
          {/* Organization's Followed AND to Follow Items */}
          {positions_display_raccoon}
        </div>
        {/* MOBILE: If voter has taken position, offer the comment bar */}
        {/* comment_display_raccoon_mobile */}
      </div>
    </div>;
  }
}
