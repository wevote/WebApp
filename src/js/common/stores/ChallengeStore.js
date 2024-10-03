import { ReduceStore } from 'flux/utils';
import { avatarGeneric } from '../../utils/applicationUtils';
import Dispatcher from '../dispatcher/Dispatcher';
import arrayContains from '../utils/arrayContains';
import VoterStore from '../../stores/VoterStore';
import daysUntil from '../utils/daysUntil'; // eslint-disable-line import/no-cycle

const SUPPORTERS_COUNT_NEXT_GOAL_DEFAULT = 10;

class ChallengeStore extends ReduceStore {
  getInitialState () {
    return {
      allCachedChallengeDicts: {}, // key == challengeWeVoteId, value = challenge data dict
      allCachedChallengeNewsItems: {}, // Dictionary with challenge_news_item_we_vote_id key and the ChallengeNews as value
      allCachedNewsItemWeVoteIdsByChallenge: {}, // Dictionary with challenge_we_vote_id as key and the ChallengeNews for this voter as value
      allCachedChallengeOwners: {}, // key == challengeWeVoteId, value = list of owners of this challenge
      allCachedChallengeOwnerPhotos: {}, // key == challengeWeVoteId, value = Tiny Profile Photo to show
      allCachedChallengePoliticianLists: {}, // key == challengeWeVoteId, value = list of politicians supported in this Challenge
      allCachedChallengeWeVoteIdsBySEOFriendlyPath: {}, // key == challengeSEOFriendlyPath, value = challengeWeVoteId
      allCachedPoliticians: {}, // key == politicianWeVoteId, value = the Politician
      allCachedPoliticianWeVoteIdsByChallenge: {}, // key == challengeWeVoteId, value == list of politicianWeVoteIds in the challenge
      allCachedRecommendedChallengeWeVoteIdLists: {}, // key == challengeWeVoteId, value = list of challenges recommended
      promotedChallengeWeVoteIds: [], // These are the challenge_we_vote_id's of the challenges this voter started
      voterCanSendUpdatesChallengeWeVoteIds: [], // These are the challenge_we_vote_id's of the challenges this voter can send updates to
      voterCanVoteForPoliticianWeVoteIds: [], // These are the politician_we_vote_id's this voter can vote for
      voterOwnedChallengeWeVoteIds: [], // These are the challenge_we_vote_id's of the challenges this voter can edit
      voterStartedChallengeWeVoteIds: [], // These are the challenge_we_vote_id's of the challenges this voter started
      challengeWeVoteIdsWhereVoterIsParticipant: [], // These are the challenge_we_vote_id's of the challenges this voter supports
      voterWeVoteId: '',
    };
  }

  resetVoterSpecificData () {
    return {
      allCachedChallengeWeVoteIdsBySEOFriendlyPath: {}, // key == challengeSEOFriendlyPath, value = challengeWeVoteId
      promotedChallengeWeVoteIds: [], // These are the challenge_we_vote_id's of the challenges this voter started
      voterCanSendUpdatesChallengeWeVoteIds: [], // These are the challenge_we_vote_id's of the challenges this voter can send updates to
      voterCanVoteForPoliticianWeVoteIds: [], // These are the politician_we_vote_id's this voter can vote for
      voterOwnedChallengeWeVoteIds: [], // These are the challenge_we_vote_id's of the challenges this voter can edit
      voterStartedChallengeWeVoteIds: [], // These are the challenge_we_vote_id's of the challenges this voter started
      challengeWeVoteIdsWhereVoterIsParticipant: [], // These are the challenge_we_vote_id's of the challenges this voter supports
      voterWeVoteId: '',
    };
  }

  challengeNewsItemTextExists (challengeNewsItemWeVoteId) {
    if (challengeNewsItemWeVoteId) {
      const challengeNewsItem = this.getChallengeNewsItemByWeVoteId(challengeNewsItemWeVoteId);
      // console.log('challengeNewsItemTextExists, challengeParticipantVoterEntry:', challengeParticipantVoterEntry);
      if ('challenge_news_text' in challengeNewsItem && challengeNewsItem.challenge_news_text) {
        return Boolean(challengeNewsItem.challenge_news_text.length > 0);
      }
    }
    return false;
  }

  challengeIsLoaded (challengeWeVoteId) {
    if (challengeWeVoteId) {
      const challenge = this.getChallengeByWeVoteId(challengeWeVoteId);
      // console.log('challengeIsLoaded, challenge:', challenge);
      if ('challenge_we_vote_id' in challenge) {
        return Boolean(challenge.challenge_we_vote_id);
      }
    }
    return false;
  }

