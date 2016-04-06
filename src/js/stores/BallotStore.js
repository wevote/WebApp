let Dispatcher = require("../dispatcher/Dispatcher");
let FluxMapStore = require("flux/lib/FluxMapStore");
import BallotActions from "../actions/BallotActions";
import VoterStore from "../stores/VoterStore";
import SupportStore from "../stores/SupportStore";
const assign = require("object-assign");

class BallotStore extends FluxMapStore {
  getInitialState () {
    return {
      ballots: {}
    };
  }

  get ballot_found (){
    return this.getState().ballot_found;
  }

  get ballot_supported () {
    let ballot = this.ballot;
    if (!ballot) { return undefined; }

    return ballot.filter( ballot_item => {
      let { kind_of_ballot_item, we_vote_id, candidate_list } = ballot_item;
      if (kind_of_ballot_item === "OFFICE"){ //Offices
        ballot_item.candidate_list = this.filtered_candidate_list(candidate_list);
        return ballot_item.candidate_list.length > 0 ? ballot_item : false;
      } else { //MEASURES
        return SupportStore.supportList[we_vote_id];
      }
    });
  }

  filtered_candidate_list (list){
    return list.filter(candidate =>{
      return SupportStore.supportList[candidate.we_vote_id] ? true : false;
    });
  }

  get ballot () {
    let civicId = VoterStore.election_id();
    if (!civicId){
      return undefined;
    } else {
      return this.getState().ballots[civicId];
    }
  }

  reduce (state, action) {

    if (action.res.success === false)
      return state;

    let key, ballot;
    let newBallot = {};

    switch (action.type) {

      case "voterRetrieve":
        BallotActions.retrieve();
        return state;

      case "voterBallotItemsRetrieve":
        key = action.res.google_civic_election_id;
        ballot = action.res.ballot_item_list || [];
        newBallot[key] = ballot;

        return {
          ...state,
          ballot_found: action.res.ballot_found,
          ballots: assign({}, state.ballots, newBallot )
        };

      case "voterAddressSave":
        key = action.res.google_civic_election_id;
        ballot = action.res.ballot_item_list || [];
        newBallot[key] = ballot;

        return {
          ...state,
          ballot_found: action.res.ballot_found,
          ballots: assign({}, state.ballots, newBallot )
        };

      case "error-voterBallotItemsRetrieve":
      default:
        return state;
    }

  }

}

module.exports = new BallotStore(Dispatcher);
