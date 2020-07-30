import Dispatcher from '../dispatcher/Dispatcher';

// Keep this comment as a cheat-sheet for the constants used API server
// Kind of Seeds
// NOTICE_FRIEND_ENDORSEMENTS_SEED
//
// Kind of Notices
// NOTICE_FRIEND_ENDORSEMENTS

export default {
  activityNoticeListRetrieve () {
    Dispatcher.loadEndpoint('activityNoticeListRetrieve',
      {
        // google_civic_election_id: googleCivicElectionId,
      });
  },
};