  extractChallengeOwnerList (challenge, allCachedChallengeOwnersIncoming, allCachedChallengeOwnerPhotosIncoming, voterCanSendUpdatesChallengeWeVoteIdsIncoming, voterOwnedChallengeWeVoteIdsIncoming) {
    const allCachedChallengeOwners = allCachedChallengeOwnersIncoming;
    const allCachedChallengeOwnerPhotos = allCachedChallengeOwnerPhotosIncoming;
    const challengeOwnersFiltered = [];
    let featuredProfileImageFound = false;
    let firstProfileImageFound = false;
    let useThisProfileImage = false;
    const voterCanSendUpdatesChallengeWeVoteIds = voterCanSendUpdatesChallengeWeVoteIdsIncoming;
    const voterOwnedChallengeWeVoteIds = voterOwnedChallengeWeVoteIdsIncoming;
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    // console.log('extractChallengeOwnerList challenge:', challenge);
    if (challenge.voter_can_send_updates_to_challenge) {
      if (!(arrayContains(challenge.challenge_we_vote_id, voterCanSendUpdatesChallengeWeVoteIds))) {
        voterCanSendUpdatesChallengeWeVoteIds.push(challenge.challenge_we_vote_id);
      }
    }
    if (challenge.voter_is_challenge_owner) {
      if (!(arrayContains(challenge.challenge_we_vote_id, voterOwnedChallengeWeVoteIds))) {
        voterOwnedChallengeWeVoteIds.push(challenge.challenge_we_vote_id);
      }
    }
    for (let i = 0; i < challenge.challenge_owner_list.length; ++i) {
      // console.log('ChallengeStore owner_list i: ', i, ', one_owner: ', challenge.challenge_owner_list[i]);
      if (challenge.challenge_owner_list[i].organization_we_vote_id &&
          challenge.challenge_owner_list[i].organization_we_vote_id === linkedOrganizationWeVoteId) {
        if (!(arrayContains(challenge.challenge_we_vote_id, voterOwnedChallengeWeVoteIds))) {
          voterOwnedChallengeWeVoteIds.push(challenge.challenge_we_vote_id);
        }
      }
      if (challenge.challenge_owner_list[i].visible_to_public) {
        if (challenge.challenge_owner_list[i].organization_name) {
          challengeOwnersFiltered.push(challenge.challenge_owner_list[i]);
        }
        if (challenge.challenge_owner_list[i].we_vote_hosted_profile_image_url_tiny) {
          if (challenge.challenge_owner_list[i].feature_this_profile_image) {
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
            allCachedChallengeOwnerPhotos[challenge.challenge_we_vote_id] = challenge.challenge_owner_list[i].we_vote_hosted_profile_image_url_tiny;
          }
        }
      }
    }
    allCachedChallengeOwners[challenge.challenge_we_vote_id] = challengeOwnersFiltered;

    return {
      allCachedChallengeOwners,
      allCachedChallengeOwnerPhotos,
      voterCanSendUpdatesChallengeWeVoteIds,
      voterOwnedChallengeWeVoteIds,
    };
  }

  extractChallengePoliticianList (challenge, allCachedChallengePoliticianListsIncoming) {
    const allCachedChallengePoliticianLists = allCachedChallengePoliticianListsIncoming;
    const challengePoliticianListFiltered = [];
    for (let i = 0; i < challenge.challenge_politician_list.length; ++i) {
      // console.log('ChallengeStore owner_list i: ', i, ', one_owner: ', challenge.challenge_politician_list[i]);
      if (challenge.challenge_politician_list[i].politician_name) {
        challengePoliticianListFiltered.push(challenge.challenge_politician_list[i]);
      }
    }
    allCachedChallengePoliticianLists[challenge.challenge_we_vote_id] = challengePoliticianListFiltered;

    return {
      allCachedChallengePoliticianLists,
    };
  }

  extractPoliticianWeVoteIdListFromChallenge (challenge, allCachedPoliticianWeVoteIdsByChallengeIncoming) {
    const allCachedPoliticianWeVoteIdsByChallenge = allCachedPoliticianWeVoteIdsByChallengeIncoming;
    const politicianWeVoteIdListFiltered = [];
    for (let i = 0; i < challenge.challenge_politician_list.length; ++i) {
      // console.log('ChallengeStore politician i: ', i, ': ', challenge.challenge_politician_list[i]);
      if (challenge.challenge_politician_list[i].politician_name) {
        politicianWeVoteIdListFiltered.push(challenge.challenge_politician_list[i].politician_we_vote_id);
      }
    }
    allCachedPoliticianWeVoteIdsByChallenge[challenge.challenge_we_vote_id] = politicianWeVoteIdListFiltered;

    return {
      allCachedPoliticianWeVoteIdsByChallenge,
    };
  }

  getAllCachedChallengeList () {
    const { allCachedChallengeDicts } = this.getState();
    return Object.values(allCachedChallengeDicts);
  }

