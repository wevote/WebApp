import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import CandidateItem from '../../components/Ballot/CandidateItem';
import CandidateStickyHeader from '../../components/Ballot/CandidateStickyHeader';
import CandidateStore from '../../stores/CandidateStore';
import { capitalizeString } from '../../utils/textFormat';
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
import AppStore from '../../stores/AppStore';
import SearchAllActions from '../../actions/SearchAllActions';
import webAppConfig from '../../config';
import EndorsementCard from '../../components/Widgets/EndorsementCard';



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
      allCachedPositionsForThisCandidate: [],
      scrolledDown: AppStore.getScrolledDown(),
    };
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    let organizationWeVoteId = '';
    if (this.props.params) {
      CandidateActions.candidateRetrieve(this.props.params.candidate_we_vote_id);
      CandidateActions.positionListForBallotItemPublic(this.props.params.candidate_we_vote_id);

      organizationWeVoteId = this.props.params.organization_we_vote_id || '';
    }

    if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
      IssueActions.issuesRetrieveForElection(VoterStore.electionId());
    }

    // Get the latest guides to follow for this candidate

    // June 2018: Avoid hitting this same api multiple times, if we already have the data
    const voterGuidesForId = VoterGuideStore.getVoterGuideForOrganizationId(this.props.params.candidate_we_vote_id);
    if (voterGuidesForId && Object.keys(voterGuidesForId).length > 0) {
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(this.props.params.candidate_we_vote_id, 'CANDIDATE');
    }

    // Make sure supportProps exist for this Candidate when browser comes straight to candidate page
    SupportActions.retrievePositionsCountsForOneBallotItem(this.props.params.candidate_we_vote_id);
    OrganizationActions.organizationsFollowedRetrieve();

    // We want to make sure we have all of the position information so that comments show up
    const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(this.props.params.candidate_we_vote_id);

    if (voterGuidesForThisBallotItem) {
      voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
        // console.log('oneVoterGuide: ', oneVoterGuide);
        OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
      });
    }

    // getAllCachedPositionsByCandidateWeVoteId returns a dict with organization_we_vote_id as the key
    // We convert to a simple list
    const allCachedPositionsForThisCandidateDict = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(this.props.params.candidate_we_vote_id);
    const allCachedPositionsForThisCandidate = Object.values(allCachedPositionsForThisCandidateDict);

    // Display the candidate's name in the search box
    const searchBoxText = this.state.candidate.ballot_item_display_name || ''; // TODO DALE Not working right now
    SearchAllActions.exitSearch(searchBoxText); // TODO: still not used :)
    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), this.props.params.candidate_we_vote_id);
    this.setState({
      candidateWeVoteId: this.props.params.candidate_we_vote_id,
      organizationWeVoteId,
      allCachedPositionsForThisCandidate,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('Candidate componentWillReceiveProps');
    // When a new candidate is passed in, update this component to show the new data
    if (nextProps.params.candidate_we_vote_id !== this.state.candidateWeVoteId) {
      CandidateActions.candidateRetrieve(nextProps.params.candidate_we_vote_id);
      CandidateActions.positionListForBallotItemPublic(nextProps.params.candidate_we_vote_id);
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextProps.params.candidate_we_vote_id, 'CANDIDATE');

      // getAllCachedPositionsByCandidateWeVoteId returns a dict with organization_we_vote_id as the key
      // We convert to a simple list
      const allCachedPositionsForThisCandidateDict = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(nextProps.params.candidate_we_vote_id);
      const allCachedPositionsForThisCandidate = Object.values(allCachedPositionsForThisCandidateDict);
      this.setState({
        candidateWeVoteId: nextProps.params.candidate_we_vote_id,
        allCachedPositionsForThisCandidate,
      });
    }

    // Display the candidate's name in the search box
    // var { candidate } = this.state;
    // var searchBoxText = candidate.ballot_item_display_name || '';  // TODO DALE Not working right now
    SearchAllActions.exitSearch('');
  }

  componentWillUnmount () {
    // console.log('Candidate componentWillUnmount');
    this.candidateStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.appStoreListener.remove();
  }

  onCandidateStoreChange () {
    // console.log('Candidate onCandidateStoreChange');
    const allCachedPositionsForThisCandidateDict = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(this.state.candidateWeVoteId);
    const allCachedPositionsForThisCandidate = Object.values(allCachedPositionsForThisCandidateDict);
    const { candidateWeVoteId } = this.state;
    this.setState({
      candidate: CandidateStore.getCandidate(candidateWeVoteId),
      allCachedPositionsForThisCandidate,
    });
  }

  onVoterGuideStoreChange () {
    // console.log('Candidate onVoterGuideStoreChange');
    // Trigger an update of the candidate so we can get an updated position_list
    //  CandidateActions.candidateRetrieve(this.state.candidateWeVoteId);
    CandidateActions.positionListForBallotItemPublic(this.state.candidateWeVoteId);

    // Also update the position count for *just* this candidate, since it might not come back with positionsCountForAllBallotItems
    SupportActions.retrievePositionsCountsForOneBallotItem(this.state.candidateWeVoteId);
  }

  onAppStoreChange () {
    this.setState({
      scrolledDown: AppStore.getScrolledDown(),
    });
  }

  render () {
    renderLog(__filename);
    const { scrolledDown } = this.state;
    // const electionId = VoterStore.electionId();
    // const NO_VOTER_GUIDES_TEXT = 'We could not find any more voter guides to follow related to this candidate.';

    // console.log('Candidate render, this.state.allCachedPositionsForThisCandidate: ', this.state.allCachedPositionsForThisCandidate);

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
        {
          scrolledDown && (
            <CandidateStickyHeader candidate={this.state.candidate} />
          )
        }
        <section className="card">
          <CandidateItem
            {...this.state.candidate}
            contest_office_name={this.state.candidate.contest_office_name}
            hideShowMoreFooter
            organizationWeVoteId={this.state.organizationWeVoteId}
            linkToOfficePage
            showLargeImage
            showOfficeName
            showPositionStatementActionBar
          />
          <div className="card__additional">
            {/* this.state.positionListFromAdvisersFollowedByVoter */}
            { this.state.allCachedPositionsForThisCandidate.length ? (
              <div>
                <PositionList
                  incomingPositionList={this.state.allCachedPositionsForThisCandidate}
                  ballotItemDisplayName={this.state.candidate.ballot_item_display_name}
                />
              </div>
            ) : null
            }
            {/* Formerly voterGuidesToFollowForThisBallotItem */}
            {/* this.state.voterGuidesForThisBallotItem.length === 0 ?
              <div className="card__additional-text">{NO_VOTER_GUIDES_TEXT}</div> : (
                <div>
                  <h3 className="card__additional-heading">{`Opinions about ${this.state.candidate.ballot_item_display_name}`}</h3>
                  <GuideList
                    id={electionId}
                    ballotItemWeVoteId={this.state.candidateWeVoteId}
                    incomingVoterGuideList={this.state.voterGuidesForThisBallotItem}
                  />
                </div>
              )
            */}
          </div>
        </section>
        <EndorsementCard
          bsPrefix="u-margin-top--sm u-stack--xs"
          variant="primary"
          buttonText="Endorsements Missing?"
          text={`Are there endorsements for
          ${candidateName}
          that you expected to see?`}
        />
        {/* <div className="opinions-followed__missing-org-text">
          Are there endorsements for
          {' '}
          {candidateName}
          {' '}
          that you expected to see?
        </div> */}
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
