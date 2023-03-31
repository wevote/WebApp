import { ReduceStore } from 'flux/utils';
import OfficeActions from '../../actions/OfficeActions';
import Dispatcher from '../dispatcher/Dispatcher';

import { mostLikelyOfficeDictFromList } from '../../utils/candidateFunctions';
import { extractNumberOfPositionsFromPositionList } from '../../utils/positionFunctions'; // eslint-disable-line import/no-cycle
import OfficeStore from '../../stores/OfficeStore';
import VoterStore from '../../stores/VoterStore';
import arrayContains from '../utils/arrayContains';

class PoliticianStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedContestOfficeWeVoteIdsByPolitician: {}, // Dictionary with politician_we_vote_id as key and ContestOfficeWeVoteIdList as value
      allCachedCandidateListsByPolitician: {}, // Dictionary with politician_we_vote_id as key and list of candidates under politician
      allCachedPoliticianNewsItems: {}, // Dictionary with politician_news_item_we_vote_id key and the PoliticianNews as value
      allCachedNewsItemWeVoteIdsByPolitician: {}, // Dictionary with politician_we_vote_id as key and the PoliticianNews for this voter as value
      allCachedPoliticianOwners: {}, // key == politicianWeVoteId, value = list of owners of this politician
      allCachedPoliticianOwnerPhotos: {}, // key == politicianWeVoteId, value = Tiny Profile Photo to show
      allCachedPoliticianWeVoteIdsBySEOFriendlyPath: {}, // key == politicianSEOFriendlyPath, value = politicianWeVoteId
      allCachedPoliticians: {}, // key == politicianWeVoteId, value = the Politician
      allCachedPositionsAboutPoliticians: {}, // Dictionary with politician_we_vote_id as one key, organization_we_vote_id as the second key, and the position as value
      allCachedRepresentativeListsByPolitician: {}, // Dictionary with politician_we_vote_id as key and list of representatives under politician
      voterCanSendUpdatesPoliticianWeVoteIds: [], // These are the politician_we_vote_id's of the politicians this voter can send updates to
      voterCanVoteForPoliticianWeVoteIds: [], // These are the politician_we_vote_id's this voter can vote for
      voterOwnedPoliticianWeVoteIds: [], // These are the politician_we_vote_id's of the politicians this voter can edit
      voterStartedPoliticianWeVoteIds: [], // These are the politician_we_vote_id's of the politicians this voter started
      voterSupportedPoliticianWeVoteIds: [], // These are the politician_we_vote_id's of the politicians this voter supports
      voterWeVoteId: '',
    };
  }

  resetVoterSpecificData () {
    return {
      allCachedPoliticianWeVoteIdsBySEOFriendlyPath: {}, // key == politicianSEOFriendlyPath, value = politicianWeVoteId
      voterCanSendUpdatesPoliticianWeVoteIds: [], // These are the politician_we_vote_id's of the politicians this voter can send updates to
      voterCanVoteForPoliticianWeVoteIds: [], // These are the politician_we_vote_id's this voter can vote for
      voterOwnedPoliticianWeVoteIds: [], // These are the politician_we_vote_id's of the politicians this voter can edit
      voterStartedPoliticianWeVoteIds: [], // These are the politician_we_vote_id's of the politicians this voter started
      voterSupportedPoliticianWeVoteIds: [], // These are the politician_we_vote_id's of the politicians this voter supports
      voterWeVoteId: '',
    };
  }

  getAllCachedPositionsDictByPoliticianWeVoteId (politicianWeVoteId) {
    return this.getState().allCachedPositionsAboutPoliticians[politicianWeVoteId] || {};
  }

  getAllCachedPositionsByPoliticianWeVoteId (politicianWeVoteId) {
    const allCachedPositionsForThisPoliticianDict = this.getState().allCachedPositionsAboutPoliticians[politicianWeVoteId] || {};
    return Object.values(allCachedPositionsForThisPoliticianDict);
  }

  getPoliticianListByOfficeWeVoteId (officeWeVoteId) {
    // console.log('officeWeVoteId:', officeWeVoteId, ', this.getState().politicianListsByOfficeWeVoteId:', this.getState().politicianListsByOfficeWeVoteId);
    const politicianListsDict = this.getState().politicianListsByOfficeWeVoteId;
    if (politicianListsDict) {
      return politicianListsDict[officeWeVoteId] || [];
    } else {
      return [];
    }
  }

  getPoliticianList () {
    const politicianList = Object.values(this.getState().allCachedPoliticians);
    return politicianList || [];
  }

  getPoliticianName (politicianWeVoteId) {
    const politician = this.getState().allCachedPoliticians[politicianWeVoteId] || {};
    if (politician && politician.ballot_item_display_name) {
      return politician.ballot_item_display_name;
    }
    return '';
  }

  getMostLikelyOfficeDictFromPoliticianWeVoteId (politicianWeVoteId) {
    const politician = this.getState().allCachedPoliticians[politicianWeVoteId] || {};
    // console.log('getMostLikelyOfficeDictFromPoliticianWeVoteId politician:', politician)
    if (politician && politician.contest_office_list && politician.contest_office_list[0]) {
      return mostLikelyOfficeDictFromList(politician.contest_office_list);
    }
    // Not ideal
    // console.log('getMostLikelyOfficeDictFromPoliticianWeVoteId falling back on politician.contest_office_we_vote_id');
    return {
      contest_office_name: politician.contest_office_name,
      contest_office_we_vote_id: politician.contest_office_we_vote_id,
      election_day_text: politician.election_day_text,
      google_civic_election_id: politician.google_civic_election_id,
      state_code: politician.state_code,
    };
  }

  getPoliticianBySEOFriendlyPath (politicianSEOFriendlyPath) {
    const politicianWeVoteId = this.getState().allCachedPoliticianWeVoteIdsBySEOFriendlyPath[politicianSEOFriendlyPath] || '';
    const politician = this.getState().allCachedPoliticians[politicianWeVoteId];
    // console.log('PoliticianStore getPoliticianBySEOFriendlyPath politicianSEOFriendlyPath:', politicianSEOFriendlyPath, ', politicianWeVoteId:', politicianWeVoteId, ', politician:', politician);
    if (politician === undefined) {
      return {};
    }
    return politician;
  }

  getPoliticianWeVoteIdFromPoliticianSEOFriendlyPath (politicianSEOFriendlyPath) {
    return this.getState().allCachedPoliticianWeVoteIdsBySEOFriendlyPath[politicianSEOFriendlyPath] || '';
  }

  getNumberOfPositionsByPoliticianWeVoteId (politicianWeVoteId) {
    let numberOfAllSupportPositions = 0;
    let numberOfAllOpposePositions = 0;
    let numberOfAllInfoOnlyPositions = 0;
    if (this.getAllCachedPositionsByPoliticianWeVoteId(politicianWeVoteId)) {
      const results = extractNumberOfPositionsFromPositionList(this.getAllCachedPositionsByPoliticianWeVoteId(politicianWeVoteId));
      ({ numberOfAllSupportPositions, numberOfAllOpposePositions, numberOfAllInfoOnlyPositions } = results);
    }
    return {
      numberOfAllSupportPositions,
      numberOfAllOpposePositions,
      numberOfAllInfoOnlyPositions,
    };
  }

  getPoliticianByWeVoteId (politicianWeVoteId) {
    const politician = this.getState().allCachedPoliticians[politicianWeVoteId];
    if (politician === undefined) {
      return {};
    }
    return politician;
  }

  getPositionAboutPoliticianFromOrganization (politicianWeVoteId, orgWeVoteId) {
    const positionsAboutPolitician = this.getAllCachedPositionsDictByPoliticianWeVoteId(politicianWeVoteId);
    // console.log('PoliticianStore, politicianId: ', politicianId, 'organization_we_vote_id: ', organization_we_vote_id);
    // console.log('PoliticianStore, getPositionAboutPoliticianFromOrganization: ', positions_about_politician[organization_we_vote_id]);
    return positionsAboutPolitician[orgWeVoteId] || [];
  }

  getVoterCanEditThisPolitician (politicianWeVoteId = '') {
    console.log('getVoterCanEditThisPolitician:', politicianWeVoteId);
    return false;
  }

  getVoterSupportsThisPolitician (politicianWeVoteId) {
    // console.log('this.getState().voterSupportedPoliticianWeVoteIds:', this.getState().voterSupportedPoliticianWeVoteIds);
    return arrayContains(politicianWeVoteId, this.getState().voterSupportedPoliticianWeVoteIds);
  }

  isPoliticianInStore (politicianId) {
    const politician = this.getState().allCachedPoliticians[politicianId] || {};
    if (politician.politician_we_vote_id) {
      return true;
    } else {
      return false;
    }
  }

  createPoliticianPosition (onePoliticianWeVoteId, oneVoterGuide) {
    const politicianObject = this.getPoliticianByWeVoteId(onePoliticianWeVoteId);
    // console.log('politicianObject: ', politicianObject);
    // console.log('createPoliticianPosition oneVoterGuide: ', oneVoterGuide);
    const onePosition = {
      position_we_vote_id: '', // Currently empty
      ballot_item_display_name: politicianObject.ballot_item_display_name,
      ballot_item_image_url_https_large: politicianObject.politician_photo_url_large,
      ballot_item_image_url_https_medium: politicianObject.politician_photo_url_medium,
      ballot_item_image_url_https_tiny: politicianObject.politician_photo_url_tiny,
      ballot_item_twitter_handle: politicianObject.twitter_handle,
      ballot_item_political_party: politicianObject.party,
      kind_of_ballot_item: 'CANDIDATE',

      // ballot_item_id: 0,
      ballot_item_we_vote_id: onePoliticianWeVoteId,

      ballot_item_state_code: politicianObject.state_code,
      contest_office_id: politicianObject.contest_office_id,
      contest_office_we_vote_id: politicianObject.contest_office_we_vote_id,
      contest_office_name: politicianObject.contest_office_name,
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
    // console.log('PoliticianStore, voterGuidesToFollowRetrieve, onePosition: ', onePosition);
    return onePosition;
  }

  extractPoliticianCandidateList (politician, allCachedCandidateListsByPoliticianIncoming) {
    let allCachedCandidateListsByPolitician = allCachedCandidateListsByPoliticianIncoming;
    // console.log('extractPoliticianCandidateList politician:', politician);
    if (!allCachedCandidateListsByPolitician) {
      allCachedCandidateListsByPolitician = {};
    }
    for (let i = 0; i < politician.candidate_list.length; ++i) {
      // console.log('PoliticianStore candidate_list i: ', i, ', one_owner: ', politician.candidate_list[i]);
      // TODO In order to get the name of the office the politician is running for (future), use this starting code...
      // if (politician.candidate_list[i].organization_we_vote_id &&
      //     politician.candidate_list[i].organization_we_vote_id === linkedOrganizationWeVoteId) {
      //   if (!(arrayContains(politician.politician_we_vote_id, voterOwnedPoliticianWeVoteIds))) {
      //     voterOwnedPoliticianWeVoteIds.push(politician.politician_we_vote_id);
      //   }
      // }
    }
    allCachedCandidateListsByPolitician[politician.politician_we_vote_id] = politician.candidate_list;

    return {
      allCachedCandidateListsByPolitician,
    };
  }

  extractPoliticianOwnerList (politician, allCachedPoliticianOwnersIncoming, allCachedPoliticianOwnerPhotosIncoming, voterCanSendUpdatesPoliticianWeVoteIdsIncoming, voterOwnedPoliticianWeVoteIdsIncoming) {
    const allCachedPoliticianOwners = allCachedPoliticianOwnersIncoming;
    const allCachedPoliticianOwnerPhotos = allCachedPoliticianOwnerPhotosIncoming;
    const politicianOwnersFiltered = [];
    let featuredProfileImageFound = false;
    let firstProfileImageFound = false;
    let useThisProfileImage = false;
    const voterCanSendUpdatesPoliticianWeVoteIds = voterCanSendUpdatesPoliticianWeVoteIdsIncoming;
    const voterOwnedPoliticianWeVoteIds = voterOwnedPoliticianWeVoteIdsIncoming;
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    // console.log('extractPoliticianOwnerList politician:', politician);
    if (politician.voter_can_send_updates_to_politician) {
      if (!(arrayContains(politician.politician_we_vote_id, voterCanSendUpdatesPoliticianWeVoteIds))) {
        voterCanSendUpdatesPoliticianWeVoteIds.push(politician.politician_we_vote_id);
      }
    }
    if (politician.voter_is_politician_owner) {
      if (!(arrayContains(politician.politician_we_vote_id, voterOwnedPoliticianWeVoteIds))) {
        voterOwnedPoliticianWeVoteIds.push(politician.politician_we_vote_id);
      }
    }
    for (let i = 0; i < politician.politician_owner_list.length; ++i) {
      // console.log('CampaignStore owner_list i: ', i, ', one_owner: ', politician.politician_owner_list[i]);
      if (politician.politician_owner_list[i].organization_we_vote_id &&
          politician.politician_owner_list[i].organization_we_vote_id === linkedOrganizationWeVoteId) {
        if (!(arrayContains(politician.politician_we_vote_id, voterOwnedPoliticianWeVoteIds))) {
          voterOwnedPoliticianWeVoteIds.push(politician.politician_we_vote_id);
        }
      }
      if (politician.politician_owner_list[i].visible_to_public) {
        if (politician.politician_owner_list[i].organization_name) {
          politicianOwnersFiltered.push(politician.politician_owner_list[i]);
        }
        if (politician.politician_owner_list[i].we_vote_hosted_profile_image_url_tiny) {
          if (politician.politician_owner_list[i].feature_this_profile_image) {
            if (!featuredProfileImageFound) {
              // Always use the first profile image found which is featured
              useThisProfileImage = true;
            }
            featuredProfileImageFound = true;
            firstProfileImageFound = true;
          }
          if (!featuredProfileImageFound && !firstProfileImageFound) {
            // Use this image if it is the first image found and a featured image hasn't already been found
            useThisProfileImage = true;
          }
          if (useThisProfileImage) {
            allCachedPoliticianOwnerPhotos[politician.politician_we_vote_id] = politician.politician_owner_list[i].we_vote_hosted_profile_image_url_tiny;
          }
        }
      }
    }
    allCachedPoliticianOwners[politician.politician_we_vote_id] = politicianOwnersFiltered;

    return {
      allCachedPoliticianOwners,
      allCachedPoliticianOwnerPhotos,
      voterCanSendUpdatesPoliticianWeVoteIds,
      voterOwnedPoliticianWeVoteIds,
    };
  }

  reduce (state, action) {
    const {
      allCachedPoliticianNewsItems,
      allCachedPoliticianWeVoteIdsBySEOFriendlyPath, allCachedNewsItemWeVoteIdsByPolitician,
      voterSupportedPoliticianWeVoteIds,
    } = state;
    let {
      allCachedPoliticians, allCachedPoliticianOwners, allCachedCandidateListsByPolitician, allCachedPoliticianOwnerPhotos,
      voterCanSendUpdatesPoliticianWeVoteIds, voterCanVoteForPoliticianWeVoteIds, voterOwnedPoliticianWeVoteIds,
      // voterStartedPoliticianWeVoteIds,
    } = state;
    let {
      politicianListsByOfficeWeVoteId,
    } = state;
    // Exit if we don't have a successful response (since we expect certain variables in a successful response below)
    if (!action.res || !action.res.success) return state;

    let localPoliticianList;
    let politician;
    let politicianList;
    let politicianNewsItem = {};
    let politicianNewsItemWeVoteIds = [];
    let revisedState;
    let voterSpecificData;
    switch (action.type) {
      case 'politicianRetrieve':
      case 'politicianRetrieveAsOwner':
        // See CampaignSupporterStore for code to take in the following politician values:
        // - latest_politician_supporter_endorsement_list
        // - latest_politician_supporter_list
        // - voter_politician_supporter

        if (!action.res || !action.res.success) return state;
        revisedState = state;
        politician = action.res;
        // console.log('PoliticianStore politicianRetrieve, politician:', politician);
        if (allCachedPoliticians === undefined) {
          allCachedPoliticians = {};
        }
        allCachedPoliticians[politician.politician_we_vote_id] = politician;
        if ('politician_news_item_list' in politician) {
          politicianNewsItemWeVoteIds = [];
          for (let i = 0; i < politician.politician_news_item_list.length; ++i) {
            politicianNewsItem = politician.politician_news_item_list[i];
            allCachedPoliticianNewsItems[politicianNewsItem.politician_news_item_we_vote_id] = politicianNewsItem;
            politicianNewsItemWeVoteIds.push(politicianNewsItem.politician_news_item_we_vote_id);
          }
          if (politician.politician_news_item_list.length > 0) {
            allCachedNewsItemWeVoteIdsByPolitician[politicianNewsItem.politician_we_vote_id] = politicianNewsItemWeVoteIds;
          }
        }
        // if ('politician_owner_list' in politician) {
        ({
          allCachedPoliticianOwners,
          allCachedPoliticianOwnerPhotos,
          voterCanSendUpdatesPoliticianWeVoteIds,
          voterOwnedPoliticianWeVoteIds,
        } = this.extractPoliticianOwnerList(politician, allCachedPoliticianOwners, allCachedPoliticianOwnerPhotos, voterCanSendUpdatesPoliticianWeVoteIds, voterOwnedPoliticianWeVoteIds));
        // }
        if ('candidate_list' in politician) {
          ({ allCachedCandidateListsByPolitician } = this.extractPoliticianCandidateList(politician, allCachedCandidateListsByPolitician));
          // We might want to put allCachedPoliticianOffices in this store, or we might want to put that in the OfficeStore,
          //  and use allCachedContestOfficeWeVoteIdsByPolitician
        }
        if ('representative_list' in politician) {
          ({ allCachedCandidateListsByPolitician } = this.extractPoliticianCandidateList(politician, allCachedCandidateListsByPolitician));
          // We might want to put allCachedPoliticianOffices in this store, or we might want to put that in the OfficeStore,
          //  and use allCachedContestOfficeWeVoteIdsByPolitician
        }
        if (!(politician.seo_friendly_path in allCachedPoliticianWeVoteIdsBySEOFriendlyPath)) {
          allCachedPoliticianWeVoteIdsBySEOFriendlyPath[politician.seo_friendly_path] = politician.politician_we_vote_id;
        }
        // console.log('PoliticianStore allCachedPoliticianOwners:', allCachedPoliticianOwners);
        if (action.res.voter_can_vote_for_politician_we_vote_ids) {
          // We want to reset this variable with this incoming value
          voterCanVoteForPoliticianWeVoteIds = action.res.voter_can_vote_for_politician_we_vote_ids;
          revisedState = { ...revisedState, voterCanVoteForPoliticianWeVoteIds };
        }
        if ('voter_politician_supporter' in action.res) {
          if ('politician_supported' in action.res.voter_politician_supporter) {
            //
            // console.log('action.res.voter_politician_supporter.politician_supported:', action.res.voter_politician_supporter.politician_supported);
            if (action.res.voter_politician_supporter.politician_supported) {
              if (!(action.res.voter_politician_supporter.politician_we_vote_id in voterSupportedPoliticianWeVoteIds)) {
                voterSupportedPoliticianWeVoteIds.push(action.res.voter_politician_supporter.politician_we_vote_id);
                revisedState = { ...revisedState, voterSupportedPoliticianWeVoteIds };
              }
            }
          }
        }
        revisedState = { ...revisedState, allCachedPoliticians };
        revisedState = { ...revisedState, allCachedPoliticianNewsItems };
        revisedState = { ...revisedState, allCachedPoliticianOwners };
        revisedState = { ...revisedState, allCachedPoliticianOwnerPhotos };
        revisedState = { ...revisedState, allCachedCandidateListsByPolitician };
        revisedState = { ...revisedState, allCachedPoliticianWeVoteIdsBySEOFriendlyPath };
        revisedState = { ...revisedState, allCachedNewsItemWeVoteIdsByPolitician };
        revisedState = { ...revisedState, voterCanSendUpdatesPoliticianWeVoteIds };
        revisedState = { ...revisedState, voterOwnedPoliticianWeVoteIds };
        return revisedState;

      case 'politiciansQuery':
      case 'politiciansRetrieve':
        // Make sure we have information for the office the politician is running for
        if (action.res.contest_office_we_vote_id) {
          const office = OfficeStore.getOffice(action.res.contest_office_we_vote_id);
          if (!office || !office.ballot_item_display_name) {
            OfficeActions.officeRetrieve(action.res.contest_office_we_vote_id);
          }
        }

        if (action.type === 'politiciansQuery') {
          politicianList = action.res.politicians;
        } else {
          politicianList = action.res.politician_list;
        }
        // console.log('PoliticianStore politiciansRetrieve politicianList:', politicianList);
        if (!politicianListsByOfficeWeVoteId) {
          politicianListsByOfficeWeVoteId = {};
        }
        localPoliticianList = [];
        politicianList.forEach((one) => {
          allCachedPoliticians[one.we_vote_id] = one;
          localPoliticianList.push(one);
        });

        return {
          ...state,
          allCachedPoliticians,
          politicianListsByOfficeWeVoteId,
        };

      case 'voterSignOut':
        // console.log('PoliticianStore voterSignOut, state:', state);
        revisedState = state;
        voterSpecificData = this.resetVoterSpecificData();
        revisedState = { ...revisedState, voterSpecificData };
        return revisedState;

      case 'error-politicianRetrieve' || 'error-positionListForBallotItem':
        console.log(action);
        return state;

      default:
        return state;
    }
  }
}

export default new PoliticianStore(Dispatcher);
