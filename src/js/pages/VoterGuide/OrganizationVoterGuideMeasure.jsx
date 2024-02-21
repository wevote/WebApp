import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import MeasureActions from '../../actions/MeasureActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';
import webAppConfig from '../../config';
import MeasureStore from '../../stores/MeasureStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

const MeasureItem = React.lazy(() => import(/* webpackChunkName: 'MeasureItem' */ '../../components/Ballot/MeasureItem'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const PositionList = React.lazy(() => import(/* webpackChunkName: 'PositionList' */ '../../components/Ballot/PositionList'));

// This is based on pages/Ballot/Measure - TO BE DEPRECATED?
export default class OrganizationVoterGuideMeasure extends Component {
  constructor (props) {
    super(props);
    this.state = {
      measure: {},
      measureWeVoteId: '',
      allCachedPositionsByMeasureWeVoteId: [],
      // Eventually we could use this getVoterGuidesToFollowForBallotItemId with measureWeVoteId, but we can't now
      //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
      // guides_to_follow_list: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(params.measure_we_vote_id)
      voterGuidesToFollowForLatestBallotItem: [],
    };
  }

  componentDidMount () {
    const { match: { params } } = this.props;
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    MeasureActions.measureRetrieve(params.measure_we_vote_id);
    MeasureActions.positionListForBallotItemPublic(params.measure_we_vote_id);
    MeasureActions.positionListForBallotItemFromFriends(params.measure_we_vote_id);

    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(params.measure_we_vote_id, 'MEASURE');

    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }

    // TODO CREATE THIS
    // AnalyticsActions.saveActionMeasure(VoterStore.electionId(), params.measure_we_vote_id);
    this.setState({
      measureWeVoteId: params.measure_we_vote_id,
      allCachedPositionsByMeasureWeVoteId: MeasureStore.getAllCachedPositionsByMeasureWeVoteId(params.measure_we_vote_id),
      voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
    // eslint-disable camelcase,react/sort-comp,react/prop-types
    // When a new measure is passed in, update this component to show the new data
    const { match: { params: nextParams } } = nextProps;
    if (nextParams.measure_we_vote_id !== this.state.measureWeVoteId) {
      MeasureActions.measureRetrieve(nextParams.measure_we_vote_id);
      MeasureActions.positionListForBallotItemPublic(nextParams.measure_we_vote_id);
      MeasureActions.positionListForBallotItemFromFriends(nextParams.measure_we_vote_id);
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextParams.measure_we_vote_id, 'MEASURE');
      this.setState({
        measureWeVoteId: nextParams.measure_we_vote_id,
        allCachedPositionsByMeasureWeVoteId: MeasureStore.getAllCachedPositionsByMeasureWeVoteId(nextParams.measure_we_vote_id),
        voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
      });
    }
  }
  // eslint-enable camelcase,react/sort-comp,react/prop-types

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    // console.log("Measure, onMeasureStoreChange");
    this.setState({
      measure: MeasureStore.getMeasure(measureWeVoteId),
      allCachedPositionsByMeasureWeVoteId: MeasureStore.getAllCachedPositionsByMeasureWeVoteId(measureWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    const { measureWeVoteId } = this.state;
    // MeasureActions.measureRetrieve(measureWeVoteId);
    MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
    MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
    // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidate_we_vote_id, but we can't now
    //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
    this.setState({
      voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
  }

  render () {
    renderLog('OrganizationVoterGuideMeasure');  // Set LOG_RENDER_EVENTS to log all renders

    const NO_VOTER_GUIDES_TEXT = 'We could not find any more voter guides to follow related to this measure.';

    if (!this.state.measure || !this.state.measure.ballot_item_display_name) {
      // TODO DALE If the measureWeVoteId is not valid, we need to update this with a notice
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <div>{LoadingWheel}</div>
          <br />
        </div>
      );
    }

    const measureName = toTitleCase(this.state.measure.ballot_item_display_name);
    const titleText = `${measureName} - WeVote`;
    const descriptionText = `Information about ${measureName}`;
    const voter = VoterStore.getVoter();
    const measureAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}m/${this.state.measure.id}/edit/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;
    const { match: { params }  } = this.props;

    return (
      <section className="card">
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <Suspense fallback={<></>}>
          <MeasureItem measureWeVoteId={this.state.measure.we_vote_id} />
        </Suspense>
        <div className="card__additional">
          { this.state.allCachedPositionsByMeasureWeVoteId ? (
            <div>
              <Suspense fallback={<></>}>
                <PositionList
                  incomingPositionList={this.state.allCachedPositionsByMeasureWeVoteId}
                  ballotItemDisplayName={this.state.measure.ballot_item_display_name}
                  params={params}
                />
              </Suspense>
            </div>
          ) : null}
          {this.state.voterGuidesToFollowForLatestBallotItem.length === 0 ?
            <div className="card__additional-text">{NO_VOTER_GUIDES_TEXT}</div> : (
              <div>
                {/* <h3 className="card__additional-heading">{`More opinions about ${this.state.measure.ballot_item_display_name}`}</h3> */}
                {/* <GuideList */}
                {/*  id={electionId} */}
                {/*  ballotItemWeVoteId={this.state.measureWeVoteId} */}
                {/*  incomingVoterGuideList={this.state.voterGuidesToFollowForLatestBallotItem} */}
                {/* /> */}
              </div>
            )}
        </div>
        {/* Show links to this candidate in the admin tools */}
        { voter.is_admin || voter.is_verified_volunteer ? (
          <span className="u-wrap-links d-print-none">
            Admin:
            <Suspense fallback={<></>}>
              <OpenExternalWebSite
                linkIdAttribute="measureAdminEdit"
                url={measureAdminEditUrl}
                target="_blank"
                className="open-web-site open-web-site__no-right-padding"
                body={(
                  <span>
                    edit
                    {measureName}
                  </span>
                )}
              />
            </Suspense>
          </span>
        ) : null}
      </section>
    );
  }
}
OrganizationVoterGuideMeasure.propTypes = {
  match: PropTypes.object.isRequired,
};
