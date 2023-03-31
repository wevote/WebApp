import Dispatcher from '../dispatcher/Dispatcher';

export default {
  politicianRetrieve (politicianWeVoteId) {
    Dispatcher.loadEndpoint('politicianRetrieve',
      {
        politician_we_vote_id: politicianWeVoteId,
      });
  },

  politiciansQuery (electionDay = '', raceOfficeLevelList = '', stateCode = '', searchText = '') {
    Dispatcher.loadEndpoint('politiciansQuery',
      {
        electionDay,
        raceOfficeLevelList,
        searchText,
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

  politicianRetrieveBySEOFriendlyPath (politicianSEOFriendlyPath) {
    let { hostname } = window.location;
    hostname = hostname || '';
    Dispatcher.loadEndpoint('politicianRetrieve',
      {
        hostname,
        seo_friendly_path: politicianSEOFriendlyPath,
      });
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
};
