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

  get ballot () {
    let civicId = VoterStore.election_id();
    if (!civicId){
      return undefined;
    } else {
      return this.getState().ballots[civicId];
    }
  }

  get ballot_remaining_choices (){
    let ballot = this.ballot;
    if (!ballot || !SupportStore.supportList ) { return undefined; }

    return ballot.filter( ballot_item => {
      let {kind_of_ballot_item, we_vote_id, candidate_list } = ballot_item;
      if (kind_of_ballot_item === "OFFICE"){ // OFFICE - you are undecided if you haven't supported anyone
        return candidate_list.filter(candidate =>{
          return SupportStore.supportList[candidate.we_vote_id];
        }).length === 0;
      } else { //MEASURES - you haven't decided if you neither support nor oppose
        return !SupportStore.supportList[we_vote_id] && !SupportStore.opposeList[we_vote_id];
      }
    });
  }

  get ballot_supported () {
    let ballot = this.ballot;
    if (!ballot || !SupportStore.supportList ) { return undefined; }

    return this.ballot_filtered_unsupported_candidates().filter( ballot_item => {
      if (ballot_item.kind_of_ballot_item === "OFFICE"){ //Offices
        return ballot_item.candidate_list.length > 0;
      } else { //MEASURES
        return SupportStore.supportList[ballot_item.we_vote_id];
      }
    });
  }

//Filters the ballot items which are type OFFICE
  ballot_filtered_unsupported_candidates (){
    return this.ballot.map( item =>{
      let is_office = item.kind_of_ballot_item === "OFFICE";
      return is_office ? this.filtered_ballot_item(item) : item;
    });
  }

//Filters out the unsupported candidates from a ballot_item where type is OFFICE
  filtered_ballot_item (ballot_item){
    let filtered_list = ballot_item.candidate_list.filter(candidate => {
      return SupportStore.supportList[candidate.we_vote_id] ? true : false;
    });
    return assign({}, ballot_item, {candidate_list: filtered_list });
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
