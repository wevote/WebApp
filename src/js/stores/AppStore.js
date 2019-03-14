import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';

class AppStore extends ReduceStore {
  getInitialState () {
    return {
      headroomUnpinned: false,
      showSelectBallotModal: false,
      showEditAddressButton: false,
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

  reduce (state, action) {
    switch (action.type) {
      case 'headroomUnpinned':
        return { ...state, headroomUnpinned: action.payload };
      case 'showSelectBallotModal':
        return { ...state, showSelectBallotModal: action.payload };
      case 'showEditAddressButton':
        return { ...state, showEditAddressButton: action.payload };
      default:
        return state;
    }
  }
}

export default new AppStore(Dispatcher);
