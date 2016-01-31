'use strict';
var dispatcher = require('../dispatcher/AppDispatcher');
var VoterConstants = require('../constants/VoterConstants');

module.exports = {
    ChangeLocation: location => dispatcher.dispatch({
        actionType: VoterConstants.VOTER_LOCATION_SET,
        location
    })
};
