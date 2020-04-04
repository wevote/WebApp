import Dispatcher from '../dispatcher/Dispatcher';

export default {
  voterGuidePossibilityPositionsRetrieve (voterGuidePossibilityId, voterGuidePossibilityPositionId = 0) {
    // We have migrated to a newer API call that we cache by CDN: voterGuidesUpcomingRetrieve
    return Dispatcher.loadEndpoint('voterGuidePossibilityPositionsRetrieve', {
      voter_guide_possibility_id: voterGuidePossibilityId,
      voter_guide_possibility_position_id: voterGuidePossibilityPositionId,
    });
  },

  voterGuidePossibilityPositionSave (voterGuidePossibilityId, voterGuidePossibilityPositionId, dictionaryToSave = {}) {
    let dispatchDictionary = {
      voter_guide_possibility_id: voterGuidePossibilityId,
      voter_guide_possibility_position_id: voterGuidePossibilityPositionId,
    };
    dispatchDictionary = Object.assign({}, dispatchDictionary, dictionaryToSave);
    // console.log('voterGuidePossibilityPositionSave dispatchDictionary:', dispatchDictionary);
    Dispatcher.loadEndpoint('voterGuidePossibilityPositionSave', dispatchDictionary);
  },

  voterGuidePossibilityRetrieve (urlToScan = '', voterGuidePossibilityId = '') {
    Dispatcher.loadEndpoint('voterGuidePossibilityRetrieve', {
      url_to_scan: urlToScan,
      voter_guide_possibility_id: voterGuidePossibilityId,
    });
  },

  voterGuidePossibilitySave (voterGuidePossibilityId, dictionaryToSave = {}) {
    let dispatchDictionary = {
      voter_guide_possibility_id: voterGuidePossibilityId,
    };
    dispatchDictionary = Object.assign({}, dispatchDictionary, dictionaryToSave);
    Dispatcher.loadEndpoint('voterGuidePossibilitySave', dispatchDictionary);
  },
};
