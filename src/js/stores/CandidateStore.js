var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");
import OfficeActions from "../actions/OfficeActions";
import OfficeStore from "../stores/OfficeStore";

class CandidateStore extends FluxMapStore {

  getInitialState () {
    return {
      all_cached_candidates: {}, // Dictionary with candidate_we_vote_id as key and the candidate as value
      position_list_from_advisers_followed_by_voter: {}, // Dictionary with candidate_we_vote_id as key and list of positions as value
    };
  }

  getCandidate (candidate_we_vote_id) {
    return this.getState().all_cached_candidates[candidate_we_vote_id] || [];
  }

  getPositionList (candidate_we_vote_id) {
    return this.getState().position_list_from_advisers_followed_by_voter[candidate_we_vote_id] || [];
  }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    let all_cached_candidates;
    let ballot_item_we_vote_id;
    let candidate;
    var key;
    let new_position_list;
    let position_list_for_candidate;
    let position_list_from_advisers_followed_by_voter;

    switch (action.type) {

      case "candidateRetrieve":
        key = action.res.we_vote_id;
        // Make sure we have information for the office the candidate is running for
        if (action.res.contest_office_we_vote_id) {
          let office = OfficeStore.getOffice(action.res.contest_office_we_vote_id);
          if (!office || !office.ballot_item_display_name) {
            OfficeActions.officeRetrieve(action.res.contest_office_we_vote_id);
          }
        }
        // merged_properties = assign({}, state.get(key), action.res );
        // return state.set(key, merged_properties );
        candidate = action.res;
        all_cached_candidates = state.all_cached_candidates;
        all_cached_candidates[candidate.we_vote_id] = candidate;
        return {
          ...state,
          all_cached_candidates: all_cached_candidates
        };

      case "positionListForBallotItem":
        position_list_for_candidate = action.res.kind_of_ballot_item === "CANDIDATE";
        if (position_list_for_candidate) {
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

      case "error-candidateRetrieve" || "error-positionListForBallotItem":
        console.log(action);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new CandidateStore(Dispatcher);
