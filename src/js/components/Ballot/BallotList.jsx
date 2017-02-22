import React, { Component, PropTypes } from "react";
import { browserHistory, Link } from "react-router";
import BallotActions from "../../actions/BallotActions";
import VoterActions from "../../actions/VoterActions";

export default class BallotList extends Component {
//  static propTypes = {
//  ballot_list: propTypes.object
//  };

  constructor (props){
    super(props);
    this.state = {};
  }

  updateBallot (google_civic_election_id, original_text_for_map_search, simple_save) {
    VoterActions.voterAddressSave(original_text_for_map_search, simple_save);
    BallotActions.voterBallotItemsRetrieve(google_civic_election_id);
    browserHistory.push("/ballot");
  }

  render () {
  let simple_save = true;
    return <div>
    <div className="text-center">
      <ul>{this.props.ballot_election_list.map((item, index) =>
        <li key={index} onClick={this.updateBallot.bind(this, item.google_civic_election_id, item.original_text_for_map_search, simple_save)}>
          {item.election_description_text}
        </li>
       )}
     </ul>
   </div>
    </div>;
  }
}
