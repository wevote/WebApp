var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class OrganizationStore extends FluxMapStore {

  reduce (state, action) {
    var key;
    var merged_properties;

    switch (action.type) {

      // After an organization is created, return it
      case "organizationSave":
        key = action.res.organization_we_vote_id;
        merged_properties = assign({}, state.get(key), action.res );
        return state.set(key, merged_properties );

      case "organizationRetrieve":
        key = action.res.organization_we_vote_id;
        merged_properties = assign({}, state.get(key), action.res );
        return state.set(key, merged_properties );

      case "positionListForOpinionMaker":
        key = action.res.opinion_maker_we_vote_id;
        var position_list = action.res.position_list;
        if (action.res.filter_for_voter) {
          var position_list_for_one_election = action.res.position_list;
          merged_properties = assign({}, state.get(key), {
            position_list_for_one_election: position_list_for_one_election
          } );
        } else if (action.res.filter_out_voter) {
          var position_list_for_all_except_one_election = action.res.position_list;
          merged_properties = assign({}, state.get(key), {
            position_list_for_all_except_one_election: position_list_for_all_except_one_election
          } );
        } else {
          merged_properties = assign({}, state.get(key), {
            position_list: position_list
          } );
        }
        return state.set(key, merged_properties );

      default:
        return state;
    }

  }

}

module.exports = new OrganizationStore(Dispatcher);
