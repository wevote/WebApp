import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";
import CandidateActions from "../actions/CandidateActions";
import OrganizationActions from "../actions/OrganizationActions";
import SupportActions from "../actions/SupportActions";
import VoterGuideActions from "../actions/VoterGuideActions";
import VoterStore from "../stores/VoterStore";
import { arrayContains } from "../utils/textFormat";

class OrganizationStore extends ReduceStore {
  getInitialState () {
    return {
      all_cached_organizations_dict: {}, // This is a dictionary with organization_we_vote_id as key and list of organizations
      organization_we_vote_ids_followed_by_organization_dict: {}, // Dictionary with organization_we_vote_id as key and list of organization_we_vote_id's being followed as value
      organization_we_vote_ids_following_by_organization_dict: {}, // Dictionary with organization_we_vote_id as key and list of organization_we_vote_id's following that org as value
      organization_we_vote_ids_voter_is_following: [],
      organization_we_vote_ids_voter_is_ignoring: [],
      organization_we_vote_ids_voter_is_following_on_twitter: [],
    };
  }

  // Given a list of ids, retrieve the complete all_cached_organizations_dict with all attributes and return as array
  returnOrganizationsFromListOfIds (list_of_organization_we_vote_ids) {
    const state = this.getState();
    let filtered_organizations_followed = [];
    if (list_of_organization_we_vote_ids) {
      // organizationsFollowedRetrieve API returns more than one voter guide per organization some times.
      let unique_organization_we_vote_id_array = list_of_organization_we_vote_ids.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      unique_organization_we_vote_id_array.forEach(organization_we_vote_id => {
        if (state.all_cached_organizations_dict[organization_we_vote_id]) {
          filtered_organizations_followed.push(state.all_cached_organizations_dict[organization_we_vote_id]);
        }
      });
    }
    return filtered_organizations_followed;
  }

  getOrganizationByWeVoteId (organization_we_vote_id){
    let all_cached_organizations_dict = this.getState().all_cached_organizations_dict;
    return all_cached_organizations_dict[organization_we_vote_id] || {};
  }

  getOrganizationPositionByWeVoteId (organization_we_vote_id, ballot_item_we_vote_id){
    let requested_position = {};
    let result_found = false;
    let all_cached_organizations_dict = this.getState().all_cached_organizations_dict;
    // console.log("getOrganizationPositionByWeVoteId, organization_we_vote_id: ", organization_we_vote_id, ", ballot_item_we_vote_id: ", ballot_item_we_vote_id);
    let organization = all_cached_organizations_dict[organization_we_vote_id] || {};
    if (organization.position_list_for_one_election) {
      organization.position_list_for_one_election.forEach( one_position => {
        if (one_position.ballot_item_we_vote_id && one_position.ballot_item_we_vote_id === ballot_item_we_vote_id && !result_found) {
          // console.log("OrganizationStore, getOrganizationPositionByWeVoteId, one_position: ", one_position);
          requested_position = one_position;
          result_found = true; // Once a result is found, ignore all other positions
        }
      });
    }
    return requested_position;
  }

  getOrganizationsVoterIsFollowing (){
    //console.log("OrganizationStore.getOrganizationsVoterIsFollowing, organization_we_vote_ids_voter_is_following: ", this.getState().organization_we_vote_ids_voter_is_following);
    return this.returnOrganizationsFromListOfIds(this.getState().organization_we_vote_ids_voter_is_following) || [];
  }

  getOrganizationsFollowedByVoterOnTwitter (){
    return this.returnOrganizationsFromListOfIds(this.getState().organization_we_vote_ids_voter_is_following_on_twitter) || [];
  }

  doesOrganizationHavePositionOnCandidate (organization_we_vote_id, candidate_we_vote_id){
    const state = this.getState();
    const organization = state.all_cached_organizations_dict[organization_we_vote_id];
    if (organization) {
      // console.log("OrganizationStore, doesOrganizationHavePositionOnCandidate, organization found");
      let position_list_for_one_election = organization.position_list_for_one_election || [];
      // let position_list_for_all_except_one_election = organization.position_list_for_all_except_one_election || [];
      let one_position = null;
      if (position_list_for_one_election.length) {
        let candidate_we_vote_ids_extracted = [];
        for (var i = 0, len = position_list_for_one_election.length; i < len; i++) {
          one_position = position_list_for_one_election[i];
          candidate_we_vote_ids_extracted.push(one_position.ballot_item_we_vote_id);
        }
        return arrayContains(candidate_we_vote_id, candidate_we_vote_ids_extracted);
      } else {
        // console.log("OrganizationStore, isVoterFollowingThisOrganization: NO organization_we_vote_ids_voter_is_following, org_we_vote_id: ", organization_we_vote_id);
        return false;
      }
    } else {
      return false;
    }
  }

