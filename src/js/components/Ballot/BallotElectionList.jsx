import React, { Component, PropTypes } from "react";
import VoterActions from "../../actions/VoterActions";
import { cleanArray } from "../../utils/textFormat";
let moment = require("moment");

export default class BallotElectionList extends Component {

  static propTypes = {
    ballot_election_list: PropTypes.array.isRequired,
    _toggleSelectBallotModal: PropTypes.func.isRequired,
  }

  constructor (props){
    super(props);
    this.state = {};
  }

  updateBallot (original_text_for_map_search, simple_save, google_civic_election_id) {
    VoterActions.voterAddressSave(original_text_for_map_search, simple_save, google_civic_election_id);
    // Not necessary here: BallotActions.voterBallotItemsRetrieve(google_civic_election_id);
    this.props._toggleSelectBallotModal();
  }

  render () {
    let currentDate = moment().format("YYYY-MM-DD");
    let simple_save = true;
    let upcomingElectionList = this.props.ballot_election_list.map((item, index) =>
      item.election_date > currentDate ?
      <div key={index}>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success"
            onClick={this.updateBallot.bind(this, item.original_text_for_map_search, simple_save, item.google_civic_election_id)}>
            See {item.election_description_text} <span><img src={"/img/global/icons/Circle-Arrow.png"}/></span><br />
            <span className="ballot-election-list__h2 pull-left"> {moment(item.election_date).format("MMMM Do, YYYY")}</span>
          </button>
        </dl>
      </div> :
      null
     );
    upcomingElectionList = cleanArray(upcomingElectionList);

    let priorElectionList = this.props.ballot_election_list.map((item, index) =>
      item.election_date > currentDate ?
      null :
      <div key={index}>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success"
            onClick={this.updateBallot.bind(this, item.original_text_for_map_search, simple_save, item.google_civic_election_id)}>
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
