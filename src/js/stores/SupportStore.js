var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");
import SupportActions from "../actions/SupportActions";

class SupportStore extends FluxMapStore {

  get (ballot_item_we_vote_id) {
    //console.log("SupportStore, ballot_item_we_vote_id: ", ballot_item_we_vote_id, ", is_public_position: ", this.isForPublicList[ballot_item_we_vote_id]);
    if (!(this.supportList && this.opposeList && this.supportCounts && this.opposeCounts )){
      return undefined;
    }
    return {
      is_support: this.supportList[ballot_item_we_vote_id] || false,
      is_oppose: this.opposeList[ballot_item_we_vote_id] || false,
      is_public_position: this.isForPublicList[ballot_item_we_vote_id] || false,  // Default to friends only
      voter_statement_text: this.statementList[ballot_item_we_vote_id] || "",
      support_count: this.supportCounts[ballot_item_we_vote_id],
      oppose_count: this.opposeCounts[ballot_item_we_vote_id]
    };
  }

  get supportList (){
    return this.getState().voter_supports;
  }

  get opposeList (){
    return this.getState().voter_opposes;
  }

  get isForPublicList (){
    return this.getState().is_public_position;
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

  listWithChangedCount (list, ballot_item_we_vote_id, amount) {
    return assign({}, list, { [ballot_item_we_vote_id]: list[ballot_item_we_vote_id] + amount });
  }

  statementListWithChanges (statement_list, ballot_item_we_vote_id, new_voter_statement_text) {
    return assign({}, statement_list, { [ballot_item_we_vote_id]: new_voter_statement_text });
  }

  isForPublicListWithChanges (is_public_position_list, ballot_item_we_vote_id, is_public_position) {
    return assign({}, is_public_position_list, { [ballot_item_we_vote_id]: is_public_position });
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

    let ballot_item_we_vote_id = "";
    if (action.res.ballot_item_we_vote_id) {
      ballot_item_we_vote_id = action.res.ballot_item_we_vote_id;
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
        //console.log("voterAllPositionsRetrieve, ballot_item_we_vote_id: ", ballot_item_we_vote_id, ", response: ", action.res);
        return {
          ...state,
          voter_supports: this.parseListToHash("is_support", action.res.position_list),
          voter_opposes: this.parseListToHash("is_oppose", action.res.position_list),
          voter_statement_text: this.parseListToHash("statement_text", action.res.position_list),
          is_public_position: this.parseListToHash("is_public_position", action.res.position_list)
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
          voter_supports: assign({}, state.voter_supports, { [ballot_item_we_vote_id]: false }),
          voter_opposes: assign({}, state.voter_opposes, { [ballot_item_we_vote_id]: true }),
          support_counts: state.voter_supports[ballot_item_we_vote_id] ?
                        this.listWithChangedCount(state.support_counts, ballot_item_we_vote_id, -1 ) :
                        state.support_counts,
          oppose_counts: this.listWithChangedCount(state.oppose_counts, ballot_item_we_vote_id, 1)
        };

      case "voterStopOpposingSave":
        return {
          ...state,
          voter_opposes: assign({}, state.voter_opposes, { [ballot_item_we_vote_id]: false }),
          oppose_counts: this.listWithChangedCount(state.oppose_counts, ballot_item_we_vote_id, -1)
        };

      case "voterSupportingSave":
        return {
          ...state,
          voter_supports: assign({}, state.voter_supports, { [ballot_item_we_vote_id]: true }),
          voter_opposes: assign({}, state.voter_opposes, { [ballot_item_we_vote_id]: false }),
          support_counts: this.listWithChangedCount(state.support_counts, ballot_item_we_vote_id, 1),
          oppose_counts: state.voter_opposes[ballot_item_we_vote_id] ?
                        this.listWithChangedCount(state.oppose_counts, ballot_item_we_vote_id, -1) :
                        state.oppose_counts,
        };

      case "voterStopSupportingSave":
        return {
          ...state,
          voter_supports: assign({}, state.voter_supports, { [ballot_item_we_vote_id]: false }),
          support_counts: this.listWithChangedCount(state.support_counts, ballot_item_we_vote_id, -1)
        };

      case "voterPositionCommentSave":
        // Add the comment to the list in memory
        // console.log("voterPositionCommentSave, ballot_item_we_vote_id: ", ballot_item_we_vote_id, ", response: ", action.res);
        return {
          ...state,
          voter_statement_text: this.statementListWithChanges(state.voter_statement_text, ballot_item_we_vote_id, action.res.statement_text),
        };

      case "voterPositionVisibilitySave":
        // Add the visibility to the list in memory
        // console.log("voterPositionVisibilitySave, ballot_item_we_vote_id: ", ballot_item_we_vote_id, ", response: ", action.res);
        return {
          ...state,
          is_public_position: this.isForPublicListWithChanges(state.is_public_position, ballot_item_we_vote_id, action.res.is_public_position)
        };

      default:
        return state;
    }
  }
}

module.exports = new SupportStore(Dispatcher);
