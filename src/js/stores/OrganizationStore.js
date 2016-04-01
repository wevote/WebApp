var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class OrganizationStore extends FluxMapStore {

  reduce (state, action) {
    var key;
    var merged_properties;

    switch (action.type) {

      case "organizationRetrieve":
        key = action.res.organization_we_vote_id;
        merged_properties = assign({}, state.get(key), action.res );
        return state.set(key, merged_properties );

      case "positionListForOpinionMaker":
        key = action.res.opinion_maker_we_vote_id;
        var position_list = action.res.position_list;
        merged_properties = assign({}, state.get(key), {position_list: position_list} );
        return state.set(key, merged_properties );

      default:
        return state;
    }

  }

}

module.exports = new OrganizationStore(Dispatcher);
