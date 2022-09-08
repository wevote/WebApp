import { Info } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CandidateActions from '../../actions/CandidateActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import historyPush from '../../common/utils/historyPush';
import { displayNoneIfSmallerThanDesktop } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';
import OrganizationVoterGuideCandidateItem from '../../components/VoterGuide/OrganizationVoterGuideCandidateItem';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import EndorsementCard from '../../components/Widgets/EndorsementCard';
import SnackNotifier from '../../components/Widgets/SnackNotifier';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';
import webAppConfig from '../../config';
import AppObservableStore from '../../stores/AppObservableStore';
import CandidateStore from '../../stores/CandidateStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const PositionList = React.lazy(() => import(/* webpackChunkName: 'PositionList' */ '../../components/Ballot/PositionList'));
const ViewUpcomingBallotButton = React.lazy(() => import(/* webpackChunkName: 'ViewUpcomingBallotButton' */ '../../components/Ready/ViewUpcomingBallotButton'));


// This is based on pages/Ballot/Candidate
// 2022-June-7: This is called from pages like this: https://localhost:3000/candidate/wv02cand30726/bto/wv02org14
//   This needs to be refactored with the new designs, but is picking up a lot of traffic from Google, so we need to keep supporting.
class OrganizationVoterGuideCandidate extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisCandidate: [],
      candidate: {},
      candidateWeVoteId: '',
      // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidateWeVoteId, but we can't now
      //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
      // guidesToFollowList: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(params.candidate_we_vote_id)
      voterGuidesToFollowForLatestBallotItem: [],
      organizationWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('Candidate componentDidMount');
    window.scrollTo(0, 0);
    const { match: { params } } = this.props;
    const { candidate_we_vote_id: candidateWeVoteId, organization_we_vote_id: organizationWeVoteId } = params;
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    CandidateActions.candidateRetrieve(candidateWeVoteId);
    CandidateActions.positionListForBallotItemPublic(candidateWeVoteId);
    CandidateActions.positionListForBallotItemFromFriends(candidateWeVoteId);

    // Get the latest guides to follow for this candidate
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidateWeVoteId, 'CANDIDATE');

    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }

    AnalyticsActions.saveActionCandidate(VoterStore.electionId(), candidateWeVoteId);
    this.setState({
      allCachedPositionsForThisCandidate: CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId),
      candidateWeVoteId,
      organizationWeVoteId,
      voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
    // console.log('OrganizationVoterGuideCandidate, organizationWeVoteId: ', organizationWeVoteId);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('Candidate componentWillReceiveProps');
    const { candidateWeVoteId: priorCandidateWeVoteId } = this.state;
    const { match: { params: nextParams } } = nextProps;
    const { candidate_we_vote_id: candidateWeVoteId } = nextParams;
    // When a new candidate is passed in, update this component to show the new data
    if (candidateWeVoteId !== priorCandidateWeVoteId) {
      CandidateActions.candidateRetrieve(candidateWeVoteId);
      CandidateActions.positionListForBallotItemPublic(candidateWeVoteId);
      CandidateActions.positionListForBallotItemFromFriends(candidateWeVoteId);
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(candidateWeVoteId, 'CANDIDATE');
      this.setState({
        allCachedPositionsForThisCandidate: CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId),
        candidateWeVoteId,
        voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
      });
    }
  }

  componentWillUnmount () {
    // console.log('Candidate componentWillUnmount');
    this.candidateStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onCandidateStoreChange () {
    // console.log('Candidate onCandidateStoreChange');
    const { candidateWeVoteId } = this.state;
    this.setState({
      allCachedPositionsForThisCandidate: CandidateStore.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId),
      candidate: CandidateStore.getCandidate(candidateWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    // console.log('Candidate onVoterGuideStoreChange');
    const { candidateWeVoteId } = this.state;
    // When the voterGuidesToFollowForLatestBallotItem changes, trigger an update of the candidate so we can get an updated position_list
    // CandidateActions.candidateRetrieve(candidateWeVoteId);
    CandidateActions.positionListForBallotItemPublic(candidateWeVoteId);
    CandidateActions.positionListForBallotItemFromFriends(candidateWeVoteId);
    // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidateWeVoteId, but we can't now
    //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
    this.setState({
      voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
      // voter_guides_to_follow_for_this_ballot_item: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(candidateWeVoteId),
    });
  }

  goToBallot = () => {
    historyPush('/ballot');
  }

  openHowItWorksModal = () => {
    // console.log('Opening modal');
    AppObservableStore.setShowHowItWorksModal(true);
  }

  render () {
    renderLog('OrganizationVoterGuideCandidate');  // Set LOG_RENDER_EVENTS to log all renders
    const NO_VOTER_GUIDES_TEXT = 'We could not find any more voter guides to follow related to this candidate.';
    const { classes, match: { params } } = this.props;
    const { allCachedPositionsForThisCandidate, candidate, organizationWeVoteId } = this.state;
    if (!candidate || !candidate.ballot_item_display_name) {
      // TODO DALE If the candidate we_vote_id is not valid, we need to update this with a notice
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <div>{LoadingWheel}</div>
          <br />
        </div>
      );
    }

    const candidateName = toTitleCase(candidate.ballot_item_display_name);
    const titleText = `${candidateName} - We Vote`;
    const descriptionText = `Information about ${candidateName}, candidate for ${candidate.contest_office_name}`;
    const voter = VoterStore.getVoter();
    const candidateAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}c/${candidate.id}/edit/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;

    return (
      <PageContentContainer>
        <SnackNotifier />
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <section className="card">
          <OrganizationVoterGuideCandidateItem
            ballotItemDisplayName={candidate.ballot_item_display_name}
            candidatePhotoUrlLarge={candidate.candidate_photo_url_large}
            candidatePhotoUrlMedium={candidate.candidate_photo_url_medium}
            contestOfficeName={candidate.contest_office_name}
            key={candidate.we_vote_id}
            linkToBallotItemPage
            linkToOfficePage
            organizationWeVoteId={organizationWeVoteId}
            party={candidate.party}
            showLargeImage
            twitterDescription={candidate.twitter_description}
            twitterFollowersCount={candidate.twitter_followers_count}
            weVoteId={candidate.we_vote_id}
          />
          <div className="card__additional">
            { allCachedPositionsForThisCandidate ? (
              <div>
                <Suspense fallback={<></>}>
                  <PositionList
                    ballotItemDisplayName={candidate.ballot_item_display_name}
                    incomingPositionList={allCachedPositionsForThisCandidate}
                    params={params}
                    positionListExistsTitle={(
                      <PositionListIntroductionText>
                        <Info classes={{ root: classes.informationIcon }} />
                        Opinions about this candidate are below. Use these filters to sort:
                      </PositionListIntroductionText>
                    )}
                  />
                </Suspense>
              </div>
            ) : null}
            {this.state.voterGuidesToFollowForLatestBallotItem.length === 0 ?
              <div className="card__additional-text">{NO_VOTER_GUIDES_TEXT}</div> : (
                <div>
                  {/* <h3 className="card__additional-heading">{`More opinions about ${candidate.ballot_item_display_name}`}</h3> */}
                  {/* <GuideList */}
                  {/*  id={electionId} */}
                  {/*  ballotItemWeVoteId={candidateWeVoteId} */}
                  {/*  incomingVoterGuideList={this.state.voterGuidesToFollowForLatestBallotItem} */}
                  {/* /> */}
                </div>
              )}
          </div>
        </section>
        {(allCachedPositionsForThisCandidate.length < 3) && (
          <PromoteFurtherAction>
            <Suspense fallback={<></>}>
              <ViewUpcomingBallotButton onClickFunction={this.goToBallot} />
            </Suspense>
            <HowItWorksLink onClick={this.openHowItWorksModal}>
              How It Works
            </HowItWorksLink>
          </PromoteFurtherAction>
        )}
        <EndorsementCardWrapper>
          <EndorsementCard
            bsPrefix="u-margin-top--sm u-stack--xs"
            variant="primary"
            buttonText="Endorsements missing?"
            text={`Are there endorsements for ${candidateName} that you expected to see?`}
          />
          <ThisIsMeAction
            kindOfOwner="POLITICIAN"
            nameBeingViewed={candidate.ballot_item_display_name}
            twitterHandleBeingViewed={candidate.twitter_handle}
          />
        </EndorsementCardWrapper>
        <br />
        {/* Show links to this candidate in the admin tools */}
        { (voter.is_admin || voter.is_verified_volunteer) && (
          <span className="u-wrap-links d-print-none">
            Admin only:
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="candidateAdminEdit"
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
            </Suspense>
          </span>
        )}
      </PageContentContainer>
    );
  }
}
OrganizationVoterGuideCandidate.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object.isRequired,
};

const styles = () => ({
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
});

const HowItWorksLink = styled('div')`
  color: #065FD4;
  cursor: pointer;
  margin-top: 48px;
  &:hover {
    color: #4371cc;
  }
`;

const PositionListIntroductionText = styled('div')`
  color: #999;
`;

const PromoteFurtherAction = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 48px;
  margin-top: 48px;
`;

const EndorsementCardWrapper = styled('div')`
  ${() => displayNoneIfSmallerThanDesktop()};
`;

export default withStyles(styles)(OrganizationVoterGuideCandidate);
