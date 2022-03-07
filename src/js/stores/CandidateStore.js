import { ReduceStore } from 'flux/utils';
import OfficeActions from '../actions/OfficeActions';
import Dispatcher from '../common/dispatcher/Dispatcher';

import { mostLikelyOfficeDictFromList } from '../utils/candidateFunctions';
import normalizedImagePath from '../common/utils/normalizedImagePath'; // eslint-disable-line import/no-cycle
import { extractNumberOfPositionsFromPositionList } from '../utils/positionFunctions'; // eslint-disable-line import/no-cycle
import { stringContains } from '../utils/textFormat';
import OfficeStore from './OfficeStore';

class CandidateStore extends ReduceStore {
  getInitialState () {
    const explanationCandidates = {
      candidateAlexanderHamilton: {
        we_vote_id: 'candidateAlexanderHamilton',
        ballot_item_display_name: 'Alexander Hamilton',
        candidate_photo_url_large: normalizedImagePath('../../../img/global/photos/Alexander_Hamilton-48x48.png'),
        contest_office_name: 'President',
        party: 'Nonpartisan',
      },
    };
    const explanationPositions = {
      candidateAlexanderHamilton: [
        {
          position_we_vote_id: 'positionOneAlexanderHamilton',
          ballot_item_display_name: 'Alexander Hamilton',
          ballot_item_we_vote_id: 'candidateAlexanderHamilton',
          kind_of_ballot_item: 'CANDIDATE',
          is_support: true,
          is_support_or_positive_rating: true,
          speaker_display_name: 'Sierra Club',
          speaker_type: 'G',
          speaker_we_vote_id: 'organizationSierraClub',
          speaker_image_url_https_large: 'https://wevote-images.s3.amazonaws.com/wv02org1061/twitter_profile_image-20180818_1_200x200.jpeg',
          contest_office_name: 'President',
          party: 'Nonpartisan',
        },
        {
          position_we_vote_id: 'positionTwoAlexanderHamilton',
          ballot_item_display_name: 'Alexander Hamilton',
          ballot_item_we_vote_id: 'candidateAlexanderHamilton',
          kind_of_ballot_item: 'CANDIDATE',
          is_support: true,
          is_support_or_positive_rating: true,
          speaker_display_name: 'Oprah',
          speaker_type: 'PF',
          speaker_we_vote_id: 'organizationOprah',
          speaker_image_url_https_large: 'https://wevote-images.s3.amazonaws.com/wv02org1061/twitter_profile_image-20180818_1_200x200.jpeg',
          contest_office_name: 'President',
          party: 'Nonpartisan',
        },
        {
          position_we_vote_id: 'positionThreeAlexanderHamilton',
          ballot_item_display_name: 'Alexander Hamilton',
          ballot_item_we_vote_id: 'candidateAlexanderHamilton',
          kind_of_ballot_item: 'CANDIDATE',
          is_support: true,
          is_support_or_positive_rating: true,
          speaker_display_name: 'League of Women Voters',
          speaker_type: 'G',
          speaker_we_vote_id: 'organizationLeagueOfWomenVoters',
          speaker_image_url_https_large: 'https://wevote-images.s3.amazonaws.com/wv02org1061/twitter_profile_image-20180818_1_200x200.jpeg',
          contest_office_name: 'President',
          party: 'Nonpartisan',
        },
      ],
    };

    return {
      allCachedCandidates: explanationCandidates, // Dictionary with candidate_we_vote_id as key and the candidate as value
      allCachedPositionsAboutCandidates: explanationPositions, // Dictionary with candidate_we_vote_id as one key, organization_we_vote_id as the second key, and the position as value
      candidateListsByOfficeWeVoteId: {}, // Dictionary with office_we_vote_id as key and list of candidates in the office as value
      numberOfCandidatesRetrievedByOffice: {}, // Dictionary with office_we_vote_id as key and number of candidates as value
    };
  }

  getAllCachedPositionsDictByCandidateWeVoteId (candidateWeVoteId) {
    return this.getState().allCachedPositionsAboutCandidates[candidateWeVoteId] || {};
  }

