import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import { stringContains } from '../utils/textFormat';

class MeasureStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedMeasures: {}, // Dictionary with measureWeVoteId as key and the measure as value
      allCachedPositionsAboutMeasures: {}, // Dictionary with measureWeVoteId as one key, organization_we_vote_id as the second key, and the position as value
      positionListFromAdvisersFollowedByVoter: {}, // Dictionary with measureWeVoteId as key and list of positions as value
    };
  }

  getMeasure (measureWeVoteId) {
    return this.getState().allCachedMeasures[measureWeVoteId] || [];
  }

  getYesVoteDescription (measureWeVoteId) {
    if (measureWeVoteId) {
      const measure = this.getMeasure(measureWeVoteId);
      if (measure && measure.yes_vote_description) {
        return measure.yes_vote_description;
      }
    }
    return '';
  }

  getNoVoteDescription (measureWeVoteId) {
    if (measureWeVoteId) {
      const measure = this.getMeasure(measureWeVoteId);
      if (measure && measure.no_vote_description) {
        return measure.no_vote_description;
      }
    }
    return '';
  }

  getPositionList (measureWeVoteId) {
    return this.getState().positionListFromAdvisersFollowedByVoter[measureWeVoteId] || [];
  }

  getPositionAboutMeasureFromOrganization (measureWeVoteId, organizationWeVoteId) {
    const positionsAboutMeasure = this.getState().allCachedPositionsAboutMeasures[measureWeVoteId] || [];
    return positionsAboutMeasure[organizationWeVoteId] || [];
  }

  reduce (state, action) { // eslint-disable-line
    const { allCachedPositionsAboutMeasures, allCachedMeasures, positionListFromAdvisersFollowedByVoter } = state;
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let ballotItemWeVoteId;
    let measure;
    let measureWeVoteId;
    let newPositionList;
    let onePosition;
    let positionListForMeasure;
    let voterGuides;
    const isEmpty = voterGuides && voterGuides.length === 0;
    const searchTermExists = action.res.search_string !== '';
    const ballotItemWeVoteIdExists = ballotItemWeVoteId && ballotItemWeVoteId.length !== 0;
    const tempBallotItemList = action.res.ballot_item_list;

    switch (action.type) {
      case 'measureRetrieve':
        measure = action.res;
        allCachedMeasures[measure.we_vote_id] = measure;
        return {
          ...state,
          allCachedMeasures,
        };

      case 'positionListForBallotItem':
        if (action.res.count === 0) return state;
        positionListForMeasure = action.res.kind_of_ballot_item === 'MEASURE';
        if (positionListForMeasure) {
          measureWeVoteId = action.res.ballot_item_we_vote_id;
          newPositionList = action.res.position_list;
          positionListFromAdvisersFollowedByVoter[measureWeVoteId] = newPositionList;
          return {
            ...state,
            positionListFromAdvisersFollowedByVoter,
          };
        } else {
          return state;
        }

      case 'voterBallotItemsRetrieve':
        if (tempBallotItemList) {
          tempBallotItemList.forEach((oneBallotItem) => {
            if (oneBallotItem.kind_of_ballot_item === 'MEASURE' && oneBallotItem.we_vote_id && !(oneBallotItem.we_vote_id in allCachedMeasures)) {
              // Only add new entries that aren't already stored
              allCachedMeasures[oneBallotItem.we_vote_id] = oneBallotItem;
            }
          });
        }
        return {
          ...state,
          allCachedMeasures,
        };

      case 'voterGuidesToFollowRetrieve':
        // This code harvests the positions that are passed in along with voter guides,
        //  and stores them so we can request them in cases where the response package for
        //  voterGuidesToFollowRetrieve does not include the position data

        // console.log("MeasureStore voterGuidesToFollowRetrieve");
        voterGuides = action.res.voter_guides;
        ballotItemWeVoteId = action.res.ballot_item_we_vote_id || '';

        if (!ballotItemWeVoteIdExists || !stringContains('meas', ballotItemWeVoteId) || isEmpty || searchTermExists) {
          // Exit this routine
          // console.log("exiting MeasureStore voterGuidesToFollowRetrieve");
          return state;
        }
        // If here, then this is a call specifically for the voter guides related to one measure
        voterGuides.forEach((oneVoterGuide) => {
          // Make sure we have a position in the voter guide
          if (oneVoterGuide.is_support_or_positive_rating || oneVoterGuide.is_oppose_or_negative_rating || oneVoterGuide.is_information_only) {
            if (!allCachedPositionsAboutMeasures[ballotItemWeVoteId]) {
              allCachedPositionsAboutMeasures[ballotItemWeVoteId] = {};
            }
            if (!allCachedPositionsAboutMeasures[ballotItemWeVoteId][oneVoterGuide.organization_we_vote_id]) {
              allCachedPositionsAboutMeasures[ballotItemWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
            }

            onePosition = {
              position_we_vote_id: oneVoterGuide.position_we_vote_id, // Currently empty
              ballot_item_display_name: oneVoterGuide.ballot_item_display_name,
              ballot_item_image_url_https_large: oneVoterGuide.ballot_item_image_url_https_large,
              ballot_item_image_url_https_medium: oneVoterGuide.ballot_item_image_url_https_medium,
              ballot_item_image_url_https_tiny: oneVoterGuide.ballot_item_image_url_https_tiny,
              ballot_item_twitter_handle: oneVoterGuide.ballot_item_twitter_handle,
              ballot_item_political_party: oneVoterGuide.ballot_item_political_party,
              kind_of_ballot_item: 'MEASURE',
              // ballot_item_id: 0,
              ballot_item_we_vote_id: ballotItemWeVoteId,
              // ballot_item_state_code: "",
              // contest_office_id: 0,
              // contest_office_we_vote_id: "",
              // contest_office_name: "",
              is_support: oneVoterGuide.is_support,
              is_positive_rating: oneVoterGuide.is_positive_rating,
              is_support_or_positive_rating: oneVoterGuide.is_support_or_positive_rating,
              is_oppose: oneVoterGuide.is_oppose,
              is_negative_rating: oneVoterGuide.is_negative_rating,
              is_oppose_or_negative_rating: oneVoterGuide.is_oppose_or_negative_rating,
              is_information_only: oneVoterGuide.is_information_only,
              is_public_position: oneVoterGuide.is_public_position,
              speaker_display_name: oneVoterGuide.speaker_display_name,
              vote_smart_rating: oneVoterGuide.vote_smart_rating,
              vote_smart_time_span: oneVoterGuide.vote_smart_time_span,
              google_civic_election_id: oneVoterGuide.google_civic_election_id,
              // state_code: "",
              more_info_url: oneVoterGuide.more_info_url,
              statement_text: oneVoterGuide.statement_text,
              last_updated: oneVoterGuide.last_updated,
            };
            // console.log("MeasureStore onePosition: ", onePosition);
            allCachedPositionsAboutMeasures[ballotItemWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
          }
        });
        // console.log("MeasureStore allCachedPositionsAboutMeasures:", allCachedPositionsAboutMeasures);
        return {
          ...state,
          allCachedPositionsAboutMeasures,
        };

        // case "voterGuidesUpcomingRetrieve":
        //   // This code harvests the positions that are passed in along with voter guides
        // DALE 2018-10-16 We could add code here to populate this store - the pattern for voterGuidesToFollowRetrieve isn't right for voterGuidesUpcomingRetrieve though

      case 'error-measureRetrieve' || 'error-positionListForBallotItem':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new MeasureStore(Dispatcher);
