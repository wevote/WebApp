import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class ActivityStore extends ReduceStore {
  getInitialState () {
    return {
      allActivity: [],
      allCachedActivityTidbitsById: {},
      allActivityNotices: [],
    };
  }

  allActivity () {
    return this.getState().allActivity || [];
  }

  allActivityNotices () {
    return this.getState().allActivityNotices || [];
  }

  getActivityTidbitById (activityTidbitId) {
    return this.getState().allCachedActivityTidbitsById[activityTidbitId] || {};
  }

  reduce (state, action) {
    let { allCachedActivityTidbitsById } = state;
    let incomingActivityList = [];
    let activityTidbitId = '';
    let allActivity = [];
    switch (action.type) {
      case 'activityListRetrieve':
        if (!action.res || !action.res.success) return state;
        incomingActivityList = action.res.activity_list || [];
        incomingActivityList.forEach((activityTidbit) => {
          activityTidbitId = `${activityTidbit.kind_of_activity}-${activityTidbit.id}`;
          if (!allCachedActivityTidbitsById) {
            allCachedActivityTidbitsById = {};
          }
          if (!allCachedActivityTidbitsById[activityTidbitId]) {
            allCachedActivityTidbitsById[activityTidbitId] = {};
          }
          allCachedActivityTidbitsById[activityTidbitId] = activityTidbit;
        });
        // Temp
        allActivity = action.res.activity_list || [];
        return {
          ...state,
          allActivity,
        };

      case 'activityNoticeListRetrieve':
        if (!action.res || !action.res.success) return state;
        return {
          ...state,
          allActivityNotices: action.res.activity_notice_list,
        };

      case 'voterSignOut':
        return this.getInitialState();

      default:
        return state;
    }
  }
}

export default new ActivityStore(Dispatcher);