  getChallengeBySEOFriendlyPath (challengeSEOFriendlyPath) {
    const challengeWeVoteId = this.getState().allCachedChallengeWeVoteIdsBySEOFriendlyPath[challengeSEOFriendlyPath] || '';
    const challenge = this.getState().allCachedChallengeDicts[challengeWeVoteId];
    // console.log('ChallengeStore getChallengeBySEOFriendlyPath challengeSEOFriendlyPath:', challengeSEOFriendlyPath, ', challengeWeVoteId:', challengeWeVoteId, ', challenge:', challenge);
    if (challenge === undefined) {
      return {};
    }
    return challenge;
  }

  getChallengeFinalElectionDateInPastByWeVoteId (challengeWeVoteId) {
    const challenge = this.getState().allCachedChallengeDicts[challengeWeVoteId];
    if (challenge === undefined || challenge.final_election_date_in_past === undefined) {
      return false;
    }
    return challenge.final_election_date_in_past;
  }

  getChallengeByWeVoteId (challengeWeVoteId) {
    const challenge = this.getState().allCachedChallengeDicts[challengeWeVoteId];
    // console.log('ChallengeStore getChallengeByWeVoteId challengeWeVoteId:', challengeWeVoteId, ', challenge:', challenge);
    if (challenge === undefined) {
      return {};
    }
    return challenge;
  }

  getChallengeInviteTextDefaultByWeVoteId (challengeWeVoteId) {
    const challenge = this.getState().allCachedChallengeDicts[challengeWeVoteId];
    // console.log('ChallengeStore getChallengeInviteTextDefaultByWeVoteId challengeWeVoteId:', challengeWeVoteId, ', challenge:', challenge);
    if (challenge === undefined || challenge.challenge_invite_text_default === undefined) {
      return '';
    }
    return challenge.challenge_invite_text_default;
  }

  getChallengeNewsItemByWeVoteId (challengeNewsItemWeVoteId) {
    return this.getState().allCachedChallengeNewsItems[challengeNewsItemWeVoteId] || {};
  }

  getChallengeNewsItemDateSentToEmail (challengeNewsItemWeVoteId) {
    const newsItem = this.getState().allCachedChallengeNewsItems[challengeNewsItemWeVoteId] || {};
    if (newsItem && newsItem.date_sent_to_email) {
      return newsItem.date_sent_to_email;
    }
    return '';
  }

  getChallengeNewsItemsExist (challengeWeVoteId) {
    const newsItemListWeVoteIds = this.getState().allCachedNewsItemWeVoteIdsByChallenge[challengeWeVoteId] || [];
    return Boolean(newsItemListWeVoteIds.length);
  }

  getChallengeNewsItemList (challengeWeVoteId) {
    const newsItemListWeVoteIds = this.getState().allCachedNewsItemWeVoteIdsByChallenge[challengeWeVoteId] || [];
    const challengeNewsItemList = [];
    if (newsItemListWeVoteIds) {
      let challengeNewsItem;
      newsItemListWeVoteIds.forEach((challengeNewsItemWeVoteId) => {
        if (this.getState().allCachedChallengeNewsItems[challengeNewsItemWeVoteId]) {
          challengeNewsItem = this.getState().allCachedChallengeNewsItems[challengeNewsItemWeVoteId];
          challengeNewsItemList.push(challengeNewsItem);
        }
      });
    }
    return challengeNewsItemList;
  }

  getChallengeOwnerList (challengeWeVoteId) {
    return this.getState().allCachedChallengeOwners[challengeWeVoteId] || [];
  }

  getChallengeLeadOwnerProfilePhoto (challengeWeVoteId, hideAnonymousImage = false) {
    const alternateImage = hideAnonymousImage ? '' : avatarGeneric();
    return this.getState().allCachedChallengeOwnerPhotos[challengeWeVoteId] || alternateImage;
  }

  getChallengePoliticianList (challengeWeVoteId) {
    return this.getState().allCachedChallengePoliticianLists[challengeWeVoteId] || [];
  }

  getChallengeParticipantsCountNextGoalDefault () {
    return SUPPORTERS_COUNT_NEXT_GOAL_DEFAULT;
  }

  getChallengeTitleByWeVoteId (challengeWeVoteId) {
    const challenge = this.getState().allCachedChallengeDicts[challengeWeVoteId];
    if (challenge === undefined || challenge.challenge_title === undefined) {
      return '';
    }
    return challenge.challenge_title;
  }

  getRecommendedChallengeList (challengeWeVoteId) {
    const recommendedChallengeWeVoteIdList = this.getState().allCachedRecommendedChallengeWeVoteIdLists[challengeWeVoteId] || [];
    return this.getChallengeListFromListOfWeVoteIds(recommendedChallengeWeVoteIdList);
  }

  getRecommendedChallengeListCount (challengeWeVoteId) {
    const recommendedChallengeWeVoteIdList = this.getState().allCachedRecommendedChallengeWeVoteIdLists[challengeWeVoteId] || [];
    return recommendedChallengeWeVoteIdList.length;
  }

