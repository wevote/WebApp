import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";
import assign from "object-assign";
import BallotActions from "../actions/BallotActions";
import BookmarkStore from "../stores/BookmarkStore";
import SupportStore from "../stores/SupportStore";
import VoterStore from "../stores/VoterStore";

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
    let civicId = VoterStore.election_id();
    return this.getState().ballots && this.getState().ballots[civicId] && SupportStore.supportList ? true : false;
  }

  get ballot_properties () {
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    let props = assign({}, this.getState().ballots[civicId] );
    props.ballot_item_list = null;
    return props;
  }

  get ballot_found () {
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].ballot_found;
  }

  get ballot () {
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].ballot_item_list;
  }

  ballotElectionList () {
    return this.getState().ballot_election_list || [];
  }

  ballotItemSearchResultsList () {
    return this.getState().ballotItemSearchResultsList || [];
  }

  get ballotLength () {
    let ballot = this.ballot || [];
    return ballot.length || 0;
  }

  get currentBallotElectionName () {
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].election_name;
  }

  get currentBallotElectionDate () {
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].election_day_text;
  }

  get currentBallotGoogleCivicElectionId () {
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].google_civic_election_id;
  }

  get currentBallotPollingLocationSource () {
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].polling_location_we_vote_id_source;
  }

  getBallotCaveat () {
    return this.getState().ballotCaveat || "";
  }

  get bookmarks () {
    let civicId = VoterStore.election_id();
    if (!this.getState().ballots || !this.getState().ballots[civicId] ){ return undefined; }
    let ballot = this.getState().ballots[civicId].ballot_item_list;

    let bookmarks = [];
    ballot.forEach( ballot_item => {
      if (BookmarkStore.get(ballot_item.we_vote_id)){ // item is bookmarked
        bookmarks.push(ballot_item);
      }
      if (ballot_item.candidate_list) {
        ballot_item.candidate_list.forEach(candidate => {
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
    if (!this.isLoaded()){ return undefined; }

    return this.ballot.filter( ballot_item => {
      let {kind_of_ballot_item, we_vote_id, candidate_list } = ballot_item;
      // console.log("BallotStore ballot_remaining_choices, kind_of_ballot_item: ", kind_of_ballot_item);
      if (kind_of_ballot_item === "OFFICE"){ // OFFICE - you are undecided if you haven't supported anyone
        return candidate_list.filter(candidate =>{
          return SupportStore.supportList[candidate.we_vote_id];
        }).length === 0;
      } else { //MEASURES - you haven't decided if you neither support nor oppose
        return !SupportStore.supportList[we_vote_id] && !SupportStore.opposeList[we_vote_id];
      }
    });
  }

  get ballot_remaining_choices_length () {
    let ballot_remaining_choices = this.ballot_remaining_choices || [];
    return ballot_remaining_choices.length || 0;
  }

  get ballot_decided () {
    if (!this.isLoaded()){ return undefined; }

    return this.ballot_filtered_unsupported_candidates().filter( ballot_item => {
      if (ballot_item.kind_of_ballot_item === "OFFICE"){ //Offices
        return ballot_item.candidate_list.length > 0;
      } else { //MEASURES
        return SupportStore.supportList[ballot_item.we_vote_id] || SupportStore.opposeList[ballot_item.we_vote_id];
      }
    });
  }

  get current_ballot_item_unfurled_tracker () {
    return this.getState().ballot_item_unfurled_tracker;
  }

  getBallotItemUnfurledStatus (we_vote_id){
    if (we_vote_id ) {
      //note: this method is made to always returns a Boolean
      // console.log(getBallotItemUnfurledStatus, this.getState())
      return !!this.getState().ballot_item_unfurled_tracker[we_vote_id];
    } else {
      return false;
    }
  }

  //Filters the ballot items which are type OFFICE
  ballot_filtered_unsupported_candidates () {
    return this.ballot.map( item =>{
      let is_office = item.kind_of_ballot_item === "OFFICE";
      return is_office ? this.filtered_ballot_item(item) : item;
    });
  }

  //Filters out the unsupported candidates if the user has either not decided or does not support
  //all the candidates in the ballot_item.
  filtered_ballot_item (ballot_item) {
    for (let i = 0; i < ballot_item.candidate_list.length; i++){
      let candidate = ballot_item.candidate_list[i];
      //If the user supports one candidate in the ballot_item then return all ballot_item candidates
      if (SupportStore.supportList[candidate.we_vote_id]){
        return ballot_item;
      }
    }
    //Code will reach this point if the user has either not decided or does not support all the candidates in the ballot_item.
    return assign({}, ballot_item, {candidate_list: [] });
  }

  getBallotByFilterType (filter_type){
    switch (filter_type) {
      case "filterRemaining":
        return this.ballot_remaining_choices;
      case "filterDecided":
        return this.ballot_decided;
      case "filterReadyToVote":
        return this.ballot;
      default :
        return this.ballot;
    }
  }

  getBallotTypeByFilterType (filter_type){
    switch (filter_type) {
      case "filterRemaining":
        return "CHOICES_REMAINING";
      case "filterDecided":
        return "ITEMS_DECIDED";
      case "filterReadyToVote":
        return "READY_TO_VOTE";
      default :
        return "ALL_BALLOT_ITEMS";
    }
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
    if (!action.res || !action.res.success)
      return state;

    let ballotCaveat = "";
    let google_civic_election_id;
    let newBallots = {};
    let revisedState;

    switch (action.type) {
      case "ballotItemOptionsClear":
        // console.log("action.res", action.res)
        return {
          ...state,
          ballotItemSearchResultsList: []
        };

      case "ballotItemOptionsRetrieve":
        // console.log("BallotStore, voterBallotListRetrieve response received.");
        let ballotItemSearchResultsList = action.res.ballot_item_list;
        return {
          ...state,
          ballotItemSearchResultsList: ballotItemSearchResultsList
        };

      case "positionListForBallotItem":
        // console.log("BallotStore, positionListForBallotItem response received.");
        let position_list_has_been_retrieved_once_by_ballot_item = state.position_list_has_been_retrieved_once_by_ballot_item;
        position_list_has_been_retrieved_once_by_ballot_item[action.res.ballot_item_we_vote_id] = true;

        return {
          ...state,
          position_list_has_been_retrieved_once_by_ballot_item: position_list_has_been_retrieved_once_by_ballot_item
        };

      case "voterAddressRetrieve":
        // console.log("BallotStore, voterAddressRetrieve response received, calling voterBallotItemsRetrieve now.");
        BallotActions.voterBallotItemsRetrieve();
        return state;

      case "voterBallotItemsRetrieve":
        // console.log("BallotStore, voterBallotItemsRetrieve response received.");
        // console.log("BallotStore, voterBallotItemsRetrieve, action.res.ballot_item_list: ", action.res.ballot_item_list);
        let new_ballot_item_unfurled_tracker = state.ballot_item_unfurled_tracker;
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
          let we_vote_id_already_seen = [];
          let filtered_ballot_items = [];
          newBallots[google_civic_election_id].ballot_item_list.forEach(ballot_item => {
            if (!we_vote_id_already_seen.includes(ballot_item.we_vote_id)) {
              we_vote_id_already_seen.push(ballot_item.we_vote_id);
              filtered_ballot_items.push(ballot_item);
            }
            if (ballot_item.kind_of_ballot_item === "OFFICE") {
              new_ballot_item_unfurled_tracker[ballot_item.we_vote_id] = false;
            }
          });

          let alphanumeric_filtered_items = []; 
          
          for(let i = 0; i < filtered_ballot_items.length; i++) {
            if(filtered_ballot_items[i].kind_of_ballot_item === "MEASURE"){
              alphanumeric_filtered_items.push(filtered_ballot_items[i]);
            }
          }

          alphanumeric_filtered_items.sort(function(a,b) {
            return a.ballot_item_display_name.localeCompare(b.ballot_item_display_name, undefined, {numeric: true, sensitivity: 'base'});
          })

          newBallots[google_civic_election_id].ballot_item_list = alphanumeric_filtered_items;

          //tracking displaying raccoon flags for offices
          newBallots[google_civic_election_id].ballot_item_list.forEach(ballot_item => {
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
        let tempBallotItemList = action.res.ballot_item_list;
        let officeWeVoteId;
        let ballotItemListCandidatesDict = state.ballotItemListCandidatesDict;
        if (ballotItemListCandidatesDict === undefined) {
          // Do not remove the following line
          console.log("ERROR: undefined ballotItemListCandidatesDict in BallotStore reduce");
        }

        if (tempBallotItemList && ballotItemListCandidatesDict) {
          tempBallotItemList.forEach(oneBallotItem => {
            if (oneBallotItem.kind_of_ballot_item === "OFFICE" && oneBallotItem.candidate_list) {
              officeWeVoteId = oneBallotItem.we_vote_id;
              if (!ballotItemListCandidatesDict[officeWeVoteId]) {
                ballotItemListCandidatesDict[officeWeVoteId] = [];
              }
              oneBallotItem.candidate_list.forEach(oneCandidate => {
                ballotItemListCandidatesDict[officeWeVoteId].push(oneCandidate.we_vote_id);
              });
            }
          });
          revisedState = Object.assign({}, revisedState, {
             ballotItemListCandidatesDict: ballotItemListCandidatesDict,
          });
        }
        return revisedState;

      case "voterBallotListRetrieve":
        // console.log("BallotStore, voterBallotListRetrieve response received.");
        let ballot_election_list = action.res.voter_ballot_list;
        return {
           ...state,
           ballot_election_list: ballot_election_list
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
              ballotCaveat: ballotCaveat
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
