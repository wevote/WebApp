import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppStore from '../../stores/AppStore';
import BallotStore from '../../stores/BallotStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateItem from '../../components/Ballot/CandidateItem';
import CandidateStickyHeader from '../../components/Ballot/CandidateStickyHeader';
import CandidateStore from '../../stores/CandidateStore';
import { capitalizeString } from '../../utils/textFormat';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import EndorsementCard from '../../components/Widgets/EndorsementCard';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import PositionList from '../../components/Ballot/PositionList';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';
// import VoterGuideActions from '../../actions/VoterGuideActions';


// The component /routes/VoterGuide/OrganizationVoterGuideCandidate is based on this component
export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisCandidate: [],
      allCachedPositionsForThisCandidateLength: 0,
      candidate: {},
      candidateWeVoteId: '',
      organizationWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      scrolledDown: false,
    };
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const { candidate_we_vote_id: candidateWeVoteId, organization_we_vote_id: organizationWeVoteId } = this.props.params;
    // console.log('candidateWeVoteId:', candidateWeVoteId);
    if (candidateWeVoteId) {
      const candidate = CandidateStore.getCandidate(candidateWeVoteId);
      const { ballot_item_display_name: ballotItemDisplayName, contest_office_we_vote_id: officeWeVoteId } = candidate;
      // console.log('candidate:', candidate);
      this.setState({
        ballotItemDisplayName,
        candidate,
      });
      CandidateActions.candidateRetrieve(candidateWeVoteId);
      if (candidateWeVoteId &&
        !this.localPositionListHasBeenRetrievedOnce(candidateWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(candidateWeVoteId) &&
        !BallotStore.positionListHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        CandidateActions.positionListForBallotItemPublic(candidateWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[candidateWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (candidateWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(candidateWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(candidateWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(officeWeVoteId)
      ) {
        CandidateActions.positionListForBallotItemFromFriends(candidateWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[candidateWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
    }

    if (IssueStore.getPreviousGoogleCivicElectionId() < 1) {
      IssueActions.issuesRetrieveForElection(VoterStore.electionId());
    }

    // Get the latest guides to follow for this candidate

    // June 2018: Avoid hitting this same api multiple times, if we already have the data
    // const voterGuidesForId = VoterGuideStore.getVoterGuideForOrganizationId(organizationWeVoteId);
    // // console.log('voterGuidesForId:', voterGuidesForId);
    // if (voterGuidesForId && Object.keys(voterGuidesForId).length > 0) {
    //   // Do not request them again
    // } else {
    //   VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidateWeVoteId, 'CANDIDATE');
    // }

    OrganizationActions.organizationsFollowedRetrieve();

    // We want to make sure we have all of the position information so that comments show up
    const voterGuidesForThisBallotItem = VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidateWeVoteId);

    if (voterGuidesForThisBallotItem) {
      voterGuidesForThisBallotItem.forEach((oneVoterGuide) => {
        // console.log('oneVoterGuide: ', oneVoterGuide);
        if (!OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(oneVoterGuide.google_civic_election_id, oneVoterGuide.organization_we_vote_id)) {
          OrganizationActions.positionListForOpinionMaker(oneVoterGuide.organization_we_vote_id, false, true, oneVoterGuide.google_civic_election_id);
        }
      });
    }

    const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), candidateWeVoteId);
    this.setState({
      allCachedPositionsForThisCandidate,
      candidateWeVoteId,
      organizationWeVoteId,
      scrolledDown: AppStore.getScrolledDown(),
    });
  }

  componentWillReceiveProps (nextProps) {
    // DALE 2019-12-30 I suspect this isn't used. Commented out now, but we can delete as soon as 100% sure.
    // console.log('Candidate componentWillReceiveProps');
    // When a new candidate is passed in, update this component to show the new data
    if (nextProps.params.candidate_we_vote_id !== this.state.candidateWeVoteId) {
      console.log('Candidate componentWillReceiveProps candidate_we_vote_id CHANGED');
      // const { candidate_we_vote_id: candidateWeVoteId } = nextProps.params;
      // CandidateActions.candidateRetrieve(candidateWeVoteId);
      // if (candidateWeVoteId &&
      //   !this.localPositionListHasBeenRetrievedOnce(candidateWeVoteId) &&
      //   !BallotStore.positionListHasBeenRetrievedOnce(candidateWeVoteId)
      // ) {
      //   CandidateActions.positionListForBallotItemPublic(candidateWeVoteId);
      //   const { positionListHasBeenRetrievedOnce } = this.state;
      //   positionListHasBeenRetrievedOnce[candidateWeVoteId] = true;
      //   this.setState({
      //     positionListHasBeenRetrievedOnce,
      //   });
      // }
      // // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidateWeVoteId, 'CANDIDATE');
      //
      // // getAllCachedPositionsByCandidateWeVoteId returns a dict with organization_we_vote_id as the key
      // // We convert to a simple list..
      // const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
      // let allCachedPositionsForThisCandidateLength = 0;
      // if (allCachedPositionsForThisCandidate) {
      //   allCachedPositionsForThisCandidateLength = allCachedPositionsForThisCandidate.length;
      // }
      // this.setState({
      //   candidateWeVoteId,
      //   allCachedPositionsForThisCandidate,
      //   allCachedPositionsForThisCandidateLength,
      // });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.allCachedPositionsForThisCandidateLength !== nextState.allCachedPositionsForThisCandidateLength) {
      // console.log('this.state.allCachedPositionsForThisCandidateLength:', this.state.allCachedPositionsForThisCandidateLength, ', nextState.allCachedPositionsForThisCandidateLength:', nextState.allCachedPositionsForThisCandidateLength);
      return true;
    }
    if (this.state.ballotItemDisplayName !== nextState.ballotItemDisplayName) {
      // console.log('this.state.ballotItemDisplayName:', this.state.ballotItemDisplayName, ', nextState.ballotItemDisplayName:', nextState.ballotItemDisplayName);
      return true;
    }
    if (this.state.candidateWeVoteId !== nextState.candidateWeVoteId) {
      // console.log('this.state.candidateWeVoteId:', this.state.candidateWeVoteId, ', nextState.candidateWeVoteId:', nextState.candidateWeVoteId);
      return true;
    }
    if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
      // console.log('this.state.organizationWeVoteId:', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId:', nextState.organizationWeVoteId);
      return true;
    }
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      // console.log('this.state.scrolledDown:', this.state.scrolledDown, ', nextState.scrolledDown:', nextState.scrolledDown);
      return true;
    }
    // console.log('Candidate shouldComponentUpdate FALSE');
    return false;
  }

  componentWillUnmount () {
    // console.log('Candidate componentWillUnmount');
    this.candidateStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    this.setState({
      scrolledDown: AppStore.getScrolledDown(),
    });
  }

  onCandidateStoreChange () {
    const { candidateWeVoteId } = this.state;
    // console.log('Candidate onCandidateStoreChange, candidateWeVoteId:', candidateWeVoteId);
    const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
    // console.log('allCachedPositionsForThisCandidate:', allCachedPositionsForThisCandidate);
    let allCachedPositionsForThisCandidateLength = 0;
    if (allCachedPositionsForThisCandidate) {
      allCachedPositionsForThisCandidateLength = allCachedPositionsForThisCandidate.length;
    }
    const candidate = CandidateStore.getCandidate(candidateWeVoteId);
    const ballotItemDisplayName = candidate.ballot_item_display_name;
    this.setState({
      ballotItemDisplayName,
      candidate,
      allCachedPositionsForThisCandidate,
      allCachedPositionsForThisCandidateLength,
    });
  }

  onVoterGuideStoreChange () {
    // console.log('Candidate onVoterGuideStoreChange');
    // Trigger an update of the candidate so we can get an updated position_list
    // CandidateActions.candidateRetrieve(this.state.candidateWeVoteId);
    // CandidateActions.positionListForBallotItemPublic(this.state.candidateWeVoteId);
  }

  localPositionListHasBeenRetrievedOnce (candidateWeVoteId) {
    if (candidateWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[candidateWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (candidateWeVoteId) {
    if (candidateWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[candidateWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('Candidate');  // Set LOG_RENDER_EVENTS to log all renders
    const { allCachedPositionsForThisCandidate, candidate, organizationWeVoteId, scrolledDown } = this.state;

    if (!candidate || !candidate.ballot_item_display_name) {
      // console.log('No candidate or candidate.ballot_item_display_name, candidate:', candidate);
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <div>{LoadingWheel}</div>
          <br />
        </div>
      );
    }
    // console.log('Candidate render');

    const candidateName = capitalizeString(candidate.ballot_item_display_name);
    const titleText = `${candidateName} - We Vote`;
    const descriptionText = `Information about ${candidateName}, candidate for ${candidate.contest_office_name}`;
    const voter = VoterStore.getVoter();
    const candidateAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}c/${candidate.id}/edit/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;

    return (
      <span>
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        {
          scrolledDown && (
            <CandidateStickyHeader candidate={candidate} />
          )
        }
        <section className="card">
          <CandidateItem
            candidateWeVoteId={candidate.we_vote_id}
            hideShowMoreFooter
            organizationWeVoteId={organizationWeVoteId}
            linkToOfficePage
            showLargeImage
            showOfficeName
            showPositionStatementActionBar
          />
        </section>
        { !!(allCachedPositionsForThisCandidate.length) && (
          <section className="card">
            <DelayedLoad showLoadingText waitBeforeShow={500}>
              <PositionList
                incomingPositionList={allCachedPositionsForThisCandidate}
                ballotItemDisplayName={candidate.ballot_item_display_name}
                params={this.props.params}
              />
            </DelayedLoad>
          </section>
        )}
        <EndorsementCard
          bsPrefix="u-margin-top--sm u-stack--xs"
          variant="primary"
          buttonText="ENDORSEMENTS MISSING?"
          text={`Are there endorsements for
          ${candidateName}
          that you expected to see?`}
        />
        <ThisIsMeAction
          twitterHandleBeingViewed={candidate.twitter_handle}
          nameBeingViewed={candidate.ballot_item_display_name}
          kindOfOwner="POLITICIAN"
        />
        <br />
        {/* Show links to this candidate in the admin tools */}
        { (voter.is_admin || voter.is_verified_volunteer) && (
          <span className="u-wrap-links d-print-none">
            Admin only:
            <OpenExternalWebSite
              url={candidateAdminEditUrl}
              target="_blank"
              className="open-web-site open-web-site__no-right-padding"
              body={(
                <span>
                  edit
                  {' '}
                  {candidateName}
                </span>
              )}
            />
          </span>
        )}
      </span>
    );
  }
}
