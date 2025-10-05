import Dispatcher from '../dispatcher/Dispatcher';
import arrayContains from '../utils/arrayContains';

export default {
  politicianCampaignWebsiteSave (politicianWeVoteId, campaignWebsite) {
    Dispatcher.loadEndpoint('politicianSave',
      {
        campaign_website: campaignWebsite,
        campaign_website_changed: true,
        politician_we_vote_id: politicianWeVoteId,
      });
  },

  politicianNameSave (politicianWeVoteId, politicianName) {
    Dispatcher.loadEndpoint('politicianSave',
      {
        politician_name: politicianName,
        politician_name_changed: true,
        politician_we_vote_id: politicianWeVoteId,
      });
  },

  politicianPhotoDelete (politicianWeVoteId) {
    Dispatcher.loadEndpoint('politicianSave',
      {
        politician_photo_from_file_reader: '',
        politician_photo_delete: true,
        politician_photo_delete_changed: true,
        politician_we_vote_id: politicianWeVoteId,
      });
  },

  politicianPhotoQueuedToSave (politicianPhotoFromFileReader) {
    Dispatcher.dispatch({ type: 'politicianPhotoQueuedToSave', payload: politicianPhotoFromFileReader });
  },

  politicianPhotoSave (politicianWeVoteId = '', politicianPhotoQueuedToSave = '', politicianPhotoQueuedToSaveSet = false, profileImageTypeCurrentlyActive = '') {
    const profileImageTypeCurrentlyActiveSet = arrayContains(profileImageTypeCurrentlyActive, ['BALLOTPEDIA', 'FACEBOOK', 'LINKEDIN', 'TWITTER', 'UPLOADED', 'VOTE_USA', 'WIKIPEDIA']);
    Dispatcher.loadEndpoint('politicianSave',
      {
        profile_image_type_currently_active: profileImageTypeCurrentlyActive,
        profile_image_type_currently_active_changed: profileImageTypeCurrentlyActiveSet,
        politician_photo_from_file_reader: politicianPhotoQueuedToSave,
        politician_photo_changed: politicianPhotoQueuedToSaveSet,
        politician_we_vote_id: politicianWeVoteId,
      });
  },

  profilePhotoTooBigReset () {
    Dispatcher.dispatch({ type: 'profilePhotoTooBigReset', payload: true });
  },

  politicianRetrieve (politicianWeVoteId, asOwner = false) {
    if (asOwner) {
      Dispatcher.loadEndpoint('politicianRetrieveAsOwner',
        {
          politician_we_vote_id: politicianWeVoteId,
        });
    } else {
      Dispatcher.loadEndpoint('politicianRetrieve',
        {
          politician_we_vote_id: politicianWeVoteId,
        });
    }
  },

  politicianStatementSave (politicianWeVoteId, politicianStatement) {
    Dispatcher.loadEndpoint('politicianSave',
      {
        ballot_guide_official_statement: politicianStatement,
        ballot_guide_official_statement_changed: true,
        politician_we_vote_id: politicianWeVoteId,
      });
  },

  politiciansQuery (raceOfficeLevelList = '', stateCode = '', searchText = '') {
    Dispatcher.loadEndpoint('politiciansQuery',
      {
        race_office_level_list: raceOfficeLevelList,
        search_text: searchText,
        state: stateCode,
        useWeVoteFormat: 1,
      });
  },

  politiciansRetrieve (politicianWeVoteId) {
    Dispatcher.loadEndpoint('politiciansRetrieve',
      {
        politician_we_vote_id: politicianWeVoteId,
      });
  },

  politicianRetrieveBySEOFriendlyPath (politicianSEOFriendlyPath, asOwner = false) {
    let { hostname } = window.location;
    hostname = hostname || '';
    if (asOwner) {
      Dispatcher.loadEndpoint('politicianRetrieveAsOwner',
        {
          hostname,
          seo_friendly_path: politicianSEOFriendlyPath,
        });
    } else {
      Dispatcher.loadEndpoint('politicianRetrieve',
        {
          hostname,
          seo_friendly_path: politicianSEOFriendlyPath,
        });
    }
  },

  positionListForBallotItemPublic (ballotItemWeVoteId) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'POLITICIAN',
      });
  },

  positionListForBallotItemPrivateIndividualsOnly (ballotItemWeVoteId) {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('positionListForBallotItem',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'POLITICIAN',
        private_citizens_only: true,
      });
  },

  positionListForBallotItemFromFriends (ballotItemWeVoteId) {
    Dispatcher.loadEndpoint('positionListForBallotItemFromFriends',
      {
        ballot_item_we_vote_id: ballotItemWeVoteId,
        kind_of_ballot_item: 'POLITICIAN',
      });
  },

  voterCanEditPolitician (politicianWeVoteId) {
    Dispatcher.dispatch({ type: 'voterCanEditPolitician', payload: politicianWeVoteId });
  },
};
