import { ReduceStore } from "flux/utils";
import assign from "object-assign";
import Dispatcher from "../dispatcher/Dispatcher";
import BallotActions from "../actions/BallotActions";
import BookmarkStore from "./BookmarkStore";
import SupportStore from "./SupportStore";
import VoterStore from "./VoterStore";

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-param-reassign: 0 */

class BallotStore extends ReduceStore {
  getInitialState () {
    return {
      ballot_item_search_results_list: [],
      ballot_item_unfurled_tracker: {},
      ballotItemListCandidatesDict: {}, // Dictionary with ballot_item_we_vote_id as key and list of candidate we_vote_ids as value
      position_list_has_been_retrieved_once_by_ballot_item: {}, // Dictionary with ballot_item_we_vote_id as key and true/false as value
    };
  }

  resetState () {
    return {
      ballot_item_search_results_list: [],
      ballot_item_unfurled_tracker: {},
      position_list_has_been_retrieved_once_by_ballot_item: {},
    };
  }

  isLoaded () {
    const civicId = VoterStore.election_id();
    return !!(this.getState().ballots && this.getState().ballots[civicId] && SupportStore.supportList);
  }

  get ballot_properties () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.election_id();
    const props = assign({}, this.getState().ballots[civicId]);
    props.ballot_item_list = null;
    return props;
  }

  get ballot_found () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].ballot_found;
  }

  get ballot () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].ballot_item_list;
  }

  ballotElectionList () {
    return this.getState().ballot_election_list || [];
  }

  ballotItemSearchResultsList () {
    return this.getState().ballotItemSearchResultsList || [];
  }

  get ballotLength () {
    const ballot = this.ballot || [];
    return ballot.length || 0;
  }

  get currentBallotElectionName () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].election_name;
  }

  get currentBallotElectionDate () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].election_day_text;
  }

  get currentBallotGoogleCivicElectionId () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].google_civic_election_id;
  }

  get currentBallotPollingLocationSource () {
    if (!this.isLoaded()) { return undefined; }
    const civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].polling_location_we_vote_id_source;
  }

  getBallotCaveat () {
    return this.getState().ballotCaveat || "";
  }

  get bookmarks () {
    const civicId = VoterStore.election_id();
    if (!this.getState().ballots || !this.getState().ballots[civicId]) { return undefined; }
    const ballot = this.getState().ballots[civicId].ballot_item_list;

    const bookmarks = [];
    ballot.forEach((ballot_item) => {
      if (BookmarkStore.get(ballot_item.we_vote_id)) { // item is bookmarked
        bookmarks.push(ballot_item);
      }
      if (ballot_item.candidate_list) {
        ballot_item.candidate_list.forEach((candidate) => {
          if (candidate) {
            if (BookmarkStore.get(candidate.we_vote_id)) {
              bookmarks.push(candidate);
            }
          }
        });
      }
    });

    return bookmarks;
  }

  get ballot_remaining_choices () {
    if (!this.isLoaded()) { return undefined; }

    return this.ballot.filter((ballot_item) => {
      const { kind_of_ballot_item, we_vote_id, candidate_list } = ballot_item;
      // console.log("BallotStore ballot_remaining_choices, kind_of_ballot_item: ", kind_of_ballot_item);
      if (kind_of_ballot_item === "OFFICE") { // OFFICE - you are undecided if you haven't supported anyone
        return candidate_list.filter(candidate => SupportStore.supportList[candidate.we_vote_id]).length === 0;
      } else { // MEASURES - you haven't decided if you neither support nor oppose
        return !SupportStore.supportList[we_vote_id] && !SupportStore.opposeList[we_vote_id];
      }
    });
  }

  get ballot_remaining_choices_length () {
    const ballot_remaining_choices = this.ballot_remaining_choices || [];
    return ballot_remaining_choices.length || 0;
  }

  get ballot_decided () {
    if (!this.isLoaded()) { return undefined; }

    return this.ballot_filtered_unsupported_candidates().filter((ballot_item) => {
      if (ballot_item.kind_of_ballot_item === "OFFICE") { // Offices
        return ballot_item.candidate_list.length > 0;
      } else { // MEASURES
        return SupportStore.supportList[ballot_item.we_vote_id] || SupportStore.opposeList[ballot_item.we_vote_id];
      }
    });
  }

  get current_ballot_item_unfurled_tracker () {
    return this.getState().ballot_item_unfurled_tracker;
  }

  getBallotItemUnfurledStatus (we_vote_id) {
    if (we_vote_id) {
      // note: this method is made to always returns a Boolean
      // console.log(getBallotItemUnfurledStatus, this.getState())
      return !!this.getState().ballot_item_unfurled_tracker[we_vote_id];
    } else {
      return false;
    }
  }

  // Filters the ballot items which are type OFFICE
  ballot_filtered_unsupported_candidates () {
    return this.ballot.map((item) => {
      const is_office = item.kind_of_ballot_item === "OFFICE";
      return is_office ? this.filtered_ballot_item(item) : item;
    });
  }

  // Filters out the unsupported candidates if the user has either not decided or does not support
  // all the candidates in the ballot_item.
  filtered_ballot_item (ballot_item) {
    for (let i = 0; i < ballot_item.candidate_list.length; i++) {
      const candidate = ballot_item.candidate_list[i];
      // If the user supports one candidate in the ballot_item then return all ballot_item candidates
      if (SupportStore.supportList[candidate.we_vote_id]) {
        return ballot_item;
      }
    }
    // Code will reach this point if the user has either not decided or does not support all the candidates in the ballot_item.
    return assign({}, ballot_item, { candidate_list: [] });
  }

  getBallotByCompletionLevelFilterType (completionLevelFilterType) {
    switch (completionLevelFilterType) {
      case "filterRemaining":
        return this.ballot_remaining_choices;
      case "filterDecided":
        return this.ballot_decided;
      case "filterReadyToVote":
        return this.ballot;
      default:
        return this.ballot;
    }
  }

  cleanCompletionLevelFilterType (completionLevelFilterType) {
    switch (completionLevelFilterType) {
      case "filterRemaining":
        return "filterRemaining";
      case "filterDecided":
        return "filterDecided";
      case "filterReadyToVote":
        return "filterReadyToVote";
      default:
        return "filterAllBallotItems";
    }
  }

  getCompletionLevelFilterTypeSaved () {
    // console.log("getCompletionLevelFilterTypeSaved:", this.getState().completionLevelFilterTypeSaved);
    return this.getState().completionLevelFilterTypeSaved || "";
  }

  getRaceLevelFilterTypeSaved () {
    // console.log("getRaceLevelFilterTypeSaved:", this.getState().raceLevelFilterTypeSaved);
    return this.getState().raceLevelFilterTypeSaved || "";
  }

  getTopLevelBallotItemWeVoteIds () {
    if (this.getState().ballotItemListCandidatesDict) {
      return Object.keys(this.getState().ballotItemListCandidatesDict);
    }
    return [];
  }

  getCandidateWeVoteIdsForOfficeWeVoteId (officeWeVoteId) {
    if (this.getState().ballotItemListCandidatesDict) {
      return this.getState().ballotItemListCandidatesDict[officeWeVoteId] || [];
    }
    return [];
  }

  positionListHasBeenRetrievedOnce (ballotItemWeVoteId) {
    return this.getState().position_list_has_been_retrieved_once_by_ballot_item[ballotItemWeVoteId] || false;
  }

  reduce (state, action) {
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let ballotCaveat = "";
    let google_civic_election_id;
    let newBallots = {};
    let revisedState;
    const tempBallotItemList = action.res.ballot_item_list;
    const new_ballot_item_unfurled_tracker = state.ballot_item_unfurled_tracker;
    const ballotItemListCandidatesDict = state.ballotItemListCandidatesDict;
    const ballot_election_list = action.res.voter_ballot_list;

    switch (action.type) {
      case "ballotItemOptionsClear":
        // console.log("action.res", action.res)
        return {
          ...state,
          ballotItemSearchResultsList: [],
        };

      case "ballotItemOptionsRetrieve":
        return {
          ...state,
          ballotItemSearchResultsList: action.res.ballot_item_list,
        };

      case "positionListForBallotItem":
        // console.log("BallotStore, positionListForBallotItem response received.");
        state.position_list_has_been_retrieved_once_by_ballot_item[action.res.ballot_item_we_vote_id] = true;

        return {
          ...state,
          position_list_has_been_retrieved_once_by_ballot_item: state.position_list_has_been_retrieved_once_by_ballot_item,
        };

      case "raceLevelFilterTypeSave":
        // console.log("raceLevelFilterTypeSave action.res", action.res);
        return {
          ...state,
          raceLevelFilterTypeSaved: action.res.race_level_filter_type_saved,
        };


      case "completionLevelFilterTypeSave":
        // console.log("completionLevelFilterTypeSave action.res", action.res);
        return {
          ...state,
          completionLevelFilterTypeSaved: action.res.completion_level_filter_type_saved,
        };

      case "voterAddressRetrieve":
        // console.log("BallotStore, voterAddressRetrieve response received, calling voterBallotItemsRetrieve now.");
        BallotActions.voterBallotItemsRetrieve();
        return state;

      case "voterBallotItemsRetrieve":
        // console.log("BallotStore, voterBallotItemsRetrieve response received.");
        // console.log("BallotStore, voterBallotItemsRetrieve, action.res.ballot_item_list: ", action.res.ballot_item_list);
        newBallots = {};
        if (state.ballots) {
          newBallots = state.ballots;
        }
        google_civic_election_id = action.res.google_civic_election_id || 0;
        google_civic_election_id = parseInt(google_civic_election_id, 10);
        revisedState = state;
        if (google_civic_election_id !== 0) {
          newBallots[google_civic_election_id] = action.res;

          // Remove duplicate offices in ballot_item_list
          const we_vote_id_already_seen = [];
          const filtered_ballot_items = [];
          newBallots[google_civic_election_id].ballot_item_list.forEach((ballot_item) => {
            if (!we_vote_id_already_seen.includes(ballot_item.we_vote_id)) {
              we_vote_id_already_seen.push(ballot_item.we_vote_id);
              filtered_ballot_items.push(ballot_item);
            }
            if (ballot_item.kind_of_ballot_item === "OFFICE") {
              new_ballot_item_unfurled_tracker[ballot_item.we_vote_id] = false;
            }
          });

          // Sort measures alphabetically
          const alphanumeric_filtered_items = [];
          const unfiltered_items = [];
          for (let i = 0; i < filtered_ballot_items.length; i++) {
            if (filtered_ballot_items[i].kind_of_ballot_item === "MEASURE") {
              alphanumeric_filtered_items.push(filtered_ballot_items[i]);
            } else {
              unfiltered_items.push(filtered_ballot_items[i]);
            }
          }
          alphanumeric_filtered_items.sort((a, b) => a.ballot_item_display_name.localeCompare(b.ballot_item_display_name, undefined, { numeric: true, sensitivity: "base" }));
          newBallots[google_civic_election_id].ballot_item_list = alphanumeric_filtered_items.concat(unfiltered_items);

          // tracking displaying raccoon flags for offices
          newBallots[google_civic_election_id].ballot_item_list.forEach((ballot_item) => {
            if (ballot_item.kind_of_ballot_item === "OFFICE") {
              new_ballot_item_unfurled_tracker[ballot_item.we_vote_id] = false;
            }
          });
          revisedState = Object.assign({}, revisedState, {
            ballots: newBallots,
            ballot_item_unfurled_tracker: new_ballot_item_unfurled_tracker,
          });
        }
        // Now capture the candidate we vote ids under each office
        // let officeWeVoteId;
        if (ballotItemListCandidatesDict === undefined) {
          // Do not remove the following line
          console.log("ERROR: undefined ballotItemListCandidatesDict in BallotStore reduce");
        }

        if (tempBallotItemList && ballotItemListCandidatesDict) {
          tempBallotItemList.forEach((oneBallotItem) => {
            if (oneBallotItem.kind_of_ballot_item === "OFFICE" && oneBallotItem.candidate_list) {
              const officeWeVoteId = oneBallotItem.we_vote_id;
              if (!ballotItemListCandidatesDict[officeWeVoteId]) {
                ballotItemListCandidatesDict[officeWeVoteId] = [];
              }
              oneBallotItem.candidate_list.forEach((oneCandidate) => {
                ballotItemListCandidatesDict[officeWeVoteId].push(oneCandidate.we_vote_id);
              });
            }
          });
          revisedState = Object.assign({}, revisedState, {
            ballotItemListCandidatesDict,
          });
        }
        return revisedState;

      case "voterBallotListRetrieve":
        // console.log("BallotStore, voterBallotListRetrieve response received.");
        return {
          ...state,
          ballot_election_list,
        };

      case "voterAddressSave":
        // console.log("BallotStore, voterAddressSave response received.");
        if (action.res.status === "SIMPLE_ADDRESS_SAVE") {
          return state;
        } else {
          newBallots = state.ballots || {};
          google_civic_election_id = action.res.google_civic_election_id || 0;
          google_civic_election_id = parseInt(google_civic_election_id, 10);
          if (google_civic_election_id !== 0) {
            newBallots[google_civic_election_id] = action.res;
            if (newBallots[google_civic_election_id].ballot_found === false) {
              ballotCaveat = newBallots[google_civic_election_id].ballot_caveat;
            }

            return {
              ...state,
              ballots: newBallots,
              ballotCaveat,
            };
          }
        }
        return state;

      case "voterBallotItemOpenOrClosedSave":
        // console.log("action.res", action.res)
        return {
          ...state,
          ballot_item_unfurled_tracker: action.res.ballot_item_unfurled_tracker,
        };

      case "voterSignOut":
        // console.log("resetting BallotStore");
        BallotActions.voterBallotItemsRetrieve();
        return this.resetState();

      case "error-voterBallotItemsRetrieve":
      default:
        return state;
    }
  }
}

export default new BallotStore(Dispatcher);
