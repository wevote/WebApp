'use strict';
var keyMirror = require('keymirror');

// Constants for AppDispatcher pub->sub system
module.exports = keyMirror({
    // Ballot Constants
    BALLOT_INITIALIZED: null,

    BALLOT_SUPPORTED: null,
    BALLOT_UNSUPPORTED: null,

    // Ballot Item Constants (OFFICE, MEASURE)
    BALLOTITEM_SUPPORTED: null,
    BALLOTITEM_UNSUPPORTED: null,

    // Candidate Constants
    CANDIDATES_RETRIEVED_FOR_OFFICE: null,
    CANDIDATES_RETRIEVED: null,
    CANDIDATE_SUPPORT: null,
    CANDIDATE_UNSUPPORT: null
});
