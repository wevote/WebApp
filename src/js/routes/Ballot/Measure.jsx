import React, { Component, PropTypes } from "react";
import AnalyticsActions from "../../actions/AnalyticsActions";
import { capitalizeString } from "../../utils/textFormat";
import GuideList from "../../components/VoterGuide/GuideList";
import Helmet from "react-helmet";
import LoadingWheel from "../../components/LoadingWheel";
import MeasureItem from "../../components/Ballot/MeasureItem";
import MeasureActions from "../../actions/MeasureActions";
import MeasureStore from "../../stores/MeasureStore";
import OrganizationActions from "../../actions/OrganizationActions";
import PositionList from "../../components/Ballot/PositionList";
import SupportActions from "../../actions/SupportActions";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import SearchAllActions from "../../actions/SearchAllActions";
const web_app_config = require("../../config");


export default class Measure extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      measure: {},
      measure_we_vote_id: "",
      position_list_from_advisers_followed_by_voter: [],
      // Eventually we could use this getVoterGuidesToFollowForBallotItemId with measure_we_vote_id, but we can't now
      //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
      // guides_to_follow_list: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(this.props.params.measure_we_vote_id)
      voter_guides_to_follow_for_latest_ballot_item: []
    };
  }

  componentDidMount (){
    this.measureStoreListener = MeasureStore.addListener(this._onMeasureStoreChange.bind(this));
    MeasureActions.measureRetrieve(this.props.params.measure_we_vote_id);
    MeasureActions.positionListForBallotItem(this.props.params.measure_we_vote_id);

    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(this.props.params.measure_we_vote_id, "MEASURE");

    // Make sure supportProps exist for this Measure when browser comes straight to measure page
    SupportActions.retrievePositionsCountsForOneBallotItem(this.props.params.measure_we_vote_id);
    OrganizationActions.organizationsFollowedRetrieve();

    SearchAllActions.exitSearch();
    // TODO CREATE THIS
    // AnalyticsActions.saveActionMeasure(VoterStore.election_id(), this.props.params.measure_we_vote_id);
    this.setState({
      measure_we_vote_id: this.props.params.measure_we_vote_id,
      position_list_from_advisers_followed_by_voter: MeasureStore.getPositionList(this.props.params.measure_we_vote_id),
      voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
    });
  }

  componentWillReceiveProps (nextProps) {
    // When a new measure is passed in, update this component to show the new data
    if (nextProps.params.measure_we_vote_id !== this.state.measure_we_vote_id) {
      MeasureActions.measureRetrieve(nextProps.params.measure_we_vote_id);
      MeasureActions.positionListForBallotItem(nextProps.params.measure_we_vote_id);
      VoterGuideActions.voterGuidesToFollowRetrieveByBallotItem(nextProps.params.measure_we_vote_id, "MEASURE");
      this.setState({
        measure_we_vote_id: nextProps.params.measure_we_vote_id,
        position_list_from_advisers_followed_by_voter: MeasureStore.getPositionList(nextProps.params.measure_we_vote_id),
        voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
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

  _onMeasureStoreChange (){
    // console.log("Measure, _onMeasureStoreChange");
    this.setState({
      measure: MeasureStore.getMeasure(this.state.measure_we_vote_id),
      position_list_from_advisers_followed_by_voter: MeasureStore.getPositionList(this.state.measure_we_vote_id),
    });
  }

  onVoterGuideStoreChange (){
    //MeasureActions.measureRetrieve(this.state.measure_we_vote_id);
    MeasureActions.positionListForBallotItem(this.state.measure_we_vote_id);
   // Also update the position count for *just* this candidate, since it might not come back with positionsCountForAllBallotItems
    SupportActions.retrievePositionsCountsForOneBallotItem(this.state.measure_we_vote_id);
    // Eventually we could use this getVoterGuidesToFollowForBallotItemId with candidate_we_vote_id, but we can't now
    //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
    this.setState({
      voter_guides_to_follow_for_latest_ballot_item: VoterGuideStore.getVoterGuidesToFollowForLatestBallotItem(),
      // voter_guides_to_follow_for_this_ballot_item: VoterGuideStore.getVoterGuidesToFollowForBallotItemId(this.state.candidate_we_vote_id),
    });
  }

  render () {
    const electionId = VoterStore.election_id();
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to follow about this measure.";

    if (!this.state.measure || !this.state.measure.ballot_item_display_name){
      // TODO DALE If the measure_we_vote_id is not valid, we need to update this with a notice
      return <div className="container-fluid well u-stack--md u-inset--md">
                <div>{LoadingWheel}</div>
                <br />
            </div>;
    }
    let measure_name = capitalizeString(this.state.measure.ballot_item_display_name);
    let title_text = measure_name + " - We Vote";
    let description_text = "Information about " + measure_name;
    let voter = VoterStore.getVoter();
    let measure_admin_edit_url = web_app_config.WE_VOTE_SERVER_ROOT_URL + "m/" + this.state.measure.id + "/edit/?google_civic_election_id=" + VoterStore.election_id() + "&state_code=";

    return <section className="card">
      <Helmet title={title_text}
              meta={[{"name": "description", "content": description_text}]}
              />
          <MeasureItem {...this.state.measure}
                       position_list={this.state.position_list_from_advisers_followed_by_voter}
                       commentButtonHide
                       showPositionsInYourNetworkBreakdown />
          <div className="card__additional">
            { this.state.position_list_from_advisers_followed_by_voter ?
              <div>
                <PositionList position_list={this.state.position_list_from_advisers_followed_by_voter}
                              hideSimpleSupportOrOppose
                              ballot_item_display_name={this.state.measure.ballot_item_display_name} />
              </div> :
              null
            }
            {this.state.voter_guides_to_follow_for_latest_ballot_item.length === 0 ?
              <p className="card__no-additional">{NO_VOTER_GUIDES_TEXT}</p> :
              <div><h3 className="card__additional-heading">{"More opinions about " + this.state.measure.ballot_item_display_name}</h3>
              <GuideList id={electionId}
                         ballotItemWeVoteId={this.state.measure_we_vote_id}
                         organizationsToFollow={this.state.voter_guides_to_follow_for_latest_ballot_item}/></div>
            }
          </div>
    {/* Show links to this candidate in the admin tools */}
    { voter.is_admin || voter.is_verified_volunteer ?
      <span>Admin: <a href={measure_admin_edit_url} target="_blank">edit {measure_name}</a></span> :
      null
    }
        </section>;

  }
}
