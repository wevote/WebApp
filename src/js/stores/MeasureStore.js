import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import { stringContains } from '../utils/textFormat';
import {extractNumberOfPositionsFromPositionList} from "../utils/positionFunctions";

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

  getAllCachedPositionsByMeasureWeVoteId (measureWeVoteId) {
    return this.getState().allCachedPositionsAboutMeasures[measureWeVoteId] || [];
  }

  getNumberOfPositionsByMeasureWeVoteId (measureWeVoteId) {
    let numberOfSupportPositions = 0;
    let numberOfOpposePositions = 0;
    let numberOfInfoOnlyPositions = 0;
    if (this.getState().allCachedPositionsAboutMeasures[measureWeVoteId]) {
      const results = extractNumberOfPositionsFromPositionList(this.getState().allCachedPositionsAboutMeasures[measureWeVoteId]);
      ({ numberOfSupportPositions, numberOfOpposePositions, numberOfInfoOnlyPositions } = results);
    }
    return {
      numberOfSupportPositions,
      numberOfOpposePositions,
      numberOfInfoOnlyPositions,
    };
  }

  getPositionList (measureWeVoteId) {
    return this.getState().positionListFromAdvisersFollowedByVoter[measureWeVoteId] || [];
  }

  getPositionAboutMeasureFromOrganization (measureWeVoteId, organizationWeVoteId) {
    const positionsAboutMeasure = this.getState().allCachedPositionsAboutMeasures[measureWeVoteId] || [];
    return positionsAboutMeasure[organizationWeVoteId] || [];
  }

  createMeasurePosition (oneMeasureWeVoteId, oneVoterGuide) {
    const measureObject = this.getMeasure(oneMeasureWeVoteId);
    // console.log('measureObject: ', measureObject);
    // console.log('createMeasurePosition oneVoterGuide: ', oneVoterGuide);

    const onePosition = {
      position_we_vote_id: '', // Currently empty
      ballot_item_display_name: measureObject.ballot_item_display_name,
      kind_of_ballot_item: 'MEASURE',

      // ballot_item_id: 0,
      ballot_item_we_vote_id: oneMeasureWeVoteId,

      ballot_item_state_code: measureObject.state_code,
      is_support: false,  // These are filled in later
      is_positive_rating: false,
      is_support_or_positive_rating: false,
      is_oppose: false,
      is_negative_rating: false,
      is_oppose_or_negative_rating: false,
      is_information_only: false,
      is_public_position: true,
      organization_we_vote_id: oneVoterGuide.organization_we_vote_id,
      speaker_display_name: oneVoterGuide.voter_guide_display_name,
      speaker_image_url_https_large: oneVoterGuide.voter_guide_image_url_large,
      speaker_image_url_https_medium: oneVoterGuide.voter_guide_image_url_medium,
      speaker_image_url_https_tiny: oneVoterGuide.voter_guide_image_url_tiny,
      speaker_twitter_handle: oneVoterGuide.twitter_handle,
      speaker_type: oneVoterGuide.voter_guide_owner_type,
      voter_guide_we_vote_id: oneVoterGuide.we_vote_id,
      vote_smart_rating: '',
      vote_smart_time_span: '',
      google_civic_election_id: oneVoterGuide.google_civic_election_id,

      // state_code: '',
      more_info_url: '',
      statement_text: '',
      last_updated: '',
    };
    // console.log('MeasureStore, voterGuidesToFollowRetrieve, onePosition: ', onePosition);
    return onePosition;
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
    let organizationWeVoteId;
    let positionList;
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

          newPositionList.forEach((one) => {
            ballotItemWeVoteId = one.ballot_item_we_vote_id;
            organizationWeVoteId = one.speaker_we_vote_id;

            if (!allCachedPositionsAboutMeasures[ballotItemWeVoteId]) {
              allCachedPositionsAboutMeasures[ballotItemWeVoteId] = {};
            }

            if (!allCachedPositionsAboutMeasures[ballotItemWeVoteId][organizationWeVoteId]) {
              allCachedPositionsAboutMeasures[ballotItemWeVoteId][organizationWeVoteId] = {};
            }

            // console.log('CandidateStore one_position_here: ', one_position_here);
            allCachedPositionsAboutMeasures[ballotItemWeVoteId][organizationWeVoteId] = one;
          });

          return {
            ...state,
            allCachedPositionsAboutMeasures,
            positionListFromAdvisersFollowedByVoter,
          };
        } else {
          return state;
        }

      case 'positionListForOpinionMaker':
        // console.log('MeasureStore, positionListForOpinionMaker response');
        organizationWeVoteId = action.res.opinion_maker_we_vote_id;
        positionList = action.res.position_list;
        positionList.forEach((one) => {
          ballotItemWeVoteId = one.ballot_item_we_vote_id;
          if (stringContains('meas', ballotItemWeVoteId)) {
            if (!allCachedPositionsAboutMeasures[ballotItemWeVoteId]) {
              allCachedPositionsAboutMeasures[ballotItemWeVoteId] = {};
            }

            if (!allCachedPositionsAboutMeasures[ballotItemWeVoteId][organizationWeVoteId]) {
              allCachedPositionsAboutMeasures[ballotItemWeVoteId][organizationWeVoteId] = {};
            }

            // console.log('MeasureStore one_position_here: ', one_position_here);
            allCachedPositionsAboutMeasures[ballotItemWeVoteId][organizationWeVoteId] = one;
          }
        });
        return {
          ...state,
          allCachedPositionsAboutMeasures,
        };

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

        // console.log('MeasureStore voterGuidesToFollowRetrieve');
        voterGuides = action.res.voter_guides;
        ballotItemWeVoteId = action.res.ballot_item_we_vote_id || '';

        if (!ballotItemWeVoteIdExists || !stringContains('meas', ballotItemWeVoteId) || isEmpty || searchTermExists) {
          // Exit this routine
          // console.log('exiting MeasureStore voterGuidesToFollowRetrieve');
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
              // ballot_item_state_code: '',
              // contest_office_id: 0,
              // contest_office_we_vote_id: '',
              // contest_office_name: '',
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
              // state_code: '',
              more_info_url: oneVoterGuide.more_info_url,
              statement_text: oneVoterGuide.statement_text,
              last_updated: oneVoterGuide.last_updated,
            };
            // console.log('MeasureStore onePosition: ', onePosition);
            allCachedPositionsAboutMeasures[ballotItemWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
          }
        });
        // console.log('MeasureStore allCachedPositionsAboutMeasures:', allCachedPositionsAboutMeasures);
        return {
          ...state,
          allCachedPositionsAboutMeasures,
        };


      case 'voterGuidesUpcomingRetrieve':
        // This code harvests the support/oppose positions that are passed in along with voter guides

        // console.log('MeasureStore voterGuidesUpcomingRetrieve');
        voterGuides = action.res.voter_guides;
        ballotItemWeVoteId = action.res.ballot_item_we_vote_id || '';

        voterGuides.forEach((oneVoterGuide) => {
          // Make sure we have a position in the voter guide
          if (!oneVoterGuide.ballot_item_we_vote_ids_this_org_supports ||
              !oneVoterGuide.ballot_item_we_vote_ids_this_org_info_only ||
              !oneVoterGuide.ballot_item_we_vote_ids_this_org_opposes ||
              !oneVoterGuide.organization_we_vote_id) {
            // If any of these are undefined, ignore this voter_guide
            // console.log('Something wrong with voter guide.');
          } else {
            // Support
            oneVoterGuide.ballot_item_we_vote_ids_this_org_supports.forEach((oneMeasureWeVoteId) => {
              if (stringContains('meas', oneMeasureWeVoteId)) {
                if (!allCachedPositionsAboutMeasures[oneMeasureWeVoteId]) {
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId] = {};
                }

                if (!allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist
                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesUpcomingRetrieve Support position already exists');
                } else {
                  onePosition = this.createMeasurePosition(oneMeasureWeVoteId, oneVoterGuide);
                  // These are support positions
                  onePosition.is_support = true;
                  onePosition.is_positive_rating = false;
                  onePosition.is_support_or_positive_rating = true;

                  // console.log('MeasureStore support onePosition: ', onePosition);
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              }
            });
            // Information Only
            oneVoterGuide.ballot_item_we_vote_ids_this_org_info_only.forEach((oneMeasureWeVoteId) => {
              if (stringContains('meas', oneMeasureWeVoteId)) {
                if (!allCachedPositionsAboutMeasures[oneMeasureWeVoteId]) {
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId] = {};
                }

                if (!allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist
                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesUpcomingRetrieve Info only position already exists');
                } else {
                  onePosition = this.createMeasurePosition(oneMeasureWeVoteId, oneVoterGuide);
                  // These are information only positions
                  onePosition.is_information_only = true;

                  // console.log('MeasureStore info onePosition: ', onePosition);
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              }
            });
            // Opposition
            oneVoterGuide.ballot_item_we_vote_ids_this_org_opposes.forEach((oneMeasureWeVoteId) => {
              if (stringContains('meas', oneMeasureWeVoteId)) {
                if (!allCachedPositionsAboutMeasures[oneMeasureWeVoteId]) {
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId] = {};
                }

                if (!allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist
                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesUpcomingRetrieve Oppose position already exists');
                } else {
                  onePosition = this.createMeasurePosition(oneMeasureWeVoteId, oneVoterGuide);
                  // These are oppose positions
                  onePosition.is_oppose = true;
                  onePosition.is_negative_rating = false;
                  onePosition.is_oppose_or_negative_rating = true;

                  // console.log('MeasureStore oppose onePosition: ', onePosition);
                  allCachedPositionsAboutMeasures[oneMeasureWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              }
            });
          }
        });

        // console.log('Measure allCachedPositionsAboutMeasures:', allCachedPositionsAboutMeasures);
        return {
          ...state,
          allCachedPositionsAboutMeasures,
        };

      case 'error-measureRetrieve' || 'error-positionListForBallotItem':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new MeasureStore(Dispatcher);
