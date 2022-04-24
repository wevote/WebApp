import { Info } from '@mui/icons-material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import MeasureActions from '../../actions/MeasureActions';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheelComp from '../../common/components/Widgets/LoadingWheelComp';
import apiCalming from '../../common/utils/apiCalming';
import { isAndroidSizeFold } from '../../common/utils/cordovaUtils';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import toTitleCase from '../../common/utils/toTitleCase';
import MeasureStickyHeader from '../../components/Ballot/MeasureStickyHeader';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import EndorsementCard from '../../components/Widgets/EndorsementCard';
import SearchOnGoogle from '../../components/Widgets/SearchOnGoogle';
import SnackNotifier from '../../components/Widgets/SnackNotifier';
import ViewOnBallotpedia from '../../components/Widgets/ViewOnBallotpedia';
import webAppConfig from '../../config';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import MeasureStore from '../../stores/MeasureStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaBallotFilterTopMargin } from '../../utils/cordovaOffsets';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const MeasureItem = React.lazy(() => import(/* webpackChunkName: 'MeasureItem' */ '../../components/Ballot/MeasureItem'));
const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));
const PositionList = React.lazy(() => import(/* webpackChunkName: 'PositionList' */ '../../components/Ballot/PositionList'));
const ShareButtonDesktopTablet = React.lazy(() => import(/* webpackChunkName: 'ShareButtonDesktopTablet' */ '../../components/Share/ShareButtonDesktopTablet'));

// The component /pages/VoterGuide/OrganizationVoterGuideMeasure is based on this component
class Measure extends Component {
  constructor (props) {
    super(props);
    this.state = {
      allCachedPositionsForThisMeasure: [],
      allCachedPositionsForThisMeasureLength: 0,
      measure: {},
      measureBallotItemDisplayName: '',
      measureWeVoteId: '',
      positionListFromFriendsHasBeenRetrievedOnce: {},
      positionListHasBeenRetrievedOnce: {},
      scrolledDown: AppObservableStore.getScrolledDown(),
    };
  }

