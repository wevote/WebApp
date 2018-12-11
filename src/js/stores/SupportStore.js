import { ReduceStore } from "flux/utils";
import assign from "object-assign";
import Dispatcher from "../dispatcher/Dispatcher";
import { mergeTwoObjectLists } from "../utils/textFormat";
import SupportActions from "../actions/SupportActions";
import VoterStore from "./VoterStore";

class SupportStore extends ReduceStore {
  getInitialState () {
    return {
      we_vote_id_support_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      we_vote_id_oppose_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      name_support_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      name_oppose_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
    };
  }

  resetState () {
    // Reset this
    const state = this.getState();
    return {
      ...state,
      we_vote_id_support_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      we_vote_id_oppose_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
      name_support_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs supporting this ballot item
      name_oppose_list_for_each_ballot_item: {}, // Dictionary with key: candidate or measure we_vote_id, value: list of orgs opposing this ballot item
    };
  }

  get (ballotItemWeVoteId) {
    if (!(this.supportList && this.opposeList && this.supportCounts && this.opposeCounts)) {
      return undefined;
    }

    return {
      is_support: this.supportList[ballotItemWeVoteId] || false,
      is_oppose: this.opposeList[ballotItemWeVoteId] || false,
      is_public_position: this.isForPublicList[ballotItemWeVoteId] || false, // Default to friends only
      voter_statement_text: this.statementList[ballotItemWeVoteId] || "",
      support_count: this.supportCounts[ballotItemWeVoteId] || 0,
      oppose_count: this.opposeCounts[ballotItemWeVoteId] || 0,
    };
  }

  get supportList () {
    return this.getState().voter_supports;
  }

  get opposeList () {
    return this.getState().voter_opposes;
  }

  get isForPublicList () {
    return this.getState().is_public_position;
  }

  get statementList () {
    return this.getState().voter_statement_text;
  }

  get supportCounts () {
    return this.getState().support_counts;
  }

  get opposeCounts () {
    return this.getState().oppose_counts;
  }

