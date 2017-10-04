let Dispatcher = require("../dispatcher/Dispatcher");
let FluxMapStore = require("flux/lib/FluxMapStore");
import BallotActions from "../actions/BallotActions";
import VoterStore from "../stores/VoterStore";
import BookmarkStore from "../stores/BookmarkStore";
import SupportStore from "../stores/SupportStore";
const assign = require("object-assign");

class BallotStore extends FluxMapStore {

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

  ballotList () {
    return this.getState().ballot_election_list || [];
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
    return this.getState().ballots[civicId].election_date;
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

  get ballot_supported () {
    if (!this.isLoaded()){ return undefined; }

    return this.ballot_filtered_unsupported_candidates().filter( ballot_item => {
      if (ballot_item.kind_of_ballot_item === "OFFICE"){ //Offices
        return ballot_item.candidate_list.length > 0;
      } else { //MEASURES
        return SupportStore.supportList[ballot_item.we_vote_id];
      }
    });
  }

  //Filters the ballot items which are type OFFICE
  ballot_filtered_unsupported_candidates () {
    return this.ballot.map( item =>{
      let is_office = item.kind_of_ballot_item === "OFFICE";
      return is_office ? this.filtered_ballot_item(item) : item;
    });
  }

  //Filters out the unsupported candidates from a ballot_item where type is OFFICE
  filtered_ballot_item (ballot_item) {
    let filtered_list = ballot_item.candidate_list.filter(candidate => {
      return SupportStore.supportList[candidate.we_vote_id] ? true : false;
    });
    return assign({}, ballot_item, {candidate_list: filtered_list });
  }

  // getBallotLocationForVoter () {
  //   // console.log("getBallotLocationForVoter this.ballot_properties:", this.ballot_properties);
  //   if (this.ballot_properties) {
  //     return {
  //       text_for_map_search: this.ballot_properties.text_for_map_search,
  //       ballot_returned_we_vote_id: this.ballot_properties.ballot_returned_we_vote_id,
  //       polling_location_we_vote_id: this.ballot_properties.polling_location_we_vote_id_source,
  //       ballot_location_order: 0,
  //       ballot_location_display_name: "", // this.ballot_properties.ballot_location_display_name,
  //       ballot_location_shortcut: this.ballot_properties.ballot_location_shortcut,
  //       google_civic_election_id: this.ballot_properties.google_civic_election_id,
  //     };
  //   }
  //   return null;
  // }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    let key;
    let newBallot = {};
    let ballotCaveat = "";

    switch (action.type) {

      case "voterAddressRetrieve":
        // console.log("BallotStore, voterAddressRetrieve response received, calling voterBallotItemsRetrieve now.");
        BallotActions.voterBallotItemsRetrieve();
        return state;

      case "voterBallotItemsRetrieve":
        // console.log("BallotStore, voterBallotItemsRetrieve response received.");
        key = action.res.google_civic_election_id;
        newBallot[key] = action.res;

        // console.log("BallotStore, voterBallotItemsRetrieve, state.ballots " + state.ballots);
        // console.log("BallotStore, voterBallotItemsRetrieve, newBallot " + newBallot);

        return {
          ...state,
          ballots: assign({}, state.ballots, newBallot ),
        };

      case "voterBallotListRetrieve":
        let ballot_election_list = action.res.voter_ballot_list;
        return {
         ...state,
         ballot_election_list: ballot_election_list
        };

      case "voterAddressSave":
        if (action.res.status === "SIMPLE_ADDRESS_SAVE") {
          return state;
        } else {
          key = action.res.google_civic_election_id;
          newBallot[key] = action.res;
          if (newBallot[key].ballot_found === false ) {
            ballotCaveat = newBallot[key].ballot_caveat;
          }

          return {
            ...state,
            ballots: assign({}, state.ballots, newBallot ),
            ballotCaveat: ballotCaveat
          };
        }

      case "error-voterBallotItemsRetrieve":
      default:
        return state;
    }

  }

}

module.exports = new BallotStore(Dispatcher);
