import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";
import OrganizationActions from "../actions/OrganizationActions";
import OrganizationStore from "../stores/OrganizationStore";
import SupportActions from "../actions/SupportActions";
import VoterGuideActions from "../actions/VoterGuideActions";
import VoterStore from "../stores/VoterStore";
import { arrayContains } from "../utils/textFormat";

class VoterGuideStore extends ReduceStore {

  // The store keeps nested attributes of voter guides in all_cached_voter_guides, whereas the followed, ignoring, to_follow are just lists of ids.
  getInitialState () {
    return {
      all_cached_voter_guides: {}, // Dictionary with organization_we_vote_id as key and the voter_guide as value
      all_cached_voter_guides_by_election: {}, // Dictionary with organization_we_vote_id and google_civic_election_id as keys and the voter_guide as value
      all_cached_voter_guides_by_organization: {}, // Dictionary with organization_we_vote_id as key and list of ALL voter_guides (regardless of election) as value
      all_cached_voter_guides_by_voter_guide: {}, // Dictionary with voter_guide_we_vote_id as key and voter_guides as value
      ballot_has_guides: true,
      organization_we_vote_ids_to_follow_all: [],
      organization_we_vote_ids_to_follow_ballot_items_dict: {}, // Dictionary with ballot_item_we_vote_id as key and list of organization we_vote_ids as value
      organization_we_vote_ids_to_follow_for_latest_ballot_item: [], // stores organization_we_vote_ids for latest ballot_item_we_vote_id
      organization_we_vote_ids_to_follow_by_issues_followed: [],
      organization_we_vote_ids_to_follow_organization_recommendation_dict: {}, // This is a dictionary with organization_we_vote_id as key and list of organization_we_vote_id's as value
      voterGuidesFollowedRetrieveStopped: false, // While this is set to true, don't allow any more calls to this API
      voterGuidesToFollowRetrieveStopped: false, // While this is set to true, don't allow any more calls to this API
    };
  }

  // Given a list of ids, retrieve the complete all_cached_voter_guides with all attributes and return as array
  returnVoterGuidesFromListOfIds (list_of_organization_we_vote_ids) {
    const state = this.getState();
    // console.log("VoterGuideStore, returnVoterGuidesFromListOfIds list_of_organization_we_vote_ids: ", list_of_organization_we_vote_ids);
    // console.log("VoterGuideStore, returnVoterGuidesFromListOfIds state.all_cached_voter_guides: ", state.all_cached_voter_guides);
    let filtered_voter_guides = [];
    if (list_of_organization_we_vote_ids) {
      // voterGuidesFollowedRetrieve API returns more than one voter guide per organization some times.
      let unique_organization_we_vote_id_array = list_of_organization_we_vote_ids.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      unique_organization_we_vote_id_array.forEach(organization_we_vote_id => {
        if (state.all_cached_voter_guides[organization_we_vote_id]) {
          filtered_voter_guides.push(state.all_cached_voter_guides[organization_we_vote_id]);
        }
      });
    }
    return filtered_voter_guides;
  }

  ballotHasGuides () {
    return this.getState().ballot_has_guides;
  }

  sortVoterGuidesByDate (unsortedVoterGuides) {
    // temporary array holds objects with position and sort-value
    let mapped = unsortedVoterGuides.map( (item, i) => {
      return { index: i, value: item };
    });

    // sorting the mapped array based on local_ballot_order which came from the server
    mapped.sort( (a, b) => {
      return +(a.value.election_day_text < b.value.election_day_text) ||
        +(a.value.election_day_text === b.value.election_day_text) - 1;
    });

    let orderedArray = [];
    for (let element of mapped) {
      orderedArray.push(element.value);
    }

    return orderedArray;
  }

