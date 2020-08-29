import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import { arrayContains } from '../utils/textFormat';

class ActivityStore extends ReduceStore {
  getInitialState () {
    return {
      allActivity: [],
      allCachedActivityCommentsByCommentWeVoteId: {},
      allCachedActivityCommentWeVoteIdsByTidbitWeVoteId: {}, // key == we_vote_id base of tree, value == we_vote_id of ALL Parent Comments & Child Comments so we can count
      allCachedActivityCommentsInTreeByTidbitWeVoteId: {}, // key == we_vote_id base of tree, value == Parent Comments (oldest to newest), with children in comment_list
      allCachedActivityTidbitsByWeVoteId: {},
      allActivityNotices: [],
    };
  }

  allActivity () {
    return this.getState().allActivity || [];
  }

  allActivityNotices () {
    return this.getState().allActivityNotices || [];
  }

  getActivityCommentByWeVoteId (activityCommentWeVoteId) {
    return this.getState().allCachedActivityCommentsByCommentWeVoteId[activityCommentWeVoteId] || {};
  }

  getActivityCommentsInTreeByTidbitWeVoteId (activityTidbitWeVoteId) {
    return this.getState().allCachedActivityCommentsInTreeByTidbitWeVoteId[activityTidbitWeVoteId] || [];
  }

  getActivityCommentAllCountByTidbitWeVoteId (activityTidbitWeVoteId) {
    if (this.getState().allCachedActivityCommentWeVoteIdsByTidbitWeVoteId && this.getState().allCachedActivityCommentWeVoteIdsByTidbitWeVoteId[activityTidbitWeVoteId]) {
      return this.getState().allCachedActivityCommentWeVoteIdsByTidbitWeVoteId[activityTidbitWeVoteId].length;
    }
    return 0;
  }

  getActivityCommentParentCountByTidbitWeVoteId (activityTidbitWeVoteId) {
    const activityInTree = this.getState().allCachedActivityCommentsInTreeByTidbitWeVoteId[activityTidbitWeVoteId] || [];
    if (activityInTree && activityInTree.length) {
      return activityInTree.length || 0;
    }
    return 0;
  }

  getActivityTidbitByWeVoteId (activityTidbitWeVoteId) {
    return this.getState().allCachedActivityTidbitsByWeVoteId[activityTidbitWeVoteId] || {};
  }

