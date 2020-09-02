import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import { arrayContains, arrayReplaceObjectMatchingPropertyValue } from '../utils/textFormat';

class ActivityStore extends ReduceStore {
  getInitialState () {
    return {
      allActivity: [],
      allCachedActivityCommentsByCommentWeVoteId: {},
      allCachedActivityCommentWeVoteIdsByTidbitWeVoteId: {}, // key == we_vote_id base of tree, value == we_vote_id of ALL Parent Comments & Child Comments so we can count
      allCachedActivityCommentsInTreeByTidbitWeVoteId: {}, // key == we_vote_id base of tree, value == Parent Comments (oldest to newest), with children in comment_list
      allCachedActivityTidbitsByWeVoteId: {},
      allChildCommentsByParentCommentWeVoteId: {},
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

  getChildCommentsByParentCommentWeVoteId (parentCommentWeVoteId) {
    return this.getState().allChildCommentsByParentCommentWeVoteId[parentCommentWeVoteId] || {};
  }

  reduce (state, action) {
    let activityComment = {};
    let activityPost = {};
    let activityCommentWeVoteId = '';
    let activityTidbitModified = {};
    let activityTidbitWeVoteId = '';
    const allActivity = state.allActivity || [];
    let allActivityModified = [];
    let {
      allCachedActivityCommentWeVoteIdsByTidbitWeVoteId, allCachedActivityCommentsByCommentWeVoteId,
      allCachedActivityCommentsInTreeByTidbitWeVoteId, allCachedActivityTidbitsByWeVoteId,
      allChildCommentsByParentCommentWeVoteId,
    } = state;
    let childCommentList = [];
    let commentListUpdated = [];
    let incomingActivityList = [];
    let incomingActivityListReadyToMerge = [];
    let oneActivityCommentModified = {};
    let parentComments = [];
    let parentCommentsWithChildren = [];
    let parentCommentsUpdated = [];
    let priorPostFound = false;
    let results = {};
    switch (action.type) {
      case 'activityCommentSave':
        if (!action.res || !action.res.success) return state;
        activityComment = action.res;
        // console.log('activityComment:', activityComment);
        activityCommentWeVoteId = activityComment.we_vote_id;
        if (!allCachedActivityCommentsByCommentWeVoteId) {
          allCachedActivityCommentsByCommentWeVoteId = {};
        }
        allCachedActivityCommentsByCommentWeVoteId[activityCommentWeVoteId] = activityComment;
        // console.log('allCachedActivityCommentsInTreeByTidbitWeVoteId:', allCachedActivityCommentsInTreeByTidbitWeVoteId);
        // Traverse the tree and add it
        commentListUpdated = [];
        parentComments = allCachedActivityCommentsInTreeByTidbitWeVoteId[activityComment.parent_we_vote_id];
        parentCommentsUpdated = [];
        if (activityComment.activity_comment_created) {
          // Add it to the tree
          if (activityComment.parent_comment_we_vote_id) {
            if (!allChildCommentsByParentCommentWeVoteId[activityComment.parent_comment_we_vote_id]) {
              allChildCommentsByParentCommentWeVoteId[activityComment.parent_comment_we_vote_id] = [];
            }
            if (!parentComments.comment_list) {
              parentComments.comment_list = [];
            }
            parentComments.comment_list.push(activityComment);
            allChildCommentsByParentCommentWeVoteId[activityComment.parent_comment_we_vote_id].push(activityComment);
          } else {
            parentComments.push(activityComment);
          }
        } else if (activityComment.parent_comment_we_vote_id) {
          // If here, the activityComment was updated, and it was a comment on a comment
          if (!allChildCommentsByParentCommentWeVoteId[activityComment.parent_comment_we_vote_id]) {
            allChildCommentsByParentCommentWeVoteId[activityComment.parent_comment_we_vote_id] = [];
          }
          if (!parentComments.comment_list) {
            parentComments.comment_list = [];
          }
          if (parentComments.comment_list) {
            for (let i = 0; i < parentComments.comment_list.length; i++) {
              if (parentComments.comment_list[i].we_vote_id === activityComment.we_vote_id) {
                commentListUpdated.push(activityComment);
                allChildCommentsByParentCommentWeVoteId[activityComment.parent_comment_we_vote_id].push(activityComment);
              } else {
                commentListUpdated.push(parentComments[i]);
                allChildCommentsByParentCommentWeVoteId[activityComment.parent_comment_we_vote_id].push(parentComments[i]);
              }
            }
            parentComments.comment_list = commentListUpdated;
          }
        } else {
          // If here, the activityComment was a comment on the parent post
          parentComments.forEach((commentFromList) => {
            if (commentFromList.we_vote_id === activityComment.we_vote_id) {
              parentCommentsUpdated.push(activityComment);
            } else {
              parentCommentsUpdated.push(commentFromList);
            }
          });
          parentComments = parentCommentsUpdated;
        }
        // console.log('parentComments:', parentComments);
        allCachedActivityCommentsInTreeByTidbitWeVoteId[activityComment.parent_we_vote_id] = parentComments;

        return {
          ...state,
          allCachedActivityCommentsByCommentWeVoteId,
          allCachedActivityCommentsInTreeByTidbitWeVoteId,
          allChildCommentsByParentCommentWeVoteId,
        };

      case 'activityListRetrieve':
        if (!action.res || !action.res.success) return state;
        incomingActivityList = action.res.activity_list || [];
        incomingActivityListReadyToMerge = [];
        if (!allCachedActivityCommentsByCommentWeVoteId) {
          allCachedActivityCommentsByCommentWeVoteId = {};
        }
        if (!allCachedActivityCommentsInTreeByTidbitWeVoteId) {
          allCachedActivityCommentsInTreeByTidbitWeVoteId = {};
        }
        if (!allCachedActivityCommentWeVoteIdsByTidbitWeVoteId) {
          allCachedActivityCommentWeVoteIdsByTidbitWeVoteId = {};
        }
        if (!allChildCommentsByParentCommentWeVoteId) {
          allChildCommentsByParentCommentWeVoteId = {};
        }
        incomingActivityList.forEach((activityTidbit) => {
          activityTidbitModified = activityTidbit;
          activityTidbitWeVoteId = activityTidbit.we_vote_id;
          parentComments = [];
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
              allCachedActivityCommentsByCommentWeVoteId[oneActivityComment.we_vote_id] = oneActivityComment;
              if (!arrayContains(oneActivityComment.we_vote_id, allCachedActivityCommentWeVoteIdsByTidbitWeVoteId[activityTidbitWeVoteId])) {
                allCachedActivityCommentWeVoteIdsByTidbitWeVoteId[activityTidbitWeVoteId].push(oneActivityComment.we_vote_id);
              }
              parentComments.push(oneActivityComment);
              childCommentList = [];
              if (oneActivityComment.comment_list) {
                if (!allChildCommentsByParentCommentWeVoteId) {
                  allChildCommentsByParentCommentWeVoteId = {};
                }
                allChildCommentsByParentCommentWeVoteId[oneActivityComment.we_vote_id] = oneActivityComment.comment_list;
                oneActivityComment.comment_list.forEach((oneChildActivityComment) => {
                  allCachedActivityCommentsByCommentWeVoteId[oneChildActivityComment.we_vote_id] = oneChildActivityComment;
                });
              }
            });
            // console.log('AFTER parentComments: ', parentComments);
            parentCommentsWithChildren = [];
            parentComments.forEach((oneActivityComment) => {
              childCommentList = allChildCommentsByParentCommentWeVoteId[oneActivityComment.we_vote_id] || [];
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
            activityTidbitModified.activity_comment_list = parentCommentsWithChildren;
          }
          incomingActivityListReadyToMerge.push(activityTidbitModified);
        });
        allActivityModified = allActivity;
        incomingActivityListReadyToMerge.forEach((incomingActivityTidbit) => {
          results = arrayReplaceObjectMatchingPropertyValue(incomingActivityTidbit.we_vote_id, 'we_vote_id', allActivityModified, incomingActivityTidbit);
          if (results.objectWasReplaced) {
            allActivityModified = results.arrayHaystack;
          } else {
            allActivityModified.push(incomingActivityTidbit);
          }
        });
        // Resort to put the newest at the top
        allActivityModified.sort((optionA, optionB) => {
          if (optionA.date_created > optionB.date_created) {
            return -1;
          }
          if (optionA.date_created < optionB.date_created) {
            return 1;
          }
          return 0;
        });
        return {
          ...state,
          allActivity: allActivityModified,
          allCachedActivityCommentsByCommentWeVoteId,
          allCachedActivityCommentsInTreeByTidbitWeVoteId,
          allCachedActivityTidbitsByWeVoteId,
          allChildCommentsByParentCommentWeVoteId,
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
