let Dispatcher = require("../dispatcher/Dispatcher");
let FluxMapStore = require("flux/lib/FluxMapStore");
import BallotActions from "../actions/BallotActions";
import VoterStore from "../stores/VoterStore";
import StarStore from "../stores/StarStore";
import SupportStore from "../stores/SupportStore";
const assign = require("object-assign");

class BallotStore extends FluxMapStore {

  isLoaded (){
    let civicId = VoterStore.election_id();
    return this.getState().ballots && this.getState().ballots[civicId] && SupportStore.supportList ? true : false;
  }

  get ballot_properties (){
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    let props = assign({}, this.getState().ballots[civicId] );
    props.ballot_item_list = null;
    return props;
  }

  get ballot_found (){
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].ballot_found;
  }

  get ballot () {
    if (!this.isLoaded()){ return undefined; }
    let civicId = VoterStore.election_id();
    return this.getState().ballots[civicId].ballot_item_list;
  }

  get bookmarks (){
    let civicId = VoterStore.election_id();
    if (!this.getState().ballots || !this.getState().ballots[civicId] ){ return undefined; }
    let ballot = this.getState().ballots[civicId].ballot_item_list;

    let bookmarks = [];
    ballot.forEach( ballot_item => {
      if (StarStore.get(ballot_item.we_vote_id)){ // item is bookmarked
        bookmarks.push(ballot_item);
      }
      if (ballot_item.candidate_list) {
        ballot_item.candidate_list.forEach(candidate => {
          if (candidate) {
            if (StarStore.get(candidate.we_vote_id)) {
              bookmarks.push(candidate);
            }
          }
        });
      }
    });

    return bookmarks;
  }

  get ballot_remaining_choices (){
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
  ballot_filtered_unsupported_candidates (){
    return this.ballot.map( item =>{
      let is_office = item.kind_of_ballot_item === "OFFICE";
      return is_office ? this.filtered_ballot_item(item) : item;
    });
  }

//Filters out the unsupported candidates from a ballot_item where type is OFFICE
  filtered_ballot_item (ballot_item){
    let filtered_list = ballot_item.candidate_list.filter(candidate => {
      return SupportStore.supportList[candidate.we_vote_id] ? true : false;
    });
    return assign({}, ballot_item, {candidate_list: filtered_list });
  }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    let key;
    let newBallot = {};

    switch (action.type) {
      // Dale 2016-06-02 On some pages we are calling BallotActions.retrieve() as many as three times in order to
      // avoid problems like Issue #224. This should be optimized.

      case "voterRetrieve":
        // console.log("BallotStore, voterRetrieve");
        // We need to refresh the ballot here (in addition to voterAddressRetrieve) because there are routes that you
        // can go to directly (e.g. wevote.me/ballot) that don't reach out and retrieve the ballot items any other way.
        BallotActions.retrieve();
        return state;

      case "voterBallotItemsRetrieve":
        key = action.res.google_civic_election_id;
        newBallot[key] = action.res;
        // console.log("BallotStore, voterBallotItemsRetrieve, key: " + key);

        return {
          ...state,
          ballots: assign({}, state.ballots, newBallot )
        };

      case "voterAddressSave":
        key = action.res.google_civic_election_id;
        newBallot[key] = action.res;
        // console.log("BallotStore, voterAddressSave, key: " + key);

        // We need to refresh the ballot here after the address is changed. If we don't, it is possible to change
        // the address and be left with the ballot for the prior address.
        BallotActions.retrieve();
        return {
          ...state,
          ballots: assign({}, state.ballots, newBallot )
        };

      case "voterAddressRetrieve":
        // console.log("BallotStore, voterAddressRetrieve");
        // We need to refresh the ballot here to solve Issue #224. On the very first visit, we need to make sure to
        // call voterBallotItemsRetrieve *after* we have a google_civic_election_id, which is true (most of the time)
        // after voterAddressRetrieve.
        BallotActions.retrieve();
        return state;

      case "error-voterBallotItemsRetrieve":
        // console.log("BallotStore, error-voterBallotItemsRetrieve");
      default:
        return state;
    }

  }

}

module.exports = new BallotStore(Dispatcher);
