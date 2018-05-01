import { ReduceStore } from "flux/utils";
import Dispatcher from "../dispatcher/Dispatcher";
import { stringContains } from "../utils/textFormat";

class MeasureStore extends ReduceStore {

  getInitialState () {
    return {
      all_cached_measures: {}, // Dictionary with measure_we_vote_id as key and the measure as value
      all_cached_positions_about_measures: {}, // Dictionary with measure_we_vote_id as one key, organization_we_vote_id as the second key, and the position as value
      position_list_from_advisers_followed_by_voter: {}, // Dictionary with measure_we_vote_id as key and list of positions as value
    };
  }

  getMeasure (measure_we_vote_id) {
    return this.getState().all_cached_measures[measure_we_vote_id] || [];
  }

  getYesVoteDescription (measure_we_vote_id) {
    if (measure_we_vote_id) {
      let measure = this.getMeasure(measure_we_vote_id);
      if (measure && measure.yes_vote_description) {
        return measure.yes_vote_description;
      }
    }
    return "";
  }

  getNoVoteDescription (measure_we_vote_id) {
    if (measure_we_vote_id) {
      let measure = this.getMeasure(measure_we_vote_id);
      if (measure && measure.no_vote_description) {
        return measure.no_vote_description;
      }
    }
    return "";
  }

  getPositionList (measure_we_vote_id) {
    return this.getState().position_list_from_advisers_followed_by_voter[measure_we_vote_id] || [];
  }

  getPositionAboutMeasureFromOrganization (measure_we_vote_id, organization_we_vote_id) {
    let positions_about_measure = this.getState().all_cached_positions_about_measures[measure_we_vote_id] || [];
    return positions_about_measure[organization_we_vote_id] || [];
  }

  reduce (state, action) {

    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success)
      return state;

    let all_cached_measures;
    let all_cached_positions_about_measures;
    let ballot_item_we_vote_id;
    let measure;
    let new_position_list;
    let one_position;
    let position_list_for_measure;
    let position_list_from_advisers_followed_by_voter;
    let voter_guides;

    switch (action.type) {

      case "measureRetrieve":
        measure = action.res;
        all_cached_measures = state.all_cached_measures;
        all_cached_measures[measure.we_vote_id] = measure;
        return {
          ...state,
          all_cached_measures: all_cached_measures
        };

      case "positionListForBallotItem":
        position_list_for_measure = action.res.kind_of_ballot_item === "MEASURE";
        if (position_list_for_measure) {
          ballot_item_we_vote_id = action.res.ballot_item_we_vote_id;
          new_position_list = action.res.position_list;
          position_list_from_advisers_followed_by_voter = state.position_list_from_advisers_followed_by_voter;
          position_list_from_advisers_followed_by_voter[ballot_item_we_vote_id] = new_position_list;
          return {
            ...state,
            position_list_from_advisers_followed_by_voter: position_list_from_advisers_followed_by_voter,
          };
        } else {
          return state;
        }

      case "voterBallotItemsRetrieve":
        all_cached_measures = state.all_cached_measures;
        let tempBallotItemList = action.res.ballot_item_list;
        if (tempBallotItemList) {
          tempBallotItemList.forEach(oneBallotItem => {
            if (oneBallotItem.kind_of_ballot_item === "MEASURE" && oneBallotItem.we_vote_id) {
              all_cached_measures[oneBallotItem.we_vote_id] = oneBallotItem;
            }
          });
        }
        return {
          ...state,
          all_cached_measures: all_cached_measures
        };

      case "voterGuidesToFollowRetrieve":
        // This code harvests the positions that are passed in along with voter guides,
        //  and stores them so we can request them in cases where the response package for
        //  voterGuidesToFollowRetrieve does not include the position data

        // console.log("MeasureStore voterGuidesToFollowRetrieve");
        voter_guides = action.res.voter_guides;
        let is_empty = voter_guides.length === 0;
        let search_term_exists = action.res.search_string !== "";
        ballot_item_we_vote_id = action.res.ballot_item_we_vote_id || "";
        let ballot_item_we_vote_id_exists = ballot_item_we_vote_id.length !== 0;

        if (!ballot_item_we_vote_id_exists || !stringContains("meas", ballot_item_we_vote_id) || is_empty || search_term_exists) {
          // Exit this routine
          // console.log("exiting MeasureStore voterGuidesToFollowRetrieve");
          return state;
        }
        all_cached_positions_about_measures = state.all_cached_positions_about_measures;
        voter_guides.forEach( one_voter_guide => {
          // Make sure we have a position in the voter guide
          if (one_voter_guide.is_support_or_positive_rating || one_voter_guide.is_oppose_or_negative_rating || one_voter_guide.is_information_only) {
            if (!all_cached_positions_about_measures[ballot_item_we_vote_id]) {
              all_cached_positions_about_measures[ballot_item_we_vote_id] = {};
            }
            if (!all_cached_positions_about_measures[ballot_item_we_vote_id][one_voter_guide.organization_we_vote_id]) {
              all_cached_positions_about_measures[ballot_item_we_vote_id][one_voter_guide.organization_we_vote_id] = {};
            }

            one_position = {
              position_we_vote_id: one_voter_guide.position_we_vote_id, // Currently empty
              ballot_item_display_name: one_voter_guide.ballot_item_display_name,
              ballot_item_image_url_https_large: one_voter_guide.ballot_item_image_url_https_large,
              ballot_item_image_url_https_medium: one_voter_guide.ballot_item_image_url_https_medium,
              ballot_item_image_url_https_tiny: one_voter_guide.ballot_item_image_url_https_tiny,
              ballot_item_twitter_handle: one_voter_guide.ballot_item_twitter_handle,
              ballot_item_political_party: one_voter_guide.ballot_item_political_party,
              kind_of_ballot_item: "MEASURE",
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
            // console.log("MeasureStore one_position: ", one_position);
            all_cached_positions_about_measures[ballot_item_we_vote_id][one_voter_guide.organization_we_vote_id] = one_position;
          }
        });
        // console.log("MeasureStore all_cached_positions_about_measures:", all_cached_positions_about_measures);
        return {
          ...state,
          all_cached_positions_about_measures: all_cached_positions_about_measures,
        };

      case "error-measureRetrieve" || "error-positionListForBallotItem":
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new MeasureStore(Dispatcher);
