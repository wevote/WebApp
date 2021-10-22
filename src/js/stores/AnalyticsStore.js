import { ReduceStore } from 'flux/utils';
import Dispatcher from '../common/dispatcher/Dispatcher';

class AnalyticsStore extends ReduceStore {
  getInitialState () {
    return {
      isSignedIn: false,
    };
  }

  getIsSignedIn () {
    const {  isSignedIn } = this.getState();
    return isSignedIn;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'saveAnalyticsAction':
        return {
          ...state,
          isSignedIn: action.res.is_signed_in,
        };
      default:
        return state;
    }
  }
}

export default new AnalyticsStore(Dispatcher);
