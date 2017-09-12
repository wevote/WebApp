import React, { Component, PropTypes } from "react";
import VoterActions from "../../actions/VoterActions";
import { cleanArray } from "../../utils/textFormat";
import moment from "moment";

const MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW = 36;

export default class BallotElectionList extends Component {

  static propTypes = {
    ballotElectionList: PropTypes.array.isRequired,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  updateBallot (originalTextForMapSearch, simple_save, googleCivicElectionId) {
    // console.log("BallotElectionList.jsx updateBallot, googleCivicElectionId: ", googleCivicElectionId);
    VoterActions.voterAddressSave(originalTextForMapSearch, simple_save, googleCivicElectionId);
    // Not necessary here: BallotActions.voterBallotItemsRetrieve(googleCivicElectionId);
    this.props.toggleFunction();
  }

  render () {
    console.log("BallotElectionList, this.props.ballotElectionList", this.props.ballotElectionList);
    let currentDate = moment().format("YYYY-MM-DD");
    let simple_save = false;
    let upcomingElectionList = this.props.ballotElectionList.map((item, index) =>
      item.election_date > currentDate ?
      <div key={index}>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success ballot-election-list__button"
                  onClick={this.updateBallot.bind(this, item.original_text_for_map_search, simple_save, item.google_civic_election_id)}>
            { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ?
              <span>{item.election_description_text}&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span> :
              <span>{item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}...&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span>
            }
            <div className="ballot-election-list__h2">{moment(item.election_date).format("MMMM Do, YYYY")}</div>
          </button>
        </dl>
      </div> :
      null
     );
    upcomingElectionList = cleanArray(upcomingElectionList);

    let priorElectionList = this.props.ballotElectionList.map((item, index) =>
      item.election_date > currentDate ?
      null :
      <div key={index}>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success ballot-election-list__button"
                  onClick={this.updateBallot.bind(this, item.original_text_for_map_search, simple_save, item.google_civic_election_id)}>
            { item.election_description_text.length < MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW ?
              <span>{item.election_description_text}&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span> :
              <span>{item.election_description_text.substring(0, MAXIMUM_NUMBER_OF_CHARACTERS_TO_SHOW - 3)}...&nbsp;<img src={"/img/global/icons/Circle-Arrow.png"}/></span>
            }
            <div className="ballot-election-list__h2">{moment(item.election_date).format("MMMM Do, YYYY")}</div>
          </button>
        </dl>
      </div>
     );
    priorElectionList = cleanArray(priorElectionList);

    return <div>
      { upcomingElectionList && upcomingElectionList.length ?
        <h4 className="h4">Upcoming Election(s)</h4> :
        null }
      {upcomingElectionList}

      { priorElectionList && priorElectionList.length ?
        <h4 className="h4">Prior Election(s)</h4> :
        null }
      {priorElectionList}
    </div>;
  }
}
