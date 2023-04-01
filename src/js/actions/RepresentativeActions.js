import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
  representativeRetrieve (representativeWeVoteId) {
    Dispatcher.loadEndpoint('representativeRetrieve',
      {
        representative_we_vote_id: representativeWeVoteId,
      });
  },

  representativesQuery (year = '', raceOfficeLevelList = '', stateCode = '', searchText = '', indexStart = 0) {
    Dispatcher.loadEndpoint('representativesQuery',
      {
        index_start: indexStart,
        number_requested: 50,
        race_office_level_list: raceOfficeLevelList,
        search_text: searchText,
        state: stateCode,
        year,
      });
  },

  representativesRetrieve (officeWeVoteId) {
    Dispatcher.loadEndpoint('representativesRetrieve',
      {
        office_we_vote_id: officeWeVoteId,
      });
  },
};
