var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");
import SupportActions from "../actions/SupportActions";

class SupportStore extends FluxMapStore {

  get (we_vote_id) {
    if (!(this.supportList && this.opposeList && this.supportCounts && this.opposeCounts )){
      return undefined;
    }
   return {
     is_support: this.supportList[we_vote_id] || false,
     is_oppose: this.opposeList[we_vote_id] || false,
     voter_statement_text: this.statementList[we_vote_id] || "",
     support_count: this.supportCounts[we_vote_id],
     oppose_count: this.opposeCounts[we_vote_id]
   };
  }

  get supportList (){
    return this.getState().voter_supports;
  }

  get opposeList (){
    return this.getState().voter_opposes;
  }

  get statementList (){
    return this.getState().voter_statement_text;
  }

  get supportCounts (){
    return this.getState().support_counts;
  }

  get opposeCounts (){
    return this.getState().oppose_counts;
  }

  listWithChangedCount (list, we_vote_id, amount) {
    return assign({}, list, { [we_vote_id]: list[we_vote_id] + amount });
  }

  statementListWithChanges (statement_list, we_vote_id, new_voter_statement_text) {
    return assign({}, statement_list, { [we_vote_id]: new_voter_statement_text });
  }

/* Turn action into a dictionary/object format with we_vote_id as key for fast lookup */
  parseListToHash (property, list){
    let hash_map = {};
    list.forEach(el => {
      hash_map[el.ballot_item_we_vote_id] = el[property];
    });
    return hash_map;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    let we_vote_id = "";
    if (action.res.ballot_item_we_vote_id) {
      we_vote_id = action.res.ballot_item_we_vote_id;
    }

    switch (action.type) {

      case "voterAddressRetrieve":
        let id = action.res.google_civic_election_id;
        SupportActions.retrieveAll();
        SupportActions.retrieveAllCounts();
        return state;

      case "voterAllPositionsRetrieve":
        // is_support is a property coming from 'position_list' in the incoming response
        // this.state.voter_supports is an updated hash with the contents of position list['is_support']
        return {
          ...state,
          voter_supports: this.parseListToHash("is_support", action.res.position_list),
          voter_opposes: this.parseListToHash("is_oppose", action.res.position_list),
          voter_statement_text: this.parseListToHash("statement_text", action.res.position_list)
        };

      case "positionsCountForAllBallotItems":
        return {
          ...state,
          oppose_counts: this.parseListToHash("oppose_count", action.res.position_counts_list),
          support_counts: this.parseListToHash("support_count", action.res.position_counts_list)
        };

      case "voterOpposingSave":
        return {
          ...state,
          voter_supports: assign({}, state.voter_supports, { [we_vote_id]: false }),
          voter_opposes: assign({}, state.voter_opposes, { [we_vote_id]: true }),
          support_counts: state.voter_supports[we_vote_id] ?
                        this.listWithChangedCount(state.support_counts, we_vote_id, -1 ) :
                        state.support_counts,
          oppose_counts: this.listWithChangedCount(state.oppose_counts, we_vote_id, 1)
        };

      case "voterStopOpposingSave":
        return {
          ...state,
          voter_opposes: assign({}, state.voter_opposes, { [we_vote_id]: false }),
          oppose_counts: this.listWithChangedCount(state.oppose_counts, we_vote_id, -1)
        };

      case "voterSupportingSave":
        return {
          ...state,
          voter_supports: assign({}, state.voter_supports, { [we_vote_id]: true }),
          voter_opposes: assign({}, state.voter_opposes, { [we_vote_id]: false }),
          support_counts: this.listWithChangedCount(state.support_counts, we_vote_id, 1),
          oppose_counts: state.voter_opposes[we_vote_id] ?
                        this.listWithChangedCount(state.oppose_counts, we_vote_id, -1) :
                        state.oppose_counts,
        };

      case "voterStopSupportingSave":
        return {
          ...state,
          voter_supports: assign({}, state.voter_supports, { [we_vote_id]: false }),
          support_counts: this.listWithChangedCount(state.support_counts, we_vote_id, -1)
        };

      case "voterPositionCommentSave":
        // Add the comment to the list in memory
        return {
          ...state,
          voter_statement_text: this.statementListWithChanges(state.voter_statement_text, we_vote_id, action.res.statement_text)
        };

      default:
        return state;
    }
  }
}

module.exports = new SupportStore(Dispatcher);
