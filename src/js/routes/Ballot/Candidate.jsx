import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import BallotStore from '../../stores/BallotStore';
import CandidateActions from '../../actions/CandidateActions';
import CandidateItem from '../../components/Ballot/CandidateItem';
import ShareButtonDesktopTablet from '../../components/Share/ShareButtonDesktopTablet';
import CandidateStickyHeader from '../../components/Ballot/CandidateStickyHeader';
import CandidateStore from '../../stores/CandidateStore';
import { capitalizeString, convertToInteger } from '../../utils/textFormat';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import EndorsementCard from '../../components/Widgets/EndorsementCard';
import IssueActions from '../../actions/IssueActions';
import IssueStore from '../../stores/IssueStore';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import PositionList from '../../components/Ballot/PositionList';
import SearchOnGoogle from '../../components/Widgets/SearchOnGoogle';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';
import ViewOnBallotpedia from '../../components/Widgets/ViewOnBallotpedia';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';

// const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

// The component /routes/VoterGuide/OrganizationVoterGuideCandidate is based on this component
class Candidate extends Component {
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
      voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce: {},
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

    const allCachedPositionsForThisCandidate = CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId);
    if (!IssueStore.issueDescriptionsRetrieveCalled()) {
      IssueActions.issueDescriptionsRetrieve();
      // IssueActions.issueDescriptionsRetrieveCalled(); // TODO: Move this to AppActions? Currently throws error: 'Cannot dispatch in the middle of a dispatch'
    }
    IssueActions.issuesFollowedRetrieve();
    if (VoterStore.electionId() && !IssueStore.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId())) {
      IssueActions.issuesUnderBallotItemsRetrieve(VoterStore.electionId());
      // IssueActions.issuesUnderBallotItemsRetrieveCalled(VoterStore.electionId()); // TODO: Move this to AppActions? Currently throws error: 'Cannot dispatch in the middle of a dispatch'
    }
    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), candidateWeVoteId);
    this.setState({
      allCachedPositionsForThisCandidate,
      candidateWeVoteId,
      organizationWeVoteId,
      scrolledDown: AppStore.getScrolledDown(),
    });
    const modalToOpen = this.props.params.modal_to_show || '';
    if (modalToOpen === 'share') {
      AppActions.setShowShareModal(true);
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log('Candidate componentWillReceiveProps');
    const modalToOpen = nextProps.params.modal_to_show || '';
    if (modalToOpen === 'share') {
      AppActions.setShowShareModal(true);
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
    const { ballot_item_display_name: ballotItemDisplayName, google_civic_election_id: googleCivicElectionId } = candidate;
    if (googleCivicElectionId &&
      !VoterGuideStore.voterGuidesUpcomingFromFriendsStopped(googleCivicElectionId) &&
      !this.localVoterGuidesFromFriendsUpcomingHasBeenRetrievedOnce(googleCivicElectionId)
    ) {
      VoterGuideActions.voterGuidesFromFriendsUpcomingRetrieve(googleCivicElectionId);
      const { voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce } = this.state;
      const googleCivicElectionIdInteger = convertToInteger(googleCivicElectionId);
      voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce[googleCivicElectionIdInteger] = true;
      this.setState({
        voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce,
      });
    }
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

  localVoterGuidesFromFriendsUpcomingHasBeenRetrievedOnce (googleCivicElectionId) {
    const googleCivicElectionIdInteger = convertToInteger(googleCivicElectionId);
    if (googleCivicElectionIdInteger) {
      const { voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce } = this.state;
      return voterGuidesFromFriendsUpcomingHasBeenRetrievedOnce[googleCivicElectionIdInteger];
    }
    return false;
  }

  render () {
    renderLog('Candidate');  // Set LOG_RENDER_EVENTS to log all renders
    const { allCachedPositionsForThisCandidate, candidate, organizationWeVoteId, scrolledDown } = this.state;
    // console.log('candidate: ', candidate);
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

    // TODO When we remove expandIssuesByDefault from CandidateItem, the page is pushed very wide. This needs to be fixed.
    //   This started happening when we implemented the flex-based "TwoColumns"
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
        <div className="card">
          <TwoColumns>
            <LeftColumnWrapper>
              <CandidateItem
                candidateWeVoteId={candidate.we_vote_id}
                hideShowMoreFooter
                organizationWeVoteId={organizationWeVoteId}
                linkToOfficePage
                showLargeImage
                showOfficeName
                showPositionStatementActionBar
              />
            </LeftColumnWrapper>
            <RightColumnWrapper className="u-show-desktop-tablet">
              <CandidateShareWrapper>
                <ShareButtonDesktopTablet candidateShare />
              </CandidateShareWrapper>
              {candidate.ballotpedia_candidate_url && (
                <ViewOnBallotpedia externalLinkUrl={candidate.ballotpedia_candidate_url} />
              )}
              {candidate.contest_office_name && (
                <SearchOnGoogle googleQuery={`${candidateName} ${candidate.contest_office_name}`} />
              )}
            </RightColumnWrapper>
          </TwoColumns>
        </div>
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

const CandidateShareWrapper = styled.div`
  margin-bottom: 12px;
  padding-left: 2px;
`;

const LeftColumnWrapper = styled.div`
  flex: 1 1 0;
`;

const RightColumnWrapper = styled.div`
  padding: 16px 16px 16px 0;
  width: fit-content;
`;

const TwoColumns = styled.div`
  display: flex;
  margin: 0 -8px 0 -8px;
`;

export default Candidate;
