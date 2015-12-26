'use strict';
var dispatcher = require('../dispatcher/AppDispatcher');
var BallotConstants = require('../constants/BallotConstants');

module.exports = {
    DataAdded: ballot => dispatcher.dispatch({
        actionType: BallotConstants.BALLOT_DATA_ADDED,
        _ballot_order: ballot._ballot_order,
        _ballot_store: ballot._ballot_store
    }),

    ItemAddedToStore: item => dispatcher.dispatch({
        actionType: BallotConstants.BALLOT_ITEM_ADDED,
        item: item.item
    }),

    AllCandidatesAdded: candidates => dispatcher.dispatch({
        actionType: BallotConstants.BALLOT_ALL_CANDIDATES_ADDED,
        _candidate_store: candidates._candidate_store
    }),

    AllItemsAdded: items => dispatcher.dispatch({
        actionType: BallotConstants.BALLOT_ALL_ITEMS_ADDED,
        _ballot_store: items._ballot_store
    })
};
