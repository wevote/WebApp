var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
import OrganizationActions from "../actions/OrganizationActions";
import OrganizationStore from "../stores/OrganizationStore";
import SupportActions from "../actions/SupportActions";
import VoterGuideActions from "../actions/VoterGuideActions";
import VoterStore from "../stores/VoterStore";
import { arrayContains } from "../utils/textFormat";

class VoterGuideStore extends FluxMapStore {

  // The store keeps nested attributes of voter guides in all_cached_voter_guides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      all_cached_voter_guides: {}, // Dictionary with organization_we_vote_id as key and the voter_guide as value
      ballot_has_guides: true,
      organization_we_vote_ids_to_follow_all: [],
      organization_we_vote_ids_to_follow_ballot_items_dict: {}, // This is a dictionary with ballot_item_we_vote_id as key and list of organization we_vote_ids as value
      organization_we_vote_ids_to_follow_for_latest_ballot_item: [], // stores organization_we_vote_ids for latest ballot_item_we_vote_id
      organization_we_vote_ids_to_follow_by_issues_followed: [],
      organization_we_vote_ids_to_follow_organization_recommendation_dict: {}, // This is a dictionary with organization_we_vote_id as key and list of organization_we_vote_id's as value
    };
  }

  // Given a list of ids, retrieve the complete all_cached_voter_guides with all attributes and return as array
  returnVoterGuidesFromListOfIds (list_of_organization_we_vote_ids) {
    const state = this.getState();
    let filtered_voter_guides = [];
    if (list_of_organization_we_vote_ids) {
      // voterGuidesFollowedRetrieve API returns more than one voter guide per organization some times.
      let unique_organization_we_vote_id_array = list_of_organization_we_vote_ids.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      unique_organization_we_vote_id_array.forEach(organization_we_vote_id => {
        filtered_voter_guides.push(state.all_cached_voter_guides[organization_we_vote_id]);
      });
    }
    return filtered_voter_guides;
  }

  ballotHasGuides () {
    return this.getState().ballot_has_guides;
  }

  getVoterGuidesToFollowAll () {
    return this.returnVoterGuidesFromListOfIds(this.getState().organization_we_vote_ids_to_follow_all) || [];
  }

  getVoterGuidesToFollowForLatestBallotItem () {
    return this.returnVoterGuidesFromListOfIds(this.getState().organization_we_vote_ids_to_follow_for_latest_ballot_item) || [];
  }

  getVoterGuideForOrganizationId (organization_we_vote_id) {
    return this.getState().all_cached_voter_guides[organization_we_vote_id] || [];
  }

  getVoterGuidesToFollowForBallotItemId (ballot_item_we_vote_id) {
    return this.returnVoterGuidesFromListOfIds(this.getState().organization_we_vote_ids_to_follow_ballot_items_dict[ballot_item_we_vote_id]) || [];
  }

  getVoterGuidesToFollowForBallotItemIdSupports (ballot_item_we_vote_id) {
    let voter_guides_to_follow = this.returnVoterGuidesFromListOfIds(this.getState().organization_we_vote_ids_to_follow_ballot_items_dict[ballot_item_we_vote_id]) || [];
    let voter_guides_to_follow_support = [];
    voter_guides_to_follow.forEach(voter_guide => {
      // console.log("voter_guide:", voter_guide);
      if (arrayContains(ballot_item_we_vote_id, voter_guide.ballot_item_we_vote_ids_this_org_supports)) {
        voter_guides_to_follow_support.push(voter_guide);
      }
    });
    return voter_guides_to_follow_support;
  }

  getVoterGuidesToFollowForBallotItemIdOpposes (ballot_item_we_vote_id) {
    let voter_guides_to_follow = this.returnVoterGuidesFromListOfIds(this.getState().organization_we_vote_ids_to_follow_ballot_items_dict[ballot_item_we_vote_id]) || [];
    let voter_guides_to_follow_oppose = [];
    voter_guides_to_follow.forEach(voter_guide => {
      // console.log("voter_guide:", voter_guide);
      if (arrayContains(ballot_item_we_vote_id, voter_guide.ballot_item_we_vote_ids_this_org_opposes)) {
        voter_guides_to_follow_oppose.push(voter_guide);
      }
    });
    return voter_guides_to_follow_oppose;
  }

  getVoterGuidesToFollowByIssuesFollowed () {
    return this.returnVoterGuidesFromListOfIds(this.getState().organization_we_vote_ids_to_follow_by_issues_followed) || [];
  }

  getVoterGuidesToFollowByOrganizationRecommendation (recommending_organization_we_vote_id) {
    return this.returnVoterGuidesFromListOfIds(this.getState().organization_we_vote_ids_to_follow_organization_recommendation_dict[recommending_organization_we_vote_id]) || [];
  }

  getVoterGuidesVoterIsFollowing (){
    return this.returnVoterGuidesFromListOfIds(OrganizationStore.getState().organization_we_vote_ids_voter_is_following) || [];
  }

  getVoterGuidesFollowedByOrganization (organization_we_vote_id){
    return this.returnVoterGuidesFromListOfIds(OrganizationStore.getState().organization_we_vote_ids_followed_by_organization_dict[organization_we_vote_id]) || [];
  }

  getVoterGuidesFollowingOrganization (organization_we_vote_id){
    return this.returnVoterGuidesFromListOfIds(OrganizationStore.getState().organization_we_vote_ids_following_by_organization_dict[organization_we_vote_id]) || [];
  }

  getVoterGuidesVoterIsIgnoring (){
    return this.returnVoterGuidesFromListOfIds(OrganizationStore.getState().organization_we_vote_ids_voter_is_ignoring) || [];
  }

  reduce (state, action) {
    let voter_guides;
    let all_cached_voter_guides;
    let google_civic_election_id;
    let organization_we_vote_id;
    let voter_linked_organization_we_vote_id;

    switch (action.type) {

      case "voterAddressSave":
        if (action.res.status === "SIMPLE_ADDRESS_SAVE") {
          return state;
        } else {
          google_civic_election_id = action.res.google_civic_election_id;
          VoterGuideActions.voterGuidesToFollowRetrieve(google_civic_election_id);
          VoterGuideActions.voterGuidesFollowedRetrieve(google_civic_election_id);
          return state;
        }

      case "voterAddressRetrieve": // refresh guides when you change address
        google_civic_election_id = action.res.google_civic_election_id;
        VoterGuideActions.voterGuidesToFollowRetrieve(google_civic_election_id);
        VoterGuideActions.voterGuidesFollowedRetrieve(google_civic_election_id);
        return state;

      case "voterFollowAllOrganizationsFollowedByOrganization":
        voter_linked_organization_we_vote_id = VoterStore.getVoter().linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organization_we_vote_id = action.res.organization_we_vote_id;
        VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.election_id());  // Whenever a voter follows a new org, update list
        // Update "who I am following" for the voter: voter_linked_organization_we_vote_id
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voter_linked_organization_we_vote_id);
        // Update who the organization is followed by
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(organization_we_vote_id);
        VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organization_we_vote_id, VoterStore.election_id());
        // Update the guides the voter is following
        VoterGuideActions.voterGuidesFollowedRetrieve();
        // Update the followers of the organization that was just followed: organization_we_vote_id
        VoterGuideActions.voterGuideFollowersRetrieve(organization_we_vote_id);
        // Following one org can change the support/oppose count for many ballot items for the voter
        SupportActions.positionsCountForAllBallotItems();
        // Retrieve the organizations followed by voter
        OrganizationActions.organizationsFollowedRetrieve();
        return state;

      case "voterGuidesToFollowRetrieve":
        voter_guides = action.res.voter_guides;
        let is_empty = voter_guides.length === 0;
        let search_term_exists = action.res.search_string !== "";
        let election_id_exists = action.res.google_civic_election_id !== 0;
        let ballot_item_we_vote_id_exists = action.res.ballot_item_we_vote_id !== "";
        let filter_voter_guides_by_issue = action.res.filter_voter_guides_by_issue;

        // If no voter guides found , and it's not a search query, retrieve results for all elections
        if (is_empty && election_id_exists && !search_term_exists ) {
          VoterGuideActions.voterGuidesToFollowRetrieve(0);
          return state;
        }

        all_cached_voter_guides = state.all_cached_voter_guides;
        var organization_we_vote_id_list_from_voter_guides_returned = [];
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          organization_we_vote_id_list_from_voter_guides_returned.push(one_voter_guide.organization_we_vote_id);
        });

        // Now store the voter_guide information by ballot_item (i.e., which organizations have positions on each ballot_item)
        // let existing_voter_guide_ids_for_one_ballot_item;
        let updated_voter_guide_ids_for_one_ballot_item = [];
        let organization_we_vote_ids_to_follow_by_issues_followed = [];
        // Start with previous list
        let organization_we_vote_ids_to_follow_ballot_items_dict = state.organization_we_vote_ids_to_follow_ballot_items_dict;
        if (ballot_item_we_vote_id_exists) {
          // Go through each of the voter_guides that was just returned. If the existing_voter_guides does not contain
          //  that voter_guide organization_we_vote_id, then add it.
          voter_guides.forEach( one_voter_guide => {
            // Add voter guides if they don't already exist
            if (!updated_voter_guide_ids_for_one_ballot_item.includes(one_voter_guide.organization_we_vote_id)) {
              updated_voter_guide_ids_for_one_ballot_item.push(one_voter_guide.organization_we_vote_id);
            }
          });
          // And finally update new_ballot_items with all voter guide ids that can be followed
          organization_we_vote_ids_to_follow_ballot_items_dict[action.res.ballot_item_we_vote_id] = updated_voter_guide_ids_for_one_ballot_item;
          // console.log("updated_voter_guide_ids_for_one_ballot_item: ", updated_voter_guide_ids_for_one_ballot_item);

          return {
            ...state,
            ballot_has_guides: search_term_exists || election_id_exists,
            organization_we_vote_ids_to_follow_for_latest_ballot_item: updated_voter_guide_ids_for_one_ballot_item,
            organization_we_vote_ids_to_follow_ballot_items_dict: organization_we_vote_ids_to_follow_ballot_items_dict,
            all_cached_voter_guides: all_cached_voter_guides
          };
        } else {
          // Go voter_guide-by-voter_guide and add them to each ballot_item
          // We assume here that we have a complete set of voter guides, so for every ballot_item we_vote_id
          //  we bring in, we clear out all earlier organization we_vote_id's at start
          // console.log("Object.keys: ", Object.keys(organization_we_vote_ids_to_follow_ballot_items_dict));
          let ballot_items_we_are_tracking = Object.keys(organization_we_vote_ids_to_follow_ballot_items_dict);
          let current_list = [];
          let new_list = [];
          let guide_we_vote_ids_processed = [];

          voter_guides.forEach( one_voter_guide => {
            if (one_voter_guide.ballot_item_we_vote_ids_this_org_supports) {
              one_voter_guide.ballot_item_we_vote_ids_this_org_supports.forEach(one_ballot_item_we_vote_id => {
                if (ballot_items_we_are_tracking.includes(one_ballot_item_we_vote_id)) {
                  current_list = organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id];
                  current_list.push(one_voter_guide.organization_we_vote_id);
                  organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id] = current_list;
                } else {
                  new_list = [];
                  new_list.push(one_voter_guide.organization_we_vote_id);
                  organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id] = new_list;
                }
                ballot_items_we_are_tracking = Object.keys(organization_we_vote_ids_to_follow_ballot_items_dict);
              });
            }
            if (one_voter_guide.ballot_item_we_vote_ids_this_org_info_only) {
              one_voter_guide.ballot_item_we_vote_ids_this_org_info_only.forEach(one_ballot_item_we_vote_id => {
                if (ballot_items_we_are_tracking.includes(one_ballot_item_we_vote_id)) {
                  current_list = organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id];
                  current_list.push(one_voter_guide.organization_we_vote_id);
                  organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id] = current_list;
                } else {
                  new_list = [];
                  new_list.push(one_voter_guide.organization_we_vote_id);
                  organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id] = new_list;
                }
                ballot_items_we_are_tracking = Object.keys(organization_we_vote_ids_to_follow_ballot_items_dict);
              });
            }
            if (one_voter_guide.ballot_item_we_vote_ids_this_org_opposes) {
              one_voter_guide.ballot_item_we_vote_ids_this_org_opposes.forEach(one_ballot_item_we_vote_id => {
                if (ballot_items_we_are_tracking.includes(one_ballot_item_we_vote_id)) {
                  current_list = organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id];
                  current_list.push(one_voter_guide.organization_we_vote_id);
                  organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id] = current_list;
                } else {
                  new_list = [];
                  new_list.push(one_voter_guide.organization_we_vote_id);
                  organization_we_vote_ids_to_follow_ballot_items_dict[one_ballot_item_we_vote_id] = new_list;
                }
                ballot_items_we_are_tracking = Object.keys(organization_we_vote_ids_to_follow_ballot_items_dict);
              });
            }

            if (filter_voter_guides_by_issue) {
              organization_we_vote_id = one_voter_guide.organization_we_vote_id;
              if (guide_we_vote_ids_processed.indexOf(organization_we_vote_id) === -1) {
                if (!organization_we_vote_ids_to_follow_by_issues_followed.includes(one_voter_guide.organization_we_vote_id)) {
                  organization_we_vote_ids_to_follow_by_issues_followed.push(one_voter_guide.organization_we_vote_id);
                }
                if (!guide_we_vote_ids_processed.includes(organization_we_vote_id)) {
                  guide_we_vote_ids_processed.push(organization_we_vote_id);
                }
              }
            }
          });

          if (filter_voter_guides_by_issue) {
            return {
              ...state,
              ballot_has_guides: search_term_exists || election_id_exists,
              organization_we_vote_ids_to_follow_ballot_items_dict: organization_we_vote_ids_to_follow_ballot_items_dict,
              organization_we_vote_ids_to_follow_by_issues_followed: organization_we_vote_ids_to_follow_by_issues_followed,
              all_cached_voter_guides: all_cached_voter_guides
            };
          } else {
            // This is for when, there is a default voter guides to follow
            return {
              ...state,
              ballot_has_guides: search_term_exists || election_id_exists,
              organization_we_vote_ids_to_follow_all: organization_we_vote_id_list_from_voter_guides_returned,
              organization_we_vote_ids_to_follow_ballot_items_dict: organization_we_vote_ids_to_follow_ballot_items_dict,
              all_cached_voter_guides: all_cached_voter_guides
            };
          }

        }

      case "voterGuidesFollowedRetrieve":
        // In OrganizationStore, we listen for a response to "organizationsFollowedRetrieve" instead of "voterGuidesFollowedRetrieve"
        // and update organization_we_vote_ids_voter_is_following
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        var organization_we_vote_ids_voter_is_following = [];
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          organization_we_vote_ids_voter_is_following.push(one_voter_guide.organization_we_vote_id);
        });
        return {
          ...state,
          organization_we_vote_ids_voter_is_following: organization_we_vote_ids_voter_is_following,
          all_cached_voter_guides: all_cached_voter_guides
        };

      case "voterGuideFollowersRetrieve":
        // In OrganizationStore, we also listen for a response to "voterGuideFollowersRetrieve" and update organization_we_vote_ids_following_by_organization_dict
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
        });
        return {
          ...state,
          all_cached_voter_guides: all_cached_voter_guides
        };

      case "voterGuidesIgnoredRetrieve":
        // In OrganizationStore, we also listen for a response to "voterGuidesIgnoredRetrieve" and update organization_we_vote_ids_voter_is_ignoring
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
        });
        return {
          ...state,
          all_cached_voter_guides: all_cached_voter_guides
        };

      case "voterGuidesFollowedByOrganizationRetrieve":
        // In OrganizationStore we listen for "voterGuidesFollowedByOrganizationRetrieve" so we can update OrganizationStore.getState().organization_we_vote_ids_followed_by_organization_dict
        voter_guides = action.res.voter_guides;
        let organization_we_vote_id_for_voter_guide_owner = action.res.organization_we_vote_id;
        // We might want to only use one of these following variables...
        // ...although a recommendation might only want to include voter guides from this election
        let organization_we_vote_ids_to_follow_organization_recommendation_dict = state.organization_we_vote_ids_to_follow_organization_recommendation_dict;
        // Clear prior recommendations
        organization_we_vote_ids_to_follow_organization_recommendation_dict[organization_we_vote_id_for_voter_guide_owner] = [];
        if (action.res.filter_by_this_google_civic_election_id && action.res.filter_by_this_google_civic_election_id !== "") {
          // console.log("voterGuidesFollowedByOrganizationRetrieve filter_by_this_google_civic_election_id, organization_we_vote_id_for_voter_guide_owner: ", organization_we_vote_id_for_voter_guide_owner);
          voter_guides.forEach(one_voter_guide => {
            organization_we_vote_ids_to_follow_organization_recommendation_dict[organization_we_vote_id_for_voter_guide_owner].push(one_voter_guide.organization_we_vote_id);
          });
          return {
            ...state,
            organization_we_vote_ids_to_follow_organization_recommendation_dict: organization_we_vote_ids_to_follow_organization_recommendation_dict,
          };
        } else {
          // console.log("voterGuidesFollowedByOrganizationRetrieve NO election_id, organization_we_vote_id_for_voter_guide_owner: ", organization_we_vote_id_for_voter_guide_owner);
          all_cached_voter_guides = state.all_cached_voter_guides;
          voter_guides.forEach(one_voter_guide => {
            all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
            organization_we_vote_ids_to_follow_organization_recommendation_dict[organization_we_vote_id_for_voter_guide_owner].push(one_voter_guide.organization_we_vote_id);
          });
          return {
            ...state,
            all_cached_voter_guides: all_cached_voter_guides,
            organization_we_vote_ids_to_follow_organization_recommendation_dict: organization_we_vote_ids_to_follow_organization_recommendation_dict,
          };
        }

      case "organizationFollow":
        // The heavy lift of the reaction to "organizationFollow" is in OrganizationStore

        // voter_linked_organization_we_vote_id is the voter who clicked the Follow button
        voter_linked_organization_we_vote_id = action.res.voter_linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organization_we_vote_id = action.res.organization_we_vote_id;
        return {
          ...state,
          organization_we_vote_ids_to_follow_all: state.organization_we_vote_ids_to_follow_all.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; }),
          organization_we_vote_ids_to_follow_for_latest_ballot_item: state.organization_we_vote_ids_to_follow_for_latest_ballot_item.filter(existing_org_we_vote_id => {return existing_org_we_vote_id !== organization_we_vote_id; }),
        };

      case "organizationStopFollowing":
        // The heavy lift of the reaction to "organizationStopFollowing" is in OrganizationStore

        // voter_linked_organization_we_vote_id is the voter who clicked the Follow button
        voter_linked_organization_we_vote_id = action.res.voter_linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organization_we_vote_id = action.res.organization_we_vote_id;
        return {
          ...state,
          organization_we_vote_ids_to_follow_all: state.organization_we_vote_ids_to_follow_all.concat(organization_we_vote_id)
        };

      case "organizationFollowIgnore":
        // The heavy lift of the reaction to "organizationFollowIgnore" is in OrganizationStore

        // voter_linked_organization_we_vote_id is the voter who clicked the Follow button
        voter_linked_organization_we_vote_id = action.res.voter_linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organization_we_vote_id = action.res.organization_we_vote_id;
        return {
          ...state,
          organization_we_vote_ids_to_follow_all: state.organization_we_vote_ids_to_follow_all.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; }),
          organization_we_vote_ids_to_follow_for_latest_ballot_item: state.organization_we_vote_ids_to_follow_for_latest_ballot_item.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; }),
        };

      default:
        return state;
    }
  }
}

module.exports = new VoterGuideStore(Dispatcher);
