import React, { Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import BallotActions from "../../actions/BallotActions";
import VoterActions from "../../actions/VoterActions";

export default class BallotElectionList extends Component {
//  static propTypes = {
//    ballot_election_listlist: propTypes.array
//  };

  constructor (props){
    super(props);
    this.state = {};
  }

  updateBallot (google_civic_election_id, original_text_for_map_search, simple_save) {
    VoterActions.voterAddressSave(google_civic_election_id, original_text_for_map_search, simple_save);
    BallotActions.voterBallotItemsRetrieve(google_civic_election_id);
    browserHistory.push("/ballot");
  }

  formattedDate (election_date) {
    let formatted_date = election_date.slice(5, 7) + "/" + election_date.slice(8) + "/" + election_date.slice(0, 4);
    return formatted_date;
  }

  render () {
  let simple_save = true;
    return <div>
        <dl className="list-unstyled">{this.props.ballot_election_list.map((item, index) =>
          <dd className="ballot-election-list__li" role="button" key={index}
            onClick={this.updateBallot.bind(this, item.google_civic_election_id, item.original_text_for_map_search, simple_save)}>
            {item.election_description_text + " on " + this.formattedDate(item.election_date)}</dd>
         )}
        </dl>
  </div>;
  }
}