  reduce (state, action) {
    let activityComment = {};
    let activityPost = {};
    let activityCommentWeVoteId = '';
    let activityTidbitWeVoteId = '';
    let allActivity = state.allActivity || [];
    let allActivityModified = [];
    let {
      allCachedActivityCommentWeVoteIdsByTidbitWeVoteId, allCachedActivityCommentsByCommentWeVoteId,
      allCachedActivityCommentsInTreeByTidbitWeVoteId, allCachedActivityTidbitsByWeVoteId,
    } = state;
    let childCommentList = [];
    let childCommentsByParentCommentWeVoteId = {};
    let incomingActivityList = [];
    let oneActivityCommentModified = {};
    let parentComments = [];
    let parentCommentsWithChildren = [];
    let priorPostFound = false;
    switch (action.type) {
      case 'activityCommentSave':
        if (!action.res || !action.res.success) return state;
        activityComment = action.res;
        activityCommentWeVoteId = activityComment.we_vote_id;
        if (!allCachedActivityCommentsByCommentWeVoteId) {
          allCachedActivityCommentsByCommentWeVoteId = {};
        }
        allCachedActivityCommentsByCommentWeVoteId[activityCommentWeVoteId] = activityComment;
        // priorPostFound = false;
        // allActivityModified = [];
        // for (let count = 0; count < allActivity.length; count++) {
        //   if (allActivity[count].activity_post_id === activityComment.we_vote_id) {
        //     // Replace existing entry
        //     allActivityModified.push(activityComment);
        //     priorPostFound = true;
        //   } else {
        //     allActivityModified.push(allActivity[count]);
        //   }
        // }
        // if (!priorPostFound) {
        //   allActivityModified.unshift(activityComment);
        // }
        return {
          ...state,
          // allActivity: allActivityModified,
          allCachedActivityCommentsByCommentWeVoteId,
        };

      case 'activityListRetrieve':
        if (!action.res || !action.res.success) return state;
        incomingActivityList = action.res.activity_list || [];
        if (!allCachedActivityCommentsByCommentWeVoteId) {
          allCachedActivityCommentsByCommentWeVoteId = {};
        }
        if (!allCachedActivityCommentsInTreeByTidbitWeVoteId) {
          allCachedActivityCommentsInTreeByTidbitWeVoteId = {};
        }
        if (!allCachedActivityCommentWeVoteIdsByTidbitWeVoteId) {
          allCachedActivityCommentWeVoteIdsByTidbitWeVoteId = {};
        }
        incomingActivityList.forEach((activityTidbit) => {
          activityTidbitWeVoteId = activityTidbit.we_vote_id;
          if (!allCachedActivityTidbitsByWeVoteId) {
            allCachedActivityTidbitsByWeVoteId = {};
          }
          if (!allCachedActivityTidbitsByWeVoteId[activityTidbitWeVoteId]) {
            allCachedActivityTidbitsByWeVoteId[activityTidbitWeVoteId] = {};
          }
          allCachedActivityTidbitsByWeVoteId[activityTidbitWeVoteId] = activityTidbit;
          // Now Save comments
          if (!allCachedActivityCommentWeVoteIdsByTidbitWeVoteId[activityTidbitWeVoteId]) {
            // Make sure we have an empty list to put the comments in for this activityTidbit
            allCachedActivityCommentWeVoteIdsByTidbitWeVoteId[activityTidbitWeVoteId] = [];
          }
          if (!allCachedActivityCommentsInTreeByTidbitWeVoteId[activityTidbitWeVoteId]) {
            // Make sure we have an empty list to put the comments in for this activityTidbit
            allCachedActivityCommentsInTreeByTidbitWeVoteId[activityTidbitWeVoteId] = [];
          }
          parentComments = [];
          childCommentsByParentCommentWeVoteId = {};
          if (activityTidbit && activityTidbit.activity_comment_list) {
            const activityCommentList = activityTidbit.activity_comment_list;
            // console.log('BEFORE activityCommentList: ', activityCommentList);
            activityCommentList.sort((optionA, optionB) => {
              if (optionA.date_created < optionB.date_created) {
                return -1;
              }
              if (optionA.date_created > optionB.date_created) {
                return 1;
              }
              return 0;
            });
            // console.log('AFTER activityCommentList: ', activityCommentList);
            activityCommentList.forEach((oneActivityComment) => {
              allCachedActivityCommentsByCommentWeVoteId[activityCommentWeVoteId] = oneActivityComment;
              if (!arrayContains(oneActivityComment.we_vote_id, allCachedActivityCommentWeVoteIdsByTidbitWeVoteId[activityTidbitWeVoteId])) {
                allCachedActivityCommentWeVoteIdsByTidbitWeVoteId[activityTidbitWeVoteId].push(oneActivityComment.we_vote_id);
              }
              if (oneActivityComment.parent_comment_we_vote_id) {
                if (!childCommentsByParentCommentWeVoteId[oneActivityComment.parent_comment_we_vote_id]) {
                  childCommentsByParentCommentWeVoteId[oneActivityComment.parent_comment_we_vote_id] = [];
                }
                childCommentsByParentCommentWeVoteId[oneActivityComment.parent_comment_we_vote_id].push(oneActivityComment);
              } else {
                parentComments.push(oneActivityComment);
              }
            });
            // console.log('AFTER parentComments: ', parentComments);
            parentCommentsWithChildren = [];
            parentComments.forEach((oneActivityComment) => {
              childCommentList = childCommentsByParentCommentWeVoteId[oneActivityComment.parent_comment_we_vote_id] || [];
              childCommentList.sort((optionA, optionB) => {
                if (optionA.date_created < optionB.date_created) {
                  return -1;
                }
                if (optionA.date_created > optionB.date_created) {
                  return 1;
                }
                return 0;
              });
              oneActivityCommentModified = oneActivityComment;
              oneActivityCommentModified.comment_list = childCommentList;
              parentCommentsWithChildren.push(oneActivityCommentModified);
            });
            allCachedActivityCommentsInTreeByTidbitWeVoteId[activityTidbit.we_vote_id] = parentCommentsWithChildren;
          }
        });
        // Temp
        allActivity = action.res.activity_list || [];
        return {
          ...state,
          allActivity,
          allCachedActivityCommentsByCommentWeVoteId,
          allCachedActivityCommentsInTreeByTidbitWeVoteId,
          allCachedActivityTidbitsByWeVoteId,
        };

      case 'activityNoticeListRetrieve':
        if (!action.res || !action.res.success) return state;
        return {
          ...state,
          allActivityNotices: action.res.activity_notice_list,
        };

      case 'activityPostSave':
        if (!action.res || !action.res.success) return state;
        activityPost = action.res;
        activityTidbitWeVoteId = activityPost.we_vote_id;
        if (!allCachedActivityTidbitsByWeVoteId) {
          allCachedActivityTidbitsByWeVoteId = {};
        }
        allCachedActivityTidbitsByWeVoteId[activityTidbitWeVoteId] = activityPost;
        priorPostFound = false;
        allActivityModified = [];
        for (let count = 0; count < allActivity.length; count++) {
          if (allActivity[count].activity_post_id === activityPost.activity_post_id) {
            // Replace existing entry
            allActivityModified.push(activityPost);
            priorPostFound = true;
          } else {
            allActivityModified.push(allActivity[count]);
          }
        }
        if (!priorPostFound) {
          allActivityModified.unshift(activityPost);
        }
        return {
          ...state,
          allActivity: allActivityModified,
          allCachedActivityTidbitsByWeVoteId,
        };

      case 'voterSignOut':
        return this.getInitialState();

      default:
        return state;
    }
  }
}

export default new ActivityStore(Dispatcher);