  getAllCachedPositionsByCandidateWeVoteId (candidateWeVoteId) {
    const allCachedPositionsForThisCandidateDict = this.getState().allCachedPositionsAboutCandidates[candidateWeVoteId] || {};
    return Object.values(allCachedPositionsForThisCandidateDict);
  }

  getCandidateListByOfficeWeVoteId (officeWeVoteId) {
    // console.log('officeWeVoteId:', officeWeVoteId, ', this.getState().candidateListsByOfficeWeVoteId:', this.getState().candidateListsByOfficeWeVoteId);
    const candidateListsDict = this.getState().candidateListsByOfficeWeVoteId;
    if (candidateListsDict) {
      return candidateListsDict[officeWeVoteId] || [];
    } else {
      return [];
    }
  }

  getCandidate (candidateWeVoteId) {
    return this.getState().allCachedCandidates[candidateWeVoteId] || {};
  }

  getMostLikelyOfficeDictFromCandidateWeVoteId (candidateWeVoteId) {
    const candidate = this.getState().allCachedCandidates[candidateWeVoteId] || {};
    // console.log('getMostLikelyOfficeDictFromCandidateWeVoteId candidate:', candidate)
    if (candidate && candidate.contest_office_list && candidate.contest_office_list[0]) {
      return mostLikelyOfficeDictFromList(candidate.contest_office_list);
    }
    // Not ideal
    // console.log('getMostLikelyOfficeDictFromCandidateWeVoteId falling back on candidate.contest_office_we_vote_id');
    return {
      contest_office_name: candidate.contest_office_name,
      contest_office_we_vote_id: candidate.contest_office_we_vote_id,
      election_day_text: candidate.election_day_text,
      google_civic_election_id: candidate.google_civic_election_id,
      state_code: candidate.state_code,
    };
  }

  getNumberOfCandidatesRetrievedByOffice (officeWeVoteId) {
    return this.getState().numberOfCandidatesRetrievedByOffice[officeWeVoteId] || 0;
  }

  getNumberOfPositionsByCandidateWeVoteId (candidateWeVoteId) {
    let numberOfAllSupportPositions = 0;
    let numberOfAllOpposePositions = 0;
    let numberOfAllInfoOnlyPositions = 0;
    if (this.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId)) {
      const results = extractNumberOfPositionsFromPositionList(this.getAllCachedPositionsByCandidateWeVoteId(candidateWeVoteId));
      ({ numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = results);
    }
    return {
      numberOfAllSupportPositions,
      numberOfAllOpposePositions,
      numberOfAllInfoOnlyPositions,
    };
  }

  getPositionAboutCandidateFromOrganization (candidateWeVoteId, orgWeVoteId) {
    const positionsAboutCandidate = this.getAllCachedPositionsDictByCandidateWeVoteId(candidateWeVoteId);
    // console.log('CandidateStore, candidateId: ', candidateId, 'organization_we_vote_id: ', organization_we_vote_id);
    // console.log('CandidateStore, getPositionAboutCandidateFromOrganization: ', positions_about_candidate[organization_we_vote_id]);
    return positionsAboutCandidate[orgWeVoteId] || [];
  }

  isCandidateInStore (candidateId) {
    const candidate = this.getState().allCachedCandidates[candidateId] || {};
    if (candidate.we_vote_id) {
      return true;
    } else {
      return false;
    }
  }

