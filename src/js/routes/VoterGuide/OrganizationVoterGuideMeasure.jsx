import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { capitalizeString } from '../../utils/textFormat';
import GuideList from '../../components/VoterGuide/GuideList';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import MeasureItem from '../../components/Ballot/MeasureItem';
import MeasureActions from '../../actions/MeasureActions';
import MeasureStore from '../../stores/MeasureStore';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';
import OrganizationActions from '../../actions/OrganizationActions';
import PositionList from '../../components/Ballot/PositionList';
import SupportActions from '../../actions/SupportActions';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import SearchAllActions from '../../actions/SearchAllActions';
import webAppConfig from '../../config';

// This is based on routes/Ballot/Measure
export default class OrganizationVoterGuideMeasure extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      measure: {},
      measureWeVoteId: '',
      positionListFromAdvisersFollowedByVoter: [],
      // Eventually we could use this getVoterGuidesToFollowForBallotItemId with measureWeVoteId, but we can't now
      //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
      // guides_to_follow_list: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(this.props.params.measure_we_vote_id)
      voterGuidesToFollowForLatestBallotItem: [],
    };
  }

  componentDidMount () {
    this.measureStoreListener = MeasureStore.addListener(this.onMeasureStoreChange.bind(this));
    MeasureActions.measureRetrieve(this.props.params.measure_we_vote_id);
    MeasureActions.positionListForBallotItemPublic(this.props.params.measure_we_vote_id);

    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(this.props.params.measure_we_vote_id, 'MEASURE');

    // Make sure supportProps exist for this Measure when browser comes straight to measure page
    SupportActions.retrievePositionsCountsForOneBallotItem(this.props.params.measure_we_vote_id);
    OrganizationActions.organizationsFollowedRetrieve();

    SearchAllActions.exitSearch();

    // TODO CREATE THIS
    // AnalyticsActions.saveActionMeasure(VoterStore.electionId(), this.props.params.measure_we_vote_id);
    this.setState({
      measureWeVoteId: this.props.params.measure_we_vote_id,
      positionListFromAdvisersFollowedByVoter: MeasureStore.getPositionList(this.props.params.measure_we_vote_id),
      voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new measure is passed in, update this component to show the new data
    if (nextProps.params.measure_we_vote_id !== this.state.measureWeVoteId) {
      MeasureActions.measureRetrieve(nextProps.params.measure_we_vote_id);
      MeasureActions.positionListForBallotItemPublic(nextProps.params.measure_we_vote_id);
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextProps.params.measure_we_vote_id, 'MEASURE');
      this.setState({
        measureWeVoteId: nextProps.params.measure_we_vote_id,
        positionListFromAdvisersFollowedByVoter: MeasureStore.getPositionList(nextProps.params.measure_we_vote_id),
        voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
      });
    }
    // Display the measure's name in the search box
    // var { measure } = this.state;
    // var searchBoxText = measure.ballot_item_display_name || "";  // TODO DALE Not working right now
    SearchAllActions.exitSearch();
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onMeasureStoreChange () {
    const { measureWeVoteId } = this.state;
    // console.log("Measure, onMeasureStoreChange");
    this.setState({
      measure: MeasureStore.getMeasure(measureWeVoteId),
      positionListFromAdvisersFollowedByVoter: MeasureStore.getPositionList(measureWeVoteId),
    });
  }

  onVoterGuideStoreChange () {
    const { measureWeVoteId } = this.state;
    // MeasureActions.measureRetrieve(measureWeVoteId);
    MeasureActions.positionListForBallotItemPublic(measureWeVoteId);
    // Also update the position count for *just* this candidate, since it might not come back with positionsCountForAllBallotItems

    SupportActions.retrievePositionsCountsForOneBallotItem(measureWeVoteId);
    // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidate_we_vote_id, but we can't now
    //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
    this.setState({
      voterGuidesToFollowForLatestBallotItem: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
  }

  render () {
    renderLog(__filename);

    const electionId = VoterStore.electionId();
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

    const measureName = capitalizeString(this.state.measure.ballot_item_display_name);
    const titleText = `${measureName} - We Vote`;
    const descriptionText = `Information about ${measureName}`;
    const voter = VoterStore.getVoter();
    const measureAdminEditUrl = `${webAppConfig.WE_VOTE_SERVER_ROOT_URL}m/${this.state.measure.id}/edit/?google_civic_election_id=${VoterStore.electionId()}&state_code=`;

    return (
      <section className="card">
        <Helmet
          title={titleText}
          meta={[{ name: 'description', content: descriptionText }]}
        />
        <MeasureItem measureWeVoteId={this.state.measure.we_vote_id} />
        <div className="card__additional">
          { this.state.positionListFromAdvisersFollowedByVoter ? (
            <div>
              <PositionList
                incomingPositionList={this.state.positionListFromAdvisersFollowedByVoter}
                hideSimpleSupportOrOppose
                ballotItemDisplayName={this.state.measure.ballot_item_display_name}
              />
            </div>
          ) : null
          }
          {this.state.voterGuidesToFollowForLatestBallotItem.length === 0 ?
            <div className="card__additional-text">{NO_VOTER_GUIDES_TEXT}</div> : (
              <div>
                <h3 className="card__additional-heading">{`More opinions about ${this.state.measure.ballot_item_display_name}`}</h3>
                <GuideList
                  id={electionId}
                  ballotItemWeVoteId={this.state.measureWeVoteId}
                  incomingVoterGuideList={this.state.voterGuidesToFollowForLatestBallotItem}
                />
              </div>
            )
          }
        </div>
        {/* Show links to this candidate in the admin tools */}
        { voter.is_admin || voter.is_verified_volunteer ? (
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
        ) : null
        }
      </section>
    );
  }
}