  doesOrganizationHavePositionOnOffice (organization_we_vote_id, contest_office_we_vote_id){
    const state = this.getState();
    const organization = state.all_cached_organizations_dict[organization_we_vote_id];
    if (organization) {
      let position_list_for_one_election = organization.position_list_for_one_election || [];
      // let position_list_for_all_except_one_election = organization.position_list_for_all_except_one_election || [];
      // console.log("OrganizationStore, doesOrganizationHavePositionOnOffice, organization found");
      let one_position = null;
      if (position_list_for_one_election.length) {
        let contest_office_we_vote_ids_extracted = [];
        for (var i = 0, len = position_list_for_one_election.length; i < len; i++) {
          one_position = position_list_for_one_election[i];
          contest_office_we_vote_ids_extracted.push(one_position.contest_office_we_vote_id);
        }
        return arrayContains(contest_office_we_vote_id, contest_office_we_vote_ids_extracted);
      } else {
        // console.log("OrganizationStore, isVoterFollowingThisOrganization: NO organization_we_vote_ids_voter_is_following, org_we_vote_id: ", organization_we_vote_id);
        return false;
      }
    } else {
      return false;
    }
  }

  isVoterFollowingThisOrganization (organization_we_vote_id){
    let organization_we_vote_ids_voter_is_following = this.getState().organization_we_vote_ids_voter_is_following || [];
    // console.log("OrganizationStore, isVoterFollowingThisOrganization, organization_we_vote_ids_voter_is_following: ", organization_we_vote_ids_voter_is_following);
    if (organization_we_vote_ids_voter_is_following.length) {
      let is_following = arrayContains(organization_we_vote_id, organization_we_vote_ids_voter_is_following);
      // console.log("OrganizationStore, isVoterFollowingThisOrganization:", is_following, ", organization_we_vote_id:", organization_we_vote_id);
      return is_following;
    } else {
      // console.log("OrganizationStore, isVoterFollowingThisOrganization: NO organization_we_vote_ids_voter_is_following, org_we_vote_id: ", organization_we_vote_id);
      return false;
    }
  }

  _copyListsToNewOrganization (new_organization, prior_copy_of_organization){
    // console.log("new_organization (_copyListsToNewOrganization): ", new_organization);
    // console.log("prior_copy_of_organization (_copyListsToNewOrganization): ", prior_copy_of_organization);
    new_organization.friends_position_list_for_one_election = prior_copy_of_organization.friends_position_list_for_one_election;
    new_organization.friends_position_list_for_all_except_one_election = prior_copy_of_organization.friends_position_list_for_all_except_one_election;
    new_organization.friends_position_list = prior_copy_of_organization.friends_position_list;
    new_organization.organization_banner_url = prior_copy_of_organization.organization_banner_url;
    new_organization.position_list_for_one_election = prior_copy_of_organization.position_list_for_one_election;
    new_organization.position_list_for_all_except_one_election = prior_copy_of_organization.position_list_for_all_except_one_election;
    new_organization.position_list = prior_copy_of_organization.position_list;
    return new_organization;
  }

