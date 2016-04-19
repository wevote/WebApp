var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
import GuideActions from "../actions/GuideActions";

class GuideStore extends FluxMapStore {

/* The store keeps nested attributes of voter guides in data, whereas the followed, ignoring, to_follow are just lists of ids.*/
    getInitialState () {
      return {
        ballot_has_guides: true,
        following: [],
        ignoring: [],
        to_follow: [],
        to_follow_for_cand: [],
        data: {}
      };
    }

/* Given a list of ids, retrieve the complete data with all attributes and return as array */
    getOrgsFromArr (arr) {
      const state = this.getState();
      let orgs = [];
      // voterGuidesFollowedRetrieve API returns more than one voter guide per organization some times.
      let uniq_arr = arr.filter( (value, index, self) => { return self.indexOf(value) === index; });
      uniq_arr.forEach( id => {
        orgs.push( state.data[id] );
      });
      return orgs;
    }

    ballotHasGuides (){
      return this.getState().ballot_has_guides;
    }

    toFollowList () {
      return this.getOrgsFromArr(this.getState().to_follow);
    }

    toFollowListForCand (){
      return this.getOrgsFromArr(this.getState().to_follow_for_cand);
    }

    followedList (){
      return this.getOrgsFromArr(this.getState().following);
    }

    isFollowing (we_vote_id){
      return this.getState().following.filter( el => { return el === we_vote_id; }).length > 0;
    }

  reduce (state, action) {
    let voter_guides;
    let data;
    let id;

    switch (action.type) {

      case "voterAddressSave": // fallthrough

      case "voterAddressRetrieve": // refresh guides when you change address
        id = action.res.google_civic_election_id;
        console.log("refreshing guides! id:", id);
        GuideActions.retrieveGuidesToFollow(id);
        GuideActions.retrieveGuidesFollowed(id);
        return state;

      case "voterGuidesToFollowRetrieve":
        voter_guides = action.res.voter_guides;
        let is_empty = voter_guides.length === 0;
        let is_search = action.res.search_string !== "";
        let is_this_ballot = action.res.google_civic_election_id !== 0;
        let is_candidate_opinions = action.res.ballot_item_we_vote_id !== "";

        // If no voter guides found , and it's not a search query, retrieve results for all elections
        if (is_empty && is_this_ballot && !is_search ){
          console.log("No guides found for ballot, retrieving guides not on ballot");
          GuideActions.retrieveGuidesToFollow(0);
          return state;
        }

        data = state.data;
        var orgs = [];
        voter_guides.forEach( item => {
          data[item.organization_we_vote_id] = item;
          orgs.push(item.organization_we_vote_id);
        });
        return {
          ...state,
          ballot_has_guides: is_search || is_this_ballot,
          to_follow: is_candidate_opinions ? state.to_follow : orgs,
          to_follow_for_cand: is_candidate_opinions ? orgs : state.to_follow_for_cand,
          data: data
        };

      case "voterGuidesFollowedRetrieve":
        voter_guides = action.res.voter_guides;
        data = state.data;
        var following = [];
        voter_guides.forEach( item => {
          data[item.organization_we_vote_id] = item;
          following.push(item.organization_we_vote_id);
        });
        return {
          ...state,
          following: following,
          data: data
        };

      case "organizationFollow":
        id = action.res.organization_we_vote_id;
        return {
          ...state,
          following: state.following.concat(id),
          to_follow: state.to_follow.filter( el => { return el !== id; }),
          ignoring: state.ignoring.filter( el => { return el !== id; })
        };

      case "organizationStopFollowing":
        id = action.res.organization_we_vote_id;
        return {
          ...state,
          following: state.following.filter( el => { return el !== id; }),
          to_follow: state.to_follow.concat(id)
        };

      case "organizationFollowIgnore":
        id = action.res.organization_we_vote_id;
        return {
          ...state,
          ignoring: state.ignoring.concat(id),
          to_follow: state.to_follow.filter( el => { return el !== id; }),
          following: state.following.filter( el => { return el !== id; })
        };

      case "error-organizationFollowIgnore" || "error-organizationFollow":
        console.log(action);
        return state;

      default:
        return state;
    }

  }

}

module.exports = new GuideStore(Dispatcher);
