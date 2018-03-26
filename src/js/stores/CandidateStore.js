import { ReduceStore } from "flux/utils";
import CandidateActions from "../actions/CandidateActions";
import Dispatcher from "../dispatcher/Dispatcher";
import OfficeActions from "../actions/OfficeActions";
import OfficeStore from "../stores/OfficeStore";
import { stringContains } from "../utils/textFormat";

class CandidateStore extends ReduceStore {

  getInitialState () {
    return {
      all_cached_candidates: {}, // Dictionary with candidate_we_vote_id as key and the candidate as value
      all_cached_positions_about_candidates: {}, // Dictionary with candidate_we_vote_id as one key, organization_we_vote_id as the second key, and the position as value
      position_list_from_advisers_followed_by_voter: {}, // Dictionary with candidate_we_vote_id as key and list of positions as value
    };
  }

  getCandidate (candidate_we_vote_id) {
    return this.getState().all_cached_candidates[candidate_we_vote_id] || {};
  }

  getPositionList (candidate_we_vote_id) {
    return this.getState().position_list_from_advisers_followed_by_voter[candidate_we_vote_id] || [];
  }

  getPositionAboutCandidateFromOrganization (candidate_we_vote_id, organization_we_vote_id) {
    let positions_about_candidate = this.getState().all_cached_positions_about_candidates[candidate_we_vote_id] || [];
    return positions_about_candidate[organization_we_vote_id] || [];
  }

  isCandidateInStore (candidate_we_vote_id) {
    let candidate = this.getState().all_cached_candidates[candidate_we_vote_id] || {};
    if (candidate.we_vote_id) {
      return true;
    } else {
      return false;
    }
  }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    let all_cached_candidates;
    let all_cached_positions_about_candidates;
    let ballot_item_we_vote_id;
    let candidate;
    let candidate_list;
    let candidate_we_vote_id;
    let new_position_list;
    let one_position;
    let position_list_for_candidate;
    let position_list_from_advisers_followed_by_voter;
    let voter_guides;

