var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");

class MeasureStore extends FluxMapStore {

  getInitialState () {
    return {
      all_cached_measures: {}, // Dictionary with measure_we_vote_id as key and the measure as value
      position_list_from_advisers_followed_by_voter: {}, // Dictionary with measure_we_vote_id as key and list of positions as value
    };
  }

  getMeasure (measure_we_vote_id) {
    return this.getState().all_cached_measures[measure_we_vote_id] || [];
  }

  getPositionList (measure_we_vote_id) {
    return this.getState().position_list_from_advisers_followed_by_voter[measure_we_vote_id] || [];
  }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    let all_cached_measures;
    let ballot_item_we_vote_id;
    let measure;
    let new_position_list;
    let position_list_for_measure;
    let position_list_from_advisers_followed_by_voter;

    switch (action.type) {

      case "measureRetrieve":
        measure = action.res;
        all_cached_measures = state.all_cached_measures;
        all_cached_measures[measure.we_vote_id] = measure;
        return {
          ...state,
          all_cached_measures: all_cached_measures
        };

      case "positionListForBallotItem":
        position_list_for_measure = action.res.kind_of_ballot_item === "MEASURE";
        if (position_list_for_measure) {
          ballot_item_we_vote_id = action.res.ballot_item_we_vote_id;
          new_position_list = action.res.position_list;
          position_list_from_advisers_followed_by_voter = state.position_list_from_advisers_followed_by_voter;
          position_list_from_advisers_followed_by_voter[ballot_item_we_vote_id] = new_position_list;
          return {
            ...state,
            position_list_from_advisers_followed_by_voter: position_list_from_advisers_followed_by_voter,
          };
        } else {
          return state;
        }

      case "error-measureRetrieve" || "error-positionListForBallotItem":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

module.exports = new MeasureStore(Dispatcher);