  componentDidMount () {
    // console.log('Measure componentDidMount');
    window.scrollTo(0, 0);

    const { match: { params } } = this.props;
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const { measure_we_vote_id: measureWeVoteId } = params;
    MeasureActions.measureRetrieve(measureWeVoteId);
    if (measureWeVoteId &&
      !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
      const { positionListHasBeenRetrievedOnce } = this.state;
      positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListHasBeenRetrievedOnce,
      });
    }
    if (measureWeVoteId &&
      !this.localPositionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId) &&
      !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId)
    ) {
      MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListFromFriendsHasBeenRetrievedOnce,
      });
    }

    // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(measureWeVoteId, 'MEASURE');

    if (apiCalming('organizationsFollowedRetrieve', 60000)) {
      OrganizationActions.organizationsFollowedRetrieve();
    }

    const measure = MeasureStore.getMeasure(measureWeVoteId);
    const { ballot_item_display_name: ballotItemDisplayName } = measure;
    let measureBallotItemDisplayName = '';
    if (measure && ballotItemDisplayName) {
      measureBallotItemDisplayName = ballotItemDisplayName;
    }
    const allCachedPositionsForThisMeasure = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(measureWeVoteId);
    let allCachedPositionsForThisMeasureLength = 0;
    if (allCachedPositionsForThisMeasure) {
      allCachedPositionsForThisMeasureLength = allCachedPositionsForThisMeasure.length;
    }
    this.setState({
      measure,
      measureBallotItemDisplayName,
      measureWeVoteId,
      allCachedPositionsForThisMeasure,
      allCachedPositionsForThisMeasureLength,
    });
    const modalToOpen = params.modal_to_show || '';
    if (modalToOpen === 'share') {
      this.modalOpenTimer = setTimeout(() => {
        AppObservableStore.setShowShareModal(true);
      }, 1000);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = params.shared_item_code || '';
      if (sharedItemCode) {
        this.modalOpenTimer = setTimeout(() => {
          AppObservableStore.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    }
    if (apiCalming('activityNoticeListRetrieve', 10000)) {
      ActivityActions.activityNoticeListRetrieve();
    }
    AnalyticsActions.saveActionMeasure(VoterStore.electionId(), measureWeVoteId);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { match: { params: nextParams } } = nextProps;
    const modalToOpen = nextParams.modal_to_show || '';
    if (modalToOpen === 'share') {
      this.modalOpenTimer = setTimeout(() => {
        AppObservableStore.setShowShareModal(true);
      }, 1000);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = nextParams.shared_item_code || '';
      if (sharedItemCode) {
        this.modalOpenTimer = setTimeout(() => {
          AppObservableStore.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    }
    // When a new measure is passed in, update this component to show the new data
    // console.log('componentWillReceiveProps nextParams.measure_we_vote_id:', nextParams.measure_we_vote_id, ', this.state.measureWeVoteId:', this.state.measureWeVoteId);
    if (nextParams.measure_we_vote_id !== this.state.measureWeVoteId) {
      const { measure_we_vote_id: measureWeVoteId } = nextParams;
      MeasureActions.measureRetrieve(measureWeVoteId);
      if (measureWeVoteId && !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) && !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)) {
        MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
        MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      if (measureWeVoteId &&
        !this.localPositionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId) &&
        !BallotStore.positionListFromFriendsHasBeenRetrievedOnce(measureWeVoteId)
      ) {
        MeasureActions.positionListForBallotItemFromFriends(measureWeVoteId);
        const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
        positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId] = true;
        this.setState({
          positionListFromFriendsHasBeenRetrievedOnce,
        });
      }
      // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextParams.measure_we_vote_id, 'MEASURE');
      const measure = MeasureStore.getMeasure(measureWeVoteId);
      let measureBallotItemDisplayName = '';
      const { ballot_item_display_name: ballotItemDisplayName } = measure;
      if (measure && ballotItemDisplayName) {
        measureBallotItemDisplayName = ballotItemDisplayName;
      }
      const allCachedPositionsForThisMeasure = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(measureWeVoteId);
      let allCachedPositionsForThisMeasureLength = 0;
      if (allCachedPositionsForThisMeasure) {
        allCachedPositionsForThisMeasureLength = allCachedPositionsForThisMeasure.length;
      }
      this.setState({
        measure,
        measureBallotItemDisplayName,
        measureWeVoteId,
        allCachedPositionsForThisMeasure,
        allCachedPositionsForThisMeasureLength,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.allCachedPositionsForThisMeasureLength !== nextState.allCachedPositionsForThisMeasureLength) {
      // console.log('this.state.allCachedPositionsForThisMeasureLength:', this.state.allCachedPositionsForThisMeasureLength, ', nextState.allCachedPositionsForThisMeasureLength:', nextState.allCachedPositionsForThisMeasureLength);
      return true;
    }
    if (this.state.measureWeVoteId !== nextState.measureWeVoteId) {
      // console.log('this.state.measureWeVoteId:', this.state.measureWeVoteId, ', nextState.measureWeVoteId:', nextState.measureWeVoteId);
      return true;
    }
    if (this.state.measureBallotItemDisplayName !== nextState.measureBallotItemDisplayName) {
      // console.log('this.state.measureBallotItemDisplayName:', this.state.measureBallotItemDisplayName, ', nextState.measureBallotItemDisplayName:', nextState.measureBallotItemDisplayName);
      return true;
    }
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      // console.log('this.state.scrolledDown:', this.state.scrolledDown, ', nextState.scrolledDown:', nextState.scrolledDown);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    this.measureStoreListener.remove();
    this.voterGuideStoreListener.remove();
    if (this.modalOpenTimer) clearTimeout(this.modalOpenTimer);
  }

  onAppObservableStoreChange () {
    this.setState({
      scrolledDown: AppObservableStore.getScrolledDown(),
    });
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    // console.log('Measure, onMeasureStoreChange');
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    let measureBallotItemDisplayName = '';

    if (measure) {
      const { ballot_item_display_name: ballotItemDisplayName } = measure;
      if (ballotItemDisplayName) {
        measureBallotItemDisplayName = ballotItemDisplayName;
      }
    }
    const allCachedPositionsForThisMeasure = MeasureStore.getAllCachedPositionsByMeasureWeVoteId(measureWeVoteId);
    let allCachedPositionsForThisMeasureLength = 0;
    if (allCachedPositionsForThisMeasure) {
      allCachedPositionsForThisMeasureLength = allCachedPositionsForThisMeasure.length;
    }
    this.setState({
      allCachedPositionsForThisMeasure,
      allCachedPositionsForThisMeasureLength,
      measure,
      measureBallotItemDisplayName,
    });
  }

  onVoterGuideStoreChange () {
    // console.log('Measure onVoterGuideStoreChange');
    // MeasureActions.measureRetrieve(this.state.measureWeVoteId);
    // MeasureActions.positionListForBallotItemPublic(this.state.measureWeVoteId);
  }

  localPositionListHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  localPositionListFromFriendsHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListFromFriendsHasBeenRetrievedOnce } = this.state;
      return positionListFromFriendsHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('Measure');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, match: { params } } = this.props;
    const { allCachedPositionsForThisMeasure, measure, scrolledDown } = this.state;
    const {
      ballot_item_display_name: ballotItemDisplayName,
      ballotpedia_measure_url: ballotpediaMeasureURL,
      id: measureId,
      we_vote_id: measureWeVoteId,
      // measure_url: measureURL,
    } = measure;

    if (!measure || !ballotItemDisplayName) {
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <div><LoadingWheelComp /></div>
          <br />
        </div>
      );
    }

    const measureName = toTitleCase(ballotItemDisplayName);
    const titleText = `${measureName} - We Vote`;
    const descriptionText = `Information about ${measureName}`;
    const voter = VoterStore.getVoter();
    const { is_admin: isAdmin, is_verified_volunteer: isVerifiedVolunteer } = voter;
    const measureAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}m/${measureId}/edit/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;

    return (
      <>
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        {
          scrolledDown && (
            <MeasureStickyHeader measureWeVoteId={measureWeVoteId} />
          )
        }
        <Suspense fallback={<LoadingWheelComp />}>
          <SnackNotifier />
          <PageContentContainer
            style={{
              marginTop: `${cordovaBallotFilterTopMargin()}`,
              marginRight: isMobileScreenSize() ? '0' : '',
              marginLeft: isMobileScreenSize() ? '0' : '',
            }}
          >
            {/* The following style adjustment prevents horizontal scrolling from the .card style */}
            <div className="card" style={{ marginRight: 0, marginLeft: 0 }}>
              <TwoColumns>
                <LeftColumnWrapper>
                  <Suspense fallback={<></>}>
                    <MeasureItem measureWeVoteId={measureWeVoteId} />
                  </Suspense>
                </LeftColumnWrapper>
                <RightColumnWrapper className="u-show-desktop-tablet">
                  <MeasureShareWrapper>
                    <Suspense fallback={<></>}>
                      <ShareButtonDesktopTablet measureShare />
                    </Suspense>
                  </MeasureShareWrapper>
                  {ballotpediaMeasureURL && (
                    <ViewOnBallotpedia externalLinkUrl={ballotpediaMeasureURL} />
                  )}
                  {measureName && (
                    <SearchOnGoogle googleQuery={`${measureName}`} />
                  )}
                </RightColumnWrapper>
              </TwoColumns>
            </div>
            { !!(allCachedPositionsForThisMeasure.length) && (
              <section className="card" style={{ marginRight: 0, marginLeft: 0 }}>
                <Suspense fallback={<></>}>
                  <DelayedLoad showLoadingText waitBeforeShow={500}>
                    <PositionList
                      incomingPositionList={allCachedPositionsForThisMeasure}
                      ballotItemDisplayName={ballotItemDisplayName}
                      params={params}
                      positionListExistsTitle={(
                        <PositionListIntroductionText>
                          <Info classes={{ root: classes.informationIcon }} />
                          Opinions about this ballot item are below. Use these filters to sort:
                        </PositionListIntroductionText>
                      )}
                    />
                  </DelayedLoad>
                </Suspense>
              </section>
            )}
            <EndorsementCard
              bsPrefix="u-margin-top--sm u-stack--xs"
              variant="primary"
              buttonText="Endorsements missing?"
              text={`Are there endorsements for ${measureName} that you expected to see?`}
            />
            <br />
            {/* Show links to this candidate in the admin tools */}
            { (isAdmin || isVerifiedVolunteer) && (
              <span className="u-wrap-links d-print-none">
                Admin only:
                <Suspense fallback={<></>}>
                  <OpenExternalWebSite
                    linkIdAttribute="measureAdminEdit"
                    url={measureAdminEditUrl}
                    target="_blank"
                    className="open-web-site open-web-site__no-right-padding"
                    body={(
                      <span>
                        edit
                        {' '}
                        {measureName}
                      </span>
                    )}
                  />
                </Suspense>
              </span>
            )}
          </PageContentContainer>
        </Suspense>
      </>
    );
  }
}
Measure.propTypes = {
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

const MeasureShareWrapper = styled('div')`
  margin-bottom: 12px;
  padding-left: 2px;
`;

const LeftColumnWrapper = styled('div')`
  flex: 1 1 0;
`;

const PositionListIntroductionText = styled('div')`
  color: #999;
`;

const RightColumnWrapper = styled('div')`
  padding: 16px 16px 16px 0;
  width: fit-content;
`;

const TwoColumns = styled('div')(({ theme }) => (`
  display: flex;
  ${() => (isAndroidSizeFold() ? { margin: 0 } : { margin: '0 -8px 0 -8px' })};
  ${theme.breakpoints.down('sm')} {
    margin: 0 3px;
  }
`));

export default withStyles(styles)(Measure);