  getRecommendedChallengeListHasBeenRetrieved (challengeWeVoteId) {
    if (!challengeWeVoteId) {
      return null;
    }
    return challengeWeVoteId in this.getState().allCachedRecommendedChallengeWeVoteIdLists;
  }

  getChallengeWeVoteIdFromChallengeSEOFriendlyPath (challengeSEOFriendlyPath) {
    return this.getState().allCachedChallengeWeVoteIdsBySEOFriendlyPath[challengeSEOFriendlyPath] || '';
  }

  getChallengeListFromListOfWeVoteIds (listOfChallengeWeVoteIds) {
    let { allCachedChallengeDicts } = this.getState();
    // console.log('getChallengeListFromListOfWeVoteIds listOfChallengeWeVoteIds: ', listOfChallengeWeVoteIds);
    // make sure that listOfChallengeWeVoteIds has unique values
    const uniqListOfChallengeWeVoteIds = listOfChallengeWeVoteIds.filter((value, index, self) => self.indexOf(value) === index);

    if (allCachedChallengeDicts === undefined) {
      allCachedChallengeDicts = {};
    }
    const challengeList = [];
    let challenge;
    uniqListOfChallengeWeVoteIds.forEach((challengeWeVoteId) => {
      if (allCachedChallengeDicts[challengeWeVoteId]) {
        challenge = allCachedChallengeDicts[challengeWeVoteId];
        challengeList.push(challenge);
      }
    });
    // console.log('getChallengeListFromListOfWeVoteIds challengeList: ', challengeList);

    return challengeList;
  }

  getDaysUntilChallengeEnds (challengeWeVoteId) {
    const challenge = this.getChallengeByWeVoteId(challengeWeVoteId);
    let challengeEndsDayText = '';
    if (challenge && challenge.challenge_ends_date_as_integer) {
      // TODO: Convert integer to date format
      challengeEndsDayText = '2024-11-05';
    } else {
      challengeEndsDayText = '2024-11-05';
    }
    return daysUntil(challengeEndsDayText);
  }

  getNumberOfInviteesInChallenge (challengeWeVoteId) {
    const challenge = this.getChallengeByWeVoteId(challengeWeVoteId);
    if (challenge && challenge.invitees_count) {
      return challenge.invitees_count;
    } else {
      return 0;
    }
  }

  getNumberOfParticipantsInChallenge (challengeWeVoteId) {
    const challenge = this.getChallengeByWeVoteId(challengeWeVoteId);
    if (challenge && challenge.participants_count) {
      return challenge.participants_count;
    } else {
      return 0;
    }
  }

  getPromotedChallengeDicts () {
    return this.getChallengeListFromListOfWeVoteIds(this.getState().promotedChallengeWeVoteIds);
  }

  getSiteUrl (challengeWeVoteId) {
    const challenge = this.getChallengeByWeVoteId(challengeWeVoteId);
    // console.log('this.getState().voterOwnedChallengeWeVoteIds:', this.getState().voterOwnedChallengeWeVoteIds);
    if (challenge && challenge.site_url) {
      return challenge.site_url;
    } else {
      return 'https://wevote.us';
    }
  }

  getVoterCanEditThisChallenge (challengeWeVoteId) {
    // console.log('this.getState().voterOwnedChallengeWeVoteIds:', this.getState().voterOwnedChallengeWeVoteIds);
    return arrayContains(challengeWeVoteId, this.getState().voterOwnedChallengeWeVoteIds);
  }

  getVoterCanSendUpdatesToThisChallenge (challengeWeVoteId) {
    // console.log('this.getState().voterCanSendUpdatesChallengeWeVoteIds:', this.getState().voterCanSendUpdatesChallengeWeVoteIds);
    return arrayContains(challengeWeVoteId, this.getState().voterCanSendUpdatesChallengeWeVoteIds);
  }

  getVoterCanVoteForPoliticianInChallenge (challengeWeVoteId) {
    const { allCachedPoliticianWeVoteIdsByChallenge, voterCanVoteForPoliticianWeVoteIds } = this.getState();  //
    // console.log('challengeWeVoteId:', challengeWeVoteId);
    if (allCachedPoliticianWeVoteIdsByChallenge && allCachedPoliticianWeVoteIdsByChallenge[challengeWeVoteId]) {
      const politicianWeVoteIdsForChallenge = allCachedPoliticianWeVoteIdsByChallenge[challengeWeVoteId];
      const intersection = politicianWeVoteIdsForChallenge.filter((x) => voterCanVoteForPoliticianWeVoteIds.includes(x));
      if (intersection && intersection.length > 0) {
        // console.log('intersection:', intersection);
        return true;
      }
    }
    return false;
  }

  getVoterOwnedChallengeDicts () {
    return this.getChallengeListFromListOfWeVoteIds(this.getState().voterOwnedChallengeWeVoteIds);
  }

  getVoterOwnedChallengeWeVoteIds () {
    return this.getState().voterOwnedChallengeWeVoteIds;
  }