  isSupportAlreadyInCache () {
    return this.getState().support_counts && Object.keys(this.getState().support_counts).length > 0;
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

  getWeVoteIdSupportListUnderThisBallotItem (ballot_item_we_vote_id) {
    // What are the issues that have positions for this election under this ballot item?
    // console.log("getIssuesUnderThisBallotItem, ballot_item_we_vote_id:", ballot_item_we_vote_id);
    if (ballot_item_we_vote_id && this.getState().we_vote_id_support_list_for_each_ballot_item) {
      return this.getState().we_vote_id_support_list_for_each_ballot_item[ballot_item_we_vote_id] || [];
    } else {
      return [];
    }
  }

  getNameSupportListUnderThisBallotItem (ballot_item_we_vote_id) {
    if (ballot_item_we_vote_id && this.getState().name_support_list_for_each_ballot_item) {
      return this.getState().name_support_list_for_each_ballot_item[ballot_item_we_vote_id] || [];
    } else {
      return [];
    }
  }

  getNameOpposeListUnderThisBallotItem (ballot_item_we_vote_id) {
    if (ballot_item_we_vote_id && this.getState().name_oppose_list_for_each_ballot_item) {
      return this.getState().name_oppose_list_for_each_ballot_item[ballot_item_we_vote_id] || [];
    } else {
      return [];
    }
  }

  // Turn action into a dictionary/object format with we_vote_id as key for fast lookup
  parseListToHash (property, list) {
    const hashMap = {};
    if (list !== undefined) {
      list.forEach((el) => {
        hashMap[el.ballot_item_we_vote_id] = el[property];
      });
    }
    return hashMap;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let ballot_item_we_vote_id = "";
    if (action.res.ballot_item_we_vote_id) {
      ballot_item_we_vote_id = action.res.ballot_item_we_vote_id;
    }

    let we_vote_id_support_list_for_each_ballot_item;
    let we_vote_id_oppose_list_for_each_ballot_item;
    let name_support_list_for_each_ballot_item;
    let name_oppose_list_for_each_ballot_item;
    let position_counts_list;
    const new_oppose_counts = this.parseListToHash("oppose_count", action.res.position_counts_list);
    const new_support_counts = this.parseListToHash("support_count", action.res.position_counts_list);
    const existing_oppose_counts = state.oppose_counts !== undefined ? state.oppose_counts : [];
    const existing_support_counts = state.support_counts !== undefined ? state.support_counts : [];
    const new_one_oppose_count = this.parseListToHash("oppose_count", action.res.position_counts_list);
    const new_one_support_count = this.parseListToHash("support_count", action.res.position_counts_list);
    const existing_oppose_counts2 = state.oppose_counts !== undefined ? state.oppose_counts : [];
    const existing_support_counts2 = state.support_counts !== undefined ? state.support_counts : [];

    switch (action.type) {
      case "voterAddressRetrieve":
        SupportActions.voterAllPositionsRetrieve();
        SupportActions.positionsCountForAllBallotItems(VoterStore.election_id());
        return state;

      case "voterAllPositionsRetrieve":
        // is_support is a property coming from 'position_list' in the incoming response
        // this.state.voter_supports is an updated hash with the contents of position list['is_support']
        return {
          ...state,
          voter_supports: this.parseListToHash("is_support", action.res.position_list),
          voter_opposes: this.parseListToHash("is_oppose", action.res.position_list),
          voter_statement_text: this.parseListToHash("statement_text", action.res.position_list),
          is_public_position: this.parseListToHash("is_public_position", action.res.position_list),
        };

      case "positionsCountForAllBallotItems":

        we_vote_id_support_list_for_each_ballot_item = state.we_vote_id_support_list_for_each_ballot_item;
        we_vote_id_oppose_list_for_each_ballot_item = state.we_vote_id_oppose_list_for_each_ballot_item;
        name_support_list_for_each_ballot_item = state.name_support_list_for_each_ballot_item;
        name_oppose_list_for_each_ballot_item = state.name_oppose_list_for_each_ballot_item;

        if (action.res.position_counts_list) {
          position_counts_list = action.res.position_counts_list;
          if (position_counts_list.length) {
            position_counts_list.forEach((positions_count_block) => {
              we_vote_id_support_list_for_each_ballot_item[positions_count_block.ballot_item_we_vote_id] = positions_count_block.support_we_vote_id_list;
              we_vote_id_oppose_list_for_each_ballot_item[positions_count_block.ballot_item_we_vote_id] = positions_count_block.oppose_we_vote_id_list;
              name_support_list_for_each_ballot_item[positions_count_block.ballot_item_we_vote_id] = positions_count_block.support_name_list;
              name_oppose_list_for_each_ballot_item[positions_count_block.ballot_item_we_vote_id] = positions_count_block.oppose_name_list;
            });
          }
        }

        // Duplicate values in the second array will overwrite those in the first
        return {
          ...state,
          oppose_counts: mergeTwoObjectLists(existing_oppose_counts, new_oppose_counts),
          support_counts: mergeTwoObjectLists(existing_support_counts, new_support_counts),
          we_vote_id_support_list_for_each_ballot_item,
          we_vote_id_oppose_list_for_each_ballot_item,
          name_support_list_for_each_ballot_item,
          name_oppose_list_for_each_ballot_item,
        };

      case "positionsCountForOneBallotItem":

        // Duplicate values in the second array will overwrite those in the first
        return {
          ...state,
          oppose_counts: mergeTwoObjectLists(existing_oppose_counts2, new_one_oppose_count),
          support_counts: mergeTwoObjectLists(existing_support_counts2, new_one_support_count),
        };

      case "voterOpposingSave":
        SupportActions.positionsCountForAllBallotItems(VoterStore.election_id());
        return {
          ...state,
          voter_supports: assign({}, state.voter_supports, { [ballot_item_we_vote_id]: false }),
          voter_opposes: assign({}, state.voter_opposes, { [ballot_item_we_vote_id]: true }),
          support_counts: state.voter_supports[ballot_item_we_vote_id] ?
            this.listWithChangedCount(state.support_counts, ballot_item_we_vote_id, -1) :
            state.support_counts,
          oppose_counts: this.listWithChangedCount(state.oppose_counts, ballot_item_we_vote_id, 1),
        };

      case "voterStopOpposingSave":
        SupportActions.positionsCountForAllBallotItems(VoterStore.election_id());
        return {
          ...state,
          voter_opposes: assign({}, state.voter_opposes, { [ballot_item_we_vote_id]: false }),
          oppose_counts: this.listWithChangedCount(state.oppose_counts, ballot_item_we_vote_id, -1),
        };

      case "voterSupportingSave":
        SupportActions.positionsCountForAllBallotItems(VoterStore.election_id());
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
        SupportActions.positionsCountForAllBallotItems(VoterStore.election_id());
        return {
          ...state,
          voter_supports: assign({}, state.voter_supports, { [ballot_item_we_vote_id]: false }),
          support_counts: this.listWithChangedCount(state.support_counts, ballot_item_we_vote_id, -1),
        };

      case "voterPositionCommentSave":

        // Add the comment to the list in memory
        return {
          ...state,
          voter_statement_text: this.statementListWithChanges(state.voter_statement_text, ballot_item_we_vote_id, action.res.statement_text),
        };

      case "voterPositionVisibilitySave":

        // Add the visibility to the list in memory
        return {
          ...state,
          is_public_position: this.isForPublicListWithChanges(state.is_public_position, ballot_item_we_vote_id, action.res.is_public_position),
        };

      case "voterSignOut":

        // console.log("resetting SupportStore");
        return this.resetState();

      default:
        return state;
    }
  }
}

export default new SupportStore(Dispatcher);
