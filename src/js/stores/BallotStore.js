var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");

class BallotStore extends FluxMapStore {
  get ballot () {
    return this.getState().get(this.__civicId);
  }

  // get civicId () {
  //   return this.__civicId;
  // }

  getGoogleCivicElectionId (){
    return this.__civicId;
  }

  reduce (state, action) {
    var key = action.res.google_civic_election_id;
    var ballot = action.res.ballot_item_list || [];

    if (action.res.success === false)
      return state;

    switch (action.type) {
      case "voterBallotItemsRetrieve":
        this.__civicId = key;
        return state.set(key, ballot);

      case "error-voterBallotItemsRetrieve":
      default:
        return state;
    }

  }

}

module.exports = new BallotStore(Dispatcher);
