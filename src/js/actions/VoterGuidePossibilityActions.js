import Dispatcher from '../common/dispatcher/Dispatcher';

export default {
  /**
   * Retrieve a Voter Guide Position Possibility
   * @param voterGuidePossibilityId, id of the Guide possibility
   * @param voterGuidePossibilityPositionId, id of the Position possibility, an integer
   * @returns {*}
   */
  voterGuidePossibilityPositionsRetrieve (voterGuidePossibilityId, voterGuidePossibilityPositionId = 0) {
    // We have migrated to a newer API call that we cache by CDN: voterGuidesUpcomingRetrieve
    return Dispatcher.loadEndpoint('voterGuidePossibilityPositionsRetrieve', {
      voter_guide_possibility_id: voterGuidePossibilityId,
      voter_guide_possibility_position_id: voterGuidePossibilityPositionId,
    });
  },

  /**
   * Save a Voter Guide Position Possibility
   * @param voterGuidePossibilityId, id of the Guide possibility
   * @param voterGuidePossibilityPositionId, id of the Position possibility. Untyped.  If zero, create a new position.  Otherwise a number or ''.
   * @param dictionaryToSave, dictionary of the data to be saved
   */
  voterGuidePossibilityPositionSave (voterGuidePossibilityId, voterGuidePossibilityPositionId, dictionaryToSave = {}) {
    let dispatchDictionary = {
      voter_guide_possibility_id: voterGuidePossibilityId,
      voter_guide_possibility_position_id: voterGuidePossibilityPositionId,
    };
    dispatchDictionary = { ...dispatchDictionary, ...dictionaryToSave };
    // console.log('voterGuidePossibilityPositionSave dispatchDictionary:', dispatchDictionary);
    Dispatcher.loadEndpoint('voterGuidePossibilityPositionSave', dispatchDictionary);
  },

  /**
   * a Voter Guide Position
   * @param urlToScan website that the endorsement comes from
   * @param voterGuidePossibilityId id of the guide possibility
   */
  voterGuidePossibilityRetrieve (urlToScan = '', voterGuidePossibilityId = '') {
    Dispatcher.loadEndpoint('voterGuidePossibilityRetrieve', {
      url_to_scan: urlToScan,
      voter_guide_possibility_id: voterGuidePossibilityId,
    });
  },

  /**
   * Save a Voter Guide Possibility
   * @param voterGuidePossibilityId id of the guide possibility
   * @param dictionaryToSave dictionary of the data to be saved
   */
  voterGuidePossibilitySave (voterGuidePossibilityId, dictionaryToSave = {}) {
    let dispatchDictionary = {
      voter_guide_possibility_id: voterGuidePossibilityId,
    };
    dispatchDictionary = { ...dispatchDictionary, ...dictionaryToSave };
    Dispatcher.loadEndpoint('voterGuidePossibilitySave', dispatchDictionary);
  },
};
