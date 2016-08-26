var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");
import OfficeActions from "../actions/OfficeActions";

class CandidateStore extends FluxMapStore {

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    var key;
    var merged_properties;

    switch (action.type) {

      case "candidateRetrieve":
        key = action.res.we_vote_id;
        OfficeActions.retrieve(action.res.contest_office_we_vote_id);
        merged_properties = assign({}, state.get(key), action.res );
        return state.set(key, merged_properties );

      case "positionListForBallotItem":
        key = action.res.ballot_item_we_vote_id;
        var position_list = action.res.position_list;
        // console.log("CandidateStore, positionListForBallotItem, position_list:", position_list);
        merged_properties = assign({}, state.get(key), {position_list: position_list} );
        return state.set(key, merged_properties );

      case "error-candidateRetrieve" || "error-positionListForBallotItem":
        console.log(action);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new CandidateStore(Dispatcher);
