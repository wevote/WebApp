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
import { renderLog } from '../../common/utils/logging';
import OrganizationVoterGuideCandidateItem from '../../components/VoterGuide/OrganizationVoterGuideCandidateItem';
import EndorsementCard from '../../components/Widgets/EndorsementCard';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';
import webAppConfig from '../../config';
import CandidateStore from '../../stores/CandidateStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import toTitleCase from '../../common/utils/toTitleCase';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const PositionList = React.lazy(() => import(/* webpackChunkName: 'PositionList' */ '../../components/Ballot/PositionList'));


// This is based on pages/Ballot/Candidate - TO BE DEPRECATED?
// TODO: Not called anywhere Dec 2020, delete when Dale agrees
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
      <span>
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <section className="card">
          <OrganizationVoterGuideCandidateItem
            {...candidate}
            contest_office_name={candidate.contest_office_name}
            linkToOfficePage
            organization_we_vote_id={organizationWeVoteId}
            showLargeImage
            showPositionStatementActionBar
          />
          <div className="card__additional">
            { allCachedPositionsForThisCandidate ? (
              <div>
                <Suspense fallback={<></>}>
                  <PositionList
                    incomingPositionList={allCachedPositionsForThisCandidate}
                    ballotItemDisplayName={candidate.ballot_item_display_name}
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
        <EndorsementCard
          bsPrefix="u-margin-top--sm u-stack--xs"
          variant="primary"
          buttonText="Endorsements missing?"
          text={`Are there endorsements for
          ${candidateName}
          that you expected to see?`}
        />
        <br />
        <ThisIsMeAction
          bsPrefix="u-margin-top--sm u-stack--xs"
          twitterHandleBeingViewed={candidate.twitter_handle}
          nameBeingViewed={candidate.ballot_item_display_name}
          kindOfOwner="POLITICIAN"
        />
        <br />
        {/* Show links to this candidate in the admin tools */}
        { voter.is_admin || voter.is_verified_volunteer ? (
          <span className="u-wrap-links d-print-none">
            Admin:
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="candidateAdminEdit"
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
            </Suspense>
          </span>
        ) : null}
      </span>
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

const PositionListIntroductionText = styled('div')`
  color: #999;
`;

export default withStyles(styles)(OrganizationVoterGuideCandidate);