  getVoterStartedChallengeDicts () {
    return this.getChallengeListFromListOfWeVoteIds(this.getState().voterStartedChallengeWeVoteIds);
  }

  getVoterSupportedChallengeDicts () {
    return this.getChallengeListFromListOfWeVoteIds(this.getState().challengeWeVoteIdsWhereVoterIsParticipant);
  }

  getVoterIsChallengeParticipant (challengeWeVoteId) {
    // console.log('this.getState().challengeWeVoteIdsWhereVoterIsParticipant:', this.getState().challengeWeVoteIdsWhereVoterIsParticipant);
    return arrayContains(challengeWeVoteId, this.getState().challengeWeVoteIdsWhereVoterIsParticipant);
  }

  createChallengeFromCandidate (candidateObject) {
    // We want to create a pseudo Challenge object from an incoming Candidate object
    // console.log('candidateObject: ', candidateObject);
    return {
      challenge_description: candidateObject.ballot_guide_official_statement,
      challenge_title: candidateObject.ballot_item_display_name,
      challenge_news_item_list: [],
      challenge_owner_list: [],
      challenge_politician_list: [],
      challenge_politician_list_exists: false,
      challenge_politician_starter_list: [],
      challenge_we_vote_id: candidateObject.linked_challenge_we_vote_id,
      final_election_date_as_integer: candidateObject.candidate_ultimate_election_date,
      final_election_date_in_past: !(candidateObject.election_is_upcoming),
      in_draft_mode: false,
      is_blocked_by_we_vote: false,
      is_blocked_by_we_vote_reason: null,
      is_participants_count_minimum_exceeded: true,
      latest_challenge_participant_list: [],
      opposers_count: candidateObject.opposers_count,
      order_in_list: 0,
      politician_we_vote_id: candidateObject.politician_we_vote_id,
      profile_image_background_color: candidateObject.profile_image_background_color,
      seo_friendly_path: candidateObject.seo_friendly_path,
      seo_friendly_path_list: [],
      status: 'PSEUDO_CHALLENGE_GENERATED_FROM_CANDIDATE ',
      success: true,
      participants_count: candidateObject.participants_count,
      participants_count_next_goal: 0,
      participants_count_victory_goal: 0,
      visible_on_this_site: true,
      voter_challenge_participant: {},
      voter_can_send_updates_to_challenge: false,
      voter_can_vote_for_politician_we_vote_ids: [],
      voter_is_challenge_owner: false,
      voter_signed_in_with_email: false,
      we_vote_hosted_challenge_photo_large_url: null,
      we_vote_hosted_challenge_photo_medium_url: null,
      we_vote_hosted_challenge_photo_small_url: null,
      we_vote_hosted_profile_image_url_large: candidateObject.candidate_photo_url_large,
      we_vote_hosted_profile_image_url_medium: candidateObject.candidate_photo_url_medium,
      we_vote_hosted_profile_image_url_tiny: candidateObject.candidate_photo_url_tiny,
    };
  }

