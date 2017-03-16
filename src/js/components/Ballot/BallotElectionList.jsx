import React, { Component, PropTypes } from "react";
import BallotActions from "../../actions/BallotActions";
import VoterActions from "../../actions/VoterActions";
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
    BallotActions.voterBallotItemsRetrieve(google_civic_election_id);
    this.props._toggleSelectBallotModal();
  }

  render () {
    let currentDate = moment().format("YYYY-MM-DD");
    let simple_save = true;
    const electionList = this.props.ballot_election_list.map((item, index) =>
      item.election_date > currentDate ?
      <div key={index}>
        <p>(Upcoming Election)</p>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success"
            onClick={this.updateBallot.bind(this, item.original_text_for_map_search, simple_save, item.google_civic_election_id)}>
            See {item.election_description_text} <span><img src={"/img/global/icons/Circle-Arrow.png"}/></span><br />
            <span className="ballot-election-list__h2 pull-left"> {moment(item.election_date).format("MMMM Do, YYYY")}</span>
          </button>
        </dl>
      </div> :
      <div key={index}>
      <p>(Click to switch to your previous ballot and see election results)</p>
        <dl className="list-unstyled text-center">
          <button type="button" className="btn btn-success"
            onClick={this.updateBallot.bind(this, item.original_text_for_map_search, simple_save, item.google_civic_election_id)}>
            See {item.election_description_text} <span><img src={"/img/global/icons/Circle-Arrow.png"}/></span><br />
            <span className="ballot-election-list__h2 pull-left"> {moment(item.election_date).format("MMMM Do, YYYY")}</span>
          </button>
        </dl>
      </div>
     );

    return <div>
      {electionList}
    </div>;
  }
}
