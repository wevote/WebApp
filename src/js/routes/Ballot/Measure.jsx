import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Info } from '@material-ui/icons';
import { capitalizeString } from '../../utils/textFormat';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import BallotStore from '../../stores/BallotStore';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import EndorsementCard from '../../components/Widgets/EndorsementCard';
import MeasureItem from '../../components/Ballot/MeasureItem';
import MeasureStickyHeader from '../../components/Ballot/MeasureStickyHeader';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import PositionList from '../../components/Ballot/PositionList';
import ViewOnBallotpedia from '../../components/Widgets/ViewOnBallotpedia';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import webAppConfig from '../../config';
import SearchOnGoogle from '../../components/Widgets/SearchOnGoogle';
import ShareButtonDesktopTablet from '../../components/Share/ShareButtonDesktopTablet';

// The component /routes/VoterGuide/OrganizationVoterGuideMeasure is based on this component
class Measure extends Component {
  static propTypes = {
    classes: PropTypes.object,
    params: PropTypes.object.isRequired,
  };

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
      scrolledDown: AppStore.getScrolledDown(),
    };
  }

  componentDidMount () {
    // console.log('Measure componentDidMount');
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    const { measure_we_vote_id: measureWeVoteId } = this.props.params;
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

    OrganizationActions.organizationsFollowedRetrieve();

    const measure = MeasureStore.getMeasure(measureWeVoteId);
    let measureBallotItemDisplayName = '';
    if (measure && measure.ballot_item_display_name) {
      measureBallotItemDisplayName = measure.ballot_item_display_name;
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
    const modalToOpen = this.props.params.modal_to_show || '';
    if (modalToOpen === 'share') {
      this.modalOpenTimer = setTimeout(() => {
        AppActions.setShowShareModal(true);
      }, 1000);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = this.props.params.shared_item_code || '';
      if (sharedItemCode) {
        this.modalOpenTimer = setTimeout(() => {
          AppActions.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    }
    ActivityActions.activityNoticeListRetrieve();
    AnalyticsActions.saveActionMeasure(VoterStore.electionId(), measureWeVoteId);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    const modalToOpen = nextProps.params.modal_to_show || '';
    if (modalToOpen === 'share') {
      this.modalOpenTimer = setTimeout(() => {
        AppActions.setShowShareModal(true);
      }, 1000);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      const sharedItemCode = nextProps.params.shared_item_code || '';
      if (sharedItemCode) {
        this.modalOpenTimer = setTimeout(() => {
          AppActions.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    }
    // When a new measure is passed in, update this component to show the new data
    // console.log('componentWillReceiveProps nextProps.params.measure_we_vote_id:', nextProps.params.measure_we_vote_id, ', this.state.measureWeVoteId:', this.state.measureWeVoteId);
    if (nextProps.params.measure_we_vote_id !== this.state.measureWeVoteId) {
      const { measure_we_vote_id: measureWeVoteId } = nextProps.params;
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
      // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextProps.params.measure_we_vote_id, 'MEASURE');
      const measure = MeasureStore.getMeasure(measureWeVoteId);
      let measureBallotItemDisplayName = '';
      if (measure && measure.ballot_item_display_name) {
        measureBallotItemDisplayName = measure.ballot_item_display_name;
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
    this.appStoreListener.remove();
    this.measureStoreListener.remove();
    this.voterGuideStoreListener.remove();
    if (this.modalOpenTimer) {
      clearTimeout(this.modalOpenTimer);
      this.modalOpenTimer = null;
    }
  }

  onAppStoreChange () {
    this.setState({
      scrolledDown: AppStore.getScrolledDown(),
    });
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    // console.log('Measure, onMeasureStoreChange');
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    let measureBallotItemDisplayName = '';
    if (measure && measure.ballot_item_display_name) {
      measureBallotItemDisplayName = measure.ballot_item_display_name;
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
    const { classes } = this.props;
    const { allCachedPositionsForThisMeasure, measure, scrolledDown } = this.state;

    if (!measure || !measure.ballot_item_display_name) {
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <div>{LoadingWheel}</div>
          <br />
        </div>
      );
    }

    const measureName = capitalizeString(measure.ballot_item_display_name);
    const titleText = `${measureName} - We Vote`;
    const descriptionText = `Information about ${measureName}`;
    const voter = VoterStore.getVoter();
    const measureAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}m/${measure.id}/edit/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;

    return (
      <span>
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        {
          scrolledDown && (
            <MeasureStickyHeader measureWeVoteId={measure.we_vote_id} />
          )
        }
        <div className="card">
          <TwoColumns>
            <LeftColumnWrapper>
              <MeasureItem measureWeVoteId={measure.we_vote_id} />
            </LeftColumnWrapper>
            <RightColumnWrapper className="u-show-desktop-tablet">
              <MeasureShareWrapper>
                <ShareButtonDesktopTablet measureShare />
              </MeasureShareWrapper>
              {measure.measure_url && (
                <ViewOnBallotpedia externalLinkUrl={measure.measure_url} />
              )}
              {measureName && (
                <SearchOnGoogle googleQuery={`${measureName}`} />
              )}
            </RightColumnWrapper>
          </TwoColumns>
        </div>
        { !!(allCachedPositionsForThisMeasure.length) && (
          <section className="card">
            <DelayedLoad showLoadingText waitBeforeShow={500}>
              <PositionList
                incomingPositionList={allCachedPositionsForThisMeasure}
                ballotItemDisplayName={measure.ballot_item_display_name}
                params={this.props.params}
                positionListExistsTitle={(
                  <PositionListIntroductionText>
                    <Info classes={{ root: classes.informationIcon }} />
                    Opinions about this ballot item are below. Use these filters to sort:
                  </PositionListIntroductionText>
                )}
              />
            </DelayedLoad>
          </section>
        )}
        <EndorsementCard
          bsPrefix="u-margin-top--sm u-stack--xs"
          variant="primary"
          buttonText="ENDORSEMENTS MISSING?"
          text={`Are there endorsements for ${measureName} that you expected to see?`}
          whiteOnBlue
        />
        <br />
        {/* Show links to this candidate in the admin tools */}
        { (voter.is_admin || voter.is_verified_volunteer) && (
          <span className="u-wrap-links d-print-none">
            Admin only:
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
          </span>
        )}
      </span>
    );
  }
}

const styles = () => ({
  informationIcon: {
    color: '#999',
    width: 16,
    height: 16,
    marginTop: '-3px',
    marginRight: 4,
  },
});

const MeasureShareWrapper = styled.div`
  margin-bottom: 12px;
  padding-left: 2px;
`;

const LeftColumnWrapper = styled.div`
  flex: 1 1 0;
`;

const PositionListIntroductionText = styled.div`
  color: #999;
`;

const RightColumnWrapper = styled.div`
  padding: 16px 16px 16px 0;
  width: fit-content;
`;

const TwoColumns = styled.div`
  display: flex;
  margin: 0 -8px 0 -8px;
`;

export default withStyles(styles)(Measure);