  getAllVoterGuidesOwnedByVoter () {
    let all_cached_voter_guides_by_organization = this.getState().all_cached_voter_guides_by_organization || {};
    let voter = VoterStore.getVoter();
    let linked_organization_we_vote_id = voter.linked_organization_we_vote_id;
    // console.log("VoterGuideStore getAllVoterGuidesOwnedByVoter, linked_organization_we_vote_id: ", linked_organization_we_vote_id);
    let unsortedVoterGuides = all_cached_voter_guides_by_organization[linked_organization_we_vote_id] || [];
    return this.sortVoterGuidesByDate(unsortedVoterGuides);
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

  getVoterGuideForOrganizationIdAndElection (organization_we_vote_id, google_civic_election_id) {
    let all_cached_voter_guides_by_election = this.getState().all_cached_voter_guides_by_election || [];
    let organization_list = all_cached_voter_guides_by_election[organization_we_vote_id] || [];
    return organization_list[google_civic_election_id] || {};
  }

  getVoterGuidesForOrganizationId (organization_we_vote_id) {
    let all_cached_voter_guides_by_organization = this.getState().all_cached_voter_guides_by_organization || {};
    return all_cached_voter_guides_by_organization[organization_we_vote_id] || [];
  }

  getVoterGuideByVoterGuideId (voter_guide_we_vote_id) {
    let all_cached_voter_guides_by_voter_guide = this.getState().all_cached_voter_guides_by_voter_guide || {};
    return all_cached_voter_guides_by_voter_guide[voter_guide_we_vote_id] || {};
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

  getVoterGuideSaveResults () {
    return this.getState().voter_guide_save_results;
  }

  voterGuidesFollowedRetrieveStopped () {
    // While this is set to true, don't allow any more calls to this API
    return this.getState().voterGuidesFollowedRetrieveStopped;
  }

  voterGuidesToFollowRetrieveStopped () {
    // While this is set to true, don't allow any more calls to this API
    return this.getState().voterGuidesToFollowRetrieveStopped;
  }

  reduce (state, action) {
    let all_cached_voter_guides;
    let all_cached_voter_guides_by_election;
    let all_cached_voter_guides_by_organization;
    let all_cached_voter_guides_by_voter_guide;
    let google_civic_election_id;
    let organization_we_vote_id;
    let replaced_existing_voter_guide;
    let revisedState;
    let temp_cached_voter_guides_for_organization;
    let voter_guide_with_pledge_info;
    let voter_guides;
    let voter_linked_organization_we_vote_id;

    switch (action.type) {

      case "pledgeToVoteWithVoterGuide":
        if (action.res.pledge_statistics_found) {
          // console.log("VoterGuideStore pledgeToVoteWithVoterGuide, action.res: ", action.res);
          SupportActions.positionsCountForAllBallotItems(VoterStore.election_id());
          all_cached_voter_guides = state.all_cached_voter_guides;
          voter_guide_with_pledge_info = all_cached_voter_guides[action.res.organization_we_vote_id] || {};
          voter_guide_with_pledge_info.pledge_goal = action.res.pledge_goal;
          voter_guide_with_pledge_info.pledge_count = action.res.pledge_count;
          voter_guide_with_pledge_info.voter_has_pledged = action.res.voter_has_pledged;
          all_cached_voter_guides[action.res.organization_we_vote_id] = voter_guide_with_pledge_info;

          all_cached_voter_guides_by_election = state.all_cached_voter_guides_by_election || [];
          if (all_cached_voter_guides_by_election[action.res.organization_we_vote_id] === undefined) {
            all_cached_voter_guides_by_election[action.res.organization_we_vote_id] = [];
          }
          voter_guide_with_pledge_info = all_cached_voter_guides_by_election[action.res.organization_we_vote_id][action.res.google_civic_election_id] || {};
          voter_guide_with_pledge_info.pledge_goal = action.res.pledge_goal;
          voter_guide_with_pledge_info.pledge_count = action.res.pledge_count;
          voter_guide_with_pledge_info.voter_has_pledged = action.res.voter_has_pledged;
          all_cached_voter_guides_by_election[action.res.organization_we_vote_id][action.res.google_civic_election_id] = voter_guide_with_pledge_info;
          OrganizationActions.organizationsFollowedRetrieve();
          SupportActions.voterAllPositionsRetrieve();
          VoterGuideActions.voterGuidesToFollowRetrieve(action.res.google_civic_election_id);
          VoterGuideActions.voterGuidesFollowedRetrieve(action.res.google_civic_election_id);

          return {
            ...state,
            all_cached_voter_guides: all_cached_voter_guides,
            all_cached_voter_guides_by_election: all_cached_voter_guides_by_election
          };
        } else {
          return state;
        }

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
        revisedState = state;
        // This is to prevent the same call from going out multiple times
        if (!this.voterGuidesToFollowRetrieveStopped()) {
          VoterGuideActions.voterGuidesToFollowRetrieve(google_civic_election_id);
          revisedState = Object.assign({}, revisedState, { voterGuidesToFollowRetrieveStopped: true });
        }
        if (!this.voterGuidesFollowedRetrieveStopped()) {
          VoterGuideActions.voterGuidesFollowedRetrieve(google_civic_election_id);
          revisedState = Object.assign({}, revisedState, { voterGuidesFollowedRetrieveStopped: true });
        }
        return revisedState;

      case "voterBallotItemsRetrieve":
        // console.log("VoterGuideStore, voterBallotItemsRetrieve response received.");
        google_civic_election_id = action.res.google_civic_election_id || 0;
        google_civic_election_id = parseInt(google_civic_election_id, 10);
        revisedState = state;
        if (google_civic_election_id !== 0) {
          // console.log("VoterGuideStore voterBallotItemsRetrieve response, VoterGuideStore.voterGuidesToFollowRetrieveStopped():", this.voterGuidesToFollowRetrieveStopped());
          if (!this.voterGuidesToFollowRetrieveStopped()) {
            VoterGuideActions.voterGuidesToFollowRetrieve(google_civic_election_id);
            revisedState = Object.assign({}, revisedState, { voterGuidesToFollowRetrieveStopped: true });
          }
          if (!this.voterGuidesFollowedRetrieveStopped()) {
            VoterGuideActions.voterGuidesFollowedRetrieve(google_civic_election_id);
            revisedState = Object.assign({}, revisedState, { voterGuidesFollowedRetrieveStopped: true });
          }
        }

        return revisedState;

      case "voterFollowAllOrganizationsFollowedByOrganization":
        // Following one org can change the support/oppose count for many ballot items for the voter
        SupportActions.positionsCountForAllBallotItems(VoterStore.election_id());
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
          // console.log("VoterGuideStore CALLING voterGuidesToFollowRetrieve again");
          VoterGuideActions.voterGuidesToFollowRetrieve(0);
          return state;
        }

        all_cached_voter_guides = state.all_cached_voter_guides;
        all_cached_voter_guides_by_election = state.all_cached_voter_guides_by_election;
        var organization_we_vote_id_list_from_voter_guides_returned = [];
        voter_guides.forEach( one_voter_guide => {
          // console.log("VoterGuideStore voterGuidesToFollowRetrieve one_voter_guide.google_civic_election_id: ", one_voter_guide.google_civic_election_id);
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          if (all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] === undefined) {
            all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] = [];
          }
          all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id][one_voter_guide.google_civic_election_id] = one_voter_guide;
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
            all_cached_voter_guides: all_cached_voter_guides,
            all_cached_voter_guides_by_election: all_cached_voter_guides_by_election,
            voterGuidesToFollowRetrieveStopped: false,
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
              all_cached_voter_guides: all_cached_voter_guides,
              voterGuidesToFollowRetrieveStopped: false,
            };
          } else {
            let retrieveAnotherPageOfResults;
            let maximum_number_to_retrieve = 350; // This needs to match the variable in VoterGuideActions
            let start_retrieve_at_this_number = action.res.start_retrieve_at_this_number + maximum_number_to_retrieve;
            let received_maximum_possible_voter_guides = action.res.number_retrieved && action.res.number_retrieved === maximum_number_to_retrieve;
            if (action.res.google_civic_election_id && received_maximum_possible_voter_guides) {
              retrieveAnotherPageOfResults = true;
            }
            if (retrieveAnotherPageOfResults) {
              VoterGuideActions.voterGuidesToFollowRetrieve(action.res.google_civic_election_id, 0, false, start_retrieve_at_this_number);
            }
            return {
              ...state,
              ballot_has_guides: search_term_exists || election_id_exists,
              organization_we_vote_ids_to_follow_all: organization_we_vote_id_list_from_voter_guides_returned,
              organization_we_vote_ids_to_follow_ballot_items_dict: organization_we_vote_ids_to_follow_ballot_items_dict,
              all_cached_voter_guides: all_cached_voter_guides,
              voterGuidesToFollowRetrieveStopped: false,
            };
          }
        }

      case "voterGuidesFollowedRetrieve":
        // In OrganizationStore, we listen for a response to "organizationsFollowedRetrieve" instead of "voterGuidesFollowedRetrieve"
        // and update organization_we_vote_ids_voter_is_following
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        all_cached_voter_guides_by_election = state.all_cached_voter_guides_by_election || [];
        var organization_we_vote_ids_voter_is_following = [];
        voter_guides.forEach( one_voter_guide => {
          // console.log("VoterGuideStore voterGuidesFollowedRetrieve one_voter_guide.google_civic_election_id: ", one_voter_guide.google_civic_election_id);
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          if (all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] === undefined) {
            all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] = [];
          }
          all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id][one_voter_guide.google_civic_election_id] = one_voter_guide;
          organization_we_vote_ids_voter_is_following.push(one_voter_guide.organization_we_vote_id);
        });
        return {
          ...state,
          organization_we_vote_ids_voter_is_following: organization_we_vote_ids_voter_is_following,
          all_cached_voter_guides: all_cached_voter_guides,
          all_cached_voter_guides_by_election: all_cached_voter_guides_by_election,
          voterGuidesFollowedRetrieveStopped: false,
        };

      case "voterGuideFollowersRetrieve":
        // In OrganizationStore, we also listen for a response to "voterGuideFollowersRetrieve" and update organization_we_vote_ids_following_by_organization_dict
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        all_cached_voter_guides_by_election = state.all_cached_voter_guides_by_election || [];
        voter_guides.forEach( one_voter_guide => {
          // console.log("VoterGuideStore voterGuideFollowersRetrieve one_voter_guide.google_civic_election_id: ", one_voter_guide.google_civic_election_id);
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          if (all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] === undefined) {
            all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] = [];
          }
          all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id][one_voter_guide.google_civic_election_id] = one_voter_guide;
        });
        return {
          ...state,
          all_cached_voter_guides: all_cached_voter_guides,
          all_cached_voter_guides_by_election: all_cached_voter_guides_by_election
        };

      case "voterGuidesIgnoredRetrieve":
        // In OrganizationStore, we also listen for a response to "voterGuidesIgnoredRetrieve" and update organization_we_vote_ids_voter_is_ignoring
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides = state.all_cached_voter_guides;
        all_cached_voter_guides_by_election = state.all_cached_voter_guides_by_election || [];
        voter_guides.forEach( one_voter_guide => {
          all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
          if (all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] === undefined) {
            all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] = [];
          }
          all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id][one_voter_guide.google_civic_election_id] = one_voter_guide;
        });
        return {
          ...state,
          all_cached_voter_guides: all_cached_voter_guides,
          all_cached_voter_guides_by_election: all_cached_voter_guides_by_election
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
          all_cached_voter_guides_by_election = state.all_cached_voter_guides_by_election;
          voter_guides.forEach(one_voter_guide => {
            // console.log("VoterGuideStore voterGuidesFollowedByOrganizationRetrieve one_voter_guide.google_civic_election_id: ", one_voter_guide.google_civic_election_id);
            all_cached_voter_guides[one_voter_guide.organization_we_vote_id] = one_voter_guide;
            if (all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] === undefined) {
              all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id] = [];
            }
            all_cached_voter_guides_by_election[one_voter_guide.organization_we_vote_id][one_voter_guide.google_civic_election_id] = one_voter_guide;
            organization_we_vote_ids_to_follow_organization_recommendation_dict[organization_we_vote_id_for_voter_guide_owner].push(one_voter_guide.organization_we_vote_id);
          });
          return {
            ...state,
            all_cached_voter_guides: all_cached_voter_guides,
            all_cached_voter_guides_by_election: all_cached_voter_guides_by_election,
            organization_we_vote_ids_to_follow_organization_recommendation_dict: organization_we_vote_ids_to_follow_organization_recommendation_dict,
          };
        }

      case "voterGuidesRetrieve":
        voter_guides = action.res.voter_guides;
        all_cached_voter_guides_by_organization = state.all_cached_voter_guides_by_organization || {};
        all_cached_voter_guides_by_voter_guide = state.all_cached_voter_guides_by_voter_guide || {};
        voter_guides.forEach( one_voter_guide => {
          // Store them by organization
          if (all_cached_voter_guides_by_organization[one_voter_guide.organization_we_vote_id] === undefined) {
            all_cached_voter_guides_by_organization[one_voter_guide.organization_we_vote_id] = [];
          }
          replaced_existing_voter_guide = false;
          temp_cached_voter_guides_for_organization = all_cached_voter_guides_by_organization[one_voter_guide.organization_we_vote_id];
          for (let count = 0; count < temp_cached_voter_guides_for_organization.length; count++) {
            if (temp_cached_voter_guides_for_organization[count].we_vote_id === one_voter_guide.we_vote_id) {
              // Replace the former voter_guide with the new one
              temp_cached_voter_guides_for_organization[count] = one_voter_guide;
              replaced_existing_voter_guide = true;
            }
          }
          if (!replaced_existing_voter_guide) {
            temp_cached_voter_guides_for_organization.push(one_voter_guide);
          }
          all_cached_voter_guides_by_organization[one_voter_guide.organization_we_vote_id] = temp_cached_voter_guides_for_organization;
          // Store them by voter guide
          all_cached_voter_guides_by_voter_guide[one_voter_guide.we_vote_id] = one_voter_guide;
        });
        return {
          ...state,
          all_cached_voter_guides_by_organization: all_cached_voter_guides_by_organization,
          all_cached_voter_guides_by_voter_guide: all_cached_voter_guides_by_voter_guide,
        };

      case "voterGuideSave":
        let voter_guide_save_results = action.res;
        all_cached_voter_guides_by_organization = state.all_cached_voter_guides_by_organization || {};
        all_cached_voter_guides_by_voter_guide = state.all_cached_voter_guides_by_voter_guide || {};

        // Store it by organization
        if (all_cached_voter_guides_by_organization[voter_guide_save_results.organization_we_vote_id] === undefined) {
          all_cached_voter_guides_by_organization[voter_guide_save_results.organization_we_vote_id] = [];
        }
        replaced_existing_voter_guide = false;
        temp_cached_voter_guides_for_organization = all_cached_voter_guides_by_organization[voter_guide_save_results.organization_we_vote_id];
        for (let count = 0; count < temp_cached_voter_guides_for_organization.length; count++) {
          if (temp_cached_voter_guides_for_organization[count].we_vote_id === voter_guide_save_results.we_vote_id) {
            // Replace the former voter_guide with the new one
            temp_cached_voter_guides_for_organization[count] = voter_guide_save_results;
            replaced_existing_voter_guide = true;
          }
        }
        if (!replaced_existing_voter_guide) {
          temp_cached_voter_guides_for_organization.push(voter_guide_save_results);
        }
        all_cached_voter_guides_by_organization[voter_guide_save_results.organization_we_vote_id] = temp_cached_voter_guides_for_organization;
        // Store them by voter guide
        all_cached_voter_guides_by_voter_guide[voter_guide_save_results.we_vote_id] = voter_guide_save_results;

        return {
          ...state,
          all_cached_voter_guides_by_organization: all_cached_voter_guides_by_organization,
          all_cached_voter_guides_by_voter_guide: all_cached_voter_guides_by_voter_guide,
          voter_guide_save_results: voter_guide_save_results,
        };

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

export default new VoterGuideStore(Dispatcher);