  createCandidatePosition (oneCandidateWeVoteId, oneVoterGuide) {
    const candidateObject = this.getCandidate(oneCandidateWeVoteId);
    // console.log('candidateObject: ', candidateObject);
    // console.log('createCandidatePosition oneVoterGuide: ', oneVoterGuide);
    const onePosition = {
      position_we_vote_id: '', // Currently empty
      ballot_item_display_name: candidateObject.ballot_item_display_name,
      ballot_item_image_url_https_large: candidateObject.candidate_photo_url_large,
      ballot_item_image_url_https_medium: candidateObject.candidate_photo_url_medium,
      ballot_item_image_url_https_tiny: candidateObject.candidate_photo_url_tiny,
      ballot_item_twitter_handle: candidateObject.twitter_handle,
      ballot_item_political_party: candidateObject.party,
      kind_of_ballot_item: 'CANDIDATE',

      // ballot_item_id: 0,
      ballot_item_we_vote_id: oneCandidateWeVoteId,

      ballot_item_state_code: candidateObject.state_code,
      contest_office_id: candidateObject.contest_office_id,
      contest_office_we_vote_id: candidateObject.contest_office_we_vote_id,
      contest_office_name: candidateObject.contest_office_name,
      is_support: false,  // These are filled in later
      is_positive_rating: false,
      is_support_or_positive_rating: false,
      is_oppose: false,
      is_negative_rating: false,
      is_oppose_or_negative_rating: false,
      is_information_only: false,
      is_public_position: true,
      organization_we_vote_id: oneVoterGuide.organization_we_vote_id,
      speaker_we_vote_id: oneVoterGuide.organization_we_vote_id,
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
    // console.log('CandidateStore, voterGuidesToFollowRetrieve, onePosition: ', onePosition);
    return onePosition;
  }

  reduce (state, action) {
    const {
      allCachedCandidates, allCachedPositionsAboutCandidates, numberOfCandidatesRetrievedByOffice,
    } = state;
    let {
      candidateListsByOfficeWeVoteId,
    } = state;
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let ballotItemWeVoteId;
    let candidate;
    let candidateList;
    let googleCivicElectionId;
    let incomingCandidateCount = 0;
    let localCandidateList = [];
    let newPositionList;
    let officePositionList;
    let onePosition;
    let voterGuides;
    let contestOfficeWeVoteId = '';
    let organizationWeVoteId = '';
    const positionList = action.res.position_list;
    const isEmpty = voterGuides && voterGuides.length === 0;
    const searchTermExists = action.res.search_string !== '';
    const ballotItemWeVoteIdExists = ballotItemWeVoteId && ballotItemWeVoteId.length !== 0;

    // January 2019: Switch cases could be DRYer.

    switch (action.type) {
      case 'candidateRetrieve':
        // Make sure we have information for the office the candidate is running for
        if (action.res.contest_office_we_vote_id) {
          const office = OfficeStore.getOffice(action.res.contest_office_we_vote_id);
          if (!office || !office.ballot_item_display_name) {
            OfficeActions.officeRetrieve(action.res.contest_office_we_vote_id);
          }
        }

        candidate = action.res;
        allCachedCandidates[candidate.we_vote_id] = candidate;
        return {
          ...state,
          allCachedCandidates,
        };

      case 'candidatesRetrieve':
        // Make sure we have information for the office the candidate is running for
        if (action.res.contest_office_we_vote_id) {
          contestOfficeWeVoteId = action.res.contest_office_we_vote_id;
          const office = OfficeStore.getOffice(action.res.contest_office_we_vote_id);
          if (!office || !office.ballot_item_display_name) {
            OfficeActions.officeRetrieve(action.res.contest_office_we_vote_id);
          }
        }

        incomingCandidateCount = 0;
        candidateList = action.res.candidate_list;
        // console.log('CandidateStore candidatesRetrieve contestOfficeWeVoteId:', contestOfficeWeVoteId, ', candidateList:', candidateList);
        if (!candidateListsByOfficeWeVoteId) {
          candidateListsByOfficeWeVoteId = {};
        }
        localCandidateList = [];
        candidateList.forEach((one) => {
          allCachedCandidates[one.we_vote_id] = one;
          incomingCandidateCount += 1;
          localCandidateList.push(one);
        });
        // console.log('localCandidateList:', localCandidateList);
        candidateListsByOfficeWeVoteId[contestOfficeWeVoteId] = localCandidateList;
        // console.log('candidateListsByOfficeWeVoteId:', candidateListsByOfficeWeVoteId);
        // console.log('candidateListsByOfficeWeVoteId[contestOfficeWeVoteId]:', candidateListsByOfficeWeVoteId[contestOfficeWeVoteId]);
        // candidateListsByOfficeWeVoteId[contestOfficeWeVoteId].forEach((two) => {
        //   console.log('two:', two);
        // });
        if (contestOfficeWeVoteId.length) {
          numberOfCandidatesRetrievedByOffice[contestOfficeWeVoteId] = incomingCandidateCount;
        }

        return {
          ...state,
          allCachedCandidates,
          candidateListsByOfficeWeVoteId,
          numberOfCandidatesRetrievedByOffice,
        };

      case 'voterAddressSave':
      case 'voterBallotItemsRetrieve':
        googleCivicElectionId = action.res.google_civic_election_id || 0;
        if (googleCivicElectionId !== 0) {
          action.res.ballot_item_list.forEach((ballotItem) => {
            if (ballotItem.kind_of_ballot_item === 'OFFICE' && ballotItem.candidate_list) {
              candidateList = ballotItem.candidate_list;
              candidateList.forEach((one) => {
                allCachedCandidates[one.we_vote_id] = one;
              });
            }
          });

          return {
            ...state,
            allCachedCandidates,
          };
        }
        return state;

      case 'positionListForBallotItem':
      case 'positionListForBallotItemFromFriends':
        // console.log('positionListForBallotItem action.res:', action.res);
        if (action.res.count === 0) return state;

        if (action.res.kind_of_ballot_item === 'CANDIDATE') {
          newPositionList = action.res.position_list;
          newPositionList.forEach((oneIncomingPosition) => {
            ballotItemWeVoteId = oneIncomingPosition.ballot_item_we_vote_id;
            organizationWeVoteId = oneIncomingPosition.speaker_we_vote_id;

            if (!allCachedPositionsAboutCandidates[ballotItemWeVoteId]) {
              allCachedPositionsAboutCandidates[ballotItemWeVoteId] = {};
            }

            if (!allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId]) {
              allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId] = {};
            }

            // console.log('CandidateStore oneIncomingPosition: ', oneIncomingPosition);
            allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId] = oneIncomingPosition;
          });

          return {
            ...state,
            allCachedPositionsAboutCandidates,
          };
        } else if (action.res.kind_of_ballot_item === 'OFFICE') {
          officePositionList = action.res.position_list;

          officePositionList.forEach((oneIncomingPosition) => {
            ballotItemWeVoteId = oneIncomingPosition.ballot_item_we_vote_id;
            organizationWeVoteId = oneIncomingPosition.speaker_we_vote_id;

            if (!allCachedPositionsAboutCandidates[ballotItemWeVoteId]) {
              allCachedPositionsAboutCandidates[ballotItemWeVoteId] = {};
            }

            if (!allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId]) {
              allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId] = {};
            }

            // console.log('CandidateStore oneIncomingPosition: ', oneIncomingPosition);
            allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId] = oneIncomingPosition;
          });

          return {
            ...state,
            allCachedPositionsAboutCandidates,
          };
        } else {
          return state;
        }

      case 'positionListForOpinionMaker':
        // console.log('CandidateStore, positionListForOpinionMaker response');
        organizationWeVoteId = action.res.opinion_maker_we_vote_id;
        positionList.forEach((one) => {
          ballotItemWeVoteId = one.ballot_item_we_vote_id;
          if (stringContains('cand', ballotItemWeVoteId)) {
            if (!allCachedPositionsAboutCandidates[ballotItemWeVoteId]) {
              allCachedPositionsAboutCandidates[ballotItemWeVoteId] = {};
            }

            if (!allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId]) {
              allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId] = {};
            }

            // console.log('CandidateStore one_position_here: ', one_position_here);
            allCachedPositionsAboutCandidates[ballotItemWeVoteId][organizationWeVoteId] = one;
          }
        });
        return {
          ...state,
          allCachedPositionsAboutCandidates,
        };

      case 'voterGuidesToFollowRetrieve':
        // This code harvests the support/oppose positions that are passed in along with voter guides,
        //  and stores them so we can request them in cases where the response package for
        //  voterGuidesToFollowRetrieve does not include the position data

        // console.log('CandidateStore voterGuidesToFollowRetrieve');
        voterGuides = action.res.voter_guides;
        ballotItemWeVoteId = action.res.ballot_item_we_vote_id || '';

        if (isEmpty || searchTermExists) {
          // Exit this routine
          // console.log('exiting CandidateStore voterGuidesToFollowRetrieve - no voter guides or search results');
          return state;
        }

        if (ballotItemWeVoteIdExists && stringContains('cand', ballotItemWeVoteId)) {
          // Case 1: voterGuidesToFollowRetrieve focused on one ballot item
          voterGuides.forEach((oneVoterGuide) => {
            // Make sure we have a position in the voter guide
            if (oneVoterGuide.is_support_or_positive_rating || oneVoterGuide.is_oppose_or_negative_rating || oneVoterGuide.is_information_only) {
              if (!allCachedPositionsAboutCandidates[ballotItemWeVoteId]) {
                allCachedPositionsAboutCandidates[ballotItemWeVoteId] = {};
              }

              if (!allCachedPositionsAboutCandidates[ballotItemWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                allCachedPositionsAboutCandidates[ballotItemWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
              }

              onePosition = allCachedPositionsAboutCandidates[ballotItemWeVoteId][oneVoterGuide.organization_we_vote_id];
              // Only proceed if the position doesn't already exist
              if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                // Do not proceed
                // console.log('CandidateStore voterGuidesToFollowRetrieve part 1 position already exists');
              } else {
                onePosition = {
                  position_we_vote_id: oneVoterGuide.position_we_vote_id, // Currently empty
                  ballot_item_display_name: oneVoterGuide.ballot_item_display_name,
                  ballot_item_image_url_https_large: oneVoterGuide.ballot_item_image_url_https_large,
                  ballot_item_image_url_https_medium: oneVoterGuide.ballot_item_image_url_https_medium,
                  ballot_item_image_url_https_tiny: oneVoterGuide.ballot_item_image_url_https_tiny,
                  ballot_item_twitter_handle: oneVoterGuide.ballot_item_twitter_handle,
                  ballot_item_political_party: oneVoterGuide.ballot_item_political_party,
                  kind_of_ballot_item: 'CANDIDATE',

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
                  organization_we_vote_id: oneVoterGuide.organization_we_vote_id,
                  speaker_we_vote_id: oneVoterGuide.organization_we_vote_id,
                  speaker_display_name: oneVoterGuide.speaker_display_name,
                  speaker_image_url_https_large: oneVoterGuide.voter_guide_image_url_large,
                  speaker_image_url_https_medium: oneVoterGuide.voter_guide_image_url_medium,
                  speaker_image_url_https_tiny: oneVoterGuide.voter_guide_image_url_tiny,
                  speaker_twitter_handle: oneVoterGuide.twitter_handle,
                  speaker_type: oneVoterGuide.voter_guide_owner_type,
                  vote_smart_rating: oneVoterGuide.vote_smart_rating,
                  vote_smart_time_span: oneVoterGuide.vote_smart_time_span,
                  voter_guide_we_vote_id: oneVoterGuide.we_vote_id,
                  google_civic_election_id: oneVoterGuide.google_civic_election_id,

                  // state_code: '',
                  more_info_url: oneVoterGuide.more_info_url,
                  statement_text: '',
                  last_updated: oneVoterGuide.last_updated,
                };
                // console.log('CandidateStore, voterGuidesToFollowRetrieve, onePosition: ', onePosition);
              }

              // console.log('CandidateStore onePosition: ', onePosition);
              allCachedPositionsAboutCandidates[ballotItemWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
            }
          });
        } else {
          // Case 2: voterGuidesToFollowRetrieve is general purpose
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
              oneVoterGuide.ballot_item_we_vote_ids_this_org_supports.forEach((oneCandidateWeVoteId) => {
                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId] = {};
                }

                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist
                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesToFollowRetrieve Support position already exists');
                } else {
                  onePosition = this.createCandidatePosition(oneCandidateWeVoteId, oneVoterGuide);
                  // These are support positions
                  onePosition.is_support = true;
                  onePosition.is_positive_rating = false;
                  onePosition.is_support_or_positive_rating = true;

                  // console.log('CandidateStore support onePosition: ', onePosition);
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              });
              // Information Only
              oneVoterGuide.ballot_item_we_vote_ids_this_org_info_only.forEach((oneCandidateWeVoteId) => {
                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId] = {};
                }

                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist
                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesToFollowRetrieve Info only position already exists');
                } else {
                  onePosition = this.createCandidatePosition(oneCandidateWeVoteId, oneVoterGuide);
                  // These are information only positions
                  onePosition.is_information_only = true;

                  // console.log('CandidateStore info onePosition: ', onePosition);
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              });
              // Opposition
              oneVoterGuide.ballot_item_we_vote_ids_this_org_opposes.forEach((oneCandidateWeVoteId) => {
                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId] = {};
                }

                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist

                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesToFollowRetrieve Oppose position already exists');
                } else {
                  onePosition = this.createCandidatePosition(oneCandidateWeVoteId, oneVoterGuide);
                  // These are oppose positions
                  onePosition.is_oppose = true;
                  onePosition.is_negative_rating = false;
                  onePosition.is_oppose_or_negative_rating = true;

                  // console.log('CandidateStore oppose onePosition: ', onePosition);
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              });
            }
          });
        }

        // console.log('CandidateStore allCachedPositionsAboutCandidates:', allCachedPositionsAboutCandidates);
        return {
          ...state,
          allCachedPositionsAboutCandidates,
        };

      case 'voterGuidesUpcomingRetrieve': // List of all public voter guides from CDN
      case 'voterGuidesFromFriendsUpcomingRetrieve': // List of all friends-only voter guides
        // This code harvests the support/oppose positions that are passed in along with voter guides

        // console.log('CandidateStore voterGuidesUpcomingRetrieve');
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
            oneVoterGuide.ballot_item_we_vote_ids_this_org_supports.forEach((oneCandidateWeVoteId) => {
              if (stringContains('cand', oneCandidateWeVoteId)) {
                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId] = {};
                }

                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist
                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesUpcomingRetrieve Support position already exists');
                } else {
                  onePosition = this.createCandidatePosition(oneCandidateWeVoteId, oneVoterGuide);
                  // These are support positions
                  onePosition.is_support = true;
                  onePosition.is_positive_rating = false;
                  onePosition.is_support_or_positive_rating = true;

                  // console.log('CandidateStore support onePosition: ', onePosition);
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              }
            });
            // Information Only
            oneVoterGuide.ballot_item_we_vote_ids_this_org_info_only.forEach((oneCandidateWeVoteId) => {
              if (stringContains('cand', oneCandidateWeVoteId)) {
                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId] = {};
                }

                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist
                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesUpcomingRetrieve Info only position already exists');
                } else {
                  onePosition = this.createCandidatePosition(oneCandidateWeVoteId, oneVoterGuide);
                  // These are information only positions
                  onePosition.is_information_only = true;

                  // console.log('CandidateStore info onePosition: ', onePosition);
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              }
            });
            // Opposition
            oneVoterGuide.ballot_item_we_vote_ids_this_org_opposes.forEach((oneCandidateWeVoteId) => {
              if (stringContains('cand', oneCandidateWeVoteId)) {
                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId] = {};
                }

                if (!allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id]) {
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = {};
                }

                onePosition = allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id];
                // Only proceed if the position doesn't already exist
                if (Object.prototype.hasOwnProperty.call(onePosition, 'ballot_item_we_vote_id')) {
                  // Do not proceed
                  // console.log('voterGuidesUpcomingRetrieve Oppose position already exists');
                } else {
                  onePosition = this.createCandidatePosition(oneCandidateWeVoteId, oneVoterGuide);
                  // These are oppose positions
                  onePosition.is_oppose = true;
                  onePosition.is_negative_rating = false;
                  onePosition.is_oppose_or_negative_rating = true;

                  // console.log('CandidateStore oppose onePosition: ', onePosition);
                  allCachedPositionsAboutCandidates[oneCandidateWeVoteId][oneVoterGuide.organization_we_vote_id] = onePosition;
                }
              }
            });
          }
        });

        // console.log('CandidateStore allCachedPositionsAboutCandidates:', allCachedPositionsAboutCandidates);
        return {
          ...state,
          allCachedPositionsAboutCandidates,
        };

      case 'error-candidateRetrieve' || 'error-positionListForBallotItem':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new CandidateStore(Dispatcher);