  reduce (state, action) {
    const {
      allCachedChallengeNewsItems,
      allCachedChallengeWeVoteIdsBySEOFriendlyPath, allCachedNewsItemWeVoteIdsByChallenge,
      allCachedRecommendedChallengeWeVoteIdLists, challengeWeVoteIdsWhereVoterIsParticipant,
    } = state;
    let {
      allCachedChallengeDicts, allCachedChallengeOwners, allCachedChallengePoliticianLists, allCachedChallengeOwnerPhotos,
      allCachedPoliticianWeVoteIdsByChallenge, promotedChallengeWeVoteIds,
      voterCanSendUpdatesChallengeWeVoteIds, voterCanVoteForPoliticianWeVoteIds, voterOwnedChallengeWeVoteIds,
      voterStartedChallengeWeVoteIds,
    } = state;
    let challenge;
    let challengeList;
    let challengeNewsItem;
    let challengeNewsItemWeVoteIds;
    let tempChallengeWeVoteId;
    let recommendedChallengesChallengeWeVoteId;
    let revisedState;
    let voterSpecificData;
    switch (action.type) {
      case 'challengeListRetrieve':
        // See ChallengeParticipantStore for code to take in the following challenge values:
        // - latest_challenge_participant_list
        // - voter_challenge_participant

        if (!action.res || !action.res.success) return state;
        revisedState = state;
        challengeList = action.res.challenge_list || [];
        recommendedChallengesChallengeWeVoteId = '';

        if (action.res.promoted_challenge_list_returned) {
          if (action.res.promoted_challenge_we_vote_ids) {
            promotedChallengeWeVoteIds = action.res.promoted_challenge_we_vote_ids;
            revisedState = { ...revisedState, promotedChallengeWeVoteIds };
          }
        }
        if (action.res.recommended_challenges_for_challenge_we_vote_id) {
          recommendedChallengesChallengeWeVoteId = action.res.recommended_challenges_for_challenge_we_vote_id;
          // console.log('recommendedChallengesChallengeWeVoteId:', recommendedChallengesChallengeWeVoteId);
        }
        if (action.res.voter_can_vote_for_politicians_list_returned) {
          if (action.res.voter_can_vote_for_politician_we_vote_ids) {
            // We want to reset this variable with this incoming value
            voterCanVoteForPoliticianWeVoteIds = action.res.voter_can_vote_for_politician_we_vote_ids;
            revisedState = { ...revisedState, voterCanVoteForPoliticianWeVoteIds };
          }
        }
        if (action.res.voter_owned_challenge_list_returned) {
          if (action.res.voter_owned_challenge_we_vote_ids) {
            // We want to reset this variable with this incoming value
            voterOwnedChallengeWeVoteIds = action.res.voter_owned_challenge_we_vote_ids;
            // revisedState updated with voterOwnedChallengeWeVoteIds below
          }
          if (action.res.voter_can_send_updates_challenge_we_vote_ids) {
            // We want to reset this variable with this incoming value
            voterCanSendUpdatesChallengeWeVoteIds = action.res.voter_can_send_updates_challenge_we_vote_ids;
            // console.log('voterCanSendUpdatesChallengeWeVoteIds:', voterCanSendUpdatesChallengeWeVoteIds);
            // revisedState updated below
          }
        }
        if (action.res.voter_started_challenge_list_returned) {
          if (action.res.voter_started_challenge_we_vote_ids) {
            voterStartedChallengeWeVoteIds = action.res.voter_started_challenge_we_vote_ids;
            revisedState = { ...revisedState, voterStartedChallengeWeVoteIds };
          }
        }
        if (action.res.challenge_we_vote_ids_where_voter_is_participant_returned) {
          if (action.res.challenge_we_vote_ids_where_voter_is_participant) {
            // console.log('action.res.challenge_we_vote_ids_where_voter_is_participant:', action.res.challenge_we_vote_ids_where_voter_is_participant);
            action.res.challenge_we_vote_ids_where_voter_is_participant.forEach((oneChallengeWeVoteId) => {
              if (!(oneChallengeWeVoteId in challengeWeVoteIdsWhereVoterIsParticipant)) {
                challengeWeVoteIdsWhereVoterIsParticipant.push(oneChallengeWeVoteId);
              }
            });
            revisedState = { ...revisedState, challengeWeVoteIdsWhereVoterIsParticipant };
          }
        }

        // console.log('action.res.voter_issues_only:', action.res.voter_issues_only);
        if (recommendedChallengesChallengeWeVoteId) {
          if (!(recommendedChallengesChallengeWeVoteId in allCachedRecommendedChallengeWeVoteIdLists)) {
            allCachedRecommendedChallengeWeVoteIdLists[recommendedChallengesChallengeWeVoteId] = [];
          }
        }
        if (allCachedChallengeDicts === undefined) {
          allCachedChallengeDicts = {};
        }
        challengeList.forEach((oneChallenge) => {
          allCachedChallengeDicts[oneChallenge.challenge_we_vote_id] = oneChallenge;
          if (recommendedChallengesChallengeWeVoteId) {
            allCachedRecommendedChallengeWeVoteIdLists[recommendedChallengesChallengeWeVoteId].push(oneChallenge.challenge_we_vote_id);
          }
          ({
            allCachedChallengeOwners,
            allCachedChallengeOwnerPhotos,
            voterCanSendUpdatesChallengeWeVoteIds,
            voterOwnedChallengeWeVoteIds,
          } = this.extractChallengeOwnerList(oneChallenge, allCachedChallengeOwners, allCachedChallengeOwnerPhotos, voterCanSendUpdatesChallengeWeVoteIds, voterOwnedChallengeWeVoteIds));
          if ('challenge_politician_list' in oneChallenge) {
            ({ allCachedChallengePoliticianLists } = this.extractChallengePoliticianList(oneChallenge, allCachedChallengePoliticianLists));
            ({ allCachedPoliticianWeVoteIdsByChallenge } = this.extractPoliticianWeVoteIdListFromChallenge(oneChallenge, allCachedPoliticianWeVoteIdsByChallenge));
          }
          if (!(oneChallenge.seo_friendly_path in allCachedChallengeWeVoteIdsBySEOFriendlyPath)) {
            allCachedChallengeWeVoteIdsBySEOFriendlyPath[oneChallenge.seo_friendly_path] = oneChallenge.challenge_we_vote_id;
          }
          if ('seo_friendly_path_list' in oneChallenge) {
            //
            let onePath = '';
            for (let i = 0; i < oneChallenge.seo_friendly_path_list.length; ++i) {
              onePath = oneChallenge.seo_friendly_path_list[i];
              if (onePath && onePath !== '') {
                if (!(onePath in allCachedChallengeWeVoteIdsBySEOFriendlyPath)) {
                  allCachedChallengeWeVoteIdsBySEOFriendlyPath[onePath] = oneChallenge.challenge_we_vote_id;
                }
              }
            }
          }
        });
        // console.log('allCachedChallengeWeVoteIdsBySEOFriendlyPath:', allCachedChallengeWeVoteIdsBySEOFriendlyPath);
        /* TODO: Next time we are testing this area... this should work, is a better sample, and should run a bit faster
        revisedState = { ...revisedState, allCachedChallengeDicts, allCachedChallengeOwnerPhotos, allCachedChallengeOwners,
          allCachedChallengePoliticianLists, allCachedChallengeWeVoteIdsBySEOFriendlyPath, allCachedPoliticianWeVoteIdsByChallenge,
          allCachedRecommendedChallengeWeVoteIdLists, voterCanSendUpdatesChallengeWeVoteIds, voterOwnedChallengeWeVoteIds,
        };
        */
        revisedState = { ...revisedState, allCachedChallengeDicts };
        revisedState = { ...revisedState, allCachedChallengeOwnerPhotos };
        revisedState = { ...revisedState, allCachedChallengeOwners };
        revisedState = { ...revisedState, allCachedChallengePoliticianLists };
        revisedState = { ...revisedState, allCachedChallengeWeVoteIdsBySEOFriendlyPath };
        revisedState = { ...revisedState, allCachedPoliticianWeVoteIdsByChallenge };
        revisedState = { ...revisedState, allCachedRecommendedChallengeWeVoteIdLists };
        revisedState = { ...revisedState, voterCanSendUpdatesChallengeWeVoteIds };
        revisedState = { ...revisedState, voterOwnedChallengeWeVoteIds };
        return revisedState;

      case 'challengeLocalAttributesUpdate':
        // console.log('ChallengeStore challengeLocalAttributesUpdate: ', action.payload);
        if (action.payload === undefined) {
          return state;
        } else {
          const challengeWeVoteId = action.payload.challengeWeVoteId || '';
          if (challengeWeVoteId in allCachedChallengeDicts) {
            challenge = this.getChallengeByWeVoteId(challengeWeVoteId);
            if (action.payload.opposers_count) {
              challenge.opposers_count = action.payload.opposers_count;
            }
            if (action.payload.participants_count) {
              challenge.participants_count = action.payload.participants_count;
            }
            allCachedChallengeDicts[challengeWeVoteId] = challenge;
            return {
              ...state,
              allCachedChallengeDicts,
            };
          } else {
            return state;
          }
        }

      case 'challengeNewsItemSave':
        // console.log('ChallengeNewsItemStore challengeNewsItemSave');
        if (action.res.challenge_we_vote_id && action.res.success) {
          challengeNewsItem = action.res;
          allCachedChallengeNewsItems[challengeNewsItem.challenge_news_item_we_vote_id] = challengeNewsItem;
          challengeNewsItemWeVoteIds = allCachedNewsItemWeVoteIdsByChallenge[challengeNewsItem.challenge_we_vote_id] || [];
          if (challengeNewsItemWeVoteIds && !challengeNewsItemWeVoteIds.includes(challengeNewsItem.challenge_news_item_we_vote_id)) {
            challengeNewsItemWeVoteIds.unshift(challengeNewsItem.challenge_news_item_we_vote_id);
            allCachedNewsItemWeVoteIdsByChallenge[challengeNewsItem.challenge_we_vote_id] = challengeNewsItemWeVoteIds;
          }
        }
        return {
          ...state,
          allCachedChallengeNewsItems,
          allCachedNewsItemWeVoteIdsByChallenge,
        };

      case 'challengeParticipantRetrieve':
      case 'challengeParticipantSave':
        if (!action.res || !action.res.success) return state;
        revisedState = state;
        tempChallengeWeVoteId = action.res.challenge_we_vote_id;
        if (action.res.voter_we_vote_id === VoterStore.getVoterWeVoteId()) {
          if (!(tempChallengeWeVoteId in challengeWeVoteIdsWhereVoterIsParticipant)) {
            challengeWeVoteIdsWhereVoterIsParticipant.push(tempChallengeWeVoteId);
          }
          revisedState = { ...revisedState, challengeWeVoteIdsWhereVoterIsParticipant };
        }
        return revisedState;

      // case 'challengeSave': TBD
      case 'challengeRetrieve':
      case 'challengeRetrieveAsOwner':
      case 'challengeStartSave':
        // See ChallengeParticipantStore for code to take in the following challenge values:
        // - latest_challenge_participant_list
        // - voter_challenge_participant

        if (!action.res || !action.res.success) return state;
        revisedState = state;
        challenge = action.res;
        // console.log('ChallengeStore challengeRetrieve, challenge:', challenge);
        if (allCachedChallengeDicts === undefined) {
          allCachedChallengeDicts = {};
        }
        allCachedChallengeDicts[challenge.challenge_we_vote_id] = challenge;
        if ('challenge_news_item_list' in challenge) {
          challengeNewsItemWeVoteIds = [];
          for (let i = 0; i < challenge.challenge_news_item_list.length; ++i) {
            challengeNewsItem = challenge.challenge_news_item_list[i];
            allCachedChallengeNewsItems[challengeNewsItem.challenge_news_item_we_vote_id] = challengeNewsItem;
            challengeNewsItemWeVoteIds.push(challengeNewsItem.challenge_news_item_we_vote_id);
          }
          if (challenge.challenge_news_item_list.length > 0) {
            allCachedNewsItemWeVoteIdsByChallenge[challengeNewsItem.challenge_we_vote_id] = challengeNewsItemWeVoteIds;
          }
        }
        // if ('challenge_owner_list' in challenge) {
        ({
          allCachedChallengeOwners,
          allCachedChallengeOwnerPhotos,
          voterCanSendUpdatesChallengeWeVoteIds,
          voterOwnedChallengeWeVoteIds,
        } = this.extractChallengeOwnerList(challenge, allCachedChallengeOwners, allCachedChallengeOwnerPhotos, voterCanSendUpdatesChallengeWeVoteIds, voterOwnedChallengeWeVoteIds));
        // }
        if ('challenge_politician_list' in challenge) {
          ({ allCachedChallengePoliticianLists } = this.extractChallengePoliticianList(challenge, allCachedChallengePoliticianLists));
          ({ allCachedPoliticianWeVoteIdsByChallenge } = this.extractPoliticianWeVoteIdListFromChallenge(challenge, allCachedPoliticianWeVoteIdsByChallenge));
        }
        if (!(challenge.seo_friendly_path in allCachedChallengeWeVoteIdsBySEOFriendlyPath)) {
          allCachedChallengeWeVoteIdsBySEOFriendlyPath[challenge.seo_friendly_path] = challenge.challenge_we_vote_id;
        }
        // console.log('ChallengeStore allCachedChallengeOwners:', allCachedChallengeOwners);
        if ('seo_friendly_path_list' in challenge) {
          //
          let onePath = '';
          for (let i = 0; i < challenge.seo_friendly_path_list.length; ++i) {
            onePath = challenge.seo_friendly_path_list[i];
            if (onePath && onePath !== '') {
              if (!(onePath in allCachedChallengeWeVoteIdsBySEOFriendlyPath)) {
                allCachedChallengeWeVoteIdsBySEOFriendlyPath[onePath] = challenge.challenge_we_vote_id;
              }
            }
          }
        }
        if (action.res.voter_can_vote_for_politician_we_vote_ids) {
          // We want to reset this variable with this incoming value
          voterCanVoteForPoliticianWeVoteIds = action.res.voter_can_vote_for_politician_we_vote_ids;
          revisedState = { ...revisedState, voterCanVoteForPoliticianWeVoteIds };
        }
        if ('voter_challenge_participant' in action.res) {
          if ('visible_to_public' in action.res.voter_challenge_participant) {
            //
            // console.log('action.res.voter_challenge_participant.visible_to_public:', action.res.voter_challenge_participant.visible_to_public);
            if (action.res.voter_challenge_participant.visible_to_public) {
              if (!(action.res.voter_challenge_participant.challenge_we_vote_id in challengeWeVoteIdsWhereVoterIsParticipant)) {
                challengeWeVoteIdsWhereVoterIsParticipant.push(action.res.voter_challenge_participant.challenge_we_vote_id);
                revisedState = { ...revisedState, challengeWeVoteIdsWhereVoterIsParticipant };
              }
            }
          }
        }
        revisedState = { ...revisedState, allCachedChallengeDicts };
        revisedState = { ...revisedState, allCachedChallengeNewsItems };
        revisedState = { ...revisedState, allCachedChallengeOwners };
        revisedState = { ...revisedState, allCachedChallengeOwnerPhotos };
        revisedState = { ...revisedState, allCachedChallengePoliticianLists };
        revisedState = { ...revisedState, allCachedChallengeWeVoteIdsBySEOFriendlyPath };
        revisedState = { ...revisedState, allCachedNewsItemWeVoteIdsByChallenge };
        revisedState = { ...revisedState, allCachedPoliticianWeVoteIdsByChallenge };
        revisedState = { ...revisedState, voterCanSendUpdatesChallengeWeVoteIds };
        revisedState = { ...revisedState, voterOwnedChallengeWeVoteIds };
        return revisedState;

      case 'voterSignOut':
        // console.log('ChallengeStore voterSignOut, state:', state);
        revisedState = state;
        voterSpecificData = this.resetVoterSpecificData();
        revisedState = { ...revisedState, voterSpecificData };
        return revisedState;

      default:
        return state;
    }
  }
}

export default new ChallengeStore(Dispatcher);
