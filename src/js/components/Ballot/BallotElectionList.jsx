import React, { Component, PropTypes } from "react";
import VoterActions from "../../actions/VoterActions";
import { cleanArray } from "../../utils/textFormat";
let moment = require("moment");

export default class BallotElectionList extends Component {

  static propTypes = {
    ballotElectionList: PropTypes.array.isRequired,
    toggleFunction: PropTypes.func.isRequired,
  };

  constructor (props){
    super(props);
    this.state = {};
  }

  updateBallot (originalTextForMapSearch, simpleSave, googleCivicElectionId) {
    console.log("BallotElectionList.jsx updateBallot, googleCivicElectionId: ", googleCivicElectionId);
    VoterActions.voterAddressSave(originalTextForMapSearch, simpleSave, googleCivicElectionId);
    // Not necessary here: BallotActions.voterBallotItemsRetrieve(googleCivicElectionId);
    this.props.toggleFunction();
  }

  render () {
    let currentDate = moment().format("YYYY-MM-DD");
    let simpleSave = true;
    let upcomingElectionList = this.props.toggleFunction.map((item, index) =>
      item.election_date > currentDate ?
      <div key={index}>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success"
            onClick={this.updateBallot.bind(this, item.originalTextForMapSearch, simpleSave, item.googleCivicElectionId)}>
            See {item.election_description_text} <span><img src={"/img/global/icons/Circle-Arrow.png"}/></span><br />
            <span className="ballot-election-list__h2 pull-left"> {moment(item.election_date).format("MMMM Do, YYYY")}</span>
          </button>
        </dl>
      </div> :
      null
     );
    upcomingElectionList = cleanArray(upcomingElectionList);

    let priorElectionList = this.props.toggleFunction.map((item, index) =>
      item.election_date > currentDate ?
      null :
      <div key={index}>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success"
            onClick={this.updateBallot.bind(this, item.originalTextForMapSearch, simpleSave, item.googleCivicElectionId)}>
            See {item.election_description_text} <span><img src={"/img/global/icons/Circle-Arrow.png"}/></span><br />
            <span className="ballot-election-list__h2 pull-left"> {moment(item.election_date).format("MMMM Do, YYYY")}</span>
          </button>
        </dl>
      </div>
     );
    priorElectionList = cleanArray(priorElectionList);

    return <div>
      { upcomingElectionList && upcomingElectionList.length > 0 ?
        <h4 className="h4">Upcoming Election(s)</h4> :
        null }
      {upcomingElectionList}

      { priorElectionList && priorElectionList.length > 0 ?
        <h4 className="h4">Prior Election(s)</h4> :
        null }
      {priorElectionList}
    </div>;
  }
}
