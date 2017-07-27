import React, { Component, PropTypes } from "react";
import GuideList from "../../components/VoterGuide/GuideList";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import Helmet from "react-helmet";
import LoadingWheel from "../../components/LoadingWheel";
import MeasureItem from "../../components/Ballot/MeasureItem";
import MeasureActions from "../../actions/MeasureActions";
import MeasureStore from "../../stores/MeasureStore";
import PositionList from "../../components/Ballot/PositionList";
import SupportActions from "../../actions/SupportActions";
import VoterStore from "../../stores/VoterStore";
import { capitalizeString } from "../../utils/textFormat";
import SearchAllActions from "../../actions/SearchAllActions";


export default class Measure extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      measure: {},
      measure_we_vote_id: this.props.params.measure_we_vote_id,
      // Eventually we could use this getVoterGuidesToFollowListByBallotItemId with measure_we_vote_id, but we can't now
      //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
      // guides_to_follow_list: GuideStore.getVoterGuidesToFollowListByBallotItemId(this.props.params.measure_we_vote_id)
      guides_to_follow_list: GuideStore.getVoterGuidesToFollowListByBallotItem()
    };
  }

  componentDidMount (){
    this.measureStoreListener = MeasureStore.addListener(this._onMeasureStoreChange.bind(this));
    var { measure_we_vote_id } = this.props.params;

    MeasureActions.retrieve(measure_we_vote_id);

    this.guideStoreListener = GuideStore.addListener(this._onGuideStoreChange.bind(this));
    GuideActions.retrieveGuidesToFollowByBallotItem(measure_we_vote_id, "MEASURE");

    // Make sure supportProps exist for this Measure when browser comes straight to measure page
    SupportActions.retrievePositionsCountsForOneBallotItem(measure_we_vote_id);

    SearchAllActions.exitSearch();
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    this.setState({measure_we_vote_id: nextProps.params.measure_we_vote_id});

    MeasureActions.retrieve(nextProps.params.measure_we_vote_id);

    GuideActions.retrieveGuidesToFollowByBallotItem(nextProps.params.measure_we_vote_id, "MEASURE");

    // Display the measure's name in the search box
    // var { measure } = this.state;
    // var searchBoxText = measure.ballot_item_display_name || "";  // TODO DALE Not working right now
    SearchAllActions.exitSearch();
  }

  componentWillUnmount () {
    this.measureStoreListener.remove();
    this.guideStoreListener.remove();
  }

  _onGuideStoreChange (){
    // Eventually we could use this getVoterGuidesToFollowListByBallotItemId with measure_we_vote_id, but we can't now
    //  because we don't always have the ballot_item_we_vote_id for certain API calls like organizationFollow
    this.setState({ guides_to_follow_list: GuideStore.getVoterGuidesToFollowListByBallotItem() });
    MeasureActions.retrieve(this.state.measure_we_vote_id);
  }

  _onMeasureStoreChange (){
    var measure = MeasureStore.get(this.state.measure_we_vote_id) || {};
    // console.log("Measure, _onMeasureStoreChange, measure: ", measure);
    this.setState({ measure: measure });
  }

  render () {
    const electionId = VoterStore.election_id();
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to follow about this measure.";

    if (!this.state.measure.ballot_item_display_name){
      // TODO DALE If the measure_we_vote_id is not valid, we need to update this with a notice
      return <div className="container-fluid well u-stack--md u-inset--md">
                <div>{LoadingWheel}</div>
                <br />
            </div>;
    }
    let measure_name = capitalizeString(this.state.measure.ballot_item_display_name);
    let title_text = measure_name + " - We Vote";
    let description_text = "Information about " + measure_name;

    return <section className="card">
      <Helmet title={title_text}
              meta={[{"name": "description", "content": description_text}]}
              />
          <MeasureItem {...this.state.measure}
                       commentButtonHide
                       showPositionsInYourNetworkBreakdown />
          <div className="card__additional">
            { this.state.measure.position_list ?
              <div>
                <PositionList position_list={this.state.measure.position_list}
                              hideSimpleSupportOrOppose
                              ballot_item_display_name={this.state.measure.ballot_item_display_name} />
              </div> :
              null
            }
            {this.state.guides_to_follow_list.length === 0 ?
              <p className="card__no-additional">{NO_VOTER_GUIDES_TEXT}</p> :
              <div><h3 className="card__additional-heading">{"More opinions about " + this.state.measure.ballot_item_display_name}</h3>
              <GuideList id={electionId}
                         ballotItemWeVoteId={this.state.measure_we_vote_id}
                         organizationsToFollow={this.state.guides_to_follow_list}/></div>
            }
          </div>
        </section>;

  }
}
