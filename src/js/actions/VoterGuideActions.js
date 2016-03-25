"use strict";

import AppDispatcher from "../dispatcher/AppDispatcher";
import VoterGuideConstants from "../constants/VoterGuideConstants";

// In the stores, there are AppDispatcher blocks that listen for these actionType constants (ex/ BALLOT_SUPPORT_ON)
//  When action calls one of these functions, we are telling the code in the AppDispatcher block to run
module.exports = {
  retrieveGuidesToFollow: function (we_vote_id) {  // VOTER_GUIDES_TO_FOLLOW, retrieveVoterGuidesToFollowList
    AppDispatcher.dispatch({
      actionType: VoterGuideConstants.VOTER_GUIDES_TO_FOLLOW,
      we_vote_id
    });
  },

  retrieveGuidesFollowed: function (we_vote_id) {  // VOTER_GUIDES_FOLLOWED, retrieveVoterGuidesFollowedList
    AppDispatcher.dispatch({
      actionType: VoterGuideConstants.VOTER_GUIDES_FOLLOWED,
      we_vote_id
    });
  },

  retrieveOrgs: function (we_vote_id) {  // RETRIEVE_ORGANIZATIONS, retrieveOrganizations
    AppDispatcher.dispatch({
      actionType: VoterGuideConstants.RETRIEVE_ORGANIZATIONS,
      we_vote_id
    });
  },

  followOrg: function (we_vote_id) {  // FOLLOW_ORGANIZATION, followOrganization
    AppDispatcher.dispatch({
      actionType: VoterGuideConstants.FOLLOW_ORGANIZATION,
      we_vote_id
    });
  },

  ignoreOrg: function (we_vote_id) {  // IGNORE_ORGANIZATION, ignoreOrganization
    console.log("ignoreOrg: " + we_vote_id);
    AppDispatcher.dispatch({
      actionType: VoterGuideConstants.IGNORE_ORGANIZATION,
      we_vote_id
    });
  },

  stopFollowingOrg: function (we_vote_id) {  // STOP_FOLLOWING_ORGANIZATION, stopFollowingOrganization
    AppDispatcher.dispatch({
      actionType: VoterGuideConstants.STOP_FOLLOWING_ORGANIZATION,
      we_vote_id
    });
  }
};
