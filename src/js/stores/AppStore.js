import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';

class AppStore extends ReduceStore {
  getInitialState () {
    return {
      headroomUnpinned: false,
      showSelectBallotModal: false,
      showEditAddressButton: false,
      scrolledDown: false,
    };
  }

  headroomIsUnpinned () {
    return this.getState().headroomUnpinned;
  }

  showSelectBallotModal () {
    return this.getState().showSelectBallotModal;
  }

  showEditAddressButton () {
    return this.getState().showEditAddressButton;
  }

  getScrolledDown () {
    return this.getState().scrolledDown;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'headroomUnpinned':
        return { ...state, headroomUnpinned: action.payload };
      case 'showSelectBallotModal':
        return { ...state, showSelectBallotModal: action.payload };
      case 'showEditAddressButton':
        return { ...state, showEditAddressButton: action.payload };
      case 'scrolledDown':
        return { ...state, scrolledDown: action.payload };
      default:
        return state;
    }
  }
}

export default new AppStore(Dispatcher);
