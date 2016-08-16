import React, { Component, PropTypes } from "react";

import GuideList from "../../components/VoterGuide/GuideList";
import GuideStore from "../../stores/GuideStore";
import GuideActions from "../../actions/GuideActions";
import MeasureItem from "../../components/Ballot/MeasureItem";
import MeasureActions from "../../actions/MeasureActions";
import MeasureStore from "../../stores/MeasureStore";
import PositionList from "../../components/Ballot/PositionList";
import VoterStore from "../../stores/VoterStore";
import { exitSearch } from "../../utils/search-functions";


export default class Measure extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.we_vote_id = this.props.params.we_vote_id;
    this.state = {measure: {} };
  }

  componentDidMount (){
    this.measureToken = MeasureStore.addListener(this._onChange.bind(this));

    MeasureActions.retrieve(this.we_vote_id);

    this.listener = GuideStore.addListener(this._onChange.bind(this));
    GuideActions.retrieveGuidesToFollowByBallotItem(this.we_vote_id, "MEASURE");

    exitSearch("");
  }

  componentWillUnmount () {
    this.measureToken.remove();
    this.listener.remove();
  }

  _onChange (){
    var measure = MeasureStore.get(this.we_vote_id) || {};
    this.setState({ measure: measure, guideList: GuideStore.toFollowListForCand() });

  }

  render () {
    const electionId = VoterStore.election_id();
    const NO_VOTER_GUIDES_TEXT = "We could not find any more voter guides to follow about this measure.";
    var { measure, guideList } = this.state;

    if (!measure.ballot_item_display_name){
      return <div className="bs-container-fluid bs-well u-gutter-top--small fluff-full1">
              <h3>No Measure Found</h3>
                <div className="small">We were not able to find that measure.
                  Please search again.</div>
                <br />
            </div>;
    }

    return <span>
        <section className="measure-card__container">
          <MeasureItem {...measure} />
          <div className="measure-card__additional">
            { measure.position_list ?
              <div>
                <PositionList
                position_list={measure.position_list}
                candidate_display_name={measure.ballot_item_display_name} />
              </div> :
              null
            }
            {guideList.length === 0 ?
              <p className="measure-card__no-additional">{NO_VOTER_GUIDES_TEXT}</p> :
              <div><h3 className="measure-card__additional-heading">{"More opinions about " + measure.ballot_item_display_name}</h3>
              <GuideList id={electionId} ballotItemWeVoteId={this.we_vote_id} organizations={guideList}/></div>
            }
          </div>
        </section>
        <br />
      </span>;

  }
}
