import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { capitalizeString } from '../../utils/textFormat';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import BallotStore from '../../stores/BallotStore';
import MeasureItem from '../../components/Ballot/MeasureItem';
import MeasureStickyHeader from '../../components/Ballot/MeasureStickyHeader';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import PositionList from '../../components/Ballot/PositionList';
import SupportActions from '../../actions/SupportActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import AppStore from '../../stores/AppStore';
import webAppConfig from '../../config';
import EndorsementCard from '../../components/Widgets/EndorsementCard';

// The component /routes/VoterGuide/OrganizationVoterGuideMeasure is based on this component
export default class Measure extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      measure: {},
      measureBallotItemDisplayName: '',
      measureWeVoteId: '',
      positionListForThisMeasure: [],
      positionListForThisMeasureLength: 0,
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
    if (measureWeVoteId && !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) && !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)) {
      MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
      const { positionListHasBeenRetrievedOnce } = this.state;
      positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
      this.setState({
        positionListHasBeenRetrievedOnce,
      });
    }

    // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(measureWeVoteId, 'MEASURE');

    // Make sure supportProps exist for this Measure when browser comes straight to measure page
    SupportActions.retrievePositionsCountsForOneBallotItem(measureWeVoteId);
    OrganizationActions.organizationsFollowedRetrieve();

    // TODO CREATE THIS
    // AnalyticsActions.saveActionMeasure(VoterStore.electionId(), measureWeVoteId);
    const measure = MeasureStore.getMeasure(measureWeVoteId);
    let measureBallotItemDisplayName = '';
    if (measure && measure.ballot_item_display_name) {
      measureBallotItemDisplayName = measure.ballot_item_display_name;
    }
    const positionListForThisMeasure = MeasureStore.getPositionList(measureWeVoteId);
    let positionListForThisMeasureLength = 0;
    if (positionListForThisMeasure) {
      positionListForThisMeasureLength = positionListForThisMeasure.length;
    }
    this.setState({
      measure,
      measureBallotItemDisplayName,
      measureWeVoteId,
      positionListForThisMeasure,
      positionListForThisMeasureLength,
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new measure is passed in, update this component to show the new data
    // console.log('componentWillReceiveProps nextProps.params.measure_we_vote_id:', nextProps.params.measure_we_vote_id, ', this.state.measureWeVoteId:', this.state.measureWeVoteId);
    if (nextProps.params.measure_we_vote_id !== this.state.measureWeVoteId) {
      const { measure_we_vote_id: measureWeVoteId } = nextProps.params;
      MeasureActions.measureRetrieve(measureWeVoteId);
      if (measureWeVoteId && !this.localPositionListHasBeenRetrievedOnce(measureWeVoteId) && !BallotStore.positionListHasBeenRetrievedOnce(measureWeVoteId)) {
        MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
        const { positionListHasBeenRetrievedOnce } = this.state;
        positionListHasBeenRetrievedOnce[measureWeVoteId] = true;
        this.setState({
          positionListHasBeenRetrievedOnce,
        });
      }
      // VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextProps.params.measure_we_vote_id, 'MEASURE');
      const measure = MeasureStore.getMeasure(measureWeVoteId);
      let measureBallotItemDisplayName = '';
      if (measure && measure.ballot_item_display_name) {
        measureBallotItemDisplayName = measure.ballot_item_display_name;
      }
      const positionListForThisMeasure = MeasureStore.getPositionList(measureWeVoteId);
      let positionListForThisMeasureLength = 0;
      if (positionListForThisMeasure) {
        positionListForThisMeasureLength = positionListForThisMeasure.length;
      }
      this.setState({
        measure,
        measureBallotItemDisplayName,
        measureWeVoteId,
        positionListForThisMeasure,
        positionListForThisMeasureLength,
      });
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
    if (this.state.measureWeVoteId !== nextState.measureWeVoteId) {
      // console.log('this.state.measureWeVoteId:', this.state.measureWeVoteId, ', nextState.measureWeVoteId:', nextState.measureWeVoteId);
      return true;
    }
    if (this.state.measureBallotItemDisplayName !== nextState.measureBallotItemDisplayName) {
      // console.log('this.state.measureBallotItemDisplayName:', this.state.measureBallotItemDisplayName, ', nextState.measureBallotItemDisplayName:', nextState.measureBallotItemDisplayName);
      return true;
    }
    if (this.state.positionListForThisMeasureLength !== nextState.positionListForThisMeasureLength) {
      // console.log('this.state.positionListForThisMeasureLength:', this.state.positionListForThisMeasureLength, ', nextState.positionListForThisMeasureLength:', nextState.positionListForThisMeasureLength);
      return true;
    }
    if (this.state.scrolledDown !== nextState.scrolledDown) {
      // console.log('this.state.scrolledDown:', this.state.scrolledDown, ', nextState.scrolledDown:', nextState.scrolledDown);
      return true;
    }
    return false;
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.appStoreListener.remove();
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
    const positionListForThisMeasure = MeasureStore.getPositionList(measureWeVoteId);
    let positionListForThisMeasureLength = 0;
    if (positionListForThisMeasure) {
      positionListForThisMeasureLength = positionListForThisMeasure.length;
    }
    this.setState({
      measure,
      measureBallotItemDisplayName,
      positionListForThisMeasure,
      positionListForThisMeasureLength,
    });
  }

  onVoterGuideStoreChange () {
    // console.log('Measure onVoterGuideStoreChange');
    // MeasureActions.measureRetrieve(this.state.measureWeVoteId);
    // MeasureActions.positionListForBallotItemPublic(this.state.measureWeVoteId);
    // Also update the position count for *just* this candidate, since it might not come back with positionsCountForAllBallotItems

    SupportActions.retrievePositionsCountsForOneBallotItem(this.state.measureWeVoteId);
  }

  localPositionListHasBeenRetrievedOnce (measureWeVoteId) {
    if (measureWeVoteId) {
      const { positionListHasBeenRetrievedOnce } = this.state;
      return positionListHasBeenRetrievedOnce[measureWeVoteId];
    }
    return false;
  }

  render () {
    renderLog('Measure');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      positionListForThisMeasure, measure, scrolledDown,
    } = this.state;

    if (!measure || !measure.ballot_item_display_name) {
      // TODO DALE If the measureWeVoteId is not valid, we need to update this with a notice
      // console.log('Measure missing measure object');
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <div>{LoadingWheel}</div>
          <br />
        </div>
      );
    }
    // console.log('positionListForThisMeasure:', positionListForThisMeasure);

    const measureName = capitalizeString(measure.ballot_item_display_name);
    const titleText = `${measureName} - We Vote`;
    const descriptionText = `Information about ${measureName}`;
    const voter = VoterStore.getVoter();
    const measureAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}m/${measure.id}/edit/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;

    return (
      <span>
        <section className="card">
          <Helmet
            title={titleText}
            meta={[{ name: 'description', content: descriptionText }]}
          />
          {
            scrolledDown && (
              <MeasureStickyHeader measureWeVoteId={measure.we_vote_id} />
            )
          }
          <MeasureItem measureWeVoteId={measure.we_vote_id} />
          <div className="card__additional">
            { positionListForThisMeasure ? (
              <div>
                <PositionList
                  incomingPositionList={positionListForThisMeasure}
                  hideSimpleSupportOrOppose
                  ballotItemDisplayName={measure.ballot_item_display_name}
                  params={this.props.params}
                />
              </div>
            ) : (
              <span>Position list for this measure missing.</span>
            )}
          </div>
        </section>
        <EndorsementCard
          bsPrefix="u-margin-top--sm u-stack--xs"
          variant="primary"
          buttonText="ENDORSEMENTS MISSING?"
          text={`Are there endorsements for
          ${measureName}
          that you expected to see?`}
        />
        {/* Show links to this candidate in the admin tools */}
        { (voter.is_admin || voter.is_verified_volunteer) && (
          <span className="u-wrap-links d-print-none">
            Admin:
            <OpenExternalWebSite
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
          </span>
        )}
      </span>
    );
  }
}
