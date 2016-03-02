var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");
import OfficeActions from "../actions/OfficeActions";

class CandidateStore extends FluxMapStore {

  reduce (state, action) {

    if (action.res.success === false)
      return state;

    switch (action.type) {

      case "candidateRetrieve":
        var key = action.res.we_vote_id;
        var candidate = action.res || {};
        this.__we_vote_id = key;
        OfficeActions.retrieve(action.res.contest_office_we_vote_id)
        var props = action.res;
        var merged_properties = assign({}, state.get(key), props );
        return state.set(key, merged_properties );

      case 'positionListForBallotItem':
        var we_vote_id = action.res.ballot_item_we_vote_id;
        var position_list = action.res.position_list;
        var merged_properties = assign({}, state.get(we_vote_id), {position_list: position_list} );
        return state.set(we_vote_id, merged_properties );

      case 'voterPositionRetrieve':
        var we_vote_id = action.res.ballot_item_we_vote_id;
        var merged_properties = assign({}, state.get(we_vote_id), {'is_oppose': action.is_oppose, 'is_support': action.is_support} );
        return state.set(we_vote_id, merged_properties );

      case 'positionSupportCountForBallotItem':
        var we_vote_id = action.res.ballot_item_we_vote_id;
        var merged_properties = assign({}, state.get(we_vote_id), {'count': action.count } );
        return state.set(we_vote_id, merged_properties );

      case "error-candidateRetrieve":
      default:
        return state;
    }

  }

}

module.exports = new CandidateStore(Dispatcher);
