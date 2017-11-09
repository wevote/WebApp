import React, { PropTypes, Component } from "react";
import { Button } from "react-bootstrap";
import { browserHistory } from "react-router";
import BallotActions from "../../actions/BallotActions";
import BallotStore from "../../stores/BallotStore";
import ElectionStore from "../../stores/ElectionStore";
import VoterStore from "../../stores/VoterStore";
import { shortenText } from "../../utils/textFormat";
import BallotLocationButton from "./BallotLocationButton";


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
    this.hideToggle = this.hideToggle.bind(this);
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
    // console.log("BallotLocationChoices componentWillReceiveProps, nextProps.google_civic_election_id: ", nextProps.google_civic_election_id);
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
      return +(parseInt(a.value.ballot_location_order, 10) > parseInt(b.value.ballot_location_order, 10)) ||
        +(parseInt(a.value.ballot_location_order, 10) === parseInt(b.value.ballot_location_order, 10)) - 1;
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
    if (ballot_location_shortcut !== "" && ballot_location_shortcut !== undefined) {
      BallotActions.voterBallotItemsRetrieve(0, "", ballot_location_shortcut);
      // Change the URL to match
      browserHistory.push("/ballot/" + ballot_location_shortcut);
    } else if (ballot_returned_we_vote_id !== "" && ballot_returned_we_vote_id !== undefined) {
      BallotActions.voterBallotItemsRetrieve(0, ballot_returned_we_vote_id, "");
      // Change the URL to match
      browserHistory.push("/ballot/id/" + ballot_returned_we_vote_id);
    }
  }

  hideToggle(){
    this.setState({ hide: !this.state.hide });
  }

  render () {
    // console.log("In BallotLocationChoices render, ballot_location_list: ", this.state.ballot_location_list);
    if (this.state.ballot_location_list && this.state.ballot_location_list.length) {
      //  className="container-fluid card"
      return <div className="u-stack--sm ballot-locations">
        <div className="btn-group">
            <div className="ballot-locations-mobile">
              {this.state.ballot_location_list.slice(0, 3).map((ballot_location, key) => {
                return <BallotLocationButton key={key} ballot_location={ballot_location} />;
              })}

              <div className={(this.state.hide) ? "hide": "show"}>
                {this.state.ballot_location_list.slice(3).map((ballot_location, key) => {
                  return <BallotLocationButton key={key} ballot_location={ballot_location} />; 
                })}
              </div>
              <div>
                <a onClick={this.hideToggle}>
                  {(this.state.hide) ? "Show " + Math.max(0, this.state.ballot_location_list.length - 3) + " more": "Hide"}
                </a>
              </div>
            </div>
            <div className="ballot-locations-desktop">
              {this.state.ballot_location_list.map( (ballot_location, key) => {
                return <BallotLocationButton key={key} ballot_location={ballot_location} />;
              })} 
            </div>
        </div>
      </div>;
    } else {
      return <div />;
    }
  }
}
