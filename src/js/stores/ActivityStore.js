import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';
import { generateActivityTidbitKey } from '../utils/activityUtils';

class ActivityStore extends ReduceStore {
  getInitialState () {
    return {
      allActivity: [],
      allCachedActivityTidbitsByKey: {},
      allActivityNotices: [],
    };
  }

  allActivity () {
    return this.getState().allActivity || [];
  }

  allActivityNotices () {
    return this.getState().allActivityNotices || [];
  }

  getActivityTidbitByKey (activityTidbitKey) {
    return this.getState().allCachedActivityTidbitsByKey[activityTidbitKey] || {};
  }

  reduce (state, action) {
    let { allCachedActivityTidbitsByKey } = state;
    let incomingActivityList = [];
    let activityPost = {};
    let activityTidbitKey = '';
    let allActivity = state.allActivity || [];
    let allActivityModified = [];
    let priorPostFound = false;
    switch (action.type) {
      case 'activityListRetrieve':
        if (!action.res || !action.res.success) return state;
        incomingActivityList = action.res.activity_list || [];
        incomingActivityList.forEach((activityTidbit) => {
          activityTidbitKey = generateActivityTidbitKey(activityTidbit.kind_of_activity, activityTidbit.id);
          if (!allCachedActivityTidbitsByKey) {
            allCachedActivityTidbitsByKey = {};
          }
          if (!allCachedActivityTidbitsByKey[activityTidbitKey]) {
            allCachedActivityTidbitsByKey[activityTidbitKey] = {};
          }
          allCachedActivityTidbitsByKey[activityTidbitKey] = activityTidbit;
        });
        // Temp
        allActivity = action.res.activity_list || [];
        return {
          ...state,
          allActivity,
          allCachedActivityTidbitsByKey,
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
        activityTidbitKey = generateActivityTidbitKey(activityPost.kind_of_activity, activityPost.id);
        if (!allCachedActivityTidbitsByKey) {
          allCachedActivityTidbitsByKey = {};
        }
        allCachedActivityTidbitsByKey[activityTidbitKey] = activityPost;
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
          allCachedActivityTidbitsByKey,
        };

      case 'voterSignOut':
        return this.getInitialState();

      default:
        return state;
    }
  }
}

export default new ActivityStore(Dispatcher);
