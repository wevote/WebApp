import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import CandidateItem from '../../components/Ballot/CandidateItem';
import CandidateStore from '../../stores/CandidateStore';
import { capitalizeString } from '../../utils/textFormat';
import GuideList from '../../components/VoterGuide/GuideList';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../../utils/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import PositionList from '../../components/Ballot/PositionList';
import SupportActions from '../../actions/SupportActions';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import SearchAllActions from '../../actions/SearchAllActions';
import webAppConfig from '../../config';

// The component /routes/VoterGuide/OrganizationVoterGuideCandidate is based on this component
export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      candidateWeVoteId: '',
      organizationWeVoteId: '',
      positionListFromAdvisersFollowedByVoter: [],

      // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidateWeVoteId, but we can't now
      //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
      // guidesToFollowList: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(this.props.params.candidate_we_vote_id)
      voterGuidesToFollowForThisBallotItem: [],
    };
  }

  componentDidMount () {
    // console.log("Candidate componentDidMount");
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));

    let organizationWeVoteId = '';
    if (this.props.params) {
      CandidateActions.candidateRetrieve(this.props.params.candidate_we_vote_id);
      CandidateActions.positionListForBallotItem(this.props.params.candidate_we_vote_id);

      organizationWeVoteId = this.props.params.organization_we_vote_id || '';
      // If needed, activate this
      // organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      // if (organizationWeVoteId && organizationWeVoteId !== "" && !organization.organization_we_vote_id) {
      //   // Retrieve the organization object
      //   OrganizationActions.organizationRetrieve(organizationWeVoteId);
      // }
    }

    if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
      IssueActions.issuesRetrieveForElection(VoterStore.electionId());
    }

    // Get the latest guides to follow for this candidate
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    // June 2018: Avoid hitting this same api multiple times, if we already have the data
    const voterGuidesForId = VoterGuideStore.getVoterGuideForOrganizationId(this.props.params.candidate_we_vote_id);
    if (voterGuidesForId && Object.keys(voterGuidesForId).length > 0) {
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(this.props.params.candidate_we_vote_id, 'CANDIDATE');
    }

    // Make sure supportProps exist for this Candidate when browser comes straight to candidate page
    SupportActions.retrievePositionsCountsForOneBallotItem(this.props.params.candidate_we_vote_id);
    OrganizationActions.organizationsFollowedRetrieve();

    // We want to make sure we have all of the position information so that comments show up
    const voterGuidesToFollowForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(this.props.params.candidate_we_vote_id);

    if (voterGuidesToFollowForThisBallotItem) {
      voterGuidesToFollowForThisBallotItem.forEach((oneVoterGuide) => {
        // console.log("oneVoterGuide: ", oneVoterGuide);
        OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
      });
    }

    // Display the candidate's name in the search box
    const searchBoxText = this.state.candidate.ballot_item_display_name || ''; // TODO DALE Not working right now
    SearchAllActions.exitSearch(searchBoxText); // TODO: still not used :)
    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), this.props.params.candidate_we_vote_id);
    this.setState({
      candidateWeVoteId: this.props.params.candidate_we_vote_id,
      organizationWeVoteId,
      positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(this.props.params.candidate_we_vote_id),
      voterGuidesToFollowForThisBallotItem,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("Candidate componentWillReceiveProps");
    // When a new candidate is passed in, update this component to show the new data
    if (nextProps.params.candidate_we_vote_id !== this.state.candidateWeVoteId) {
      CandidateActions.candidateRetrieve(nextProps.params.candidate_we_vote_id);
      CandidateActions.positionListForBallotItem(nextProps.params.candidate_we_vote_id);
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextProps.params.candidate_we_vote_id, 'CANDIDATE');
      this.setState({
        candidateWeVoteId: nextProps.params.candidate_we_vote_id,
        positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(nextProps.params.candidate_we_vote_id),
        voterGuidesToFollowForThisBallotItem: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(nextProps.params.candidate_we_vote_id),
      });
    }

    // Display the candidate's name in the search box
    // var { candidate } = this.state;
    // var searchBoxText = candidate.ballot_item_display_name || "";  // TODO DALE Not working right now
    SearchAllActions.exitSearch('');
  }

  componentWillUnmount () {
    // console.log("Candidate componentWillUnmount");
    this.candidateStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onCandidateStoreChange () {
    // console.log("Candidate onCandidateStoreChange");
    this.setState(state => ({
      candidate: CandidateStore.getCandidate(state.candidateWeVoteId),
      positionListFromAdvisersFollowedByVoter: CandidateStore.getPositionList(state.candidateWeVoteId),
    }));
  }

  onVoterGuideStoreChange () {
    // console.log("Candidate onVoterGuideStoreChange");
    // Trigger an update of the candidate so we can get an updated position_list
    //  CandidateActions.candidateRetrieve(this.state.candidateWeVoteId);
    CandidateActions.positionListForBallotItem(this.state.candidateWeVoteId);

    // Also update the position count for *just* this candidate, since it might not come back with positionsCountForAllBallotItems
    SupportActions.retrievePositionsCountsForOneBallotItem(this.state.candidateWeVoteId);

    // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidateWeVoteId, but we can't now
    //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
    this.setState(state => ({
      voterGuidesToFollowForThisBallotItem: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(state.candidateWeVoteId),
    }));
  }

  render () {
    renderLog(__filename);
    const electionId = VoterStore.electionId();
    const NO_VOTER_GUIDES_TEXT = 'We could not find any more voter guides to listen to related to this candidate.';

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
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <section className="card">
          <CandidateItem
            {...this.state.candidate}
            contest_office_name={this.state.candidate.contest_office_name}
            organizationWeVoteId={this.state.organizationWeVoteId}
            linkToOfficePage
            showLargeImage
            showPositionStatementActionBar
          />
          <div className="card__additional">
            { this.state.positionListFromAdvisersFollowedByVoter ? (
              <div>
                <PositionList
                  position_list={this.state.positionListFromAdvisersFollowedByVoter}
                  hideSimpleSupportOrOppose
                  ballot_item_display_name={this.state.candidate.ballot_item_display_name}
                  positionListExistsTitle={<div><h3 className="card__additional-heading">Your Network&apos;s Opinions</h3></div>}
                />
              </div>
            ) : null
            }
            {this.state.voterGuidesToFollowForThisBallotItem.length === 0 ?
              <div className="card__additional-text">{NO_VOTER_GUIDES_TEXT}</div> : (
                <div>
                  <h3 className="card__additional-heading">{`More opinions about ${this.state.candidate.ballot_item_display_name}`}</h3>
                  <GuideList
                    id={electionId}
                    ballotItemWeVoteId={this.state.candidateWeVoteId}
                    organizationsToFollow={this.state.voterGuidesToFollowForThisBallotItem}
                  />
                </div>
              )
            }
          </div>
        </section>
        <OpenExternalWebSite
          url="https://api.wevoteusa.org/vg/create/"
          className="opinions-followed__missing-org-link"
          target="_blank"
          title="Endorsements Missing?"
          body={<Button className="btn btn-success btn-sm" bsPrefix="u-margin-top--sm u-stack--xs" variant="primary">Endorsements Missing?</Button>}
        />
        <div className="opinions-followed__missing-org-text">
          Are there endorsements for
          {' '}
          {candidateName}
          {' '}
          that you expected to see?
        </div>
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
