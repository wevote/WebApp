import Dispatcher from '../dispatcher/Dispatcher';

// Keep this comment as a cheat-sheet for the constants used API server
// Kind of Seeds
// NOTICE_FRIEND_ENDORSEMENTS_SEED
//
// Kind of Notices
// NOTICE_FRIEND_ENDORSEMENTS

export default {
  activityListRetrieve () {
    // console.log('activityNoticeListRetrieve');
    Dispatcher.loadEndpoint('activityListRetrieve',
      {
        // google_civic_election_id: googleCivicElectionId,
      });
  },
  activityNoticeListRetrieve (activityNoticeIdListClicked = [], activityNoticeIdListSeen = []) {
    // console.log('activityNoticeListRetrieve');
    Dispatcher.loadEndpoint('activityNoticeListRetrieve',
      {
        activity_notice_id_list_clicked: activityNoticeIdListClicked,
        activity_notice_id_list_seen: activityNoticeIdListSeen,
      });
  },
};
