import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/AppDispatcher';

class AppStore extends ReduceStore {
  getInitialState () {
    return {
      getStartedMode: '',
      headroomUnpinned: false,
      scrolledDown: false,
      showEditAddressButton: false,
      showSelectBallotModal: false,
      showSignInModal: false,
      storeSignInStartPath: false,
    };
  }

  getScrolledDown () {
    return this.getState().scrolledDown;
  }

  getStartedMode () {
    return this.getState().getStartedMode;
  }

  headroomIsUnpinned () {
    return this.getState().headroomUnpinned;
  }

  showEditAddressButton () {
    return this.getState().showEditAddressButton;
  }

  showSelectBallotModal () {
    return this.getState().showSelectBallotModal;
  }

  showSignInModal () {
    return this.getState().showSignInModal;
  }

  storeSignInStartPath () {
    return this.getState().storeSignInStartPath;
  }

  reduce (state, action) {
    switch (action.type) {
      case 'getStartedMode':
        return { ...state, getStartedMode: action.payload };
      case 'headroomUnpinned':
        return { ...state, headroomUnpinned: action.payload };
      case 'scrolledDown':
        return { ...state, scrolledDown: action.payload };
      case 'showSelectBallotModal':
        return { ...state, showSelectBallotModal: action.payload };
      case 'showSignInModal':
        return { ...state, showSignInModal: action.payload };
      case 'showEditAddressButton':
        return { ...state, showEditAddressButton: action.payload };
      case 'storeSignInStartPath':
        // Send a signal to src/js/Application.jsx to write the current pathname to the cookie 'sign_in_start_path'
        return { ...state, storeSignInStartPath: action.payload };
      case 'unsetStoreSignInStartPath':
        // Turn off the signal to src/js/Application.jsx to write the current pathname to the cookie 'sign_in_start_path'
        return { ...state, storeSignInStartPath: action.payload };
      default:
        return state;
    }
  }
}

export default new AppStore(Dispatcher);
