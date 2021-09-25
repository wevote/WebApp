import Dispatcher from '../common/dispatcher/Dispatcher';

// Keep this comment as a cheat-sheet for the constants used API server
// Kind of Seeds
// NOTICE_FRIEND_ENDORSEMENTS_SEED
//
// Kind of Notices
// NOTICE_FRIEND_ENDORSEMENTS

export default {
  activityCommentSave (activityCommentWeVoteId = '', parentWeVoteId = '', statementText = null, visibilitySetting = 'FRIENDS_ONLY', parentCommentWeVoteId = '') {
    // console.log('activityNoticeListRetrieve');
    Dispatcher.loadEndpoint('activityCommentSave',
      {
        activity_comment_we_vote_id: activityCommentWeVoteId,
        parent_we_vote_id: parentWeVoteId,
        parent_comment_we_vote_id: parentCommentWeVoteId,
        statement_text: statementText,
        visibility_setting: visibilitySetting,
      });
  },
  activityListRetrieve (activityTidbitWeVoteIdList = []) {
    // console.log('activityNoticeListRetrieve');
    Dispatcher.loadEndpoint('activityListRetrieve',
      {
        activity_tidbit_we_vote_id_list: activityTidbitWeVoteIdList,
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
  activityPostSave (activityPostWeVoteId = '', statementText = null, visibilitySetting = 'FRIENDS_ONLY') {
    // console.log('activityNoticeListRetrieve');
    Dispatcher.loadEndpoint('activityPostSave',
      {
        activity_post_we_vote_id: activityPostWeVoteId,
        statement_text: statementText,
        visibility_setting: visibilitySetting,
      });
  },
};
