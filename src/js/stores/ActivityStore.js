import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/Dispatcher';

class ActivityStore extends ReduceStore {
  getInitialState () {
    return {
      allActivityNotices: [],
    };
  }

  allActivityNotices () {
    return this.getState().allActivityNotices || [];
  }

  reduce (state, action) {
    switch (action.type) {
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
