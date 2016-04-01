let Dispatcher = require("../dispatcher/Dispatcher");
let FluxMapStore = require("flux/lib/FluxMapStore");
import BallotActions from "../actions/BallotActions";
import VoterStore from "../stores/VoterStore";
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
    console.log(this.getState().ballots);
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