  reduce (state, action) {
    let add_voter_guides_not_from_election;
    let all_cached_organizations_dict;
    let candidate_we_vote_id;
    let organization_we_vote_id;
    let organization;
    let prior_copy_of_organization;
    let organizations_followed_on_twitter_list;
    let organization_we_vote_ids_voter_is_following;
    let organization_we_vote_ids_voter_is_ignoring;
    let search_string;
    let voter_linked_organization_we_vote_id;
    let voter_guides;

    switch (action.type) {

      case "organizationFollow":
        // We also listen to "organizationFollow" in VoterGuideStore so we can alter organization_we_vote_ids_to_follow_all and organization_we_vote_ids_to_follow_for_latest_ballot_item
        // voter_linked_organization_we_vote_id is the voter who clicked the Follow button
        voter_linked_organization_we_vote_id = action.res.voter_linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organization_we_vote_id = action.res.organization_we_vote_id;
        if (action.res.organization_follow_based_on_issue) {
          VoterGuideActions.voterGuidesToFollowRetrieveByIssuesFollowed();  // Whenever a voter follows a new org, update list
        } else {
          search_string = "";
          add_voter_guides_not_from_election = true;
          // Whenever a voter follows a new org, update list
          VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.election_id(), search_string, add_voter_guides_not_from_election);
        }
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
        organization_we_vote_ids_voter_is_following = state.organization_we_vote_ids_voter_is_following;
        if (!arrayContains(organization_we_vote_id, organization_we_vote_ids_voter_is_following)) {
          organization_we_vote_ids_voter_is_following = state.organization_we_vote_ids_voter_is_following.concat(organization_we_vote_id);
        }
        return {
          ...state,
          organization_we_vote_ids_voter_is_following: organization_we_vote_ids_voter_is_following,
          organization_we_vote_ids_voter_is_ignoring: state.organization_we_vote_ids_voter_is_ignoring.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== voter_linked_organization_we_vote_id; })
        };

      case "organizationStopFollowing":
        // We also listen to "organizationStopFollowing" in VoterGuideStore so we can alter organization_we_vote_ids_to_follow_all

        // voter_linked_organization_we_vote_id is the voter who clicked the Follow button
        voter_linked_organization_we_vote_id = action.res.voter_linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organization_we_vote_id = action.res.organization_we_vote_id;
        search_string = "";
        add_voter_guides_not_from_election = true;
        // Whenever a voter follows a new org, update list
        VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.election_id(), search_string, add_voter_guides_not_from_election);
        // Update "who I am following" for the voter: voter_linked_organization_we_vote_id
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voter_linked_organization_we_vote_id);
        // Update who the organization is followed by
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(organization_we_vote_id);
        VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organization_we_vote_id, VoterStore.election_id());
        // Update the guides the voter is following
        VoterGuideActions.voterGuidesFollowedRetrieve();
        // Update the followers of the organization that was just un-followed: organization_we_vote_id
        VoterGuideActions.voterGuideFollowersRetrieve(organization_we_vote_id);
        // Un-Following one org can change the support/oppose count for many ballot items for the voter
        SupportActions.positionsCountForAllBallotItems();
        // Retrieve the organizations followed by voter
        OrganizationActions.organizationsFollowedRetrieve();
        return {
          ...state,
          organization_we_vote_ids_voter_is_following: state.organization_we_vote_ids_voter_is_following.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; }),
        };

      case "organizationFollowIgnore":
        // We also listen to "organizationFollowIgnore" in VoterGuideStore so we can alter organization_we_vote_ids_to_follow_all and organization_we_vote_ids_to_follow_for_latest_ballot_item

        // voter_linked_organization_we_vote_id is the voter who clicked the Follow button
        voter_linked_organization_we_vote_id = action.res.voter_linked_organization_we_vote_id;
        // organization_we_vote_id is the organization that was just followed
        organization_we_vote_id = action.res.organization_we_vote_id;
        search_string = "";
        add_voter_guides_not_from_election = true;
        // Whenever a voter follows a new org, update list
        VoterGuideActions.voterGuidesToFollowRetrieve(VoterStore.election_id(), search_string, add_voter_guides_not_from_election);
        // Update "who I am following" for the voter: voter_linked_organization_we_vote_id
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(voter_linked_organization_we_vote_id);
        // Update who the organization is followed by
        VoterGuideActions.voterGuidesFollowedByOrganizationRetrieve(organization_we_vote_id);
        VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(organization_we_vote_id, VoterStore.election_id());
        // Update the guides the voter is following
        VoterGuideActions.voterGuidesFollowedRetrieve();
        // Update the followers of the organization that was just ignored: organization_we_vote_id
        VoterGuideActions.voterGuideFollowersRetrieve(organization_we_vote_id);
        // Ignoring one org can change the support/oppose count for many ballot items for the voter
        SupportActions.positionsCountForAllBallotItems();
        // Go through all of the candidates currently on the ballot and update their positions
        candidate_we_vote_id = "wv01cand5887"; // TODO TEMP
        CandidateActions.positionListForBallotItem(candidate_we_vote_id);
        // Retrieve the organizations followed by voter
        OrganizationActions.organizationsFollowedRetrieve();
        organization_we_vote_ids_voter_is_ignoring = state.organization_we_vote_ids_voter_is_ignoring;
        if (!arrayContains(organization_we_vote_id, organization_we_vote_ids_voter_is_ignoring)) {
          organization_we_vote_ids_voter_is_ignoring = state.organization_we_vote_ids_voter_is_ignoring.concat(organization_we_vote_id);
        }
        return {
          ...state,
          organization_we_vote_ids_voter_is_ignoring: organization_we_vote_ids_voter_is_ignoring,
          organization_we_vote_ids_voter_is_following: state.organization_we_vote_ids_voter_is_following.filter( existing_org_we_vote_id => { return existing_org_we_vote_id !== organization_we_vote_id; })
        };

      case "error-organizationFollowIgnore" || "error-organizationFollow":
        console.log("error: ", action);
        return state;

      // After an organization is created, return it
      case "organizationSave":
        if (action.res.success) {
          organization_we_vote_id = action.res.organization_we_vote_id;
          all_cached_organizations_dict = state.all_cached_organizations_dict;
          organization = action.res;
          // Make sure to maintain the lists we attach to the organization from other API calls
          if (all_cached_organizations_dict[organization_we_vote_id]) {
            prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
            organization = this._copyListsToNewOrganization(organization, prior_copy_of_organization);
          }
          all_cached_organizations_dict[organization_we_vote_id] = organization;
          return {
            ...state,
            all_cached_organizations_dict: all_cached_organizations_dict
          };
        }
        return state;

      case "organizationsFollowedRetrieve":
        if (action.res.success) {
          if (action.res.auto_followed_from_twitter_suggestion) {
            organizations_followed_on_twitter_list = action.res.organization_list;
            all_cached_organizations_dict = state.all_cached_organizations_dict;
            var organization_we_vote_ids_voter_is_following_on_twitter = [];
            organizations_followed_on_twitter_list.forEach( one_organization => {
              all_cached_organizations_dict[organization.organization_we_vote_id] = one_organization;
              organization_we_vote_ids_voter_is_following_on_twitter.push(one_organization.organization_we_vote_id);
            });
            return {
              ...state,
              organization_we_vote_ids_voter_is_following_on_twitter: organization_we_vote_ids_voter_is_following_on_twitter,
              all_cached_organizations_dict: all_cached_organizations_dict
            };
          } else {
            var organization_list = action.res.organization_list;
            organization_we_vote_ids_voter_is_following = [];
            let revised_organization;
            all_cached_organizations_dict = state.all_cached_organizations_dict;
            organization_list.forEach( one_organization => {
              organization_we_vote_id = one_organization.organization_we_vote_id;
              // Make sure to maintain the lists we attach to the organization from other API calls
              if (all_cached_organizations_dict[organization_we_vote_id]) {
                prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
                revised_organization = this._copyListsToNewOrganization(one_organization, prior_copy_of_organization);
                all_cached_organizations_dict[organization_we_vote_id] = revised_organization;
              } else {
                all_cached_organizations_dict[organization_we_vote_id] = one_organization;
              }
              if (!arrayContains(one_organization.organization_we_vote_id, organization_we_vote_ids_voter_is_following)) {
                organization_we_vote_ids_voter_is_following.push(one_organization.organization_we_vote_id);
              }
            });
            return {
              ...state,
              organization_we_vote_ids_voter_is_following: organization_we_vote_ids_voter_is_following,
              all_cached_organizations_dict: all_cached_organizations_dict,
            };
          }
        }
        return state;

      case "organizationRetrieve":
        organization_we_vote_id = action.res.organization_we_vote_id;
        all_cached_organizations_dict = state.all_cached_organizations_dict;
        organization = action.res;

        // Make sure to maintain the lists we attach to the organization from other API calls
        if (all_cached_organizations_dict[organization_we_vote_id]) {
          prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
          organization = this._copyListsToNewOrganization(organization, prior_copy_of_organization);
        }
        all_cached_organizations_dict[organization_we_vote_id] = organization;
        return {
          ...state,
          all_cached_organizations_dict: all_cached_organizations_dict
        };

      case "positionListForOpinionMaker":  // retrievePositions and retrieveFriendsPositions
        organization_we_vote_id = action.res.opinion_maker_we_vote_id;
        if (action.res.friends_vs_public === "FRIENDS_ONLY") {  // retrieveFriendsPositions
          if (action.res.filter_for_voter) {
            var friends_position_list_for_one_election = action.res.position_list;
            all_cached_organizations_dict = state.all_cached_organizations_dict;
            organization = all_cached_organizations_dict[organization_we_vote_id] || {};

            // Make sure to maintain the lists we attach to the organization from other API calls
            if (all_cached_organizations_dict[organization_we_vote_id]) {
              prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
              organization = this._copyListsToNewOrganization(organization, prior_copy_of_organization);
            }
            // And now update the friends_position_list_for_one_election
            organization.friends_position_list_for_one_election = friends_position_list_for_one_election;
            // console.log("organization-FRIENDS_ONLY-filter_for_voter: ", organization);
            all_cached_organizations_dict[organization_we_vote_id] = organization;
            return {
              ...state,
              all_cached_organizations_dict: all_cached_organizations_dict
            };
          } else if (action.res.filter_out_voter) {
            var friends_position_list_for_all_except_one_election = action.res.position_list;
            all_cached_organizations_dict = state.all_cached_organizations_dict;
            organization = all_cached_organizations_dict[organization_we_vote_id] || {};

            // Make sure to maintain the lists we attach to the organization from other API calls
            if (all_cached_organizations_dict[organization_we_vote_id]) {
              prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
              organization = this._copyListsToNewOrganization(organization, prior_copy_of_organization);
            }
            // And now update the friends_position_list_for_all_except_one_election
            organization.friends_position_list_for_all_except_one_election = friends_position_list_for_all_except_one_election;
            // console.log("organization-FRIENDS_ONLY-filter_out_voter: ", organization);
            all_cached_organizations_dict[organization_we_vote_id] = organization;
            return {
              ...state,
              all_cached_organizations_dict: all_cached_organizations_dict
            };
          } else {
            var friends_position_list = action.res.position_list;
            all_cached_organizations_dict = state.all_cached_organizations_dict;
            organization = all_cached_organizations_dict[organization_we_vote_id] || {};

            // Make sure to maintain the lists we attach to the organization from other API calls
            if (all_cached_organizations_dict[organization_we_vote_id]) {
              prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
              organization = this._copyListsToNewOrganization(organization, prior_copy_of_organization);
            }
            // And now update the friends_position_list
            organization.friends_position_list = friends_position_list;
            // console.log("organization-FRIENDS_ONLY-first else: ", organization);
            all_cached_organizations_dict[organization_we_vote_id] = organization;
            return {
              ...state,
              all_cached_organizations_dict: all_cached_organizations_dict
            };
          }
        } else // retrievePositions
        if (action.res.filter_for_voter) {
          var position_list_for_one_election = action.res.position_list;
          all_cached_organizations_dict = state.all_cached_organizations_dict;
          organization = all_cached_organizations_dict[organization_we_vote_id] || {};

          // Make sure to maintain the lists we attach to the organization from other API calls
          if (all_cached_organizations_dict[organization_we_vote_id]) {
            prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
            organization = this._copyListsToNewOrganization(organization, prior_copy_of_organization);
          }
          organization.position_list_for_one_election = position_list_for_one_election;
          // console.log("organization-NOT FRIENDS_ONLY-filter_for_voter: ", organization);
          all_cached_organizations_dict[organization_we_vote_id] = organization;
          return {
            ...state,
            all_cached_organizations_dict: all_cached_organizations_dict
          };
        } else if (action.res.filter_out_voter) {
          var position_list_for_all_except_one_election = action.res.position_list;
          all_cached_organizations_dict = state.all_cached_organizations_dict;
          organization = all_cached_organizations_dict[organization_we_vote_id] || {};

          // Make sure to maintain the lists we attach to the organization from other API calls
          if (all_cached_organizations_dict[organization_we_vote_id]) {
            prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
            organization = this._copyListsToNewOrganization(organization, prior_copy_of_organization);
          }
          organization.position_list_for_all_except_one_election = position_list_for_all_except_one_election;
          // console.log("organization-NOT FRIENDS_ONLY-filter_out_voter: ", organization);
          all_cached_organizations_dict[organization_we_vote_id] = organization;
          return {
            ...state,
            all_cached_organizations_dict: all_cached_organizations_dict
          };
        } else {
          var position_list = action.res.position_list;
          all_cached_organizations_dict = state.all_cached_organizations_dict;
          organization = all_cached_organizations_dict[organization_we_vote_id] || {};

          // Make sure to maintain the lists we attach to the organization from other API calls
          if (all_cached_organizations_dict[organization_we_vote_id]) {
            prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
            organization = this._copyListsToNewOrganization(organization, prior_copy_of_organization);
          }
          organization.position_list = position_list;
          // console.log("organization-NOT FRIENDS_ONLY-no filter: ", organization);
          all_cached_organizations_dict[organization_we_vote_id] = organization;
          return {
            ...state,
            all_cached_organizations_dict: all_cached_organizations_dict
          };
        }

      case "voterGuidesFollowedByOrganizationRetrieve":
        // In VoterGuideStore we listen for "voterGuidesFollowedByOrganizationRetrieve" so we can update
        //  all_cached_voter_guides and organization_we_vote_ids_to_follow_organization_recommendation_dict
        voter_guides = action.res.voter_guides;
        let organization_we_vote_id_for_voter_guide_owner = action.res.organization_we_vote_id;
        // We want to show *all* organizations followed by the organization on the "Following" tab
        let organization_we_vote_ids_followed_by_organization_dict = state.organization_we_vote_ids_followed_by_organization_dict;
        if (action.res.filter_by_this_google_civic_election_id && action.res.filter_by_this_google_civic_election_id !== "") {
          // Ignore the results if filtered by google_civic_election_id
          return {
            ...state,
          };
        } else {
          // console.log("voterGuidesFollowedByOrganizationRetrieve NO election_id, organization_we_vote_id_for_voter_guide_owner: ", organization_we_vote_id_for_voter_guide_owner);
          organization_we_vote_ids_followed_by_organization_dict[organization_we_vote_id_for_voter_guide_owner] = [];
          voter_guides.forEach(one_voter_guide => {
            organization_we_vote_ids_followed_by_organization_dict[organization_we_vote_id_for_voter_guide_owner].push(one_voter_guide.organization_we_vote_id);
          });
          return {
            ...state,
            organization_we_vote_ids_followed_by_organization_dict: organization_we_vote_ids_followed_by_organization_dict,
          };
        }

      case "voterGuideFollowersRetrieve":
        // In VoterGuideStore, we also listen for a response to "voterGuideFollowersRetrieve" and update all_cached_voter_guides
        voter_guides = action.res.voter_guides;
        let organization_we_vote_ids_following_by_organization_dict = state.organization_we_vote_ids_following_by_organization_dict;
        // Reset the followers for this organization
        organization_we_vote_ids_following_by_organization_dict[action.res.organization_we_vote_id] = [];
        voter_guides.forEach( one_voter_guide => {
          organization_we_vote_ids_following_by_organization_dict[action.res.organization_we_vote_id].push(one_voter_guide.organization_we_vote_id);
        });
        return {
          ...state,
          organization_we_vote_ids_following_by_organization_dict: organization_we_vote_ids_following_by_organization_dict
        };

      // case "voterGuidesFollowedRetrieve":
      //   // In VoterGuideStore, we listen for a response to "voterGuidesFollowedRetrieve" and update all_cached_voter_guides
      //   // In OrganizationStore, we listen for a response to "organizationsFollowedRetrieve" instead of "voterGuidesFollowedRetrieve"

      case "voterGuidesIgnoredRetrieve":
        // In OrganizationStore, we also listen for a response to "voterGuidesIgnoredRetrieve" and update organization_we_vote_ids_voter_is_ignoring
        voter_guides = action.res.voter_guides;
        organization_we_vote_ids_voter_is_ignoring = [];
        voter_guides.forEach( one_voter_guide => {
          if (!arrayContains(one_voter_guide.organization_we_vote_id, organization_we_vote_ids_voter_is_ignoring)) {
            organization_we_vote_ids_voter_is_ignoring.push(one_voter_guide.organization_we_vote_id);
          }
        });
        return {
          ...state,
          organization_we_vote_ids_voter_is_ignoring: organization_we_vote_ids_voter_is_ignoring,
        };

      default:
        return state;
    }
  }
}

module.exports = new OrganizationStore(Dispatcher);
