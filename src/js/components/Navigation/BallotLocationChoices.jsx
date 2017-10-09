import React, { PropTypes, Component } from "react";
import { Button } from "react-bootstrap";
import BallotActions from "../../actions/BallotActions";
import BallotStore from "../../stores/BallotStore";
import ElectionStore from "../../stores/ElectionStore";
import VoterStore from "../../stores/VoterStore";


export default class BallotLocationChoices extends Component {
  static propTypes = {
    current_voter_address: PropTypes.string,
    google_civic_election_id: PropTypes.number.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      google_civic_election_id: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount () {
    // console.log("In BallotLocationChoices componentDidMount,  this.props.google_civic_election_id: ", this.props.google_civic_election_id);
    this.electionStoreListener = ElectionStore.addListener(this.onElectionStoreChange.bind(this));
    this.setState({
      google_civic_election_id: this.props.google_civic_election_id,
      ballot_location_list: this.retrieveBallotLocationList(this.props.google_civic_election_id),
    });
    // console.log("In BallotLocationChoices componentDidMount, ballot_location_list_sorted: ", ballot_location_list_sorted);
  }
  componentWillReceiveProps (nextProps) {
    // console.log("BallotLocationChoices componentWillReceiveProps");
    this.setState({
      google_civic_election_id: nextProps.google_civic_election_id,
      ballot_location_list: this.retrieveBallotLocationList(nextProps.google_civic_election_id),
    });
  }

  componentWillUnmount () {
    // console.log("BallotLocationChoices componentWillUnmount");
    this.electionStoreListener.remove();
  }

  onElectionStoreChange () {
    // console.log("BallotLocationChoices, onElectionStoreChange");
    this.setState({
      ballot_location_list: this.retrieveBallotLocationList(this.state.google_civic_election_id),
    });
    // console.log("In BallotLocationChoices onElectionStoreChange, ballot_location_list_unsorted: ", ballot_location_list_unsorted);
  }

  retrieveBallotLocationList (google_civic_election_id) {
    // console.log("retrieveBallotLocationList, google_civic_election_id: ", google_civic_election_id);
    if (!google_civic_election_id || google_civic_election_id === 0) {
      return [];
    }
    let ballot_location_list_unsorted = ElectionStore.getBallotLocationsForElection(google_civic_election_id);
    let ballot_location_list_sorted = this.sortBallotLocations(ballot_location_list_unsorted);
    let voter_ballot_location = VoterStore.getBallotLocationForVoter();
    if (voter_ballot_location && voter_ballot_location.ballot_returned_we_vote_id) {
      let voter_ballot_location_in_list = false;
      // If the election in the voter_ballot_location matches the election we are looking at,
      // include the voter's displayed address
      // console.log("retrieveBallotLocationList, google_civic_election_id: ", google_civic_election_id, ", voter_ballot_location: ", voter_ballot_location);
      if (voter_ballot_location.google_civic_election_id === google_civic_election_id) {
        ballot_location_list_sorted.map((ballot_location) => {
          if (ballot_location.ballot_returned_we_vote_id === voter_ballot_location.ballot_returned_we_vote_id) {
            voter_ballot_location_in_list = true;
          }
        });

        if (!voter_ballot_location_in_list) {
          // The this ballot isn't already in the list, add it to the start
          ballot_location_list_sorted.unshift(voter_ballot_location); // Add to the start of the array
          // console.log("Added to start of ballot_location_list_sorted: ", voter_ballot_location);
        }
      }
    }
    return ballot_location_list_sorted;
  }

  sortBallotLocations (ballot_location_list_unsorted) {
    // temporary array holds objects with position and sort-value
    let mapped = ballot_location_list_unsorted.map( (ballot_location, i) => {
      return { index: i, value: ballot_location };
    });

    // sorting the mapped array based on ballot_location_order which came from the server
    mapped.sort( (a, b) => {
      return +(parseInt(a.value.ballot_location_order) > parseInt(b.value.ballot_location_order)) ||
        +(parseInt(a.value.ballot_location_order) === parseInt(b.value.ballot_location_order)) - 1;
    });

    let orderedArray = [];
    for (let element of mapped) {
      orderedArray.push(element.value);
    }

    return orderedArray;
  }

  handleClick (ballot_returned_we_vote_id = "", ballot_location_shortcut = "") {
    // console.log("BallotLocationChoices, handleClick, ballot_returned_we_vote_id: ", ballot_returned_we_vote_id);
    // console.log("BallotLocationChoices, handleClick, ballot_location_shortcut: ", ballot_location_shortcut);
    let google_civic_election_id = 0;
    BallotActions.voterBallotItemsRetrieve(google_civic_election_id, ballot_returned_we_vote_id, ballot_location_shortcut);
  }

  render () {
    // console.log("In BallotLocationChoices render, ballot_location_list: ", this.state.ballot_location_list);
    if (this.state.ballot_location_list && this.state.ballot_location_list.length) {
      //  className="container-fluid card"
      return <div className="u-stack--sm">
        <div className="btn-group">
        {this.state.ballot_location_list.map( (ballot_location, key) => {
          if (ballot_location.ballot_item_display_name !== "" || ballot_location.text_for_map_search !== "") {
            let ballot_location_shortcut_of_retrieved_ballot = "";
            let ballot_location_shortcut_matches = false;
            let ballot_returned_we_vote_id_of_retrieved_ballot = "";
            let ballot_returned_we_vote_id_matches = false;
            let ballot_location_display_name = "";
            if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_location_shortcut) {
              ballot_location_shortcut_of_retrieved_ballot = BallotStore.ballot_properties.ballot_location_shortcut;
              if (ballot_location.ballot_location_shortcut && ballot_location_shortcut_of_retrieved_ballot) {
                if (ballot_location.ballot_location_shortcut === ballot_location_shortcut_of_retrieved_ballot) {
                  ballot_location_shortcut_matches = true;
                }
              }
            }
            if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_returned_we_vote_id) {
              ballot_returned_we_vote_id_of_retrieved_ballot = BallotStore.ballot_properties.ballot_returned_we_vote_id;
              if (ballot_location.ballot_returned_we_vote_id && ballot_returned_we_vote_id_of_retrieved_ballot) {
                if (ballot_location.ballot_returned_we_vote_id === ballot_returned_we_vote_id_of_retrieved_ballot) {
                  ballot_returned_we_vote_id_matches = true;
                }
              }
            }
            console.log("ballot_location");
            if (ballot_location.ballot_location_display_name && ballot_location.ballot_location_display_name !== "") {
              ballot_location_display_name = ballot_location.ballot_location_display_name;
            } else if (ballot_location.text_for_map_search !== "") {
              ballot_location_display_name = ballot_location.text_for_map_search;
            } else {
              ballot_location_display_name = "My Address";
            }
            return <span key={key} className="u-push--md">
              <Button bsStyle={ballot_location_shortcut_matches || ballot_returned_we_vote_id_matches ? "info" : "default"}
                      onClick={() => { this.handleClick(ballot_location.ballot_returned_we_vote_id, ballot_location.ballot_location_shortcut); }} >
                <span>{ballot_location_display_name}</span>
              </Button>
            </span>;
          } else {
            return <span key={key} />;
          }
        })}
        </div>
      </div>;
    } else {
      return <div />;
    }
  }
}
