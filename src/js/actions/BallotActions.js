import Dispatcher from '../dispatcher/Dispatcher';

let voterBallotItemRetrievedWithZeroCivicId = false;

export default {
  allBallotItemsRetrieve (googleCivicElectionId, stateCode = '') {
    // This API is always retrieved from our CDN per: WebApp/src/js/utils/service.js
    Dispatcher.loadEndpoint('allBallotItemsRetrieve', {
      google_civic_election_id: googleCivicElectionId,
      state_code: stateCode,
    });
  },

  allBallotItemsRetrieveCalled () {
    Dispatcher.dispatch({ type: 'allBallotItemsRetrieveCalled', payload: true });
  },

  ballotItemOptionsClear () {
    Dispatcher.dispatch({
      type: 'ballotItemOptionsClear',
      res: {
        success: true,
      },
    });
  },

  ballotItemOptionsRetrieve (googleCivicElectionId = 0, search_string = '', state_code = '') {
    Dispatcher.loadEndpoint('ballotItemOptionsRetrieve', {
      google_civic_election_id: googleCivicElectionId,
      search_string,
      state_code,
    });
  },

  completionLevelFilterTypeSave (completionLevelFilterType = '') {
    Dispatcher.dispatch({
      type: 'completionLevelFilterTypeSave',
      res: {
        completion_level_filter_type_saved: completionLevelFilterType,
        success: true,
      },
    });
  },

  raceLevelFilterTypeSave (raceLevelFilterType = '') {
    Dispatcher.dispatch({
      type: 'raceLevelFilterTypeSave',
      res: {
        race_level_filter_type_saved: raceLevelFilterType,
        success: true,
      },
    });
  },

  voterBallotItemsRetrieve (googleCivicElectionId = 0, ballot_returned_we_vote_id = '', ballot_location_shortcut = '') {
    if (googleCivicElectionId === 0 && voterBallotItemRetrievedWithZeroCivicId) {
      // Yuck
      console.log('We only allow voterBallotItemsRetrieve with googleCivicElectionId === 0, once per session');
    } else {
      console.log('BallotActions voterBallotItemsRetrieve with googleCivicElectionId: ', googleCivicElectionId);
      if (googleCivicElectionId === 0) voterBallotItemRetrievedWithZeroCivicId = true;
      Dispatcher.loadEndpoint('voterBallotItemsRetrieve', {
        use_test_election: false,
        google_civic_election_id: googleCivicElectionId,
        ballot_returned_we_vote_id,
        ballot_location_shortcut,
      });
    }
  },

  voterBallotListRetrieve () {
    Dispatcher.loadEndpoint('voterBallotListRetrieve');
  },

  voterBallotItemOpenOrClosedSave: (ballotItemUnfurledTracker) => {
    Dispatcher.dispatch({
      type: 'voterBallotItemOpenOrClosedSave',
      res: {
        ballot_item_unfurled_tracker: ballotItemUnfurledTracker,
        success: true,
      },
    });
  },
};
