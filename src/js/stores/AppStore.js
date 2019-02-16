import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';

class AppStore extends ReduceStore {
  getInitialState () {
    return {
      headroomUnpinned: false,
    };
  }

  headroomIsUnpinned () {
    return this.getState().headroomUnpinned;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'headroomUnpinned':
        return { ...state, headroomUnpinned: action.payload };
      default:
        return state;
    }
  }
}

export default new AppStore(Dispatcher);
