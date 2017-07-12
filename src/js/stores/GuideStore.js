var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
import GuideActions from "../actions/GuideActions";
import SupportActions from "../actions/SupportActions";
import VoterStore from "../stores/VoterStore";

class GuideStore extends FluxMapStore {

  // The store keeps nested attributes of voter guides in all_cached_voter_guides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      ballot_has_guides: true,
      following: [],
      followedByOrganization: [],
      followers: [],
      followingOnTwitter: [],
      ignoring: [],
      to_follow: [],
      to_follow_list_for_ballot_item: [],
      to_follow_list_for_all_ballot_items: [],
      all_cached_voter_guides: {},
      all_cached_organizations_followed: {}
    };
  }

  // Given a list of ids, retrieve the complete all_cached_voter_guides with all attributes and return as array
  returnVoterGuidesFromListOfIds (list_of_organization_we_vote_ids) {
    const state = this.getState();
    let filtered_voter_guides = [];
    if (list_of_organization_we_vote_ids) {
      // voterGuidesFollowedRetrieve API returns more than one voter guide per organization some times.
      let uniq_arr = list_of_organization_we_vote_ids.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      uniq_arr.forEach(organization_we_vote_id => {
        filtered_voter_guides.push(state.all_cached_voter_guides[organization_we_vote_id]);
      });
    }
    return filtered_voter_guides;
  }

    // Given a list of ids, retrieve the complete all_cached_organizations_followed with all attributes and return as array
  returnOrganizationsFollowedFromListOfIds (list_of_organization_we_vote_ids) {
    const state = this.getState();
    let filtered_organizations_followed = [];
    if (list_of_organization_we_vote_ids) {
      // organizationsFollowedRetrieve API returns more than one voter guide per organization some times.
      let uniq_arr = list_of_organization_we_vote_ids.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      uniq_arr.forEach(organization_we_vote_id => {
        filtered_organizations_followed.push(state.all_cached_organizations_followed[organization_we_vote_id]);
      });
    }
    return filtered_organizations_followed;
  }

  retrieveGuidesToFollowByIssueFilter () {
    return this.getState().to_follow_list_for_voter_issues;
  }

  ballotHasGuides (){
    return this.getState().ballot_has_guides;
  }

  toFollowList () {
    return this.returnVoterGuidesFromListOfIds(this.getState().to_follow) || [];
  }

  // We need this function because we don't always know
  toFollowListForBallotItem (){
    return this.returnVoterGuidesFromListOfIds(this.getState().to_follow_list_for_ballot_item) || [];
  }

  toFollowListForBallotItemById (ballot_item_we_vote_id){
    return this.returnVoterGuidesFromListOfIds(this.getState().to_follow_list_for_all_ballot_items[ballot_item_we_vote_id]) || [];
  }

  followedList (){
    return this.returnVoterGuidesFromListOfIds(this.getState().following) || [];
  }

  followedByOrganizationList (){
    return this.returnVoterGuidesFromListOfIds(this.getState().followedByOrganization) || [];
  }

  followersList (){
    return this.returnVoterGuidesFromListOfIds(this.getState().followers) || [];
  }

  followedOnTwitterList (){
    return this.returnOrganizationsFollowedFromListOfIds(this.getState().followingOnTwitter) || [];
  }

  ignoredList (){
    return this.returnVoterGuidesFromListOfIds(this.getState().ignoring);
  }

  isFollowing (we_vote_id){
    return this.getState().following.filter( existing_org_we_vote_id => { return existing_org_we_vote_id === we_vote_id; }).length > 0;
  }

  reduce (state, action) {
    let voter_guides;
    let all_cached_voter_guides;
    let id;
    let organizations_followed_on_twitter_list;
    let all_cached_organizations_followed;

    switch (action.type) {

      case "voterAddressSave":
        if (action.res.status === "SIMPLE_ADDRESS_SAVE") {
          return state;
        } else {
          id = action.res.google_civic_election_id;
          GuideActions.retrieveGuidesToFollow(id);
          GuideActions.voterGuidesFollowedRetrieve(id);
          return state;
        }

      case "voterAddressRetrieve": // refresh guides when you change address
        id = action.res.google_civic_election_id;
        GuideActions.retrieveGuidesToFollow(id);
        GuideActions.voterGuidesFollowedRetrieve(id);
        return state;

      case "voterGuidesToFollowRetrieve":
        // console.log("voterGuidesToFollowRetrieve");
        voter_guides = action.res.voter_guides;
        let is_empty = voter_guides.length === 0;
        let is_search = action.res.search_string !== "";
        let is_this_ballot = action.res.google_civic_election_id !== 0;
        let is_candidate_opinions = action.res.ballot_item_we_vote_id !== "";
        let filter_voter_guides_by_issue = action.res.filter_voter_guides_by_issue;

        // If no voter guides found , and it's not a search query, retrieve results for all elections
        if (is_empty && is_this_ballot && !is_search ){
          GuideActions.retrieveGuidesToFollow(0);
          return state;
        }

        all_cached_voter_guides = state.all_cached_voter_guides;
        var filtered_voter_guide_ids = [];
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          filtered_voter_guide_ids.push(one_voter_guide.organization_we_vote_id);
        });

        // Now store the voter_guide information by ballot_item (i.e., which organizations have positions on each ballot_item)
        // let existing_voter_guide_ids_for_one_ballot_item;
        let updated_voter_guide_ids_for_one_ballot_item = [];
        let to_follow_list_for_voter_issues = [];
        // Start with previous list
        let to_follow_list_for_all_ballot_items_updated = state.to_follow_list_for_all_ballot_items;
        if (action.res.ballot_item_we_vote_id) {
          // Go through each of the voter_guides that was just returned. If the existing_voter_guides does not contain
          //  that voter_guide organization_we_vote_id, then add it.
          voter_guides.forEach( one_voter_guide => {
            // Add voter guides if they don't already exist
            if (!updated_voter_guide_ids_for_one_ballot_item.includes(one_voter_guide.organization_we_vote_id)) {
              updated_voter_guide_ids_for_one_ballot_item.push(one_voter_guide.organization_we_vote_id);
            }
          });
          // And finally update new_ballot_items with all voter guide ids that can be followed
          to_follow_list_for_all_ballot_items_updated[action.res.ballot_item_we_vote_id] = updated_voter_guide_ids_for_one_ballot_item;
          // console.log("updated_voter_guide_ids_for_one_ballot_item: ", updated_voter_guide_ids_for_one_ballot_item);
        } else {
          // Go voter_guide-by-voter_guide and add them to each ballot_item
          // We assume here that we have a complete set of voter guides, so for every ballot_item we_vote_id
          //  we bring in, we clear out all earlier organization we_vote_id's at start
          // console.log("Object.keys: ", Object.keys(to_follow_list_for_all_ballot_items_updated));
          let ballot_items_we_are_tracking = Object.keys(to_follow_list_for_all_ballot_items_updated);
          let current_list = [];
          let new_list = [];
          let ballot_item_we_vote_ids_this_org_supports;
          let guide_we_vote_ids_processed = [];

          voter_guides.forEach( one_voter_guide => {
            ballot_item_we_vote_ids_this_org_supports = one_voter_guide.ballot_item_we_vote_ids_this_org_supports;
            if (ballot_item_we_vote_ids_this_org_supports) {
              ballot_item_we_vote_ids_this_org_supports.forEach(one_ballot_item_we_vote_id => {
                // console.log("one_ballot_item_we_vote_id: ", one_ballot_item_we_vote_id);
                // Do we have an entry in this.state.to_follow_list_for_all_ballot_items[one_ballot_item_we_vote_id]
                if (ballot_items_we_are_tracking.includes(one_ballot_item_we_vote_id)) {
                  current_list = to_follow_list_for_all_ballot_items_updated[one_ballot_item_we_vote_id];
                  current_list.push(one_voter_guide.organization_we_vote_id);
                  to_follow_list_for_all_ballot_items_updated[one_ballot_item_we_vote_id] = current_list;
                } else {
                  new_list = [];
                  new_list.push(one_voter_guide.organization_we_vote_id);
                  to_follow_list_for_all_ballot_items_updated[one_ballot_item_we_vote_id] = new_list;
                }
                ballot_items_we_are_tracking = Object.keys(to_follow_list_for_all_ballot_items_updated);
              });
            }

            if (filter_voter_guides_by_issue) {
              let organization_we_vote_id = one_voter_guide.organization_we_vote_id;
              if (guide_we_vote_ids_processed.indexOf(organization_we_vote_id) === -1) {
                to_follow_list_for_voter_issues.push(one_voter_guide);
                guide_we_vote_ids_processed.push(organization_we_vote_id);
              }
            }
          });
        }

        return {
          ...state,
          ballot_has_guides: is_search || is_this_ballot,
          to_follow: is_candidate_opinions ? state.to_follow : filtered_voter_guide_ids,
          to_follow_list_for_ballot_item: is_candidate_opinions ? filtered_voter_guide_ids : state.to_follow_list_for_ballot_item,
          to_follow_list_for_all_ballot_items: to_follow_list_for_all_ballot_items_updated,
          to_follow_list_for_voter_issues: to_follow_list_for_voter_issues,
          all_cached_voter_guides: all_cached_voter_guides
        };

      case "voterGuidesFollowedRetrieve":
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        var following = [];
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          following.push(one_voter_guide.organization_we_vote_id);
        });
        return {
          ...state,
          following: following,
          all_cached_voter_guides: all_cached_voter_guides
        };

      case "voterGuidesFollowedByOrganizationRetrieve":
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        var followedByOrganization = [];
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          followedByOrganization.push(one_voter_guide.organization_we_vote_id);
        });
        return {
          ...state,
          followedByOrganization: followedByOrganization,
          all_cached_voter_guides: all_cached_voter_guides
        };

      case "voterGuideFollowersRetrieve":
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        var followers = [];
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          followers.push(one_voter_guide.organization_we_vote_id);
        });
        return {
          ...state,
          followers: followers,
          all_cached_voter_guides: all_cached_voter_guides
        };

      case "voterGuidesIgnoredRetrieve":
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        var ignoring = [];
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          ignoring.push(one_voter_guide.organization_we_vote_id);
        });
        return {
          ...state,
          ignoring: ignoring,
          all_cached_voter_guides: all_cached_voter_guides
        };

      case "organizationsFollowedRetrieve":
        if (action.res.auto_followed_from_twitter_suggestion) {
          organizations_followed_on_twitter_list = action.res.organization_list;
          all_cached_organizations_followed = state.all_cached_organizations_followed;
          var followingOnTwitter = [];
          organizations_followed_on_twitter_list.forEach( one_organization => {
            all_cached_organizations_followed[one_organization.organization_we_vote_id] = one_organization;
            followingOnTwitter.push(one_organization.organization_we_vote_id);
          });
          }
          return {
            ...state,
            followingOnTwitter: followingOnTwitter,
            all_cached_organizations_followed: all_cached_organizations_followed
          };

      case "organizationFollow":
        var organization_we_vote_id = action.res.organization_we_vote_id;
        if (action.res.organization_follow_based_on_issue) {
          GuideActions.retrieveGuidesToFollowByIssueFilter();  // Whenever a voter follows a new org, update list
        } else {
          GuideActions.retrieveGuidesToFollow(VoterStore.election_id());  // Whenever a voter follows a new org, update list
        }
        GuideActions.voterGuidesFollowedByOrganizationRetrieve(organization_we_vote_id);
        GuideActions.voterGuideFollowersRetrieve(organization_we_vote_id);
        SupportActions.positionsCountForAllBallotItems();  // Following one org can change the support/oppose count for many items
        return {
          ...state,
          following: state.following.concat(organization_we_vote_id),
          to_follow: state.to_follow.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; }),
          to_follow_list_for_ballot_item: state.to_follow_list_for_ballot_item.filter(existing_org_we_vote_id => {return existing_org_we_vote_id !== organization_we_vote_id; }),
          // Add to_follow_list_for_all_ballot_items here
          ignoring: state.ignoring.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; })
        };

      case "organizationStopFollowing":
        var organization_we_vote_id = action.res.organization_we_vote_id;
        GuideActions.retrieveGuidesToFollow(VoterStore.election_id());  // Whenever a voter stops following an org, update list
        GuideActions.voterGuidesFollowedByOrganizationRetrieve(organization_we_vote_id);
        GuideActions.voterGuideFollowersRetrieve(organization_we_vote_id);
        SupportActions.positionsCountForAllBallotItems();
        return {
          ...state,
          following: state.following.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; }),
          to_follow: state.to_follow.concat(id)
        };

      case "organizationFollowIgnore":
        var organization_we_vote_id = action.res.organization_we_vote_id;
        GuideActions.retrieveGuidesToFollow(VoterStore.election_id());  // Whenever a voter ignores an org, update list
        GuideActions.voterGuidesFollowedByOrganizationRetrieve(organization_we_vote_id);
        GuideActions.voterGuideFollowersRetrieve(organization_we_vote_id);
        return {
          ...state,
          ignoring: state.ignoring.concat(organization_we_vote_id),
          to_follow: state.to_follow.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; }),
          to_follow_list_for_ballot_item: state.to_follow_list_for_ballot_item.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; }),
          // Add to_follow_list_for_all_ballot_items here
          following: state.following.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; })
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