    switch (action.type) {

      case "candidateRetrieve":
        // Make sure we have information for the office the candidate is running for
        if (action.res.contest_office_we_vote_id) {
          let office = OfficeStore.getOffice(action.res.contest_office_we_vote_id);
          if (!office || !office.ballot_item_display_name) {
            OfficeActions.officeRetrieve(action.res.contest_office_we_vote_id);
          }
        }
        candidate = action.res;
        all_cached_candidates = state.all_cached_candidates;
        all_cached_candidates[candidate.we_vote_id] = candidate;
        return {
          ...state,
          all_cached_candidates: all_cached_candidates
        };

      case "candidatesRetrieve":
        // Make sure we have information for the office the candidate is running for
        if (action.res.contest_office_we_vote_id) {
          let office = OfficeStore.getOffice(action.res.contest_office_we_vote_id);
          if (!office || !office.ballot_item_display_name) {
            OfficeActions.officeRetrieve(action.res.contest_office_we_vote_id);
          }
        }
        candidate_list = action.res.candidate_list;
        all_cached_candidates = state.all_cached_candidates;
        candidate_list.forEach( one_candidate => {
          all_cached_candidates[one_candidate.we_vote_id] = one_candidate;
        });
        return {
          ...state,
          all_cached_candidates: all_cached_candidates
        };

      case "organizationFollow":
        // Go through all of the candidates currently on the ballot and update their positions
        if (state.all_cached_candidates) {
          for (candidate_we_vote_id in state.all_cached_candidates) {
            CandidateActions.positionListForBallotItem(candidate_we_vote_id);
          }
        }
        return state;

      case "organizationStopFollowing":
        // Go through all of the candidates currently on the ballot and update their positions
        if (state.all_cached_candidates) {
          for (candidate_we_vote_id in state.all_cached_candidates) {
            CandidateActions.positionListForBallotItem(candidate_we_vote_id);
          }
        }
        return state;

      case "organizationFollowIgnore":
        // Go through all of the candidates currently on the ballot and update their positions
        if (state.all_cached_candidates) {
          for (candidate_we_vote_id in state.all_cached_candidates) {
            CandidateActions.positionListForBallotItem(candidate_we_vote_id);
          }
        }
        return state;

      case "positionListForBallotItem":
        position_list_for_candidate = action.res.kind_of_ballot_item === "CANDIDATE";
        // console.log("positionListForBallotItem action.res:", action.res);
        if (position_list_for_candidate) {
          ballot_item_we_vote_id = action.res.ballot_item_we_vote_id;
          new_position_list = action.res.position_list;
          position_list_from_advisers_followed_by_voter = state.position_list_from_advisers_followed_by_voter;
          position_list_from_advisers_followed_by_voter[ballot_item_we_vote_id] = new_position_list;
          // console.log("positionListForBallotItem position_list_from_advisers_followed_by_voter[ballot_item_we_vote_id]:", position_list_from_advisers_followed_by_voter[ballot_item_we_vote_id]);
          return {
            ...state,
            position_list_from_advisers_followed_by_voter: position_list_from_advisers_followed_by_voter,
          };
        } else {
          return state;
        }

      case "voterGuidesToFollowRetrieve":
        // This code harvests the positions that are passed in along with voter guides,
        //  and stores them so we can request them in cases where the response package for
        //  voterGuidesToFollowRetrieve does not include the position data

        // console.log("CandidateStore voterGuidesToFollowRetrieve");
        voter_guides = action.res.voter_guides;
        let is_empty = voter_guides.length === 0;
        let search_term_exists = action.res.search_string !== "";
        ballot_item_we_vote_id = action.res.ballot_item_we_vote_id || "";
        let ballot_item_we_vote_id_exists = ballot_item_we_vote_id.length !== 0;

        if (!ballot_item_we_vote_id_exists || !stringContains("cand", ballot_item_we_vote_id) || is_empty || search_term_exists) {
          // Exit this routine
          // console.log("exiting CandidateStore voterGuidesToFollowRetrieve");
          return state;
        }
        all_cached_positions_about_candidates = state.all_cached_positions_about_candidates;
        voter_guides.forEach( one_voter_guide => {
          // Make sure we have a position in the voter guide
          if (one_voter_guide.is_support_or_positive_rating || one_voter_guide.is_oppose_or_negative_rating || one_voter_guide.is_information_only) {
            if (!all_cached_positions_about_candidates[ballot_item_we_vote_id]) {
              all_cached_positions_about_candidates[ballot_item_we_vote_id] = {};
            }
            if (!all_cached_positions_about_candidates[ballot_item_we_vote_id][one_voter_guide.organization_we_vote_id]) {
              all_cached_positions_about_candidates[ballot_item_we_vote_id][one_voter_guide.organization_we_vote_id] = {};
            }

            one_position = {
              position_we_vote_id: one_voter_guide.position_we_vote_id, // Currently empty
              ballot_item_display_name: one_voter_guide.ballot_item_display_name,
              ballot_item_image_url_https_large: one_voter_guide.ballot_item_image_url_https_large,
              ballot_item_image_url_https_medium: one_voter_guide.ballot_item_image_url_https_medium,
              ballot_item_image_url_https_tiny: one_voter_guide.ballot_item_image_url_https_tiny,
              ballot_item_twitter_handle: one_voter_guide.ballot_item_twitter_handle,
              ballot_item_political_party: one_voter_guide.ballot_item_political_party,
              kind_of_ballot_item: "CANDIDATE",
              // ballot_item_id: 0,
              ballot_item_we_vote_id: ballot_item_we_vote_id,
              // ballot_item_state_code: "",
              // contest_office_id: 0,
              // contest_office_we_vote_id: "",
              // contest_office_name: "",
              is_support: one_voter_guide.is_support,
              is_positive_rating: one_voter_guide.is_positive_rating,
              is_support_or_positive_rating: one_voter_guide.is_support_or_positive_rating,
              is_oppose: one_voter_guide.is_oppose,
              is_negative_rating: one_voter_guide.is_negative_rating,
              is_oppose_or_negative_rating: one_voter_guide.is_oppose_or_negative_rating,
              is_information_only: one_voter_guide.is_information_only,
              is_public_position: one_voter_guide.is_public_position,
              speaker_display_name: one_voter_guide.speaker_display_name,
              vote_smart_rating: one_voter_guide.vote_smart_rating,
              vote_smart_time_span: one_voter_guide.vote_smart_time_span,
              google_civic_election_id: one_voter_guide.google_civic_election_id,
              // state_code: "",
              more_info_url: one_voter_guide.more_info_url,
              statement_text: one_voter_guide.statement_text,
              last_updated: one_voter_guide.last_updated
            };
            // console.log("CandidateStore one_position: ", one_position);
            all_cached_positions_about_candidates[ballot_item_we_vote_id][one_voter_guide.organization_we_vote_id] = one_position;
          }
        });
        // console.log("CandidateStore all_cached_positions_about_candidates:", all_cached_positions_about_candidates);
        return {
          ...state,
          all_cached_positions_about_candidates: all_cached_positions_about_candidates,
        };

      case "error-candidateRetrieve" || "error-positionListForBallotItem":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

module.exports = new CandidateStore(Dispatcher);
