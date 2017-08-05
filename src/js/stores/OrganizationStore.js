var Dispatcher = require("../dispatcher/Dispatcher");
var FluxMapStore = require("flux/lib/FluxMapStore");
const assign = require("object-assign");

class OrganizationStore extends FluxMapStore {
  getInitialState () {
    return {
      all_cached_organizations_dict: {}, // This is a dictionary with organization_we_vote_id as key and list of organizations
    };
  }

  getOrganizationByWeVoteId (organization_we_vote_id){
    let all_cached_organizations_dict = this.getState().all_cached_organizations_dict;
    // console.log("getOrganizationByWeVoteId, one organization: ", all_cached_organizations_dict[organization_we_vote_id]);
    return all_cached_organizations_dict[organization_we_vote_id] || {};
  }

  reduce (state, action) {
    let organization_we_vote_id;
    let organization;
    let prior_copy_of_organization;

    switch (action.type) {

      // After an organization is created, return it
      case "organizationSave":
        if (action.res.success) {
          organization_we_vote_id = action.res.organization_we_vote_id;
          let all_cached_organizations_dict = state.all_cached_organizations_dict;
          organization = action.res;
          // Make sure to maintain the lists we attach to the organization from other API calls
          if (all_cached_organizations_dict[organization_we_vote_id]) {
            prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
            organization.friends_position_list_for_one_election = prior_copy_of_organization.friends_position_list_for_one_election;
            organization.friends_position_list_for_all_except_one_election = prior_copy_of_organization.friends_position_list_for_all_except_one_election;
            organization.friends_position_list = prior_copy_of_organization.friends_position_list;
            organization.position_list_for_one_election = prior_copy_of_organization.position_list_for_one_election;
            organization.position_list_for_all_except_one_election = prior_copy_of_organization.position_list_for_all_except_one_election;
            organization.position_list = prior_copy_of_organization.position_list;
          }
          all_cached_organizations_dict[organization_we_vote_id] = organization;
          return {
            ...state,
            all_cached_organizations_dict: all_cached_organizations_dict
          };
        }
        return state;

      case "organizationRetrieve":
        organization_we_vote_id = action.res.organization_we_vote_id;
        let all_cached_organizations_dict = state.all_cached_organizations_dict;
        organization = action.res;
        // Make sure to maintain the lists we attach to the organization from other API calls
        if (all_cached_organizations_dict[organization_we_vote_id]) {
          prior_copy_of_organization = all_cached_organizations_dict[organization_we_vote_id];
          organization.friends_position_list_for_one_election = prior_copy_of_organization.friends_position_list_for_one_election;
          organization.friends_position_list_for_all_except_one_election = prior_copy_of_organization.friends_position_list_for_all_except_one_election;
          organization.friends_position_list = prior_copy_of_organization.friends_position_list;
          organization.position_list_for_one_election = prior_copy_of_organization.position_list_for_one_election;
          organization.position_list_for_all_except_one_election = prior_copy_of_organization.position_list_for_all_except_one_election;
          organization.position_list = prior_copy_of_organization.position_list;
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
            let all_cached_organizations_dict = state.all_cached_organizations_dict;
            organization = all_cached_organizations_dict[organization_we_vote_id] || {};
            organization.friends_position_list_for_one_election = friends_position_list_for_one_election;
            // console.log("organization-FRIENDS_ONLY-filter_for_voter: ", organization);
            all_cached_organizations_dict[organization_we_vote_id] = organization;
            return {
              ...state,
              all_cached_organizations_dict: all_cached_organizations_dict
            };
          } else if (action.res.filter_out_voter) {
            var friends_position_list_for_all_except_one_election = action.res.position_list;
            let all_cached_organizations_dict = state.all_cached_organizations_dict;
            organization = all_cached_organizations_dict[organization_we_vote_id] || {};
            organization.friends_position_list_for_all_except_one_election = friends_position_list_for_all_except_one_election;
            // console.log("organization-FRIENDS_ONLY-filter_out_voter: ", organization);
            all_cached_organizations_dict[organization_we_vote_id] = organization;
            return {
              ...state,
              all_cached_organizations_dict: all_cached_organizations_dict
            };
          } else {
            var friends_position_list = action.res.position_list;
            let all_cached_organizations_dict = state.all_cached_organizations_dict;
            organization = all_cached_organizations_dict[organization_we_vote_id] || {};
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
          let all_cached_organizations_dict = state.all_cached_organizations_dict;
          organization = all_cached_organizations_dict[organization_we_vote_id] || {};
          organization.position_list_for_one_election = position_list_for_one_election;
          // console.log("organization-not FRIENDS_ONLY-filter_for_voter: ", organization);
          all_cached_organizations_dict[organization_we_vote_id] = organization;
          return {
            ...state,
            all_cached_organizations_dict: all_cached_organizations_dict
          };
        } else if (action.res.filter_out_voter) {
          var position_list_for_all_except_one_election = action.res.position_list;
          let all_cached_organizations_dict = state.all_cached_organizations_dict;
          organization = all_cached_organizations_dict[organization_we_vote_id] || {};
          organization.position_list_for_all_except_one_election = position_list_for_all_except_one_election;
          // console.log("organization-not FRIENDS_ONLY-filter_out_voter: ", organization);
          all_cached_organizations_dict[organization_we_vote_id] = organization;
          return {
            ...state,
            all_cached_organizations_dict: all_cached_organizations_dict
          };
        } else {
          var position_list = action.res.position_list;
          let all_cached_organizations_dict = state.all_cached_organizations_dict;
          organization = all_cached_organizations_dict[organization_we_vote_id] || {};
          organization.position_list = position_list;
          // console.log("organization-not FRIENDS_ONLY-filter_for_voter: ", organization);
          all_cached_organizations_dict[organization_we_vote_id] = organization;
          return {
            ...state,
            all_cached_organizations_dict: all_cached_organizations_dict
          };
        }

      default:
        return state;
    }
  }
}

module.exports = new OrganizationStore(Dispatcher);
