import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import CandidateActions from "../../actions/CandidateActions";
import OrganizationVoterGuideCandidateItem from "../../components/VoterGuide/OrganizationVoterGuideCandidateItem";
import CandidateStore from "../../stores/CandidateStore";
import { capitalizeString } from "../../utils/textFormat";
import GuideList from "../../components/VoterGuide/GuideList";
import LoadingWheel from "../../components/LoadingWheel";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import OrganizationActions from "../../actions/OrganizationActions";
import PositionList from "../../components/Ballot/PositionList";
import SupportActions from "../../actions/SupportActions";
import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import SearchAllActions from "../../actions/SearchAllActions";
import webAppConfig from "../../config";

// This is based on routes/Ballot/Candidate
export default class OrganizationVoterGuideCandidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      candidateWeVoteId: "",
      positionListFromAdvisersFollowedByVoter: [],
      // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidateWeVoteId, but we can't now
      //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
      // guidesToFollowList: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(this.props.params.candidate_we_vote_id)
      voterGuidesToFollowForLatestBallotItem: [],
      organizationWeVoteId: "",
    };
  }

  componentDidMount () {
    // console.log("Candidate componentDidMount");
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    CandidateActions.candidateRetrieve(this.props.params.candidate_we_vote_id);
    CandidateActions.positionListForBallotItem(this.props.params.candidate_we_vote_id);

    // Get the latest guides to follow for this candidate
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(this.props.params.candidate_we_vote_id, "CANDIDATE");

    // Make sure supportProps exist for this Candidate when browser comes straight to candidate page
    SupportActions.retrievePositionsCountsForOneBallotItem(this.props.params.candidate_we_vote_id);
    OrganizationActions.organizationsFollowedRetrieve();

    // Display the candidate's name in the search box
    const searchBoxText = this.state.candidate.ballot_item_display_name || ""; // TODO DALE Not working right now
    SearchAllActions.exitSearch(searchBoxText); // TODO: still not used :)
    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), this.props.params.candidate_we_vote_id);
    this.setState({
      candidateWeVoteId: this.props.params.candidate_we_vote_id,
      organizationWeVoteId: this.props.params.organization_we_vote_id,
      positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(this.props.params.candidate_we_vote_id),
      voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
    // console.log("OrganizationVoterGuideCandidate, organization_we_vote_id: ", this.props.params.organization_we_vote_id);
  }

  componentWillReceiveProps (nextProps) {
    // console.log("Candidate componentWillReceiveProps");
    // When a new candidate is passed in, update this component to show the new data
    if (nextProps.params.candidate_we_vote_id !== this.state.candidateWeVoteId) {
      CandidateActions.candidateRetrieve(nextProps.params.candidate_we_vote_id);
      CandidateActions.positionListForBallotItem(nextProps.params.candidate_we_vote_id);
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextProps.params.candidate_we_vote_id, "CANDIDATE");
      this.setState({
        candidateWeVoteId: nextProps.params.candidate_we_vote_id,
        positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(nextProps.params.candidate_we_vote_id),
        voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
      });
    }

    // Display the candidate's name in the search box
    // var { candidate } = this.state;
    // var searchBoxText = candidate.ballot_item_display_name || "";  // TODO DALE Not working right now
    SearchAllActions.exitSearch("");
  }

  componentWillUnmount () {
    // console.log("Candidate componentWillUnmount");
    this.candidateStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId } = this.state;
    // console.log("Candidate onCandidateStoreChange");
    this.setState({
      candidate: CandidateStore.getCandidate(candidateWeVoteId),
      positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(candidateWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    // console.log("Candidate onVoterGuideStoreChange");
    // When the voterGuidesToFollowForLatestBallotItem changes, trigger an update of the candidate so we can get an updated position_list
    // CandidateActions.candidateRetrieve(this.state.candidateWeVoteId);
    CandidateActions.positionListForBallotItem(this.state.candidateWeVoteId);
    // Also update the position count for *just* this candidate, since it might not come back with positionsCountForAllBallotItems
    SupportActions.retrievePositionsCountsForOneBallotItem(this.state.candidateWeVoteId);
    // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidateWeVoteId, but we can't now
    //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
    this.setState({
      voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
      // voter_guides_to_follow_for_this_ballot_item: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(this.state.candidateWeVoteId),
    });
  }

  render () {
    const electionId = VoterStore.electionId();
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to listen to related to this candidate.";
    // console.log("Candidate render, this.state.positionListFromAdvisersFollowedByVoter: ", this.state.positionListFromAdvisersFollowedByVoter);

    if (!this.state.candidate || !this.state.candidate.ballot_item_display_name) {
      // TODO DALE If the candidate we_vote_id is not valid, we need to update this with a notice
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <div>{LoadingWheel}</div>
          <br />
        </div>
      );
    }

    const candidateName = capitalizeString(this.state.candidate.ballot_item_display_name);
    const titleText = `${candidateName} - We Vote`;
    const descriptionText = `Information about ${candidateName}, candidate for ${this.state.candidate.contest_office_name}`;
    const voter = VoterStore.getVoter();
    const candidateAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}c/${this.state.candidate.id}/edit/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;

    return (
      <span>
        <Helmet
          title={titleText}
          meta={[{ name: "description", content: descriptionText }]}
        />
        <section className="card">
          <OrganizationVoterGuideCandidateItem
            {...this.state.candidate}
            commentButtonHide
            contest_office_name={this.state.candidate.contest_office_name}
            hideOpinionsToFollow
            linkToOfficePage
            organization_we_vote_id={this.state.organizationWeVoteId}
            position_list={this.state.positionListFromAdvisersFollowedByVoter}
            showLargeImage
            showPositionsInYourNetworkBreakdown
            showPositionStatementActionBar
          />
          <div className="card__additional">
            { this.state.positionListFromAdvisersFollowedByVoter ? (
              <div>
                <PositionList
                  position_list={this.state.positionListFromAdvisersFollowedByVoter}
                  hideSimpleSupportOrOppose
                  ballot_item_display_name={this.state.candidate.ballot_item_display_name}
                />
              </div>
            ) : null
            }
            {this.state.voterGuidesToFollowForLatestBallotItem.length === 0 ?
              <div className="card__additional-text">{NO_VOTER_GUIDES_TEXT}</div> : (
                <div>
                  <h3 className="card__additional-heading">{`More opinions about ${this.state.candidate.ballot_item_display_name}`}</h3>
                  <GuideList
                    id={electionId}
                    ballotItemWeVoteId={this.state.candidateWeVoteId}
                    organizationsToFollow={this.state.voterGuidesToFollowForLatestBallotItem}
                  />
                </div>
              )
            }
          </div>
        </section>
        <br />
        <ThisIsMeAction
          twitter_handle_being_viewed={this.state.candidate.twitter_handle}
          name_being_viewed={this.state.candidate.ballot_item_display_name}
          kind_of_owner="POLITICIAN"
        />
        <br />
        {/* Show links to this candidate in the admin tools */}
        { voter.is_admin || voter.is_verified_volunteer ? (
          <span className="u-wrap-links d-print-none">
            Admin:
            <OpenExternalWebSite
              url={candidateAdminEditUrl}
              target="_blank"
              className="open-web-site open-web-site__no-right-padding"
              body={(
                <span>
                  edit
                  {candidateName}
                </span>
              )}
            />
          </span>
        ) : null
        }
      </span>
    );
  }
}
